'use client'
import { Button } from '@/components/ui/button'
import CheckoutCartInventory from './CheckoutCartInventory'
import SquarePaymentBox from './SquarePaymentBox'
import StripeLocationAndTaxField from './StripeLocationAndTaxField'
import * as Accordion from '@/components/ui/accordion'
import { CircleCheck, MinusIcon, PlusIcon } from 'lucide-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { CartProvider } from '@/components/Cart/CartProviderComponent'
import PickupDeliveryOptions from '../../(frontend)/product/[slug]/PickupDeliveryOptions'
import { useRouter } from 'next/navigation'
import { createPaymentIntent, patchPaymentIntentWithTaxes } from './StripePaymentIntentService'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

const NATIVE_SUN_MERRILLVILLE_ADDRESS = {
  line1: '1978 Southlake Mall',
  line2: '#144',
  city: 'Merrillville',
  country: 'US',
  postal_code: '46410',
  state: 'IN',
}

const CHECKOUT_PROCESS_PROGRESSION = [
  'confirm_cart',
  'contact_info',
  'pickup_delivery_details',
  'payment_information',
]

export default function CheckoutProcessAccordion() {
  const idempotencyKey = useRef(crypto.randomUUID())
  const { ...CartContext } = useContext(CartProvider)
  const router = useRouter()

  const [value, setValue] = useState(0)
  const [confirmLocationProcessState, setConfirmLocationProcessState] = useState<
    'stable' | 'loading' | 'done'
  >('stable')

  const handleConfirmPickupMethod = async (e: any) => {
    setConfirmLocationProcessState('loading')

    if (!CartContext.cart) {
      alert('The cart is empty!')
      setConfirmLocationProcessState('stable')
      return
    }

    if (CartContext.checkoutDetails?.pickup == 'delivery' && !CartContext.checkoutDetails) {
      alert('No address on the delivery')
      setConfirmLocationProcessState('stable')
      return
    }

    if (!CartContext.checkoutDetails?.paymentIntentId) {
      alert('No payment intent id.')
      setConfirmLocationProcessState('stable')
      return
    }

    patchPaymentIntentWithTaxes({
      items: CartContext.cart,
      customer_details:
        CartContext.checkoutDetails.pickup == 'pickup'
          ? {
            name: 'Native Sun LLC',
            address: NATIVE_SUN_MERRILLVILLE_ADDRESS,
            complete: true,
          }
          : CartContext.checkoutDetails.deliveryTo!,
      paymentIntentId: CartContext.checkoutDetails?.paymentIntentId,
    })
      .then((data) => {
        CartContext.setCheckoutDetails((prev) => {
          if (!prev) {
            return null
          }

          return {
            ...prev,
            tax: data.tax,
            totalDue: data.total,
          }
        })

        setTimeout(() => {
          setValue((prev) => prev + 1)
          setConfirmLocationProcessState('stable')
        }, 500)
      })
      .catch((err) => {
        alert('Could not get tax rate for purchase.')
        console.log(err)
      })
  }

  const CHECKOUT_PROCESS_STEPS = [
    {
      name: 'Confirm your cart',
      slug: 'confirm_cart',
      content: (
        <div className="flex flex-col w-full p-2 gap-4">
          <h3
            {...{
              className: 'text-xl font-canela',
            }}
          >
            Review Cart
          </h3>
          <CheckoutCartInventory />
          <div className="flex flex-col w-full gap-2">
            <Button
              {...{
                onClick: (e) => router.back(),
                variant: 'outline',
              }}
            >
              Continue Shopping
            </Button>
            <Button
              {...{
                onClick: (e) => {
                  setValue((prev) => prev + 1)
                },
              }}
            >
              Confirm Cart
            </Button>
          </div>
        </div>
      ),
    },
    {
      name: 'Contact info',
      slug: 'contact_info',
      content: (
        <div className="flex flex-col w-full p-2 py-6 gap-4 ">
          <Field
            {...{
              className: 'flex flex-col',
            }}
          >
            <FieldLabel>Email address</FieldLabel>
            <FieldDescription>
              Required to complete transaction, send an order confirmation email, and package tracking information only.
            </FieldDescription>
            <FieldContent {...{
              className: "flex flex-col gap-4"
            }}>
              <Input
                {...{
                  type: 'email',
                  onChange: (e) => {
                    CartContext.setCheckoutDetails((prev) => {
                      if (!prev) {
                        return null
                      }

                      return {
                        ...prev,
                        emailAddress: e.target.value,
                      }
                    })
                  },
                }}
              />
              <Field {...{
                orientation: "horizontal",
              }}>
                <Checkbox {...{
                  id: "send-marketing-emails",
                  checked: CartContext.checkoutDetails?.isSendMeMarketingEmails ?? false,
                  onCheckedChange: (checked) => CartContext.setCheckoutDetails(prev => ({
                    ...(prev ?? {}),
                    isSendMeMarketingEmails: checked == true
                  }))
                }} />
                <FieldLabel htmlFor="send-marketing-emails">
                  Send me marketing emails too. <span className='opacity-50'>(You can unsubscribe at any time)</span>
                </FieldLabel>
              </Field>
            </FieldContent>
          </Field>
          {/* <span className="debug">{JSON.stringify(CartContext.location)}</span> */}
          <Button
            {...{
              onClick: (e) => {
                setValue((prev) => prev + 1)
              },
              disabled: !CartContext || !CartContext.checkoutDetails || !CartContext.checkoutDetails.emailAddress,
            }}
          >
            Continue
          </Button>
        </div>
      ),
    },
    {
      name: 'Pickup or Delivery information',
      slug: 'pickup_delivery_details',
      content: (
        <div className="flex flex-col w-full p-2 gap-8 ">
          {!CartContext.checkoutDetails && <span>No payment intent.</span>}
          <div className='block py-5'>
            {CartContext.checkoutDetails && (
              <div className="flex flex-col gap-4">
                <h3 {...{
                  className: 'font-bold'
                }}>Billing address</h3>
                <span {...{
                  className: 'text-xs'
                }}>Required to complete payment. For delivery, your address determines sales tax. For pickup orders, Indiana sales tax is applied.</span>
                <StripeLocationAndTaxField
                  {...{
                    paymentIntent: CartContext.checkoutDetails,
                    onChange: (e) => {
                      CartContext.setCheckoutDetails((prev) => {
                        return {
                          ...(prev ?? {}),
                          billingAddress: {
                            ...e.value,
                            complete: e.complete,
                          },
                          deliveryTo: {
                            ...e.value,
                            complete: e.complete,
                          },
                          isShippingSameAsBillingAddress: true
                        }
                      });
                    }
                  }}
                />
              </div>
            )}
          </div>
          <PickupDeliveryOptions />
          {CartContext.checkoutDetails?.pickup == 'delivery' && (
            <div className="flex flex-col gap-4">
              <h3 {...{
                    className: 'font-bold'
                  }}>Delivery address</h3>
              <Field orientation="horizontal">
                <Checkbox {...{
                  id: "same-as-billing",
                  checked: CartContext.checkoutDetails.isShippingSameAsBillingAddress ?? false,
                  onCheckedChange: (value) => {
                    CartContext.setCheckoutDetails(prev => ({
                      ...(prev ?? {}),
                      isShippingSameAsBillingAddress: value == true,
                      deliveryTo: value == true ? prev?.billingAddress : null
                    }))
                  }
                }} />
                <FieldLabel htmlFor="same-as-billing">
                  Shipping address is the same as billing address
                </FieldLabel>
              </Field>
              {!CartContext.checkoutDetails.isShippingSameAsBillingAddress && (
                <div className="flex flex-col gap-4">
                  
                  <span {...{
                    className: 'text-xs'
                  }}>For delivery, your address determines sales tax. For pickup orders, Indiana sales tax is applied.</span>
                  <StripeLocationAndTaxField
                    {...{
                      paymentIntent: CartContext.checkoutDetails,
                      onChange: (e) => {
                        CartContext.setCheckoutDetails((prev) => {
                          return {
                            ...(prev ?? {}),
                            deliveryTo: {
                              ...e.value,
                              complete: e.complete,
                            }
                          }
                        });
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )}
          {/* <span className="debug">{JSON.stringify(CartContext.location)}</span> */}
          <Button
            {...{
              onClick: handleConfirmPickupMethod,
              disabled:
                !CartContext ||
                !CartContext.checkoutDetails?.pickup ||
                (!CartContext.checkoutDetails?.billingAddress || !CartContext.checkoutDetails.billingAddress.complete) ||
                (CartContext.checkoutDetails.pickup == 'delivery' && !CartContext.checkoutDetails.isShippingSameAsBillingAddress && (!CartContext.checkoutDetails.deliveryTo || !CartContext.checkoutDetails.deliveryTo.complete)),
            }}
          >
            {confirmLocationProcessState == 'stable' && (
              <>
                Confirm{' '}
                {CartContext.checkoutDetails?.pickup == 'pickup' ? 'pickup at Merrillville' : 'delivery address'}
              </>
            )}
            {confirmLocationProcessState == 'loading' && (
              <div
                {...{
                  className:
                    'h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white',
                }}
              />
            )}
          </Button>
        </div>
      ),
    },
    {
      name: 'Payment information',
      slug: 'payment_information',
      content: (
        <div className="flex flex-col w-full p-2 gap-4 pt-8">
          <SquarePaymentBox
            {...{
              amount: CartContext.checkoutDetails?.totalDue ?? 0,
            }}
          />
        </div>
      ),
    },
  ]

  useEffect(() => {
    createPaymentIntent({
      items: CartContext.cart!,
      idempotencyKey: idempotencyKey.current,
    })
      .then((data) => CartContext.setCheckoutDetails(data))
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <div className="flex flex-col gap-4 w-full py-4">
      <h2
        {...{
          className: 'text-xl font-canela',
        }}
      >
        Excellent choices. Few more steps to check out.
      </h2>

      <Accordion.Accordion
        {...{
          type: 'single',
          className: 'w-full border-t border-b border-gray-300',
          value: CHECKOUT_PROCESS_PROGRESSION[value],
        }}
      >
        {CHECKOUT_PROCESS_STEPS.map((accordion, index) => {
          return (
            <Accordion.AccordionItem
              key={accordion.slug}
              {...{
                value: accordion.slug,
                className: 'contents',
                disabled: value < index,
              }}
            >
              <div className="sticky top-14 flex w-full! bg-white ">
                <Accordion.AccordionTrigger
                  {...{
                    className: ' flex w-full! p-4',
                    onClick: (e) => {
                      setValue(index)
                    },
                  }}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm">
                      {index + 1}. {accordion.name}
                    </span>
                    {/* <MinusIcon className='size-4' /> */}
                    {value > index ? (
                      <CircleCheck className="size-4 fill-[#009487] text-white" />
                    ) : (
                      <>
                        {value == index ? <MinusIcon className="size-4" /> : <PlusIcon className="size-4" />}
                      </>
                    )}
                  </div>
                </Accordion.AccordionTrigger>
              </div>
              <Accordion.AccordionContent
                {...{
                  hidden: value != index,
                  forceMount: true,
                }}
              >
                {accordion.content}
              </Accordion.AccordionContent>
            </Accordion.AccordionItem>
          )
        })}
      </Accordion.Accordion>
    </div>
  )
}
