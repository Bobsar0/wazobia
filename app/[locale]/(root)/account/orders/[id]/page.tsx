import { notFound } from 'next/navigation'
import React from 'react'

import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import OrderDetailsForm from '@/components/shared/order/order-details-form'
import Link from 'next/link'
import { formatId } from '@/lib/utils'

/**
 * Generates metadata for the order details page.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - Promise that resolves to an object containing the order ID.
 *
 * @returns {Promise<{ title: string }>} The metadata to be used for the page, including the order title.
 */

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  return {
    title: `Order ${formatId(params.id)}`,
  }
}

/**
 * Asynchronously fetches an order by ID and renders the OrderDetailsForm component.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - Promise that resolves to an object containing the order ID.
 *
 * @returns {JSX.Element} The OrderDetailsForm component with the resolved order ID, admin status and order details.
 *
 * This component retrieves the order by ID and checks if the order exists. If the order does not exist, it triggers a notFound.
 * It also checks the user's session to determine if the user is an admin.
 */
export default async function OrderDetailsPage(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  return (
    <>
      <div className='flex gap-2'>
        <Link href='/account'>Your Account</Link>
        <span>›</span>
        <Link href='/account/orders'>Your Orders</Link>
        <span>›</span>
        <span>Order {formatId(order._id)}</span>
      </div>
      <h1 className='h1-bold py-4'>Order {formatId(order._id)}</h1>
      <OrderDetailsForm
        order={order}
        isAdmin={session?.user?.role === 'Admin' || false}
      />
    </>
  )
}