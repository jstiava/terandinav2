'use client'

import { formatPrice } from "@/collections/Products/formatPrice";
import { CartProvider } from "@/components/Cart/CartProviderComponent"
import { useContext } from "react";

export default function CheckoutOrderReceiptPreview() {

    const { ...CartContext } = useContext(CartProvider);

    return (
        <div className="flex flex-col gap-2 w-full">
            <h3 {...{
                className: 'text-xl font-canela'
            }}>Receipt</h3>

            <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between w-full items-center">
                    <span>Subtotal</span>
                    <span>{formatPrice(CartContext.checkoutDetails?.subtotal ?? 0, 'usd')}</span>
                </div>
                <div className="flex justify-between w-full items-center">
                    <span>Tax added</span>
                    <span>{formatPrice(CartContext.checkoutDetails?.tax ?? 0, 'usd')}</span>
                </div>
                <div className="flex justify-between w-full items-center">
                    <span>Total</span>
                    <span>{formatPrice(CartContext.checkoutDetails?.totalDue ?? 0, 'usd')}</span>
                </div>
            </div>
        </div>
    )
}