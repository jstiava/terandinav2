'use server'

import { generateShippoShipment } from '@/app/(session)/(checkout)/checkout/ShippoService'
import { SquareClient, SquareEnvironment } from 'square'

const square = new SquareClient({
  token: process.env.SQUARE_SANDBOX_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox,
})

export async function processSquarePayment(props: {
  idempotencyKey: string,
  sourceId: string,
  amountInCents: number,
  billingContact: {
    givenName: string | null | undefined;
    familyName: string | null | undefined;
    addressLines: (string | null | undefined)[];
    city: string | null | undefined;
    state: string | null | undefined;
    postalCode: string | null | undefined;
    countryCode: string | null | undefined;
    email: string | null | undefined;
  }
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
    });

    // const shipment = await generateShippoShipment({
    //   addressFrom: {

    //   },
    //   addressTo: {

    //   }
    // })



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
