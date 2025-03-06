import Image from 'next/image'
import Link from 'next/link'
import Menu from './menu'
import Search from './search'
import data from '@/lib/data/data'
import Sidebar from './sidebar'
import { getAllCategories } from '@/lib/actions/product.actions'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

/**
 * The main header component for the app.
 *
 * This component renders the app's logo, search bar, navigation menu,
 * and categories sidebar. It also renders a bottom bar with links
 * to the app's main pages.
 *
 * The component is a Next.js `async` component, which allows it to
 * fetch data from the API on the server-side and render the component
 * with the fetched data on the client-side.
 *
 * @returns The header component.
 */
export default async function Header() {
  const { site } = await getSetting()
  const t = await getTranslations()

  const categories = await getAllCategories()
  return (
    <header className='bg-black  text-white'>
      <div className='px-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <Link
              href='/'
              className='flex items-center header-button font-extrabold text-2xl m-1 '
            >
              <Image
                src='/icons/logo.svg'
                width={40}
                height={40}
                alt={`${site.name} logo`}
              />
              {site.name}
            </Link>
          </div>

          <div className='hidden md:block flex-1 max-w-xl'>
            <Search />
          </div>
          <Menu />
        </div>
        <div className='md:hidden block py-2'>
          <Search />
        </div>
      </div>
      <div className='flex items-center px-3 mb-[1px]  bg-gray-800'>
        <Sidebar categories={categories} />
        <div className='flex items-center flex-wrap gap-3 overflow-hidden   max-h-[42px]'>
          {data.headerMenus.map((menu) => (
            <Link
              href={menu.href}
              key={menu.href}
              className='header-button !p-2 '
            >
              {t('Header.' + menu.name)}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
