'use client'

import { useContext } from "react"
import CheckoutCartInventory from "./CheckoutCartInventory"
import { CartProvider } from "@/components/Cart/CartProviderComponent"
import CheckoutOrderReceiptPreview from "./CheckoutOrderReceiptPreview";


export default function CheckoutSummaryAside() {

  const { ...CartContext } = useContext(CartProvider);


  return (
    <aside className="min-w-0">
      <div className="sticky top-6 flex flex-col gap-6">

        {/* Cart */}
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-canela text-xl">
              Order Summary
            </h2>

            <span className="text-sm text-muted-foreground">
              { CartContext.cart?.length } item(s)
            </span>
          </div>

          <div className="rounded-xl border bg-background">
            <CheckoutCartInventory />
          </div>
        </section>

        {/* Shipping reminder */}
        <section className="rounded-xl bg-muted/50 p-4">
          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="size-4"
              >
                <path d="M3 7h11v10H3z" />
                <path d="M14 10h4l3 3v4h-7z" />
                <circle cx="7" cy="19" r="1.5" />
                <circle cx="18" cy="19" r="1.5" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium">
                Free standard shipping
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your order ships free and typically arrives within
                1–2 weeks.
              </p>
            </div>
          </div>
        </section>

        {/* Receipt */}
        <section className="flex flex-col gap-4">
          <div className="h-px w-full bg-border" />

          <div className="flex items-center justify-between">
            <h3 className="font-canela text-xl">
              Order total
            </h3>
          </div>

          <CheckoutOrderReceiptPreview />
        </section>

      </div>
    </aside>
  )
}
