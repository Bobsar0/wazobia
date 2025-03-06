import useCartStore from "@/hooks/use-cart-store";
import ProductPrice from "./product/product-price";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { SelectContent, SelectItem, SelectValue, Separator } from "@radix-ui/react-select";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Image from "next/image";
import { Select, SelectTrigger } from "../ui/select";
import { TrashIcon } from "lucide-react";
import { useLocale, useTranslations } from 'next-intl'
import { getDirection } from '@/i18n-config'
import useSettingStore from "@/hooks/use-setting-store";

/**
 * A sidebar component that displays the cart items and subtotal.
 * 
 * If the items price is greater than the free shipping minimum price,
 * it will display a message indicating that the order qualifies for free shipping.
 * 
 * The component also displays a button to go to the cart page.
 * 
 * The cart items are rendered in a scrollable area, with each item displaying
 * the product image, price, and quantity. The quantity can be updated by the
 * user by selecting a value from a dropdown. The user can also remove an item
 * from the cart by clicking on the trash icon.
 * 
 * The component uses the `useCartStore` hook to get the cart items and subtotal,
 * and to update the cart items and remove items from the cart.
 */
export default function CartSidebar() {
  const {
    setting: {
      common: { freeShippingMinPrice },
    },
  } = useSettingStore()

  const t = useTranslations()
  const locale = useLocale()
  
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore()

  return (
    <div className='w-32 overflow-y-auto'>
      <div
        className={`w-32 fixed  h-full ${
          getDirection(locale) === 'rtl' ? 'border-r' : 'border-l'
        }`}
      >
        <div className="p-2 h-full flex flex-col gap-2 justify-start items-center">
          <div className="text-center space-y-2">
            <div>{t('Cart.Subtotal')}</div>
            <div className="font-bold">
              <ProductPrice price={itemsPrice} plain />
            </div>

            {itemsPrice > freeShippingMinPrice && (
              <div className="text-center text-xs">
                {t('Cart.Your order qualifies for FREE Shipping')}
              </div>
            )}

            <Link 
              className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full hover:no-underline w-full' )}
              href="/cart"
              >
                {t('Cart.Go to Cart')}
            </Link>
            <Separator className="mt-3" />
          </div>

          <ScrollArea className="flex-1 w-full">
            {items.map((item) => (
              <div key={item.clientId}>
                <div className="my-3">
                <Link href={`/product/${item.slug}`}>
                  <div className="relative h-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes='20vw'
                      className='object-contain'
                    />
                  </div>
                </Link>
                <div className="text-sm text-center font-bold">
                  <ProductPrice price={item.price} plain />
                </div>
                <div className="flex gap-2 mt-2">
                  <Select
                    value={item.quantity.toString()}
                    onValueChange={(value) =>
                      updateItem(item, Number(value))
                    }
                  >
                    <SelectTrigger className='text-xs w-12 ml-1 h-auto py-0'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({
                        length: item.countInStock,
                      }).map((_, i) => (
                        <SelectItem key={i + 1} value={`${i + 1}`}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant={'outline'}
                    size={'sm'}
                    onClick={() => removeItem(item)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Separator />
            </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}