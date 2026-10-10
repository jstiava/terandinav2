'use client'

import { CartProvider } from "@/components/Cart/CartProviderComponent"
import { Button } from "@/components/ui/button";
import { cn } from "@/utilities/cn";
import { useContext } from "react"



export default function PickupDeliveryOptions() {

    const { ...CartContext } = useContext(CartProvider);

    return (
        <div className="flex flex-col w-full gap-4 ">
            <h3 {...{
                className: 'font-bold'
            }}>Delivery or pickup</h3>
            <div className="flex flex-wrap gap-2">

                <Button {...{
                    variant: "outline",
                    className: cn("flex-col items-start justify-start p-1!  h-20 w-[45%] max-w-[10rem] text-xs gap-1 ",
                        CartContext.checkoutDetails?.pickup == 'delivery' ? 'border bg-primary/25 hover:bg-primary/50 border-black' : 'border hover:bg-primary/25 border-primary/25'
                    ),
                    onClick: e => {
                        CartContext.setCheckoutDetails(prev => ({
                            ...(prev ?? {}),
                            pickup: 'delivery'
                        }))
                    }
                }}>
                    <div className="flex flex-col items-start w-full gap-1 py-10! px-4! ">
                        <span {...{
                            className: 'font-bold'
                        }}>Free shipping</span>
                        <span>No sign in required.</span>
                    </div>

                </Button>

                <Button {...{
                    variant: "outline",
                    className: cn("flex-col items-start justify-start p-1!  h-20 w-[45%] max-w-[10rem] text-xs gap-1 ",
                        CartContext.checkoutDetails?.pickup == 'pickup' ? 'border bg-primary/25 hover:bg-primary/50 border-black' : 'border hover:bg-primary/25 border-primary/25'
                    ),
                    onClick: e => {
                        CartContext.setCheckoutDetails(prev => ({
                            ...(prev ?? {}),
                            pickup: 'pickup'
                        }))
                    }
                }}>
                    <div className="flex flex-col items-start w-full gap-1 py-10! px-4! ">
                        <span
                            {...{
                                className: 'font-bold'
                            }}>In-store pickup</span>
                        <span>Merrillville, IN</span>
                    </div>

                </Button>
            </div>
        </div>
    )
}