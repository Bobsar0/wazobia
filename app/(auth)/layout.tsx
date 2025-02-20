import { APP_COPYRIGHT } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

/**
 * The auth layout component.
 *
 * This component is the root of all auth pages. It provides a simple
 * layout with a header, main content, and footer. The header contains
 * a link to the home page, and the footer contains a copyright notice
 * and links to the conditions of use, privacy policy, and help pages.
 *
 * This component is server-side rendered and should not be used on the
 * client-side.
 *
 * @param children The children of the component. This is the main
 * content of the page.
 * @returns The component.
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const { site } = await getSetting()
  return (
    <div className='flex flex-col items-center min-h-screen highlight-link  '>
      <header className='mt-8'>
        <Link href='/'>
          <Image
            src='/icons/logo.svg'
            alt='logo'
            width={64}
            height={64}
            priority
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </Link>
      </header>
      <main className='mx-auto max-w-sm min-w-80 p-4'>{children}</main>
      <footer className=' flex-1 mt-8 bg-gray-800 w-full flex flex-col gap-4 items-center p-8 text-sm'>
        <div className='flex justify-center space-x-4'>
          <Link href='/page/conditions-of-use'>Conditions of Use</Link>
          <Link href='/page/privacy-policy'> Privacy Notice</Link>
          <Link href='/page/help'> Help </Link>
        </div>
        <div>
          <p className='text-gray-400'>{APP_COPYRIGHT}</p>
        </div>
      </footer>
    </div>
  )
}