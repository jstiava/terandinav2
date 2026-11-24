'use client'

import { useContext, useEffect, useState } from "react"
import { CartProvider } from "./CartProviderComponent"
import { Button } from "../ui/button";
import { ShoppingBasketIcon } from "lucide-react";
import * as Drawer from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import ProductCardInCart from "@/components/Cart/ProductCardInCart";
import ContinueToCheckoutButton from "@/components/Cart/ContinueToCheckoutButton";




export default function CartDrawer() {

    const router = useRouter();
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
                    className: `aspect-square w-11 h-fit`

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
                    <div className="flex flex-col p-4 gap-4 ">

                        {!CartContext.cart || CartContext.cart.length === 0 && (
                            <div className="flex w-full h-fit py-4 items-center justify-center opacity-50 text-xs">
                                <span>Cart is empty.</span>
                            </div>
                        )}
                        {CartContext.cart?.map(item => {

                            const chosenSize = item.size ? item.product.sizes?.find(x => x.id == item.size) : null;
                            const totalQuantity = chosenSize?.count ?? 0;

                            if (!chosenSize) {
                                return <span key={item.id}>Something went wrong with {item.id}</span>
                            }

                            return (
                                <ProductCardInCart
                                    key={`${item.id}_${chosenSize?.id ?? 'no_chosen_size'}`} {...{
                                        product: item.product,
                                        quantity: item.quantity,
                                        size: chosenSize,
                                        totalQuantity
                                    }}
                                />
                            )

                        })}
                    </div>
                    <div className="flex flex-col items-center justify-center flex-col w-full p-4 gap-2">

                        <ContinueToCheckoutButton />
                        
                        <Button {...{
                            className: "w-full",
                            size: 'lg',
                            variant: "outline",
                            onClick: e => {
                                CartContext.close()
                            }
                        }}>
                            Keep Shopping
                        </Button>
                    </div>
                </div>

            </Drawer.DrawerContent>
        </Drawer.Drawer>
    )
}