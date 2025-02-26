'use client'

import { ChevronDownIcon, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import useColorStore from '@/hooks/use-color-store'
import useIsMounted from '@/hooks/use-is-mounted'

/**
 * ThemeSwitcher component provides a dropdown menu for selecting the theme and color scheme.
 * 
 * - Utilizes the `useTheme` hook from `next-themes` to manage the current theme.
 * - Uses `useColorStore` to manage available colors and the current color scheme.
 * - Displays a dropdown menu with options to switch between 'dark' and 'light' themes.
 * - Provides a selection of available colors based on the current theme.
 * - Renders a `Moon` or `Sun` icon based on the selected theme with a `ChevronDownIcon`.
 * 
 * This component should be used as part of a header or settings interface to allow users
 * to customize their theme and color preferences.
 */

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { availableColors, color, setColor } = useColorStore(theme)
  // const t = useTranslations('Header')
  const changeTheme = (value: string) => {
    setTheme(value)
  }
  const isMounted = useIsMounted()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='header-button h-[41px]'>
        {theme === 'dark' && isMounted ? (
          <div className='flex items-center gap-1'>
            <Moon className='h-4 w-4' /> Dark <ChevronDownIcon />
          </div>
        ) : (
          <div className='flex items-center gap-1'>
            <Sun className='h-4 w-4' /> Light <ChevronDownIcon />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>

        <DropdownMenuRadioGroup value={theme} onValueChange={changeTheme}>
          <DropdownMenuRadioItem value='dark'>
            <Moon className='h-4 w-4 mr-1' /> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='light'>
            <Sun className='h-4 w-4 mr-1' /> Light
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />

        <DropdownMenuLabel>Color</DropdownMenuLabel>

        <DropdownMenuRadioGroup
          value={color.name}
          onValueChange={(value) => setColor(value, true)}
        >
          {availableColors.map((c) => (
            <DropdownMenuRadioItem key={c.name} value={c.name}>
              <div
                style={{ backgroundColor: c.name }}
                className='h-4 w-4 mr-1 rounded-full'
              ></div>
              {c.name}
              {/* {t(c.name)} */}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}