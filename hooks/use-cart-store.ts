import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Cart, OrderItem } from '@/types'
import { calcDeliveryDateAndPrice } from '@/lib/actions/order.actions'

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: undefined,
  shippingPrice: undefined,
  totalPrice: 0,
  paymentMethod: undefined,
  // shippingAddress: undefined,
  deliveryDateIndex: undefined,
}

interface CartState {
  cart: Cart
  addItem: (item: OrderItem, quantity: number) => Promise<string>
  updateItem: (item: OrderItem, quantity: number) => Promise<void>
  removeItem: (item: OrderItem) => void
  // clearCart: () => void
  // setShippingAddress: (shippingAddress: ShippingAddress) => Promise<void>
  // setPaymentMethod: (paymentMethod: string) => void
  // setDeliveryDateIndex: (index: number) => Promise<void>
}

const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: initialState,

      /**
       * Adds an item to the cart.
       *
       * If the item already exists in the cart, it will update the quantity.
       * If the item does not exist in the cart, it will add the item to the cart.
       *
       * Will throw an error if there are not enough items in stock.
       *
       * @param {OrderItem} item - The item to add to the cart.
       * @param {number} quantity - The quantity of the item to add.
       * @returns {Promise<string>} The client id of the item that was added to the cart.
       */
      addItem: async (item: OrderItem, quantity: number) => {
        // const { items, shippingAddress } = get().cart
        const { items } = get().cart

        const existItem = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )

        if (existItem) {
          if (existItem.countInStock < quantity + existItem.quantity) {
            throw new Error('Not enough items in stock')
          }
        } else {
          if (item.countInStock < item.quantity) {
            throw new Error('Not enough items in stock')
          }
        }

        const updatedCartItems = existItem
          ? items.map((x) =>
              x.product === item.product &&
              x.color === item.color &&
              x.size === item.size
                ? { ...existItem, quantity: existItem.quantity + quantity }
                : x
            )
          : [...items, { ...item, quantity }]

        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              items: updatedCartItems,
              // shippingAddress,
            })),
          },
        })

        const foundItem = updatedCartItems.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )
        if (!foundItem) {
          throw new Error('Item not found in cart')
        }

        return foundItem.clientId
      },
      /**
       * Updates the quantity of an item in the cart.
       * @param {OrderItem} item - The item to be updated.
       * @param {number} quantity - The new quantity of the item.
       * @returns {Promise<void>}
       */
      updateItem: async (item: OrderItem, quantity: number) => {
        const { items } = get().cart
        const exist = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )
        if (!exist) return
        const updatedCartItems = items.map((x) =>
          x.product === item.product &&
          x.color === item.color &&
          x.size === item.size
            ? { ...exist, quantity: quantity }
            : x
        )
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              items: updatedCartItems,
              // shippingAddress,
            })),
          },
        })
      },
      /**
       * Removes an item from the cart.
       * @param {OrderItem} item - The item to be removed.
       * @returns {Promise<void>}
       */
      removeItem: async (item: OrderItem) => {
        const { items } = get().cart
        const updatedCartItems = items.filter(
          (x) =>
            x.product !== item.product ||
            x.color !== item.color ||
            x.size !== item.size
        )
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              items: updatedCartItems,
              // shippingAddress,
            })),
          },
        })
      },
      // setShippingAddress: async (shippingAddress: ShippingAddress) => {
      //   const { items } = get().cart
      //   set({
      //     cart: {
      //       ...get().cart,
      //       shippingAddress,
      //       ...(await calcDeliveryDateAndPrice({
      //         items,
      //         shippingAddress,
      //       })),
      //     },
      //   })
      // },
      // setPaymentMethod: (paymentMethod: string) => {
      //   set({
      //     cart: {
      //       ...get().cart,
      //       paymentMethod,
      //     },
      //   })
      // },
      // setDeliveryDateIndex: async (index: number) => {
      //   const { items, shippingAddress } = get().cart

      //   set({
      //     cart: {
      //       ...get().cart,
      //       ...(await calcDeliveryDateAndPrice({
      //         items,
      //         shippingAddress,
      //         deliveryDateIndex: index,
      //       })),
      //     },
      //   })
      // },
      // clearCart: () => {
      //   set({
      //     cart: {
      //       ...get().cart,
      //       items: [],
      //     },
      //   })
      // },
      init: () => set({ cart: initialState }),
    }),

    {
      name: 'cart-store',
    }
  )
)
export default useCartStore