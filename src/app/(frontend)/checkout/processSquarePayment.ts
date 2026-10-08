'use server'

import { SquareClient, SquareEnvironment } from 'square'

const square = new SquareClient({
  token: process.env.SQUARE_SANDBOX_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox,
})

export async function processSquarePayment(props: {
  idempotencyKey: string,
  sourceId: string,
  amountInCents: number
}) {
  try {

    const result = await square.payments.create({
      sourceId: props.sourceId,
      idempotencyKey: props.idempotencyKey,
      amountMoney: {
        amount: BigInt(props.amountInCents),
        currency: 'USD',
      },
      locationId: process.env.SQUARE_SANDBOX_LOCATION_ID,
    })

    return {
      success: true,
      payment: result,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      payment: null,
    }
  }
}
