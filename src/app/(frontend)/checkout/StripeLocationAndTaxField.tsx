'use client'

import { CartProvider } from '@/components/Cart/CartProviderComponent';
import { Field } from '@/components/ui/field';
import { cn } from '@/utilities/cn';
import { ErrorIcon, FieldLabel } from '@payloadcms/ui';
import { AddressElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { useContext, useEffect, useState } from 'react';

const STRIPE_PUBLISHABLE_KEY = "pk_test_51RbubdPf2y8hwgTueP49rSJA5wOI4dDCmG3sytOH7Tc8TcmLvnOkRcu3Kr3VxsOYw7VNvAHl8thXiiJgJR9ZPhdU00o6yQdbXK"
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export default function StripeLocationAndTaxField({ paymentIntent }: {
    paymentIntent: any
}) {

    const { ...CartContext } = useContext(CartProvider);

    const options = {
        clientSecret: paymentIntent.clientSecret,
        appearance: {
            theme: "stripe",
            variables: {
                colorPrimary: '#009487',
                colorBackground: '#f4f4f4',
                colorText: '#30313d',
                colorDanger: '#df1b41',
                fontFamily: 'Archivo, Ideal Sans, system-ui, sans-serif',
                spacingUnit: '0.25rem',
                borderRadius: '0.25rem',
            }
        },
        fonts: [
            {
                family: 'Archivo',
                src: 'url("https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Inconsolata:wght@200..900&family=Overpass:ital,wght@0,100..900;1,100..900&display=swap")',
                weight: '500',
            }
        ]
    } as StripeElementsOptions;

    if (!paymentIntent || !options || !paymentIntent.clientSecret || !stripePromise) {
        return (
            <div className="flex flex-col h-20 w-full items-center justify-center gap-3 rounded-sm border border-destructive/20 bg-destructive/5 text-destructive">
                <span className="text-xs font-medium">
                    Something went wrong. Please try again.
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <span {...{
                className: 'text-xs'
            }}>Location required to determine sales tax.</span>
            <div className={cn(
                "flex flex-col w-full rounded-md border border-border p-4 gap-4",

            )}>
                <Elements {...{
                    stripe: stripePromise,
                    options
                }}>
                    <AddressElement
                        id="address-element"
                        options={{
                            allowedCountries: ['US'],
                            mode: 'shipping',
                            display: {
                                name: 'split'
                            },
                            fields: {
                                phone: 'always',

                            },
                        }}
                        onChange={(e) => {
                            CartContext.setLocation({
                                ...e.value,
                                complete: e.complete,
                            } as any);
                        }}
                    />
                </Elements>
            </div>
        </div>
    )
}
