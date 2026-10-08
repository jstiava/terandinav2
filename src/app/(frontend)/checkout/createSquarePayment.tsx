"use server"

import {
    SquareClient,
    SquareEnvironment,
} from "square"

const square = new SquareClient({
    token: process.env.SQUARE_SANDBOX_ACCESS_TOKEN!,
    environment: SquareEnvironment.Sandbox,
})

export async function createSquarePayment({
    token,
    amount,
}: {
    token: string
    amount: number
}) {
    try {
        const response = await square.payments.create({
            sourceId: token,
            idempotencyKey: crypto.randomUUID(),
            amountMoney: {
                amount: BigInt(amount),
                currency: "USD",
            },
        })

        return {
            success: true,
            paymentId: response.payment?.id,
        }

    } catch (error) {
        console.error(error)

        return {
            success: false,
            error: "Payment failed",
        }
    }
}