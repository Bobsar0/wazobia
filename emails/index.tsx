import { Resend } from 'resend'
import PurchaseReceiptEmail from './purchase-receipt'
import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'
import { IOrder } from '@/lib/db/models/order.model'
import AskReviewOrderItemsEmail from './ask-review-order-items'

const resend = new Resend(process.env.RESEND_API_KEY as string)

/**
 * Sends an order confirmation email to the user containing the order receipt.
 *
 * @param {{ order: IOrder }} param
 * @param {IOrder} param.order The order to send the confirmation for.
 * @returns {Promise<void>} A promise resolved when the email is sent.
 */
export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: `Order Confirmation`,
    react: <PurchaseReceiptEmail order={order} />,
  })
}

/**
 * Sends an email to the user to review the items in their order, after a day from
 * the order creation date.
 *
 * @param {{ order: IOrder }} param
 * @param {IOrder} param.order The order containing the items to ask a review for.
 * @returns {Promise<void>} A promise resolved when the email is sent.
 */
export const sendAskReviewOrderItems = async ({ order }: { order: IOrder }) => {
  const oneDayFromNow = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()

  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: 'Review your order items',
    react: <AskReviewOrderItemsEmail order={order} />,
    scheduledAt: oneDayFromNow,
  })
}
