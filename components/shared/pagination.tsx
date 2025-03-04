'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { formUrlQuery } from '@/lib/utils'

import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  page: number | string
  totalPages: number
  urlParamName?: string
}

/**
 * A pagination component for navigating between pages.
 *
 * @param {{ page: number|string, totalPages: number, urlParamName?: string }} props
 * @prop {number|string} page - The current page number.
 * @prop {number} totalPages - The total number of pages.
 * @prop {string} [urlParamName] - The URL query parameter name. Defaults to 'page'.
 *
 * @returns {JSX.Element} A pagination component.
 */
const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    })

    router.push(newUrl, { scroll: true })
  }

  // const t = useTranslations()
  return (
    <div className='flex items-center gap-2'>
      <Button
        size='lg'
        variant='outline'
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1}
        className='w-24'
      >
        <ChevronLeft /> Previous
      </Button>
      Page {page} of {totalPages}
      <Button
        size='lg'
        variant='outline'
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
        className='w-24'
      >
        Next <ChevronRight />
      </Button>
    </div>
  )
}

export default Pagination