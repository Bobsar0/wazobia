/* eslint-disable @typescript-eslint/no-explicit-any */
import data from '@/lib/data/data'
import { connectToDatabase } from '.'

import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import Product from './models/product.model'
import User from './models/user.model'
import Review from './models/review.model'
import Order from './models/order.model'
import { IOrderInput, OrderItem, ShippingAddress } from '@/types'
import {
  generateId,
  calculatePastDate,
  calculateFutureDate,
  round2,
} from '../utils'
import { AVAILABLE_DELIVERY_DATES } from '../constants'
import WebPage from './models/web-page.model'

loadEnvConfig(cwd())

/**
 * Seeds the database with sample data.
 *
 * The data includes:
 * - 5 users
 * - 5 products with sample data
 * - 10 reviews for each product, with a mix of verified and unverified purchases
 * - 200 orders, each with a random user and product
 *
 * The seed data is just a sample and you should replace it with your own data.
 */
const main = async () => {
  try {
    const { products, users, reviews, webPages } = data
    await connectToDatabase(process.env.MONGODB_URI)

    //Users
    await User.deleteMany()
    const createdUsers = await User.insertMany(users)

    //Products
    await Product.deleteMany()
    const createdProducts = await Product.insertMany(products)

    //Reviews
    await Review.deleteMany()
    // create sample review for all products
    const rws = []
    for (let i = 0; i < createdProducts.length; i++) {
      let x = 0
      const { ratingDistribution } = createdProducts[i]
      for (let j = 0; j < ratingDistribution.length; j++) {
        for (let k = 0; k < ratingDistribution[j].count; k++) {
          x++
          rws.push({
            ...reviews.filter((x) => x.rating === j + 1)[
              x % reviews.filter((x) => x.rating === j + 1).length
            ],
            isVerifiedPurchase: true,
            product: createdProducts[i]._id,
            user: createdUsers[x % createdUsers.length]._id,
            updatedAt: Date.now(),
            createdAt: Date.now(),
          })
        }
      }
    }
    const createdReviews = await Review.insertMany(rws)

    //Orders
    await Order.deleteMany()
    const orders = []
    for (let i = 0; i < 200; i++) {
      orders.push(
        await generateOrder(
          i,
          createdUsers.map((x) => x._id),
          createdProducts.map((x) => x._id)
        )
      )
    }

    //WebPages
    await WebPage.deleteMany()
    await WebPage.insertMany(webPages)

    console.log({
      createdUsers,
      createdProducts,
      createdReviews,
      message: 'Seeded database successfully',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}

/**
 * Generates an order with a given index, array of user IDs and array of product IDs.
 * @param {number} i - The index of the order.
 * @param {any} users - An array of user IDs.
 * @param {any} products - An array of product IDs.
 * @returns {Promise<IOrderInput>} The generated order.
 */
const generateOrder = async (
  i: number,
  users: any,
  products: any
): Promise<IOrderInput> => {
  const product1 = await Product.findById(products[i % products.length])

  const product2 = await Product.findById(
    products[
      i % products.length >= products.length - 1
        ? (i % products.length) - 1
        : (i % products.length) + 1
    ]
  )
  const product3 = await Product.findById(
    products[
      i % products.length >= products.length - 2
        ? (i % products.length) - 2
        : (i % products.length) + 2
    ]
  )

  if (!product1 || !product2 || !product3) throw new Error('Product not found')

  const items = [
    {
      clientId: generateId(),
      product: product1._id,
      name: product1.name,
      slug: product1.slug,
      quantity: 1,
      image: product1.images[0],
      category: product1.category,
      price: product1.price,
      countInStock: product1.countInStock,
    },
    {
      clientId: generateId(),
      product: product2._id,
      name: product2.name,
      slug: product2.slug,
      quantity: 2,
      image: product2.images[0],
      category: product1.category,
      price: product2.price,
      countInStock: product1.countInStock,
    },
    {
      clientId: generateId(),
      product: product3._id,
      name: product3.name,
      slug: product3.slug,
      quantity: 3,
      image: product3.images[0],
      category: product1.category,
      price: product3.price,
      countInStock: product1.countInStock,
    },
  ]

  const order = {
    user: users[i % users.length],
    items: items.map((item) => ({
      ...item,
      product: item.product,
    })),
    shippingAddress: data.users[i % users.length].address,
    paymentMethod: data.users[i % users.length].paymentMethod,
    isPaid: true,
    isDelivered: true,
    paidAt: calculatePastDate(i),
    deliveredAt: calculatePastDate(i),
    createdAt: calculatePastDate(i),
    expectedDeliveryDate: calculateFutureDate(i % 2),
    ...calcDeliveryDateAndPriceForSeed({
      items: items,
      shippingAddress: data.users[i % users.length].address,
      deliveryDateIndex: i % 2,
    }),
  }
  return order
}

/**
 * Calculates the total price of an order including shipping and taxes, specifically for use in the seed file.
 *
 * @param {{ items: OrderItem[], shippingAddress?: ShippingAddress, deliveryDateIndex?: number }}
 * @returns {Promise<{ itemsPrice: number, shippingPrice?: number, taxPrice?: number, totalPrice: number }>}
 */
export const calcDeliveryDateAndPriceForSeed = ({
  items,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number
  items: OrderItem[]
  shippingAddress?: ShippingAddress
}) => {
  // const { availableDeliveryDates } = data.settings[0]
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

  const shippingPrice = deliveryDate.shippingPrice

  const taxPrice = round2(itemsPrice * 0.15)
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

main()
