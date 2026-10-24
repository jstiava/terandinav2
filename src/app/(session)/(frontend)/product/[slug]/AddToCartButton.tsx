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
      
    </>
  )
}
