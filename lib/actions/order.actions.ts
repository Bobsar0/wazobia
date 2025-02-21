import { OrderItem, ShippingAddress } from "@/types"
import { round2 } from "../utils"
import { AVAILABLE_DELIVERY_DATES } from "../constants"

const taxPercent = 0.15;

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

  const taxPrice = !shippingAddress ? undefined : round2(itemsPrice * taxPercent)

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