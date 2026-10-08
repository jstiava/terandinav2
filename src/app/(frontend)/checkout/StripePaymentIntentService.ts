'use server'

import Stripe from 'stripe'
import { ProductType, StripeLocationDetails } from '@/components/Cart/CartProviderComponent'
import { Product } from '@/payload-types'
import { calculateOrderAmount } from './calculateOrderAmount'

const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY))

export async function createPaymentIntent(props: { items: ProductType[]; idempotencyKey: string }) {
  console.log({
    message: 'INIT - createPaymentIntent',
    cart: props.items,
  })

  // TODO - SHIPPING FEE
  const SHIPPING_FEE = 0

  const subtotal = calculateOrderAmount(props.items)
  const totalDue = subtotal
  const metadata: Record<string, string> = {}

  if (totalDue <= 0) {
    throw new Error('Transaction set for $0')
  }

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: totalDue,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    },
    {
      idempotencyKey: props.idempotencyKey,
    },
  )

  if (!paymentIntent.client_secret) {
    throw new Error('No client secret provided.')
  }

  console.log(paymentIntent)

  return {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    subtotal,
    totalDue,
  }
}

export async function patchPaymentIntentWithTaxes(props: {
  items: ProductType[]
  customer_details: StripeLocationDetails
  paymentIntentId: string
}) {
  const subtotal = calculateOrderAmount(props.items)
  const totalDue = subtotal
  const metadata: Record<string, string> = {}

  console.log(props)
  const oldIntent = await stripe.paymentIntents.retrieve(props.paymentIntentId)

  if (!oldIntent) {
    throw Error('No old intent')
  }

  const line_items = props.items.map((item) => ({
    amount: calculateOrderAmount(item),
    reference: item.id,
    tax_behavior: 'exclusive' as const,
  }))

  console.log(line_items)
  const taxCalculation = await stripe.tax.calculations.create({
    currency: 'usd',
    line_items,
    customer_details: {
      // @ts-ignore
      address: props.customer_details.address,
      address_source: 'shipping',
    },
  })

  console.log(taxCalculation)

  const taxAmount = taxCalculation.tax_amount_exclusive
  const total = totalDue + taxAmount

  const updatedIntent = await stripe.paymentIntents.update(props.paymentIntentId, {
    amount: total,
  })

  return {
    tax: taxAmount,
    subtotal: totalDue,
    total,
  }
}
