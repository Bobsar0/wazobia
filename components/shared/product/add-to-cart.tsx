/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCartStore from '@/hooks/use-cart-store'
import { useToast } from '@/hooks/use-toast'
import { OrderItem } from '@/types'
// import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * Component that provides an interface for adding an item to the shopping cart.
 * 
 * @param {Object} props - The component props.
 * @param {OrderItem} props.item - The item to be added to the cart.
 * @param {boolean} [props.minimal=false] - Flag to determine if the minimal version of the component should be rendered.
 * 
 * The component renders a button or a detailed interface based on the `minimal` flag. In minimal mode,
 * it displays a button that adds the item to the cart with a quantity of 1 and shows a toast notification.
 * In non-minimal mode, it provides a select input for quantity and additional buttons for adding the item
 * to the cart or directly proceeding to checkout.
 */

export default function AddToCart({
  item,
  minimal = false,
}: {
  item: OrderItem
  minimal?: boolean
}) {
  const router = useRouter()
  const { toast } = useToast()

  const { addItem } = useCartStore()

  const [quantity, setQuantity] = useState(1)

  // const t = useTranslations()

  return minimal ? (
    <Button
      className='rounded-full w-auto'
      onClick={() => {
        try {
          addItem(item, 1)
          toast({
            // description: t('Product.Added to Cart'),
            description: 'Added to Cart',
            action: (
              <Button
                onClick={() => {
                  router.push('/cart')
                }}
              >
                {/* {t('Product.Go to Cart')} */}
                Go to Cart
              </Button>
            ),
          })
        } catch (error: any) {
          toast({
            variant: 'destructive',
            description: error.message,
          })
        }
      }}
    >
      {/* {t('Product.Add to Cart')} */}
      Add to Cart
    </Button>
  ) : (
    <div className='w-full space-y-2'>
      <Select
        value={quantity.toString()}
        onValueChange={(i) => setQuantity(Number(i))}
      >
        <SelectTrigger className=''>
          <SelectValue>
            {/* {t('Product.Quantity')}: {quantity} */}
            Quantity: {quantity}
          </SelectValue>
        </SelectTrigger>
        <SelectContent position='popper'>
          {Array.from({ length: item.countInStock }).map((_, i) => (
            <SelectItem key={i + 1} value={`${i + 1}`}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className='rounded-full w-full'
        type='button'
        onClick={async () => {
          try {
            const itemId = await addItem(item, quantity)
            router.push(`/cart/${itemId}`)
          } catch (error: any) {
            toast({
              variant: 'destructive',
              description: error.message,
            })
          }
        }}
      >
        {/* {t('Product.Add to Cart')} */}
        Add to Cart
      </Button>
      <Button
        variant='secondary'
        onClick={() => {
          try {
            addItem(item, quantity)
            router.push(`/checkout`)
          } catch (error: any) {
            toast({
              variant: 'destructive',
              description: error.message,
            })
          }
        }}
        className='w-full rounded-full '
      >
        {/* {t('Product.Buy Now')} */}
        Buy Now
      </Button>
    </div>
  )
}