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

  const [state, setState] = useState<'stable' | 'loading' | 'done'>('stable');
  const [message, setMessage] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const isMd = useMediaQuery('(min-width: 768px)')

  const handleAddToCart = (e?: any) => {

    if (!ProductContext.size) {
      setState('stable')
      setMessage("Size is required.")
      return;
    }

    CartContext.add({
      item: {
        id: ProductContext.product.id,
        size: ProductContext.size.id,
        quantity: ProductContext.quantity,
        product: ProductContext.product,
      },
    })

    setTimeout(() => {
      // setIsDrawerOpen(true);
      CartContext.open();
      setState('stable')
    }, 1000)

  }

  const onClick = () => {
    if (state == 'done') {
      setState('stable')
      return
    } else if (state == 'loading') {
      return
    }

    setState('loading')
    handleAddToCart();
  }

  if (!ProductContext.size) {
    return (
      <Button
        {...{
          className: 'font-bold uppercase ',
          variant: 'outline',
          disabled: true,
          onClick,
          size: 'lg',
        }}
      >
        Sold out
      </Button>
    )
  }

  return (
    <div className="flex gap-1 w-full flex-col ">
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
      {message && <span className='text-xs text-red-400'>{message}</span>}
    </div>
  )
}
