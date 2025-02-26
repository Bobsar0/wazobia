'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ColorProvider } from './color-provider'

/**
 * ThemeProvider component provides a theme and color scheme to all its children.
 *
 * It wraps `next-themes`'s `ThemeProvider` and `use-color-store`'s `ColorProvider` to provide
 * a theme and color scheme, and also sets up the CSS variables for the color scheme.
 *
 * @param children The children elements to render.
 * @param props The props to pass to the `ThemeProvider`.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ColorProvider>{children}</ColorProvider>
    </NextThemesProvider>
  )
}