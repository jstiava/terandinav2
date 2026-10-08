'use client'
import { Button } from "@/components/ui/button";
import CheckoutCartInventory from "./CheckoutCartInventory";
import SquarePaymentBox from "./SquarePaymentBox";
import StripeLocationAndTaxField from "./StripeLocationAndTaxField";
import * as Accordion from "@/components/ui/accordion";
import { CircleCheck, LockIcon, PlusIcon } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { CartProvider } from "@/components/Cart/CartProviderComponent";
import PickupDeliveryOptions from "../product/[slug]/PickupDeliveryOptions";
import { useRouter } from "next/navigation";
import { createPaymentIntent, patchPaymentIntentWithTaxes } from "./StripePaymentIntentService";
import { prev } from "node_modules/cheerio/dist/esm/api/traversing";
import { formatPrice } from "@/collections/Products/formatPrice";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";


const CHECKOUT_PROCESS_PROGRESSION = ['confirm_cart', 'contact_info', 'pickup_delivery_details', 'payment_information'];

export default function CheckoutProcessAccordion() {

    const idempotencyKey = useRef(crypto.randomUUID());
    const { ...CartContext } = useContext(CartProvider);
    const router = useRouter();

    const [value, setValue] = useState(0);
    const [confirmLocationProcessState, setConfirmLocationProcessState] = useState<'stable' | 'loading' | 'done'>('stable');

    useEffect(() => {

        createPaymentIntent({
            items: CartContext.cart!,
            idempotencyKey: idempotencyKey.current
        })
            .then(data => CartContext.setCheckoutDetails(data))
            .catch(err => {
                console.log(err);
            })
    }, []);

    const handleConfirmPickupMethod = async (e: any) => {

        setConfirmLocationProcessState('loading')

        if (!CartContext.cart) {
            alert("The cart is empty!")
            setConfirmLocationProcessState('stable')
            return;
        }

        if (CartContext.pickup == 'delivery' && !CartContext.location) {
            alert("No address on the delivery")
            setConfirmLocationProcessState('stable')
            return;
        }

        if (!CartContext.checkoutDetails?.paymentIntentId) {
            alert("No payment intent id.")
            setConfirmLocationProcessState('stable')
            return;
        }

        patchPaymentIntentWithTaxes({
            items: CartContext.cart,
            customer_details: CartContext.pickup == 'pickup' ? {
                "name": 'Native Sun LLC', "address": { "line1": '1978 Southlake Mall', "line2": '#144', "city": "Merrillville", "country": "US", "postal_code": "46410", "state": "IN" }, "complete": true
            } : CartContext.location!,
            paymentIntentId: CartContext.checkoutDetails?.paymentIntentId
        })
            .then(data => {
                CartContext.setCheckoutDetails((prev) => {

                    if (!prev) {
                        return null;
                    }

                    return {
                        ...prev,
                        tax: data.tax,
                        totalDue: data.total
                    }
                })

                setTimeout(() => {
                    setValue(prev => prev + 1);
                    setConfirmLocationProcessState('stable')
                }, 500)
            })
            .catch(err => {
                alert("Could not get tax rate for purchase.")
                console.log(err);
            })



    }


    return (
        <div className="flex flex-col gap-4 w-full py-4">

            <h2 {...{
                className: "text-xl font-canela"
            }}>Excellent choices. Few more steps to check out.</h2>

            <Accordion.Accordion {...{
                type: 'single',
                className: 'w-full border-t border-b border-gray-300',
                value: CHECKOUT_PROCESS_PROGRESSION[value],
            }}>

                {/* Confirm cart */}
                <Accordion.AccordionItem
                    key={'confirm_cart'} {...{
                        value: 'confirm_cart',
                        className: 'contents'
                    }}  >
                    <div className="sticky top-14 flex w-full! bg-white border-b ">

                        <Accordion.AccordionTrigger {...{
                            className: ' flex w-full! p-4',
                            onClick: e => {
                                setValue(0)
                            }
                        }}>
                            <div className="flex justify-between items-center w-full">
                                <span className='text-sm'>1. Confirm your cart</span>
                                {/* <MinusIcon className='size-4' /> */}
                                {value > 0 ? <CircleCheck className='size-4 fill-[#009487] text-white' /> : <PlusIcon className='size-4' />}
                            </div>
                        </Accordion.AccordionTrigger>
                    </div>
                    <Accordion.AccordionContent>
                        <div className="flex flex-col w-full p-2 gap-4">
                            <h3 {...{
                                className: "text-xl font-canela"
                            }}>Review Cart</h3>
                            <CheckoutCartInventory />
                            <div className="flex flex-col w-full gap-2">
                                <Button {...{
                                    onClick: e => router.back(),
                                    variant: "outline"
                                }}>Continue Shopping</Button>
                                <Button {...{
                                    onClick: e => {
                                        setValue(prev => prev + 1);
                                    }
                                }}>Confirm Cart</Button>
                            </div>
                        </div>
                    </Accordion.AccordionContent>
                </Accordion.AccordionItem>

                {/* Contact Info */}
                <Accordion.AccordionItem
                    key={'contact_info'} {...{
                        value: 'contact_info',
                        disabled: value < 1,
                        className: 'contents'
                    }}  >
                    <div className="sticky top-14 flex w-full! bg-white border-b z-[30] ">

                        <Accordion.AccordionTrigger  {...{
                            className: 'w-full! p-4',
                            onClick: e => {
                                setValue(1)
                            }
                        }}>
                            <div className="flex justify-between items-center w-full">
                                {/* @ts-ignore */}
                                <span className='text-sm'>2. Contact Info</span>
                                {/* <MinusIcon className='size-4' /> */}
                                {value > 1 ? <CircleCheck className='size-4 fill-[#009487] text-white' /> : <PlusIcon className='size-4' />}
                            </div>
                        </Accordion.AccordionTrigger>
                    </div>
                    <Accordion.AccordionContent >
                        <div className="flex flex-col w-full p-2 py-6 gap-4 ">
                            <Field {...{
                                className: "flex flex-col"
                            }}>
                                <FieldLabel>Email address</FieldLabel>
                                <FieldDescription>Required to send you order confirmation and package tracking information. Not used for marketing or newsletter.</FieldDescription>
                                <FieldContent>
                                    <Input {...{
                                        type: "email",
                                        onChange: (e) => {
                                            CartContext.setCheckoutDetails(prev => {

                                                if (!prev) {
                                                    return null;
                                                }

                                                return {
                                                    ...prev,
                                                    emailAddress: e.target.value
                                                }
                                            })
                                        }
                                    }} />
                                </FieldContent>
                            </Field>
                            {/* <span className="debug">{JSON.stringify(CartContext.location)}</span> */}
                            <Button {...{
                                onClick: e => {
                                    setValue(prev => prev + 1)
                                },
                                // disabled: !CartContext || (CartContext.pickup == 'delivery' && (!CartContext.location || !CartContext.location.complete))
                            }}>Continue </Button>
                        </div>
                    </Accordion.AccordionContent>

                </Accordion.AccordionItem>


                {/* Pickup or delivery information */}
                <Accordion.AccordionItem
                    key={'pickup_delivery_details'} {...{
                        value: 'pickup_delivery_details',
                        disabled: value < 2,
                        className: 'contents'
                    }}  >

                    <div className="sticky top-14 flex w-full! bg-white border-b z-[30] ">

                        <Accordion.AccordionTrigger  {...{
                            className: 'w-full! p-4',
                            onClick: e => {
                                setValue(1)
                            }
                        }}>
                            <div className="flex justify-between items-center w-full">
                                {/* @ts-ignore */}
                                <span className='text-sm'>3. {value > 2 ? CartContext.pickup == 'pickup' ? 'Pickup at Merrillville, IN location.' : `Delivery to ${CartContext.location!.line1 ?? "Line 1 Address"}` : 'Pickup or Delivery information'}</span>
                                {/* <MinusIcon className='size-4' /> */}
                                {value > 2 ? <CircleCheck className='size-4 fill-[#009487] text-white' /> : <PlusIcon className='size-4' />}
                            </div>
                        </Accordion.AccordionTrigger>
                    </div>
                    <Accordion.AccordionContent {...{
                        hidden: value != 2,
                        forceMount: true
                    }}>
                        <div className="flex flex-col w-full p-2 gap-4 ">
                            <PickupDeliveryOptions />
                            {!CartContext.checkoutDetails && (
                                <span>No payment intent.</span>
                            )}
                            <div className={CartContext.pickup == 'delivery' ? 'block pb-10' : 'hidden'}>
                                {CartContext.checkoutDetails && (
                                    <StripeLocationAndTaxField {...{
                                        paymentIntent: CartContext.checkoutDetails
                                    }} />
                                )}
                            </div>
                            {/* <span className="debug">{JSON.stringify(CartContext.location)}</span> */}
                            <Button {...{
                                onClick: handleConfirmPickupMethod,
                                disabled: !CartContext || (CartContext.pickup == 'delivery' && (!CartContext.location || !CartContext.location.complete))
                            }}>
                                {confirmLocationProcessState == 'stable' && (<>Confirm {CartContext.pickup == 'pickup' ? 'pickup at Merrillville' : 'delivery address'}</>)}
                                {confirmLocationProcessState == 'loading' && (
                                    <div {...{
                                        className: "h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                    }} />
                                )}
                            </Button>
                        </div>
                    </Accordion.AccordionContent>
                </Accordion.AccordionItem>

                {/* Payment information */}
                <Accordion.AccordionItem
                    key={'payment_information'} {...{
                        value: 'payment_information',
                        disabled: true,
                        className: 'contents'
                    }}  >
                    <div className="sticky top-14 flex w-full! bg-white border-b z-[30] ">

                        <Accordion.AccordionTrigger className='flex w-full! p-4'>
                            <div className="flex justify-between items-center w-full">
                                <span className='text-sm'>4. Payment information</span>
                                {/* <MinusIcon className='size-4' /> */}
                                <PlusIcon className='size-4' />
                            </div>
                        </Accordion.AccordionTrigger>
                    </div>
                    <Accordion.AccordionContent>
                        <div className="flex flex-col w-full p-2 gap-4 pt-8">
                            <SquarePaymentBox {...{
                                amount: CartContext.checkoutDetails?.totalDue ?? 0,
                                onConfirm: ({ token }) => {
                                    console.log(token);
                                    setValue(prev => prev + 1);
                                    return;
                                }
                            }} />

                        </div>
                    </Accordion.AccordionContent>
                </Accordion.AccordionItem>


            </Accordion.Accordion>
        </div >
    )
}