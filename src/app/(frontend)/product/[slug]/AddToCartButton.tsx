'use client'

import { Button } from '@/components/ui/button'
import { useContext, useState } from 'react'
import { ProductProvider } from './ProductProviderComponent'
import { CartProvider } from '@/components/Cart/CartProviderComponent'
import { CheckIcon, MinusCircle, PlusCircle } from 'lucide-react'
import * as Drawer from '@/components/ui/drawer'
import ProductSizeSelector from './ProductSizeSelector'
import { formatPrice } from '@/collections/Products/formatPrice'
import { useMediaQuery } from '@/utilities/useMediaQuery'

export default function AddToCartButton() {
  const { ...ProductContext } = useContext(ProductProvider)
  const CartContext = useContext(CartProvider)

  const [state, setState] = useState<'stable' | 'loading' | 'done'>('stable')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const isMd = useMediaQuery('(min-width: 768px)')

  const handleAddToCart = (e?: any) => {
    CartContext.add({
      item: {
        id: ProductContext.product.id,
        size: ProductContext.size?.id,
        quantity: ProductContext.quantity,
        product: ProductContext.product,
      },
    })
    setIsDrawerOpen(false)
  }

  const onClick = () => {
    if (state == 'done') {
      setState('stable')
      return
    } else if (state == 'loading') {
      return
    }

    setState('loading')

    setTimeout(() => {
      // setIsDrawerOpen(true);
      handleAddToCart();
      CartContext.open();
      setState('stable')
    }, 1000)
  }

  return (
    <>
      <Button
        {...{
          className: '',
          variant: 'default',
          onClick,
          size: 'lg',
        }}
      >
        {state == 'stable' && 'Add to cart'}
        {state == 'loading' && (
          <div
            {...{
              className:
                'h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white',
            }}
          />
        )}
        {state == 'done' && (
          <>
            <CheckIcon />
            Added to cart
          </>
        )}
      </Button>

      <Drawer.Drawer
        {...{
          direction: isMd ? 'right' : 'bottom',
          open: isDrawerOpen,
          onOpenChange: (open) => {
            setIsDrawerOpen(open)
          },
        }}
      >
        <Drawer.DrawerContent
          {...{
            className: isMd
              ? 'fixed inset-y-0 right-0 left-auto z-[101] h-full w-full max-w-[30rem] flex flex-col border-l bg-background outline-none'
              : 'h-fit w-full',
          }}
        >
          <Drawer.DrawerTitle
            {...{
              className: 'sr-only',
            }}
          >
            {ProductContext.product.name} - Add to Cart
          </Drawer.DrawerTitle>
          <div className="flex flex-col w-full h-fit">
            <div className="flex flex-col p-6 gap-6 pb-10">
              <div className="flex w-full gap-4">
                <div
                  {...{
                    className:
                      'flex aspect-square w-16 h-fit bg-border bg-cover bg-center bg-no-repeat',
                    style: {
                      backgroundImage:
                        ProductContext.product.images && ProductContext.product.images.length > 0
                          ? `url("${(ProductContext.product.images[0].image as any).url}")`
                          : '',
                    },
                  }}
                />
                <div className="flex flex-col w-full h-fit">
                  <h1
                    {...{
                      className: 'font-bold uppercase text-sm',
                    }}
                  >
                    {ProductContext.product.name}
                  </h1>

                  {ProductContext.product.prices && ProductContext.product.prices.length > 0 && (
                    <span
                      {...{
                        className: 'text-sm',
                      }}
                    >
                      {formatPrice(
                        ProductContext.product.prices[0].amount * 100,
                        ProductContext.product.prices[0].currency,
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex flex-col w-full gap-2">
                <span
                  {...{
                    className: 'text-xs',
                  }}
                >
                  Quantity
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    {...{
                      className: 'aspect-square w-8 p-0 h-fit',
                      onClick: (e) => ProductContext.decrementQuantity(),
                      disabled: ProductContext.quantity == 0,
                      variant: 'ghost',
                    }}
                  >
                    <MinusCircle />
                  </Button>
                  <span
                    {...{
                      className: 'text-sm w-6 text-center',
                    }}
                  >
                    {ProductContext.quantity ?? 1}
                  </span>
                  <Button
                    {...{
                      className: 'aspect-square w-8 p-0 h-fit',
                      onClick: (e) => ProductContext.incrementQuantity(),
                      variant: 'ghost',
                    }}
                  >
                    <PlusCircle />
                  </Button>
                </div>
              </div>

              {/* Sizes */}
              <div className="flex flex-col w-full gap-2 ">
                <span
                  {...{
                    className: 'text-xs',
                  }}
                >
                  Size
                </span>
                <ProductSizeSelector />
              </div>

              <Button
                {...{
                  className: '',
                  variant: 'default',
                  onClick: handleAddToCart,
                  size: 'lg',
                  disabled: !ProductContext.size,
                }}
              >
                Confirm size & add to cart
              </Button>
            </div>
          </div>
        </Drawer.DrawerContent>
      </Drawer.Drawer>
    </>
  )
}
