'use client'

import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'
import useIsMounted from '@/hooks/use-is-mounted'
import useCartSidebar from '@/hooks/use-cart-sidebar'

/**
 * A button that displays the cart items count and links to the cart page.
 *
 * If the cart items count is greater than or equal to 10, it will be displayed
 * in a smaller font size and without padding.
 *
 * The `useIsMounted` hook is used to avoid displaying the cart items count on
 * the server side and avoid hydration error.
 *
 * The `useCartStore` hook is used to get the cart items.
 *
 * The styles for this component are defined in the `header-button` and `cart-button` classes in the
 * `components/ui/button.css` file.
 *
 * @returns A JSX element that renders a button with the cart items count.
 */
export default function CartButton() {
  const isMounted = useIsMounted()
  const {
    cart: { items },
  } = useCartStore()
  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)
  const isCartSidebarOpen = useCartSidebar()
  // const showSidebar = useShowSidebar()
  // const t = useTranslations()

  // const locale = useLocale()
  return (
    <Link href='/cart' className='px-1 header-button'>
      <div className='flex items-end text-xs relative'>
        <ShoppingCartIcon className='h-8 w-8' />

        {isMounted && (
          <span
            className={cn(
              `bg-black px-1 rounded-full text-primary text-base font-bold absolute right-[30px] top-[-4px] z-10`,
              cartItemsCount >= 10 && 'text-sm px-0 p-[1px]'
            )}
          >
            {cartItemsCount}
          </span>
        )}
        <span className='font-bold'>Cart</span>
        {isCartSidebarOpen && (
          <div
            className={`absolute top-[20px] right-[-16px] rotate-[-90deg] z-10 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-transparent border-b-background`}
          ></div>
        )}

        {/* {showSidebar && (
          <div
            className={`absolute top-[20px] ${
              getDirection(locale) === 'rtl'
                ? 'left-[-16px] rotate-[-270deg]'
                : 'right-[-16px] rotate-[-90deg]'
            }  z-10   w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-transparent border-b-background`}
          ></div>
        )} */}
      </div>
    </Link>
  )
}