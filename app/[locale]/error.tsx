'use client'
import React from 'react'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

/**
 * The default error page displayed by Next.js when an error occurs.
 *
 * @example
 * <ErrorPage error={error} reset={() => reset()} />
 *
 * @param {Error} error - The error that occurred.
 * @param {() => void} reset - A function to call when the "Try again" button is pressed.
 *
 * @returns {JSX.Element} The rendered error page.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const t = useTranslations()
  return (
    <div className='flex flex-col items-center justify-center min-h-screen '>
      <div className='p-6 rounded-lg shadow-md w-1/3 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Error</h1>
        <p className='text-destructive'>{error.message}</p>
        <Button variant='outline' className='mt-4' onClick={() => reset()}>
          {t('Error.Try again')}
        </Button>
        <Button
          variant='outline'
          className='mt-4 ml-2'
          onClick={() => (window.location.href = '/')}
        >
          {t('Error.Back To Home')}
        </Button>
      </div>
    </div>
  )
}