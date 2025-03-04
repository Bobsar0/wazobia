'use server'

import { Cart, IOrderList, OrderItem, ShippingAddress } from '@/types'
import { formatError, round2 } from '../utils'
import { AVAILABLE_DELIVERY_DATES, PAGE_SIZE } from '../constants'
import { auth } from '@/auth'
import { connectToDatabase } from '../db'
import { OrderInputSchema } from '../validator'
import Order, { IOrder } from '../db/models/order.model'
import { paypal } from '../payments/paypal'
import { sendAskReviewOrderItems, sendPurchaseReceipt } from '@/emails'
import { revalidatePath } from 'next/cache'
import { DateRange } from 'react-day-picker'
import Product from '../db/models/product.model'
import User from '../db/models/user.model'
import mongoose from 'mongoose'

const taxPercent = 0.15

// CREATE
export const createOrder = async (clientSideCart: Cart) => {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session) throw new Error('User not authenticated')
    // recalculate price and delivery date on the server
    const createdOrder = await createOrderFromCart(
      clientSideCart,
      session.user.id!
    )
    return {
      success: true,
      message: 'Order placed successfully',
      data: { orderId: createdOrder._id.toString() },
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Creates an order from the given cart.
 *
 * @param {Cart} clientSideCart - The cart to create the order from.
 * @param {string} userId - The ID of the user who placed the order.
 * @returns {Promise<Model<Order, Document>>} The created order.
 */
export const createOrderFromCart = async (
  clientSideCart: Cart,
  userId: string
) => {
  const cart = {
    ...clientSideCart,
    ...calcDeliveryDateAndPrice({
      items: clientSideCart.items,
      shippingAddress: clientSideCart.shippingAddress,
      deliveryDateIndex: clientSideCart.deliveryDateIndex,
    }),
  }

  const order = OrderInputSchema.parse({
    user: userId,
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
    expectedDeliveryDate: cart.expectedDeliveryDate,
  })
  return await Order.create(order)
}

/**
 * Retrieves an order by its ID.
 *
 * @param {string} orderId - The ID of the order to retrieve.
 * @returns {Promise<IOrder>} The retrieved order.
 */
export async function getOrderById(orderId: string): Promise<IOrder> {
  await connectToDatabase()
  const order = await Order.findById(orderId)
  return JSON.parse(JSON.stringify(order))
}

//Paypal

/**
 * Creates a PayPal order for the given order ID.
 *
 * @param {string} orderId - The ID of the order to create a PayPal order for.
 * @returns {Promise<{ success: boolean, message: string, data?: string }>} The result of the operation.
 * If the order is found and the PayPal order is created successfully, the result will have `success` set to `true`
 * and `data` set to the ID of the created PayPal order. If the order is not found or an error occurs, the result will
 * have `success` set to `false` and `message` set to an error message.
 */
export async function createPayPalOrder(orderId: string) {
  await connectToDatabase()
  try {
    const order = await Order.findById(orderId)
    if (order) {
      const paypalOrder = await paypal.createOrder(order.totalPrice)
      order.paymentResult = {
        id: paypalOrder.id,
        email_address: '',
        status: '',
        pricePaid: '0',
      }
      await order.save()
      return {
        success: true,
        message: 'PayPal order created successfully',
        data: paypalOrder.id,
      }
    } else {
      throw new Error('Order not found')
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

/**
 * Approves a PayPal order after creating order and redirecting user to paypal website for payment.
 *
 * Sends a confirmation email containing order receipt to the user if approval is successful
 *
 * @param {string} orderId - The ID of the order to approve.
 * @param {{ orderID: string }} data - The data from PayPal.
 * @returns {Promise<{ success: boolean, message: string }>} The result of the operation.
 * If the order is found and the payment is approved successfully, the result will have `success` set to `true`
 * and `message` set to a success message. If the order is not found or an error occurs, the result will
 * have `success` set to `false` and `message` set to an error message.
 */
export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  await connectToDatabase()
  try {
    const order = await Order.findById(orderId).populate('user', 'email')
    if (!order) throw new Error('Order not found')

    const captureData = await paypal.capturePayment(data.orderID)
    if (
      !captureData ||
      captureData.id !== order.paymentResult?.id ||
      captureData.status !== 'COMPLETED'
    )
      throw new Error('Error in paypal payment')

    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = {
      id: captureData.id,
      status: captureData.status,
      email_address: captureData.payer.email_address,
      pricePaid:
        captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
    }

    await order.save()
    await sendPurchaseReceipt({ order })
    revalidatePath(`/account/orders/${orderId}`)

    return {
      success: true,
      message: 'Your order has been successfully paid by PayPal',
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

/**
 * Calculates the total price of an order including shipping and taxes.
 * @param {{ items: OrderItem[], shippingAddress?: ShippingAddress, deliveryDateIndex?: number }}
 * @returns {Promise<{ itemsPrice: number, shippingPrice?: number, taxPrice?: number, totalPrice: number }>}
 */
export const calcDeliveryDateAndPrice = async ({
  items,
  shippingAddress,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number
  items: OrderItem[]
  shippingAddress?: ShippingAddress
}) => {
  // const { availableDeliveryDates } = await getSetting()
  const availableDeliveryDates = AVAILABLE_DELIVERY_DATES

  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const deliveryDate =
    availableDeliveryDates[
      deliveryDateIndex === undefined
        ? availableDeliveryDates.length - 1
        : deliveryDateIndex
    ]
  const shippingPrice =
    !shippingAddress || !deliveryDate
      ? undefined
      : deliveryDate.freeShippingMinPrice > 0 &&
          itemsPrice >= deliveryDate.freeShippingMinPrice
        ? 0
        : deliveryDate.shippingPrice

  const taxPrice = !shippingAddress
    ? undefined
    : round2(itemsPrice * taxPercent)

  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  )
  return {
    availableDeliveryDates,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? availableDeliveryDates.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  }
}

/**
 * Retrieves the orders for the authenticated user, with pagination support.
 *
 * @param {Object} params - The parameters for the query.
 * @param {number} [params.limit] - The maximum number of orders to return per page. Defaults to the common page size setting if not provided.
 * @param {number} params.page - The page number for pagination.
 * @returns {Promise<{ data: IOrder[], totalPages: number }>} An object containing the user's orders and the total number of pages.
 * @throws {Error} Throws an error if the user is not authenticated.
 */
export async function getMyOrders({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  // const {
  //   common: { pageSize },
  // } = await getSetting()
  limit = limit || PAGE_SIZE
  await connectToDatabase()
  const session = await auth()
  if (!session) {
    throw new Error('User is not authenticated')
  }
  const skipAmount = (Number(page) - 1) * limit
  const orders = await Order.find({
    user: session?.user?.id,
  })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const ordersCount = await Order.countDocuments({ user: session?.user?.id })

  return {
    data: JSON.parse(JSON.stringify(orders)),
    totalPages: Math.ceil(ordersCount / limit),
  }
}

/**
 * Retrieves a summary of orders for the given date range.
 *
 * @param {DateRange} date - The date range object with from and to properties.
 * @returns {Promise<{ ordersCount: number, productsCount: number, usersCount: number, totalSales: number, monthlySales: { label: string, value: number }[], salesChartData: { date: string, totalSales: number }[], topSalesCategories: { _id: string, totalSales: number }[], topSalesProducts: { _id: string, totalSales: number }[], latestOrders: IOrderList[] }>} An object containing the summary of orders.
 */
export async function getOrderSummary(date: DateRange) {
  await connectToDatabase()

  const ordersCount = await Order.countDocuments({
    createdAt: {
      $gte: date.from,
      $lte: date.to,
    },
  })
  const productsCount = await Product.countDocuments({
    createdAt: {
      $gte: date.from,
      $lte: date.to,
    },
  })
  const usersCount = await User.countDocuments({
    createdAt: {
      $gte: date.from,
      $lte: date.to,
    },
  })

  const totalSalesResult = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
    { $project: { totalSales: { $ifNull: ['$sales', 0] } } },
  ])
  const totalSales = totalSalesResult[0] ? totalSalesResult[0].totalSales : 0

  const today = new Date()
  const sixMonthEarlierDate = new Date(
    today.getFullYear(),
    today.getMonth() - 5,
    1
  )
  const monthlySales = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: sixMonthEarlierDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        label: '$_id',
        value: '$totalSales',
      },
    },

    { $sort: { label: -1 } },
  ])
  const topSalesCategories = await getTopSalesCategories(date)
  const topSalesProducts = await getTopSalesProducts(date)

  // const {
  //   common: { pageSize },
  // } = await getSetting()
  const limit = PAGE_SIZE
  const latestOrders = await Order.find()
    .populate('user', 'name')
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    monthlySales: JSON.parse(JSON.stringify(monthlySales)),
    salesChartData: JSON.parse(JSON.stringify(await getSalesChartData(date))),
    topSalesCategories: JSON.parse(JSON.stringify(topSalesCategories)),
    topSalesProducts: JSON.parse(JSON.stringify(topSalesProducts)),
    latestOrders: JSON.parse(JSON.stringify(latestOrders)) as IOrderList[],
  }
}

/**
 * Generates sales chart data over a specified date range.
 *
 * This function aggregates order data to calculate total sales for each day within the
 * provided date range. The results are formatted to show the date alongside the total
 * sales for that day.
 *
 * @param {DateRange} date - The date range for which to generate sales chart data.
 * @returns {Promise<Array<{ date: string, totalSales: number }>>} A promise that resolves
 * to an array of objects, each containing a date string and the corresponding total sales.
 */

async function getSalesChartData(date: DateRange) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $concat: [
            { $toString: '$_id.year' },
            '/',
            { $toString: '$_id.month' },
            '/',
            { $toString: '$_id.day' },
          ],
        },
        totalSales: 1,
      },
    },
    { $sort: { date: 1 } },
  ])

  return result
}

/**
 * Retrieves the top 6 selling products within the given date range.
 *
 * The aggregation pipeline consists of the following steps:
 * 1. Filter orders by the given date range.
 * 2. Unwind the orderItems array.
 * 3. Group the unwound orderItems by productId and calculate the total sales per product.
 * 4. Sort the grouped products by total sales in descending order.
 * 5. Limit the result to the top 6 products.
 * 6. Replace the productInfo array with the product name and format the output.
 * 7. Sort the result by product id in ascending order.
 *
 * @param {DateRange} date A date range object with from and to properties.
 * @returns {Promise<{id: string, label: string, image: string, value: number}[]>} An array of top selling products, sorted by total sales in descending order.
 */
async function getTopSalesProducts(date: DateRange) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    // Step 1: Unwind orderItems array
    { $unwind: '$items' },

    // Step 2: Group by productId to calculate total sales per product
    {
      $group: {
        _id: {
          name: '$items.name',
          image: '$items.image',
          _id: '$items.product',
        },
        totalSales: {
          $sum: { $multiply: ['$items.quantity', '$items.price'] },
        }, // Assume quantity field in orderItems represents units sold
      },
    },
    {
      $sort: {
        totalSales: -1,
      },
    },
    { $limit: 6 },

    // Step 3: Replace productInfo array with product name and format the output
    {
      $project: {
        _id: 0,
        id: '$_id._id',
        label: '$_id.name',
        image: '$_id.image',
        value: '$totalSales',
      },
    },

    // Step 4: Sort by totalSales in descending order
    { $sort: { _id: 1 } },
  ])

  return result
}

/**
 * Retrieves the top N selling categories within the given date range.
 *
 * The aggregation pipeline consists of the following steps:
 * 1. Filter orders by the given date range.
 * 2. Unwind the orderItems array.
 * 3. Group the unwound orderItems by category and calculate the total sales per category.
 * 4. Sort the grouped categories by total sales in descending order.
 * 5. Limit the result to the top N categories.
 *
 * @param {DateRange} date A date range object with from and to properties.
 * @param {number} [limit=5] The number of top selling categories to retrieve.
 * @returns {Promise<{ _id: string, totalSales: number }[]>} An array of top selling categories, sorted by total sales in descending order.
 */
async function getTopSalesCategories(date: DateRange, limit = 5) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    // Step 1: Unwind orderItems array
    { $unwind: '$items' },
    // Step 2: Group by productId to calculate total sales per product
    {
      $group: {
        _id: '$items.category',
        totalSales: { $sum: '$items.quantity' }, // Assume quantity field in orderItems represents units sold
      },
    },
    // Step 3: Sort by totalSales in descending order
    { $sort: { totalSales: -1 } },
    // Step 4: Limit to top N products
    { $limit: limit },
  ])

  return result
}

/**
 * Deletes an order by its ID.
 *
 * @param {string} id - The ID of the order to delete.
 * @returns {Promise<{ success: boolean, message: string }>} A promise resolving to an object containing a success boolean and a message string.
 * @throws {Error} If the order is not found.
 */
export async function deleteOrder(id: string) {
  try {
    await connectToDatabase()
    const res = await Order.findByIdAndDelete(id)
    if (!res) throw new Error('Order not found')
    revalidatePath('/admin/orders')
    return {
      success: true,
      message: 'Order deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Retrieves a paginated list of all orders.
 *
 * @param {Object} param - The parameters for retrieving orders.
 * @param {number} [param.limit] - The maximum number of orders to return per page. Defaults to the common page size setting if not provided.
 * @param {number} param.page - The page number for pagination.
 * @returns {Promise<{ data: IOrderList[], totalPages: number }>} An object containing the list of orders and the total number of pages.
 */
export async function getAllOrders({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  limit = limit || PAGE_SIZE
  await connectToDatabase()
  const skipAmount = (Number(page) - 1) * limit
  const orders = await Order.find()
    .populate('user', 'name')
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const ordersCount = await Order.countDocuments()
  return {
    data: JSON.parse(JSON.stringify(orders)) as IOrderList[],
    totalPages: Math.ceil(ordersCount / limit),
  }
}

/**
 * Updates an order to paid status.
 *
 * @param {string} orderId - The ID of the order to update.
 * @returns {Promise<{ success: boolean, message: string }>} A promise resolving to an object containing a success boolean and a message string.
 * If the order is found, not already paid, and the update is successful, the result will have `success` set to `true`
 * and `message` set to a success message. If the order is not found, already paid, or an error occurs, the result will
 * have `success` set to `false` and `message` set to an error message.
 */
export async function updateOrderToPaid(orderId: string) {
  try {
    await connectToDatabase()
    const order = await Order.findById(orderId).populate<{
      user: { email: string; name: string }
    }>('user', 'name email')

    if (!order) throw new Error('Order not found')
    if (order.isPaid) throw new Error('Order is already paid')

    order.isPaid = true
    order.paidAt = new Date()
    await order.save()

    if (!process.env.MONGODB_URI?.startsWith('mongodb://localhost'))
      await updateProductStock(order._id)
    if (order.user.email) await sendPurchaseReceipt({ order })
      
    revalidatePath(`/account/orders/${orderId}`)

    return { success: true, message: 'Order paid successfully' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

/**
 * Updates the countInStock of each product in the given order.
 *
 * @param {string} orderId - The ID of the order to update.
 * @returns {Promise<boolean>} A promise resolving to a boolean indicating if the update was successful.
 * @throws {Error} If an error occurs during the update process.
 * @private
 */
const updateProductStock = async (orderId: string) => {
  const session = await mongoose.connection.startSession()

  try {
    session.startTransaction()
    const opts = { session }

    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { isPaid: true, paidAt: new Date() },
      opts
    )
    if (!order) throw new Error('Order not found')

    for (const item of order.items) {
      const product = await Product.findById(item.product).session(session)
      if (!product) throw new Error('Product not found')

      product.countInStock -= item.quantity
      await Product.updateOne(
        { _id: product._id },
        { countInStock: product.countInStock },
        opts
      )
    }
    await session.commitTransaction()
    session.endSession()
    return true
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

/**
 * Marks an order as delivered.
 *
 * @param {string} orderId - The ID of the order to mark as delivered.
 * @returns {Promise<{ success: boolean, message: string }>} A promise resolving to an object containing a success boolean and a message string.
 * If the order is found, paid, and the delivery is successful, the result will have `success` set to `true`
 * and `message` set to a success message. If the order is not found, not paid, or an error occurs, the result will
 * have `success` set to `false` and `message` set to an error message.
 */
export async function deliverOrder(orderId: string) {
  try {
    await connectToDatabase()
    const order = await Order.findById(orderId).populate<{
      user: { email: string; name: string }
    }>('user', 'name email')
    if (!order) throw new Error('Order not found')
    if (!order.isPaid) throw new Error('Order is not paid')
    order.isDelivered = true
    order.deliveredAt = new Date()
    await order.save()
    if (order.user.email) await sendAskReviewOrderItems({ order })
    revalidatePath(`/account/orders/${orderId}`)
    return { success: true, message: 'Order delivered successfully' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}