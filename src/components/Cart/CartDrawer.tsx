'use client'

import { useContext, useEffect, useState } from "react"
import { CartProvider } from "./CartProviderComponent"
import { Button } from "../ui/button";
import { ShoppingBasketIcon, XIcon } from "lucide-react";
import * as Drawer from "@/components/ui/drawer";
import { formatPrice } from "../Stripe/Checkout";


export default function CartDrawer() {

    const { ...CartContext } = useContext(CartProvider);

    const [cartChanged, setCartChanged] = useState(false);

    useEffect(() => {

        if (!CartContext.cart || CartContext.cart.length === 0) {
            setCartChanged(false)
            return;
        }

        setCartChanged(true)

        setTimeout(() => {
            setCartChanged(false)
        }, 500)
    }, [CartContext.cart])

    return (
        <Drawer.Drawer {...{
            direction: 'right',
            open: CartContext.isOpen,
            onOpenChange: (open) => {
                open ? CartContext.open() : CartContext.close()
            }
        }}>
            <Drawer.DrawerTrigger asChild>
                <Button {...{
                    variant: "ghost",
                    className: `aspect-square`

                }}>
                    <ShoppingBasketIcon {...{
                        className: `${cartChanged ? 'animate-bounce' : ''}`
                    }} />
                </Button>
            </Drawer.DrawerTrigger>
            <Drawer.DrawerContent {...{
                className: "fixed inset-y-0 right-0 left-auto z-[101] h-full w-full max-w-[70rem] flex flex-col border-l bg-background outline-none"
            }}>
                <div className="flex flex-col py-6 px-4 md:px-8 md:py-10 w-full h-fit gap-4">
                    <Drawer.DrawerTitle>Shopping Cart</Drawer.DrawerTitle>
                    <div className="flex flex-col p-2 gap-0">
                        {CartContext.cart?.map(item => {

                            const chosenSize = item.size ? item.product.sizes?.find(x => x.id == item.size) : null

                            return (
                                <div
                                    key={item.id}
                                    {...{
                                        className: "flex w-full gap-4 p-3"
                                    }}>
                                    <div className="flex flex-1 gap-4 min-w-0">
                                        <div {...{
                                            className: "flex size-16 aspect-square bg-border bg-cover bg-center bg-no-repeat",
                                            style: {
                                                backgroundImage: item.product.images && item.product.images.length > 0 ? `url("${(item.product.images[0].image as any).thumbnailURL}")` : ""
                                            }
                                        }} />
                                        <div className="flex flex-col gap-2 text-xs">
                                            <span {...{
                                                className: "uppercase "
                                            }}>{item.product.name}</span>
                                            <span >{chosenSize?.label == 'custom' ? chosenSize.customLabel : chosenSize?.label}</span>
                                            <span >Quantity: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-fit items-end text-xs gap-0">
                                        <span>{item.product.prices && item.product.prices.length > 0 ? formatPrice(item.product.prices[0].amount * 100 * item.quantity, item.product.prices[0].currency) : "--"}</span>
                                        <Button {...{
                                            variant: "link",
                                            className: "w-fit text-xs p-0 gap-0",
                                            onClick: e => {
                                                CartContext.remove({
                                                    product_id: item.id,
                                                    size_id: item.size
                                                })
                                            }
                                        }}><XIcon />Remove</Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex flex-col items-center justify-center flex-col w-full p-4 gap-2">

                        {CartContext.cart && CartContext.cart.length > 0 && (
                            <Button {...{
                                asChild: true,
                                className: "w-full",
                                size: 'lg',
                            }}>
                                <a {...{
                                    href: "/checkout"
                                }}>Go to checkout</a>
                            </Button>
                        )}
                        <Button {...{
                            className: "w-full",
                            size: 'lg',
                            variant: "outline",
                            onClick: e => {
                                CartContext.close()
                            }
                        }}>
                            Continue Shopping
                        </Button>
                    </div>
                </div>

            </Drawer.DrawerContent>
        </Drawer.Drawer>
    )
}