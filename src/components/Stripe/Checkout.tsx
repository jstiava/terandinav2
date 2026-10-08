"use client"
import { AddressElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeAddressElementChangeEvent, StripeElementsOptions } from '@stripe/stripe-js';
import StripeCheckoutForm from "./CheckoutForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { createPaymentIntent } from './CheckoutServer';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';


const STRIPE_PUBLISHABLE_KEY = "pk_test_51SZZ2VBe2tETfAdnDb5tTsnnWEQZilmBNh70zSOnmNXbTj7vykPvrNhs6363niAgBzZNgjuICwoEfPzH9Aln22j600FnfqPwDv"
// const STRIPE_PUBLISHABLE_KEY = "pk_test_51RbubdPf2y8hwgTueP49rSJA5wOI4dDCmG3sytOH7Tc8TcmLvnOkRcu3Kr3VxsOYw7VNvAHl8thXiiJgJR9ZPhdU00o6yQdbXK"
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const isAddressFilled = (address: {
    name: string;
    firstName?: string;
    lastName?: string;
    address: {
        line1: string;
        line2: string | null;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
    phone?: string;
}, emailAddress: string | null) => {

    if (!address) {
        return false;
    }

    if (!emailAddress && !address.name) {
        return false;
    }

    if (!address.address.line1) {
        return false;
    }

    if (!address.address.city) {
        return false;
    }

    if (!address.address.state) {
        return false;
    }

    if (!address.address.postal_code) {
        return false;
    }

    if (!address.address.country) {
        return false;
    }

    return true;
}

export default function Checkout() {

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [totalDue, setTotalDue] = useState(0);
    const [emailAddress, setEmailAddress] = useState<string | null>(null);
    const [address, setAddress] = useState<any | null>(null);

    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

    const [taxAdded, setTaxAdded] = useState<boolean | null>(true);
    // const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = false;

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        console.log("Create payment intent")

        createPaymentIntent([])
          .then((data) => {
              setPaymentIntentId(data.paymentIntentId)
              setClientSecret(data.clientSecret)
              setSubtotal(data.subtotal)
              setTotalDue(data.totalDue)
          })
          .catch(err => {
              console.log(err);
          });


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const findTaxes = () => {
    //     fetch("/api/create-payment-intent", {
    //         method: "PATCH",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //             items: props.Cart.checkout(),
    //             customer_details: address,
    //             paymentIntentId
    //         }),
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             setTaxAdded(data.tax);
    //             setTotalDue(data.totalDue);
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // }

    const options = {
        clientSecret,
        appearance: {
            theme: "stripe",
            variables: {
                colorPrimary: '#093162',
                colorBackground: '#ffffff',
                colorText: '#30313d',
                colorDanger: '#df1b41',
                fontFamily: 'Helvetica, system-ui, sans-serif',
                spacingUnit: '0.25rem',
                borderRadius: '0.25rem',
            }
        },
    } as StripeElementsOptions;

    if (!options || !clientSecret || !stripePromise) {
        return (
         <div className='flex justify-center w-full py-[2rem]'>
           <div className="flex flex-col w-[95vw] max-w-[50rem] gap-4">
             <Alert variant={'default'} className='w-full'>
               <AlertTitle>TEST MODE - Wait a few seconds...</AlertTitle>
               <AlertDescription>This is a simulation of a secure payment environment with Stripe.</AlertDescription>
             </Alert>
            <Skeleton className='w-full h-[6rem]  bg-gray-200' />
            <Skeleton className='w-full h-[10rem] bg-gray-200' />
            <Skeleton className='w-full h-[8rem] bg-gray-200' />
           </div>
         </div>
        );
    }

    return (
        <Elements options={options} stripe={stripePromise}>
            <div className="flex flex-col items-center gap-4" style={{
                width: "100%",
                padding: "3rem 1rem"
            }}>
                <div className={isSm ? "column relaxed" : "flex relaxed top between"} style={{
                    maxWidth: "30rem",
                    width: "100%",
                    padding: "1rem"
                }}>

                    <div className="column relaxed w-full" >
                           <div className="flex flex-col gap-0 font-helvetica">
                             <Label className="py-2 font-helvetica" htmlFor='emailAddress'>Email Address</Label>
                             <Input
                             id="emailAddress"
                             placeholder='youremail@domain.com'
                             />
                           </div>
                        <div className="column">
                            <div className="flex fit compact">
                                <p>Checkout</p>
                            </div>

                            {clientSecret && (
                                <>
                                    {confirmed ? <p>Stripe Complete Page</p> : (
                                        <div className="column">
                                          <StripeCheckoutForm
                                              subtotal={formatPrice(totalDue, 'usd')}
                                              emailAddress={emailAddress}
                                              address={address}
                                          />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Elements>
    )
}

export const formatPrice = (price: number | null, currency: string): string => {

    try {
        if (!price || !currency) {
            return ""
        }

        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
        }).format(price / 100);

    }
    catch (err) {
        console.error(err);
        return "";
    }
}
