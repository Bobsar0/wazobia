import { usePathname } from 'next/navigation'
import useDeviceType from './use-device-type'
import useCartStore from './use-cart-store'
import { i18n } from '@/i18n-config'

const locales = i18n.locales
  .filter((locale) => locale.code !== 'en-US')
  .map((locale) => locale.code)

/**
 * Tests if a given string is not in the set of paths where the cart sidebar
 * should not be shown.
 *
 * @param s - The string to test.
 * @returns True if the string is not in the set of paths, false otherwise.
 */
const isNotInPaths = (s: string) => {
  console.log('is string in locales?', locales, s)
  const localePattern = `/(?:${locales.join('|')})` // Match locales
  const pathsPattern = `^(?:${localePattern})?(?:/$|/cart$|/checkout$|/sign-in$|/sign-up$|/order(?:/.*)?$|/account(?:/.*)?$|/admin(?:/.*)?$)?$`
  console.log(!new RegExp(pathsPattern).test(s))
  return !new RegExp(pathsPattern).test(s)
}

/**
 * A custom React hook that determines whether the cart sidebar should be displayed.
 *
 * The sidebar is shown only if there are items in the cart, the device type is 'desktop',
 * and the current path is not one of the paths where the sidebar should be hidden.
 *
 * The hook uses `useCartStore` to get the items from the cart, `useDeviceType` to determine
 * the device type, and `usePathname` to get the current navigation path.
 *
 * @returns {boolean} - True if the sidebar should be displayed, false otherwise.
 */

function useCartSidebar() {
  const {
    cart: { items },
  } = useCartStore()
  const deviceType = useDeviceType()
  const currentPath = usePathname()

  return (
    items.length > 0 && deviceType === 'desktop' && isNotInPaths(currentPath)
  )
}

export default useCartSidebar