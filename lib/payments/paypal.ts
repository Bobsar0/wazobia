import { CURRENCY_CODE } from "../constants"

const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com'

export const paypal = {
  /**
   * Creates a new PayPal order.
   *
   * @param {number} price - The price of the order.
   * @returns {Promise<Object>} The response from PayPal.
   */
  createOrder: async function createOrder(price: number) {
    const accessToken = await generateAccessToken()
    const url = `${base}/v2/checkout/orders`
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: CURRENCY_CODE,
              value: price,
            },
          },
        ],
      }),
    })
    return handleResponse(response)
  },
  
  /**
   * Captures a PayPal order.
   *
   * @param {string} orderId - The ID of the order to capture.
   * @returns {Promise<Object>} The response from PayPal.
   */
  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generateAccessToken()
    const url = `${base}/v2/checkout/orders/${orderId}/capture`
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return handleResponse(response)
  },
}

/**
 * Generates a PayPal access token.
 *
 * @returns {Promise<string>} The access token.
 */
async function generateAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET).toString(
    'base64'
  )
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'post',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })

  const jsonData = await handleResponse(response)
  return jsonData.access_token
}

/**
 * Handles a response from the PayPal API.
 *
 * If the response status is 200 or 201, it will return the JSON data from the response.
 * If the response status is anything else, it will throw an error with the error message.
 *
 * @param {Response} response - The response from the PayPal API.
 * @returns {Promise<Object|string>} The JSON data from the response if the status is 200 or 201, or the error message if the status is anything else.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleResponse(response: any) {
  if (response.status === 200 || response.status === 201) {
    return response.json()
  }

  const errorMessage = await response.text()
  throw new Error(errorMessage)
}