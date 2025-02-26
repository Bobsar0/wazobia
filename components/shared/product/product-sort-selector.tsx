'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getFilterUrl } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React from 'react'

/**
 * A component that renders a select input for sorting products.
 *
 * @param {{sortOrders: {value: string; name: string}[], sort: string, params: {q?: string, category?: string, price?: string, rating?: string, sort?: string, page?: string}}} props
 * @prop {string[]} sortOrders An array of objects with `value` and `name` properties.
 * @prop {string} sort The currently selected sort order.
 * @prop {Object} params An object containing the current query parameters.
 *
 * When the user selects a new sort order, the component will push a new URL with the updated
 * sort order to the browser's history using `next/router`.
 *
 * The component renders the currently selected sort order as a value in the select input.
 * It also renders the `name` property of each object in `sortOrders` as an option in the select input.
 *
 * The component does not render anything if `sortOrders` is not an array or if it is empty.
 *
 * The component does not render anything if `sort` is not a string.
 *
 * The component does not render anything if `params` is not an object.
 */
export default function ProductSortSelector({
  sortOrders,
  sort,
  params,
}: {
  sortOrders: { value: string; name: string }[]
  sort: string
  params: {
    q?: string
    category?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }
}) {
  const router = useRouter()
  return (
    <Select
      onValueChange={(v) => {
        router.push(getFilterUrl({ params, sort: v }))
      }}
      value={sort}
    >
      <SelectTrigger>
        <SelectValue>
          Sort By: {sortOrders.find((s) => s.value === sort)!.name}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {sortOrders.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}