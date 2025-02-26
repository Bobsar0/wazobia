import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import qs from 'query-string'

/**
 * Updates a single query string parameter in a given URL and returns the resulting URL.
 *
 * @param {string} params - The query string to update.
 * @param {string} key - The key to update in the query string.
 * @param {string | null} value - The value to set for the given key.
 *   If null, the key will be removed from the query string.
 *
 * @returns {string} The updated URL.
 */
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string
  key: string
  value: string | null
}) {
  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

/**
 * Combines multiple class names into a single string using `clsx` and merges them with Tailwind's `twMerge`.
 *
 * @param inputs - An array of class values that can be strings, objects, or arrays.
 * @returns A single string with merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})
/**
 * Formats a number as a currency string.
 *
 * @param amount The number to format as a currency string.
 * @returns A string representing the given amount in currency format, e.g. "$1.99".
 */
export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')
/**
 * Formats a number using the browser locale's default formatting.
 *
 * @param number The number to format.
 * @returns A string representing the given number in the browser's locale's default number format.
 */
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}

/**
 * Format a number with up to two decimal places, padding with zeros if necessary.
 *
 * Examples:
 * - `formatNumberWithDecimal(1.234)` returns `"1.23"`
 * - `formatNumberWithDecimal(1.2)` returns `"1.20"`
 * - `formatNumberWithDecimal(1)` returns `"1"`
 */
export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split('.')
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : int
}

/**
 * Converts a string to a slug, suitable for use in URLs.
 *
 * 1. Lowercases the string.
 * 2. Replaces any non-word characters (except spaces and hyphens) with an empty string.
 * 3. Replaces any spaces with a hyphen.
 * 4. Removes any leading or trailing hyphens.
 * 5. Replaces any repeated hyphens with a single hyphen.
 *
 * @example
 * toSlug("My Example Blog Post") // "my-example-blog-post"
 */
export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')

/**
 * Rounds a number to two decimal places.
 *
 * This function uses a technique to mitigate floating-point precision
 * issues by adding a small epsilon value before rounding.
 *
 * @param num - The number to round.
 * @returns The number rounded to two decimal places.
 */
export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100

/**
 * Generates a random 24-character string, consisting only of digits.
 *
 * This is intended to be used as a unique identifier, such as for a document ID in a database.
 *
 * Note that this function does not guarantee that the generated IDs will be unique. If you need
 * to generate IDs that are guaranteed unique, consider using a UUID library such as `uuid`.
 */
export const generateId = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)).join('')

/**
 * Formats an error object into a human-readable string message.
 *
 * This function handles different types of errors such as ZodError, ValidationError,
 * and MongoDB duplicate key errors, formatting them into a concise error message.
 *
 * - For ZodError, it extracts the path and message for each field error and joins them with a period.
 * - For ValidationError, it extracts the message for each field error and joins them with a period.
 * - For MongoDB duplicate key errors (error code 11000), it identifies the duplicate field and
 *   returns a message indicating that the field already exists.
 * - For other errors, it returns the error message if it's a string, otherwise it stringifies the
 *   message object.
 *
 * @param error - The error object to format.
 * @returns A string representing the formatted error message.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (error: any): string => {
  if (error.name === 'ZodError') {
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message
      return `${error.errors[field].path}: ${errorMessage}` // field: errorMessage
    })
    return fieldErrors.join('. ')
  } else if (error.name === 'ValidationError') {
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message
      return errorMessage
    })
    return fieldErrors.join('. ')
  } else if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyValue)[0]
    return `${duplicateField} already exists`
  } else {
    // return 'Something went wrong. please try again'
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message)
  }
}

/**
 * Calculates a future date given a number of days.
 *
 * @param days - The number of days from today.
 * @returns A Date object representing the future date.
 */
export function calculateFutureDate(days: number) {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + days)
  return currentDate
}

/**
 * Given a year and month as a string in the format 'YYYY-MM', returns the month name.
 *
 * If the given month is the current month, the returned string will be suffixed with ' Ongoing'.
 *
 * @param yearMonth - The year and month as a string in the format 'YYYY-MM'.
 * @returns The month name as a string.
 */
export function getMonthName(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number)
  const date = new Date(year, month - 1)
  const monthName = date.toLocaleString('default', { month: 'long' })
  const now = new Date()

  if (year === now.getFullYear() && month === now.getMonth() + 1) {
    return `${monthName} Ongoing`
  }
  return monthName
}

/**
 * Calculates a past date given a number of days.
 *
 * @param days - The number of days before today.
 * @returns A Date object representing the past date.
 */
export function calculatePastDate(days: number) {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() - days)
  return currentDate
}

/**
 * Calculates the time remaining until midnight.
 *
 * This function returns the number of hours and minutes left from the current time
 * until the next occurrence of midnight (12:00 AM).
 *
 * @returns An object containing the number of hours and minutes remaining until midnight.
 */

export function timeUntilMidnight(): { hours: number; minutes: number } {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0) // Set to 12:00 AM (next day)

  const diff = midnight.getTime() - now.getTime() // Difference in milliseconds
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { hours, minutes }
}

/**
 * Formats a date string into a date-time string, a date-only string, and a time-only string.
 *
 * The date-time string is formatted according to the following options:
 * - month: short (e.g., 'Oct')
 * - year: numeric (e.g., '2023')
 * - day: numeric (e.g., '25')
 * - hour: numeric (e.g., '8')
 * - minute: numeric (e.g., '30')
 * - hour12: true (use 12-hour clock)
 *
 * The date-only string is formatted according to the following options:
 * - month: short (e.g., 'Oct')
 * - year: numeric (e.g., '2023')
 * - day: numeric (e.g., '25')
 *
 * The time-only string is formatted according to the following options:
 * - hour: numeric (e.g., '8')
 * - minute: numeric (e.g., '30')
 * - hour12: true (use 12-hour clock)
 *
 * @param dateString - The date string to format.
 * @returns An object with the formatted date-time string, date-only string, and time-only string.
 */
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const dateOptions: Intl.DateTimeFormatOptions = {
    // weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  )
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  )
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  )
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  }
}

/**
 * Format a MongoDB ObjectId into a shorter string by taking the last 6 characters of the id.
 * @param id The ObjectId to format.
 * @returns A string with the last 6 characters of the ObjectId, prefixed with '..'.
 */
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`
}

/**
 * Given an object with parameters and optional filter values, returns a URL string
 * with the filter values added to the query string.
 *
 * The parameters object should have the following shape:
 * - q?: string
 * - category?: string
 * - tag?: string
 * - price?: string
 * - rating?: string
 * - sort?: string
 * - page?: string
 *
 * The filter values are optional and will only be included in the query string
 * if they are provided.
 *
 * @param {Object} params The parameters object.
 * @param {string} [category] The category filter value.
 * @param {string} [tag] The tag filter value.
 * @param {string} [sort] The sort filter value.
 * @param {string} [price] The price filter value.
 * @param {string} [rating] The rating filter value.
 * @param {string} [page] The page filter value.
 * @returns {string} A URL string with the filter values added to the query string.
 */
export const getFilterUrl = ({
  params,
  category,
  tag,
  sort,
  price,
  rating,
  page,
}: {
  params: {
    q?: string
    category?: string
    tag?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }
  tag?: string
  category?: string
  sort?: string
  price?: string
  rating?: string
  page?: string
}) => {
  const newParams = { ...params }
  if (category) newParams.category = category
  if (tag) newParams.tag = toSlug(tag)
  if (price) newParams.price = price
  if (rating) newParams.rating = rating
  if (page) newParams.page = page
  if (sort) newParams.sort = sort
  return `/search?${new URLSearchParams(newParams).toString()}`
}