/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import ProductPrice from '@/components/shared/product/product-price'
import { Card, CardContent } from '@/components/ui/card'
import useColorStore from '@/hooks/use-color-store'
import { CURRENCY_SYMBOL } from '@/lib/constants'
import { formatDateTime } from '@/lib/utils'
import { useTheme } from 'next-themes'
import React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

/**
 * A custom tooltip component for use with Recharts.
 *
 * @param {boolean} active
 * @param {{ value: number }[]} payload
 * @param {string} label
 * @returns {React.ReactElement}
 */
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <Card>
        <CardContent className='p-2'>
          <p>{label && formatDateTime(new Date(label)).dateOnly}</p>
          <p className='text-primary text-xl'>
            <ProductPrice price={payload[0].value} plain />
          </p>
        </CardContent>
      </Card>
    )
  }
  return null
}

/**
 * A custom tick component for the x-axis of the AreaChart.
 *
 * @param {{ x: number, y: number, payload: { value: string } }} props
 * @returns {React.ReactElement}
 */
const CustomXAxisTick: React.FC<any> = ({ x, y, payload }) => {
  return (
    <text x={x} y={y + 10} textAnchor='left' fill='#666' className='text-xs'>
      {formatDateTime(new Date(payload.value)).dateOnly}
      {/* {`${payload.value.split('/')[1]}/${payload.value.split('/')[2]}`} */}
    </text>
  )
}
const STROKE_COLORS: { [key: string]: { [key: string]: string } } = {
  Red: { light: '#980404', dark: '#ff3333' },
  Green: { light: '#015001', dark: '#06dc06' },
  Gold: { light: '#ac9103', dark: '#f1d541' },
  Blue: { light: '#0044cc', dark: '#0066ff' },
}

/**
 * Renders a sales area chart using the provided data.
 *
 * This component utilizes a responsive container to adjust its size
 * and an area chart to display sales data over time. It includes
 * grid lines, customized X and Y axes, tooltips, and an area
 * representing total sales.
 *
 * @param {Object} props
 * @param {Array} props.data - An array of data objects containing sales information. 
 * Each object should have a 'date' and 'totalSales' property.
 *
 * @returns {JSX.Element} The rendered sales area chart component.
 */

export default function SalesAreaChart({ data }: { data: any[] }) {
  const { theme } = useTheme()
  const { cssColors, color } = useColorStore(theme)

  return (
    <ResponsiveContainer width='100%' height={400}>
      <AreaChart data={data}>
        <CartesianGrid horizontal={true} vertical={false} stroke='' />
        <XAxis dataKey='date' tick={<CustomXAxisTick />} interval={3} />
        <YAxis fontSize={12} tickFormatter={(value: number) => `${CURRENCY_SYMBOL}${value}`} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type='monotone'
          dataKey='totalSales'
          stroke={STROKE_COLORS[color.name][theme || 'light']}
          strokeWidth={2}
          fill={`hsl(${cssColors['--primary']})`}
          fillOpacity={0.8}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}