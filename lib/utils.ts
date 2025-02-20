import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
    .replace(/-+/g, '-');

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
  Array.from({length: 24}, () => Math.floor(Math.random() * 10)).join('')

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

