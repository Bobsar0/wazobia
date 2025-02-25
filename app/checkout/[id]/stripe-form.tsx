"use server"

import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import { SERVER_URL } from '@/lib/constants'

/**
 * StripeForm component that renders a payment form for processing payments
 * using Stripe. It handles form submission to confirm payment, displays
 * any errors encountered, and manages loading state during the process.
 *
 * @param {Object} props - The component props.
 * @param {number} props.priceInCents - The price of the order in cents.
 * @param {string} props.orderId - The unique identifier of the order.
 *
 * The component initializes Stripe elements, manages the user's email input,
 * and facilitates the interaction with Stripe's payment APIs.
 */

export default function StripeForm({
  priceInCents,
  orderId,
}: {
  priceInCents: number
  orderId: string
}) {
  // const {
  //   setting: { site },
  // } = useSettingStore()

  const site = { url: SERVER_URL }

  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [email, setEmail] = useState<string>()

/**
 * Handles the payment form submission by preventing the default event,
 * checking for required Stripe elements, and initiating the payment confirmation
 * process. If successful, it redirects to a success page; otherwise, it displays
 * an error message based on the type of error encountered.
 *
 * @param {FormEvent} e - The form event triggered by the submission.
 */

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (stripe == null || elements == null || email == null) return

    setIsLoading(true)
    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${site.url}/checkout/${orderId}/stripe-payment-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('An unknown error occurred')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='text-xl'>Stripe Checkout</div>
      {errorMessage && <div className='text-destructive'>{errorMessage}</div>}
      <PaymentElement id='payment-element'/>
      <div>
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      </div>
      <Button
        className='w-full'
        size='lg'
        disabled={stripe == null || elements == null || isLoading}
      >
        {isLoading ? (
          'Purchasing...'
        ) : (
          <div>
            Purchase - <ProductPrice price={priceInCents / 100} plain />
          </div>
        )}
      </Button>
    </form>
  )
}