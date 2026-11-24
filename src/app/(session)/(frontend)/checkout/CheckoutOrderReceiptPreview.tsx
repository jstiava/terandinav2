'use client'

import { formatPrice } from '@/collections/Products/formatPrice'
import { CartProvider } from '@/components/Cart/CartProviderComponent'
import { useContext } from 'react'

export default function CheckoutOrderReceiptPreview() {
  const { ...CartContext } = useContext(CartProvider)

  return (
    <div className="flex flex-col gap-4">
      {/* Receipt rows */}
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>

          <span className="tabular-nums">{ formatPrice(CartContext.checkoutDetails?.subtotal ?? 0, 'usd')}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Shipping</span>

          <span className="font-medium">Free</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Estimated tax</span>

          <span className="tabular-nums">{ formatPrice(CartContext.checkoutDetails?.tax ?? 0, 'usd')}</span>
        </div>
      </div>

      {/* Total */}
      <div className="h-px w-full bg-border" />

      <div className="flex items-baseline justify-between">
        <span className="text-base font-medium">Total</span>

        <span className="font-canela text-2xl tabular-nums">{ formatPrice(CartContext.checkoutDetails?.totalDue ?? 0, 'usd')}</span>
      </div>

      {/* Payment note */}
      <p className="text-xs leading-5 text-muted-foreground">
        Taxes are calculated based on your shipping address. You won&apos;t be charged until your
        order is submitted.
      </p>
    </div>
  )
}
