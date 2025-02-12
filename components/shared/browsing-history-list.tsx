'use client'
import useBrowsingHistory from '@/hooks/use-browsing-history'
import React, { useEffect } from 'react'
import ProductSlider from './product/product-slider'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'

/**
 * A component that displays a user's browsing history.
 *
 * It displays two lists of products: a list of related products, and a list of products
 * that the user has viewed. The component will not render if the user has no browsing history.
 *
 * @param {Object} props
 * @prop {string} [className] - Additional class names to apply to the component.
 * @returns {JSX.Element}
 */
export default function BrowsingHistoryList({
  className,
}: {
  className?: string
}) {
  const { products } = useBrowsingHistory()
  // const t = useTranslations('Home')
  return (
    products.length !== 0 && (
      <div className='bg-background'>
        <Separator className={cn('mb-4', className)} />
        <ProductList
          title={"Related to items that you've viewed"}
          type='related'
        />
        <Separator className='mb-4' />
        <ProductList
          title={'Your browsing history'}
          hideDetails
          type='history'
        />
      </div>
    )
  )
}

/**
 * A component that displays a list of products related to a user's browsing history.
 *
 * The component fetches the products from the server and passes them to the
 * `ProductSlider` component to be rendered.
 *
 * @param {Object} props
 * @prop {string} title - The title of the list.
 * @prop {'history'|'related'} type - The type of the list. 'history' displays a list of
 *   products that the user has viewed. 'related' displays a list of related products.
 * @prop {string} [excludeId] - The id of the product to exclude from the list.
 * @prop {boolean} [hideDetails] - If true, the component will not render the product details.
 * @returns {JSX.Element}
 */
function ProductList({
  title,
  type = 'history',
  hideDetails = false,
  excludeId = '',
}: {
  title: string
  type: 'history' | 'related'
  excludeId?: string
  hideDetails?: boolean
}) {
  const { products } = useBrowsingHistory()
  const [data, setData] = React.useState([])
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `/api/products/browsing-history?type=${type}&excludeId=${excludeId}&categories=${products
          .map((product) => product.category)
          .join(',')}&ids=${products.map((product) => product.id).join(',')}`
      )
      const data = await res.json()
      setData(data)
    }
    fetchProducts()
  }, [excludeId, products, type])

  return (
    data.length > 0 && (
      <ProductSlider title={title} products={data} hideDetails={hideDetails} />
    )
  )
}