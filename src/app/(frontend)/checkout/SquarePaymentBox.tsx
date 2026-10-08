"use client"

import { formatPrice } from "@/collections/Products/formatPrice";
import { CartProvider } from "@/components/Cart/CartProviderComponent"
import { Button } from "@/components/ui/button";
import { LockIcon } from "lucide-react";
import Script from "next/script"
import { useContext, useEffect, useRef, useState } from "react"

export default function SquarePaymentBox({ amount, onConfirm }: { amount: number, onConfirm: ({ token }: { token: string }) => any }) {

    const { ...CartContext } = useContext(CartProvider);
    const cardRef = useRef<any>(null);
    const [squareLoaded, setSquareLoaded] = useState(false)
    const [initializing, setInitializing] = useState(false)
    const [ready, setReady] = useState(false)
    const [error, setError] = useState<string | null>(null);


    const handleConfirm = async (e: any) => {
        const card = cardRef.current;

        if (!card) {
            throw new Error('Square card is not ready');
        }

        const tokenResult = await card.tokenize({
            billing: {
                givenName: CartContext.location?.firstName,
                familyName: CartContext.location?.lastName,
                // email: CartContext.email_address,
                // phone: CartContext.phone_number,
                addressLines: [CartContext.location?.address.line1, CartContext.location?.address.line2],
                city: CartContext.location?.address.city,
                state: CartContext.location?.address.state,
                postalCode: CartContext.location?.address.postal_code,
                countryCode: CartContext.location?.address.country,
            },
        });

        if (tokenResult.status !== 'OK') {
            console.error(tokenResult.errors);
            return;
        }

        const token = tokenResult.token;

        CartContext.setTokenizedCartWithPaymentReady(token);
        onConfirm({
            token
        })

        // Payment succeeded
    };

    useEffect(() => {
        if (!squareLoaded) return

        let cancelled = false

        async function initializeSquare() {
            try {
                setInitializing(true)

                if (!window.Square) {
                    throw new Error("Square.js has not loaded")
                }

                const payments = window.Square.payments(
                    'sandbox-sq0idb-NZA_DL8678BtDG2ki0QzsA',
                    'LJ04DKJQH79JM'
                )

                const card = await payments.card()

                if (cancelled) {
                    card.destroy()
                    return
                }

                await card.attach("#square-card-container")

                if (!cancelled) {
                    setReady(true)
                }

            } catch (err) {

                console.error({
                    message: "Unable to load payment form",
                    err
                })
                setError("Unable to load payment form.")

            } finally {
                if (!cancelled) {
                    setInitializing(false)
                }
            }
        }

        initializeSquare()

        return () => {
            cancelled = true
        }
    }, [squareLoaded])

    return (
        <>
            <Script
                src="https://sandbox.web.squarecdn.com/v1/square.js"
                strategy="afterInteractive"
                onLoad={() => setSquareLoaded(true)}
                onError={() => setError("Unable to load Square.")}
            />

            <div className="relative">
                {/* Loading block */}
                {!ready && !error && (
                    <div className="rounded-lg border p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-10 rounded bg-gray-200" />
                            <div className="h-10 rounded bg-gray-200" />
                            <div className="h-10 rounded bg-gray-200" />
                        </div>

                        <p className="mt-4 text-sm text-gray-500">
                            {initializing
                                ? "Initializing payment form..."
                                : "Loading payment form..."}
                        </p>
                    </div>
                )}

                {/* Square mounts here */}
                <div
                    ref={cardRef}
                    id="square-card-container"
                    className={!ready ? "hidden" : ""}
                />

                {error && (
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                )}

            </div>

            <div className="flex gap-1 items-center text-xs">
                <LockIcon {...{
                    className: 'size-3'
                }} /><span>Secured with Square</span>
            </div>
            <Button {...{
                size: "lg",
                className: "w-full mt-4  bg-black",
                onClick: handleConfirm
            }}>
                Confirm card details
            </Button>
        </>
    )
}