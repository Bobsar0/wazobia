'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import useColorStore from '@/hooks/use-color-store'

/**
 * Provides a color scheme based on the current theme.
 *
 * This component is a wrapper around `next-themes`'s `ThemeProvider`. It uses
 * the `useTheme` hook from `next-themes` to get the current theme and the
 * `useColorStore` hook from `use-color-store` to get the current color scheme.
 *
 * It then uses the `useEffect` hook to update the CSS variables for the color
 * scheme whenever the theme or color scheme changes.
 *
 * @param children The children elements to render.
 * @param props The props to pass to the `ThemeProvider`.
 */
export function ColorProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const { theme } = useTheme()
  const { color, updateCssVariables } = useColorStore(theme)
  React.useEffect(() => {
    updateCssVariables()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, color])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}