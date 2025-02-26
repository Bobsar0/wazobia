import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Menu from '@/components/shared/header/menu'
import { AdminNav } from './admin-nav'
import { APP_LOGO_PATH, APP_NAME } from '@/lib/constants'

/**
 * The admin layout component.
 *
 * This component provides a layout for all admin pages, including a header
 * with a logo, navigation menu, and site-specific settings. It displays the
 * main content of the admin page wrapped in a styled container.
 *
 * @param {React.ReactNode} children - The children of the component, representing
 * the main content of the admin page.
 * @returns {JSX.Element} The component.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const { site } = await getSetting()
  const site = { name: APP_NAME }
  return (
    <>
      <div className='flex flex-col'>
        <div className='bg-black text-white'>
          <div className='flex h-16 items-center px-2'>
            <Link href='/'>
              <Image
                src={APP_LOGO_PATH}
                width={48}
                height={48}
                alt={`${site.name} logo`}
              />
            </Link>
            <AdminNav className='mx-6 hidden md:flex' />
            <div className='ml-auto flex items-center space-x-4'>
              <Menu forAdmin />
            </div>
          </div>
          <div>
            <AdminNav className='flex md:hidden px-4 pb-2' />
          </div>
        </div>
        <div className='flex-1 p-4'>{children}</div>
      </div>
    </>
  )
}