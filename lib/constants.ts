export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Wazobia"
export const APP_SLOGAN = process.env.NEXT_PUBLIC_APP_SLOGAN || "Shop smart not hard."
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || APP_SLOGAN
export const APP_COPYRIGHT = process.env.NEXT_PUBLIC_APP_COPYRIGHT || 
`Copyright © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.`

export const PAGE_SIZE = process.env.PAGE_SIZE || 9
export const FREE_SHIPPING_MIN_PRICE = Number(process.env.FREE_SHIPPING_MIN_PRICE || 35)

export const AVAILABLE_PAYMENT_METHODS = [
  {
    name: 'PayPal',
    commission: 0,
    isDefault: true,
  },
  {
    name: 'Stripe',
    commission: 0,
    isDefault: true
  },
  {
    name: 'Cash On Delivery',
    commission: 0,
    isDefault: true
  }
]

export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || AVAILABLE_PAYMENT_METHODS[2].name

export const AVAILABLE_DELIVERY_DATES = [
  {
    name: 'Tomorrow',
    daysToDeliver: 1,
    shippingPrice: 12.9,
    freeShippingMinPrice: 0,
  },
  {
    name: 'Next 3 days',
    daysToDeliver: 3,
    shippingPrice: 6.9,
    freeShippingMinPrice: 0,
  },
  {
    name: 'Next 5 days',
    daysToDeliver: 5,
    shippingPrice: 4.9,
    freeShippingMinPrice: 35
  }
]