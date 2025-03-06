import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import CheckoutForm from './checkout-form'

export const metadata: Metadata = {
  title: 'Checkout',
}

/**
 * The checkout page.
 *
 * This page is protected by authentication. If the user is not logged in, it
 * redirects them to the sign-in page with a callback URL of /checkout.
 *
 * Once the user is logged in, it renders the CheckoutForm component.
 */
export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/checkout')
  }
  return <CheckoutForm />
}