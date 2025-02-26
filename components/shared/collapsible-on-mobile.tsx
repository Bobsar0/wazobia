'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import useDeviceType from '@/hooks/use-device-type'
import { Button } from '../ui/button'

/**
 * A component that renders a collapsible section which behaves differently based on the device type.
 *
 * @param {{title: string, children: React.ReactNode}} props - The component props.
 * @param {string} props.title - The title displayed on the collapsible trigger button when on mobile devices.
 * @param {React.ReactNode} props.children - The content to be shown inside the collapsible area.
 *
 * @returns {JSX.Element|null} The collapsible component, or null if the device type is unknown.
 *
 * The collapsible is automatically expanded on desktop devices and collapsible on mobile devices.
 */
export default function CollapsibleOnMobile({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()

  const deviceType = useDeviceType()
  const [open, setOpen] = useState(false)
  
  useEffect(() => {
    if (deviceType === 'mobile') setOpen(false)
    else if (deviceType === 'desktop') setOpen(true)
  }, [deviceType, searchParams])
  if (deviceType === 'unknown') return null

  return (
    <Collapsible open={open}>
      <CollapsibleTrigger asChild>
        {deviceType === 'mobile' && (
          <Button
            onClick={() => setOpen(!open)}
            variant={'outline'}
            className='w-full'
          >
            {title}
          </Button>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  )
}