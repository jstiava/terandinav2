'use server'

import Stripe from "stripe"

interface StripePriceQuantityStub {
    price: any,
    quantity: number
}

const reduceStripeCheckoutItem = (item: { price: any; quantity: number; size: string }) => {
  return {
    product_id: item.price.product,
    price_id: item.price.id,
    unit_amount: item.price.unit_amount,
    quantity: item.quantity,
    size: item.size,
  }
}

const calculateOrderAmount = (target: StripePriceQuantityStub | StripePriceQuantityStub[]) => {

    if (Array.isArray(target)) {
        let amount = 0;
        for (let i = 0; i < target.length; i++) {
            amount += calculateOrderAmount(target[i]);
        }
        return amount;
    }

    return (target.price.unit_amount || 0) * target.quantity;
};


export async function createPaymentIntent(items: any[]) {

   const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY))

   try {
     const SHIPPING_FEE = 895
     const subtotal = calculateOrderAmount(items)
     const totalDue = subtotal >= 20000 ? subtotal : subtotal + SHIPPING_FEE

     const metadata: Record<string, string> = {}
     items.forEach((item: any, index: number) => {
       metadata[`item_${index}`] = JSON.stringify(reduceStripeCheckoutItem(item))
     })
     const paymentIntent = await stripe.paymentIntents.create({
       amount: totalDue,
       currency: 'usd',
       payment_method_types: ['card', 'us_bank_account'],
       metadata,
     })

     return {
       paymentIntentId: paymentIntent.id,
       clientSecret: paymentIntent.client_secret,
       subtotal,
       totalDue,
     }
   }
   catch (err) {
     throw Error("Could not complete stripe payment intent creation.")
   }

}
