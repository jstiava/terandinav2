'use client'

import { CartProvider } from '@/components/Cart/CartProviderComponent'
import { Button } from '@/components/ui/button'
import { RefObject, useContext } from 'react'
import { processSquarePayment } from './processSquarePayment'
import { useRouter } from 'next/navigation'

export default function PayNowButton({ cardRef }: { cardRef: RefObject<any> }) {

  const router = useRouter();
  const { ...CartContext } = useContext(CartProvider)

  const handleConfirm = async (e: any) => {
    const card = cardRef.current

    if (!card) {
      throw new Error('Square card is not ready')
    }

    if (!CartContext.checkoutDetails?.totalDue) {
      throw new Error('Total amount due is undefined or zero.')
    }

    const squareBillingContact = {
      givenName: CartContext.checkoutDetails.billingAddress?.firstName,
      familyName: CartContext.checkoutDetails.billingAddress?.lastName,
      // phone: CartContext.phone_number,
      addressLines: [
        CartContext.checkoutDetails.billingAddress?.address.line1,
        CartContext.checkoutDetails.billingAddress?.address.line2,
      ].filter(Boolean),
      city: CartContext.checkoutDetails.billingAddress?.address.city,
      state: CartContext.checkoutDetails.billingAddress?.address.state,
      postalCode: CartContext.checkoutDetails.billingAddress?.address.postal_code,
      countryCode: CartContext.checkoutDetails.billingAddress?.address.country,
      email: CartContext.checkoutDetails.billingAddress?.emailAddress,
    }

    const paymentReadyPayload = {
      amount: (CartContext.checkoutDetails?.totalDue / 100).toFixed(2),
      currencyCode: 'USD',
      billingContact: squareBillingContact,
      intent: 'CHARGE',
      customerInitiated: true,
      sellerKeyedIn: false,
    }

    console.log(paymentReadyPayload)

    const tokenResult = await card.tokenize(paymentReadyPayload)

    if (tokenResult.status !== 'OK') {
      console.error(tokenResult.errors)
      return
    }

    const payment = await processSquarePayment({
      amountInCents: Number(paymentReadyPayload.amount) * 100,
      idempotencyKey: crypto.randomUUID(),
      sourceId: tokenResult.token,
      billingContact: squareBillingContact
    })

    console.log({
      message: "The payment",
      payment
    })

    router.push('/order-confirmation')
  }

  return (
    <Button
      {...{
        size: 'lg',
        className: 'w-full mt-4  bg-black',
        onClick: handleConfirm,
        disabled: !cardRef || !cardRef.current,
      }}
    >
      Pay Now
    </Button>
  )
}
