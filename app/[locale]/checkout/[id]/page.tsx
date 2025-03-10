import { notFound } from 'next/navigation'
import React from 'react'

import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import PaymentForm from './payment-form'
import Stripe from 'stripe'
import { CURRENCY_CODE } from '@/lib/constants'

export const metadata = {
  title: 'Payment',
}

/**
 * Page to process payment for an order.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - Promise that resolves to an object containing the order ID.
 *
 * @returns {JSX.Element} The PaymentForm component with the order details, PayPal client ID, Stripe client secret, and admin status.
 *
 * This component retrieves the order by ID and checks if the order exists. If the order does not exist, it triggers a notFound.
 * If the payment method is Stripe and the order is not paid, it creates a Stripe payment intent and retrieves the client secret.
 * It also checks the user's session to determine if the user is an admin.
 */
const CheckoutPaymentPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  let stripeClientSecret = null
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: CURRENCY_CODE,
      metadata: { orderId: order._id },
    })
    stripeClientSecret = paymentIntent.client_secret
  }

  return (
    <PaymentForm
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      stripeClientSecret={ stripeClientSecret }
      isAdmin={session?.user?.role === 'Admin' || false}
    />
  )
}

export default CheckoutPaymentPage