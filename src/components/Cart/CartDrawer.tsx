'use client'

import { useContext, useEffect, useState } from "react"
import { CartProvider } from "./CartProviderComponent"
import { Button } from "../ui/button";
import { Minus, PlusIcon, ShoppingBasketIcon, XIcon } from "lucide-react";
import * as Drawer from "@/components/ui/drawer";
import { formatPrice } from "../Stripe/Checkout";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";


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
                            const totalQuantity = item.product.sizes?.reduce((acc, s) => acc + (s.count ?? 0), 0) ?? 0;

                            return (
                                <div
                                    key={item.id}
                                    {...{
                                        className: "flex w-full gap-4 p-6 border rounded-sm"
                                    }}>
                                    <div className="flex flex-1 gap-4 min-w-0">
                                        <ImageWithSkeleton {...{
                                            className: "flex size-16 aspect-square bg-border bg-cover bg-center bg-no-repeat",
                                            src: item.product.images && item.product.images.length > 0 ? (item.product.images[0].image as any).url : "",
                                            alt: item.product.images && item.product.images.length > 0 ? (item.product.images[0].image as any).alt : ""
                                        }} />
                                        <div className="flex flex-col gap-2 text-xs">
                                            <span {...{
                                                className: "uppercase "
                                            }}>{item.product.name}</span>
                                            <span >{chosenSize?.label == 'custom' ? chosenSize.customLabel : chosenSize?.label}</span>
                                            <span >Quantity: {item.quantity}</span>

                                            <div className="flex items-center w-full flex-wrap gap-2 pt-2">
                                                {totalQuantity > 1 && (
                                                    <>
                                                        <Button {...{
                                                            variant: "outline",
                                                            disabled: item.quantity <= 1,
                                                            className: "w-fit text-xs py-1 px-4 gap-1 flex items-center rounded-full",
                                                            onClick: e => {
                                                                CartContext.swap({
                                                                    product_id: item.id,
                                                                    size: item.size,
                                                                    item: {
                                                                        ...item,
                                                                        quantity: item.quantity - 1
                                                                    }
                                                                })
                                                            }
                                                        }}><Minus /> Remove 1</Button>

                                                        <Button {...{
                                                            variant: "outline",
                                                            disabled: item.quantity == totalQuantity,
                                                            className: "w-fit text-xs py-1 px-4 gap-1 flex items-center rounded-full",
                                                            onClick: e => {
                                                                CartContext.swap({
                                                                    product_id: item.id,
                                                                    size: item.size,
                                                                    item: {
                                                                        ...item,
                                                                        quantity: item.quantity + 1
                                                                    }
                                                                })
                                                            }
                                                        }}><PlusIcon /> Add 1</Button>
                                                    </>
                                                )}

                                                <Button {...{
                                                    variant: "outline",
                                                    className: "w-fit text-xs py-1 px-4 gap-1 flex items-center rounded-full",
                                                    onClick: e => {
                                                        CartContext.remove({
                                                            product_id: item.id,
                                                            size: item.size
                                                        })
                                                    }
                                                }}><XIcon /> Remove</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-fit items-end text-xs gap-0">
                                        <span>{item.product.prices && item.product.prices.length > 0 ? formatPrice(item.product.prices[0].amount * 100 * item.quantity, item.product.prices[0].currency) : "--"}</span>

                                    </div>


                                </div>
                            )
                        })}
                    </div>
                    <div className="flex flex-col items-center justify-center flex-col w-full p-4 gap-2">

                        <Button {...{
                            className: "w-full h-12",
                            size: 'lg',
                            disabled: (!CartContext.cart || CartContext.cart.length === 0),
                            onClick: e => {
                                router.push('/checkout');
                                CartContext.close()
                            }
                        }}>Checkout as guest</Button>
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