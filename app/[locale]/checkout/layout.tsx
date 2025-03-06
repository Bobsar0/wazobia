import { HelpCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

/**
 * The checkout layout component.
 *
 * This component is the root of all checkout pages. It provides a simple
 * layout with a header that contains a link to the home page, a title
 * "Checkout", and a link to the help page.
 *
 * This component is server-side rendered and should not be used on the
 * client-side.
 *
 * @param {React.ReactNode} children The children of the component. This is
 * the main content of the page.
 * @returns {JSX.Element} The component.
 */
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='p-4'>
      <header className='bg-card mb-4 border-b'>
        <div className='max-w-6xl mx-auto flex justify-between items-center'>
          <Link href='/'>
            <Image
              src='/icons/logo.svg'
              alt='logo'
              width={70}
              height={70}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </Link>
          <div>
            <h1 className='text-3xl'>Checkout</h1>
          </div>
          <div>
            <Link href='/page/help'>
              <HelpCircle className='w-6 h-6' />
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}