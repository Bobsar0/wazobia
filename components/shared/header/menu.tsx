import Link from 'next/link'
import React from 'react'
import CartButton from './cart-button'


const Menu = () => {
  return (
    <div className='flex justify-end'>
      <nav className='flex gap-3 w-full'>
        <Link href='/signin' className='flex items-center header-button'>
          Hello, Sign in
          {/* <UserIcon className='h-8 w-8'/>
          <span className='font-bold'>Sign in</span> */}
        </Link>

        <CartButton />
      </nav>
    </div>
  )
}

export default Menu