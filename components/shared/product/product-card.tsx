import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import Rating from './rating'
import { formatNumber, generateId, round2 } from '@/lib/utils'
import ProductPrice from './product-price'
import ImageHover from './image-hover'
import { IProduct } from '@/lib/db/models/product.model'
import AddToCart from './add-to-cart'

/**
 * A component that displays a product card.
 *
 * The component renders a card with the product name, brand, price, and average rating.
 * If `hideBorder` is true, the component will not render a card border.
 * If `hideDetails` is true, the component will not render the product details.
 * If `hideAddToCart` is true, the component will not render the "Add to Cart" button.
 *
 * @param {Object} props - The component props.
 * @param {IProduct} props.product - The product to be displayed.
 * @param {boolean} [props.hideBorder=false] - Flag to determine if the card border should be hidden.
 * @param {boolean} [props.hideDetails=false] - Flag to determine if the product details should be hidden.
 * @param {boolean} [props.hideAddToCart=false] - Flag to determine if the "Add to Cart" button should be hidden.
 * @returns {JSX.Element}
 */
const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
}: {
  product: IProduct
  hideDetails?: boolean
  hideBorder?: boolean
  hideAddToCart?: boolean
}) => {
  /**
   * Renders a product image. If the product has more than one image, it renders an ImageHover component.
   * Otherwise, it renders a single image.
   *
   * @returns {JSX.Element}
   */
  const ProductImage = () => (
    <Link href={`/product/${product.slug}`}>
      <div className='relative h-52'>
        {product.images.length > 1 ? (
          <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
          />
        ) : (
          <div className='relative h-52'>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes='80vw'
              className='object-contain'
            />
          </div>
        )}
      </div>
    </Link>
  )
  /**
   * Renders the product details.
   *
   * The component renders a div with the product brand, name, average rating, number of reviews, and price.
   * The product name is rendered as a link to the product page.
   * The price is rendered as a `ProductPrice` component.
   * The average rating and number of reviews are rendered as a `Rating` component.
   */
  const ProductDetails = () => (
    <div className='flex-1 space-y-2'>
      <p className='font-bold'>{product.brand}</p>
      <Link
        href={`/product/${product.slug}`}
        className='overflow-hidden text-ellipsis'
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {product.name}
      </Link>
      <div className='flex gap-2 justify-center'>
        <Rating rating={product.avgRating} />
        <span>({formatNumber(product.numReviews)})</span>
      </div>

      <ProductPrice
        isDeal={product.tags.includes('todays-deal')}
        price={product.price}
        listPrice={product.listPrice}
        forListing
      />
    </div>
  )
  /**
   * Renders a minimal `AddToCart` component with the product details.
   *
   * The component renders a div with a centered `AddToCart` component.
   * The `AddToCart` component is rendered with the `minimal` property set to `true`.
   * The `item` property is set to an object containing the product details.
   */
  const AddButton = () => (
    <div className='w-full text-center'>
      <AddToCart
        minimal
        item={{
          clientId: generateId(),
          product: product._id,
          size: product.sizes[0],
          color: product.colors[0],
          countInStock: product.countInStock,
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: round2(product.price),
          quantity: 1,
          image: product.images[0],
        }}
      />
    </div>
  )

  return hideBorder ? (
    <div className='flex flex-col'>
      <ProductImage />
      {!hideDetails && (
        <>
          <div className='p-3 flex-1 text-center'>
            <ProductDetails />
          </div>
          {!hideAddToCart && <AddButton />}
        </>
      )}
    </div>
  ) : (
    <Card className='flex flex-col  '>
      <CardHeader className='p-3'>
        <ProductImage />
      </CardHeader>
      {!hideDetails && (
        <>
          <CardContent className='p-3 flex-1 text-center'>
            <ProductDetails />
          </CardContent>
          <CardFooter className='p-3'>
            {!hideAddToCart && <AddButton />}
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default ProductCard
