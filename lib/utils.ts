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
    .replace(/-+/g, '-')
