export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Wazobia"
export const APP_LOGO_PATH = "/icons/logo.svg"
export const APP_LOGO_PATH_WHITE = "/icons/logo-white.svg"
export const APP_LOGO_PATH_BLACK = "/icons/logo-black.svg"
export const APP_SLOGAN = process.env.NEXT_PUBLIC_APP_SLOGAN || "Shop smart not hard."
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || APP_SLOGAN
export const APP_COPYRIGHT = process.env.NEXT_PUBLIC_APP_COPYRIGHT || 
`Copyright © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.`

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"
export const SENDER_NAME = process.env.SENDER_NAME || 'support'
export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'

export const PAGE_SIZE = Number(process.env.PAGE_SIZE || '9')
export const FREE_SHIPPING_MIN_PRICE = Number(process.env.FREE_SHIPPING_MIN_PRICE || 35)

export const CURRENCY_CODE = 'USD'
export const CURRENCY_SYMBOL = '$'

export const USER_ROLES = ['Admin', 'User']

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