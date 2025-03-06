/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import useColorStore from '@/hooks/use-color-store'
import { useTheme } from 'next-themes'
import React from 'react'
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts'

/**
 * A component that renders a pie chart of top selling categories.
 *
 * @param {{ data: any[] }} props
 * @prop {any[]} data An array of objects, each containing a category name in the `_id` property, and a total sales amount in the `totalSales` property.
 *
 * The component will render a pie chart with a slice for each category, colored with the primary color from the current theme.
 * The component will also render a text label for each slice, showing the category name and total sales amount.
 *
 * The component uses the `recharts` library to render the chart.
 *
 * The component is responsive, meaning its size will adapt to the size of its parent container.
 */
export default function SalesCategoryPieChart({ data }: { data: any[] }) {
  const { theme } = useTheme()
  const { cssColors } = useColorStore(theme)

  const RADIAN = Math.PI / 180
  
/**
 * Renders a customized label for each pie slice.
 *
 * This function calculates the position of the label based on the mid-angle,
 * inner and outer radii of the pie slice. It places the label in the middle
 * of the slice and returns an SVG text element displaying the category name
 * and total sales.
 *
 * @param {Object} params - The parameters for the label.
 * @param {number} params.cx - The x-coordinate of the center of the pie.
 * @param {number} params.cy - The y-coordinate of the center of the pie.
 * @param {number} params.midAngle - The mid-angle of the pie slice.
 * @param {number} params.innerRadius - The inner radius of the pie slice.
 * @param {number} params.outerRadius - The outer radius of the pie slice.
 * @param {number} params.index - The index of the data point in the dataset.
 * @returns {JSX.Element} The SVG text element for the label.
 */

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <>
        <text
          x={x}
          y={y}
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline='central'
          className='text-xs'
        >
          {`${data[index]._id} ${data[index].totalSales} sales`}
        </text>
      </>
    )
  }

  return (
    <ResponsiveContainer width='100%' height={400}>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey='totalSales'
          cx='50%'
          cy='50%'
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`hsl(${cssColors['--primary']})`}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}