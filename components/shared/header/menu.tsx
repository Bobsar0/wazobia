import React from 'react'
import CartButton from './cart-button'
import UserButton from './user-button'


/**
 * A simple menu component that displays a user button and a cart button.
 *
 * @returns A JSX element representing the menu.
 */
const Menu = () => {
  return (
    <div className='flex justify-end'>
      <nav className='flex gap-3 w-full'>
        <UserButton />
        <CartButton />
      </nav>
    </div>
  )
}

export default Menu