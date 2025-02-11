import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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