'use client'

import { Button } from '@/components/ui/button'
import { useContext, useState } from 'react'
import { ProductProvider } from './ProductProviderComponent'
import { CartProvider } from '@/components/Cart/CartProviderComponent'
import { AlertCircleIcon, BellRingIcon, CheckIcon } from 'lucide-react'
import { useMediaQuery } from '@/utilities/useMediaQuery'
import * as Dialog from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'

export default function AddToCartButton() {
  const { ...ProductContext } = useContext(ProductProvider)
  const CartContext = useContext(CartProvider)

  const [state, setState] = useState<'stable' | 'loading' | 'done'>('stable');
  const [message, setMessage] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  const [notifyEmail, setNotifyEmail] = useState<string | null>(null);
  const [isNotifyingYou, setIsNotifyingYou] = useState(false);

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

  if (ProductContext.isSoldOut) {
    return (
      <div className="flex flex-col gap-2 w-full h-fit">
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
        <Dialog.Dialog>
          <Dialog.DialogTrigger asChild>
            <Button
              {...{
                variant: 'outline',
                size: 'lg',
              }}
            >
              <BellRingIcon /> Notify me when avaliable
            </Button>
          </Dialog.DialogTrigger>
          <Dialog.DialogContent {...{
            className: 'flex flex-col gap-4 items-end'
          }}>
            <Dialog.DialogTitle>Fill in your email address and we&apos;ll notify you when the product is avaliable.</Dialog.DialogTitle>
            <Field>
              <FieldLabel>Email address</FieldLabel>
              <FieldContent>
                <Input {...{
                  className: "h-12 text-lg",
                  value: notifyEmail ?? "",
                  onChange: e => {
                    setNotifyEmail(e.target.value);
                  }
                }} />
              </FieldContent>
            </Field>
            <Button {...{
              disabled: !notifyEmail
            }}>Email me</Button>
          </Dialog.DialogContent>
        </Dialog.Dialog>
      </div>
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
