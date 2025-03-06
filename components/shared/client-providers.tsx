'use client'
import React from 'react'
import useCartSidebar from '@/hooks/use-cart-sidebar'
import CartSidebar from './cart-sidebar'
import { Toaster } from '../ui/toaster'
import { ThemeProvider } from './theme-provider'
import AppInitializer from './app-initializer'
import { ClientSetting } from '@/types'

/**
 * ClientProviders provides a set of context providers to the entire application.
 * These include the AppInitializer, ThemeProvider, CartSidebar, and Toaster.
 *
 * @param {ClientSetting} setting - The site setting object.
 * @param {ReactNode} children - The children to render.
 * @returns {ReactElement} The rendered providers.
 */
export default function ClientProviders({
  setting,
  children,
}: {
  setting: ClientSetting
  children: React.ReactNode
}) {
  const visible = useCartSidebar()

  return (
    <AppInitializer setting={setting}>
      <ThemeProvider attribute='class' defaultTheme='system'>
        {visible ? (
          <div className='flex min-h-screen'>
            <div className='flex-1 overflow-hidden'>{children}</div>
            <CartSidebar />
          </div>
        ) : (
          <div>{children}</div>
        )}
        <Toaster />
      </ThemeProvider>
    </AppInitializer>
  )
}