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

    const billingContact = {
      givenName: CartContext.location?.firstName,
      familyName: CartContext.location?.lastName,
      // phone: CartContext.phone_number,
      addressLines: [
        CartContext.location?.address.line1,
        CartContext.location?.address.line2,
      ].filter(Boolean),
      city: CartContext.location?.address.city,
      state: CartContext.location?.address.state,
      postalCode: CartContext.location?.address.postal_code,
      countryCode: CartContext.location?.address.country,
      email: CartContext.location?.emailAddress,
    }

    const paymentReadyPayload = {
      amount: (CartContext.checkoutDetails?.totalDue / 100).toFixed(2),
      currencyCode: 'USD',
      billingContact,
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

    const token = tokenResult.token

    CartContext.setTokenizedCartWithPaymentReady(token)

    const payment = await processSquarePayment({
      amountInCents: Number(paymentReadyPayload.amount) * 100,
      idempotencyKey: crypto.randomUUID(),
      sourceId: tokenResult.token,
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

/**
 * [Error] [{field: "verificationDetails.billingContact", message: "verificationDetails.billingContact is required and must be a(n) object.", type: "VALIDATION_ERROR"}, {field: "verificationDetails.intent", message: "verificationDetails.intent is required and must be a(n) string.", type: "VALIDATION_ERROR"}, {field: "verificationDetails.customerInitiated", message: "verificationDetails.customerInitiated is required and must be a(n) boolean.", type: "VALIDATION_ERROR"}, {field: "verificationDetails.sellerKeyedIn", message: "verificationDetails.sellerKeyedIn is required and must be a(n) boolean.", type: "VALIDATION_ERROR"}] (4)
	error (intercept-console-error.js:57)
	(anonymous function) (PayNowButton.tsx:54)
 */
