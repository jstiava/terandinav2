'use client'

import { formatPrice } from "@/collections/Products/formatPrice";
import { CartProvider } from "@/components/Cart/CartProviderComponent"
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useContext } from "react"


export default function CheckoutCartInventory() {

    const CartContext = useContext(CartProvider);

    return (
        <div className="flex flex-col p-0 gap-2 w-full">
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
    )
}