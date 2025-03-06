'use client'

import ProductPrice from '@/components/shared/product/product-price'
import { getMonthName } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

type TableChartProps = {
  labelType: 'month' | 'product'
  data: {
    label: string
    image?: string
    value: number
    id?: string
  }[]
}

import React from 'react'

interface ProgressBarProps {
  value: number // Accepts a number between 0 and 100
  className?: string
}

/**
 * A progress bar component that displays a bar filling up based on the value provided in the props.
 * The bar starts from the right and fills up to the left.
 *
 * @param {number} value A number between 0 and 100 representing how full the bar should be.
 * @param {string} [className] Additional CSS classes to be applied to the component.
 * @returns {React.ReactElement} The ProgressBar component.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  // Ensure value stays within 0-100 range
  const boundedValue = Math.min(100, Math.max(0, value))

  return (
    <div className='relative w-full h-4 overflow-hidden'>
      <div
        className='bg-primary h-full transition-all duration-300 rounded-lg'
        style={{
          width: `${boundedValue}%`,
          float: 'right', // Aligns the bar to start from the right
        }}
      />
    </div>
  )
}

/**
 * A component that renders a table chart with progress bars and optional images.
 *
 * @param {Object} props
 * @param {'month'|'product'} [props.labelType='month'] - The type of label to display.
 * @param {Array<{label: string, image?: string, value: number, id?: string}>} [props.data=[]] - The data to display, containing labels, optional images, and values.
 *
 * @returns {JSX.Element} The TableChart component.
 *
 * @example
 * <TableChart
 *   labelType='month'
 *   data={[
 *     { label: 'January', value: 100 },
 *     { label: 'February', value: 200 },
 *     { label: 'March', value: 300 },
 *   ]}
 * />
 */
export default function TableChart({
  labelType = 'month',
  data = [],
}: TableChartProps) {
  const max = Math.max(...data.map((item) => item.value))
  
  const dataWithPercentage = data.map((x) => ({
    ...x,
    label: labelType === 'month' ? getMonthName(x.label) : x.label,
    percentage: Math.round((x.value / max) * 100),
  }))

  return (
    <div className='space-y-3'>
      {dataWithPercentage.map(({ label, id, value, image, percentage }) => (
        <div
          key={label}
          className='grid grid-cols-[100px_1fr_80px] md:grid-cols-[250px_1fr_80px] gap-2 space-y-4  '
        >
          {image ? (
            <Link className='flex items-end' href={`/admin/products/${id}`}>
              <Image
                className='rounded border  aspect-square object-scale-down max-w-full h-auto mx-auto mr-1'
                src={image!}
                alt={label}
                width={36}
                height={36}
              />
              <p className='text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
                {label}
              </p>
            </Link>
          ) : (
            <div className='flex items-end text-sm'>{label}</div>
          )}

          <ProgressBar value={percentage} />

          <div className='text-sm text-right flex items-center'>
            <ProductPrice price={value} plain />
          </div>
        </div>
      ))}
    </div>
  )
}