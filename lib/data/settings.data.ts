import { i18n } from '@/i18n-config'
import {
  APP_DESCRIPTION,
  APP_LOGO_PATH,
  APP_NAME,
  APP_SLOGAN,
  CURRENCY_CONVERT_RATE_EUR,
  CURRENCY_CONVERT_RATE_GBP,
  CURRENCY_CONVERT_RATE_NGN,
  FREE_SHIPPING_MIN_PRICE,
  SERVER_URL,
} from '../constants'

const settings = [
  {
    common: {
      freeShippingMinPrice: FREE_SHIPPING_MIN_PRICE,
      isMaintenanceMode: false,
      defaultTheme: 'Light',
      defaultColor: 'Gold',
      pageSize: 9,
    },
    site: {
      name: APP_NAME,
      description: APP_DESCRIPTION,
      keywords: 'Next Ecommerce, Next.js, Tailwind CSS, MongoDB',
      url: SERVER_URL,
      logo: APP_LOGO_PATH,
      slogan: APP_SLOGAN,
      author: 'Next Ecommerce',
      copyright: '2000-2024, Next-Ecommerce.com, Inc. or its affiliates',
      email: 'admin@example.com',
      address: '123, Main Street, Anytown, CA, Zip 12345',
      phone: '+1 (123) 456-7890',
    },
    carousels: [
      {
        title: 'Most Popular Shoes For Sale',
        buttonCaption: 'Shop Now',
        image: '/images/banner3.jpg',
        url: '/search?category=Shoes',
      },
      {
        title: 'Best Sellers in T-Shirts',
        buttonCaption: 'Shop Now',
        image: '/images/banner1.jpg',
        url: '/search?category=T-Shirts',
      },
      {
        title: 'Best Deals on Wrist Watches',
        buttonCaption: 'See More',
        image: '/images/banner2.jpg',
        url: '/search?category=Wrist Watches',
      },
    ],
    availableLanguages: i18n.locales.map((locale) => ({
      code: locale.code,
      name: locale.name,
    })),
    defaultLanguage: 'en-US',
    availableCurrencies: [
      {
        name: 'Nigerian Naira',
        code: 'NGN',
        symbol: '₦',
        convertRate: CURRENCY_CONVERT_RATE_NGN,
      },
      {
        name: 'United States Dollar',
        code: 'USD',
        symbol: '$',
        convertRate: 1,
      },
      {
        name: 'British Pound Sterling',
        code: 'GBP',
        symbol: '£',
        convertRate: CURRENCY_CONVERT_RATE_GBP,
      },
      {
        name: 'Euro',
        code: 'EUR',
        symbol: '€',
        convertRate: CURRENCY_CONVERT_RATE_EUR,
      },
    ],
    defaultCurrency: 'USD',
    availablePaymentMethods: [
      { name: 'PayPal', commission: 0 },
      { name: 'Stripe', commission: 0 },
      { name: 'Cash On Delivery', commission: 0 },
    ],
    defaultPaymentMethod: 'PayPal',
    availableDeliveryDates: [
      {
        name: 'Tomorrow',
        daysToDeliver: 1,
        shippingPrice: 12.9,
        freeShippingMinPrice: 0,
      },
      {
        name: 'Next 3 Days',
        daysToDeliver: 3,
        shippingPrice: 6.9,
        freeShippingMinPrice: 0,
      },
      {
        name: 'Next 5 Days',
        daysToDeliver: 5,
        shippingPrice: 4.9,
        freeShippingMinPrice: 35,
      },
    ],
    defaultDeliveryDate: 'Next 5 Days',
  },
]

export default settings
