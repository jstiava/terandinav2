'use client'

import { Product } from "@/payload-types";
import { createContext, Dispatch, JSX, SetStateAction, useEffect, useState } from "react"


export type ProductType = {
    id: string,
    size: string | null | undefined,
    quantity: number,
    product: Product,
};

export type CheckoutDetailsType = {
    pickup: 'pickup' | 'delivery',
    isSendMeMarketingEmails: boolean | null,
    isShippingSameAsBillingAddress: boolean | null,
    emailAddress: string | null,
    billingAddress: StripeLocationDetails | null,
    deliveryTo: StripeLocationDetails | null,
    paymentIntentId?: string,
    clientSecret?: string,
    totalDue: number,
    tax?: number,
    subtotal: number
}

export type StripeLocationDetails = { "emailAddress"?: string | null, "name"?: string | null, "firstName"?: string | null, "lastName"?: string | null, "address": { "line1": string | null, "line2": string | null, "city": string | null, "country": string | null, "postal_code": string | null, "state": string | null }, "complete": boolean }

export const CartProvider = createContext<{
    cart: ProductType[] | null;
    add: (props: { item: ProductType }) => boolean;
    remove: (props: {
        product_id: string,
        size_id?: string | null
    }) => boolean;
    get: (props: { price_id: string, size: any }) => Product | null;
    // swap: (props: { removedItem: string, newItem: {
    //     id: string,
    //     size: string
    // } }) => void;
    clear: () => void;
    close: () => void;
    open: () => void;
    isOpen: boolean;
    
    checkoutDetails: Partial<CheckoutDetailsType> | null,
    setCheckoutDetails: Dispatch<SetStateAction<Partial<CheckoutDetailsType> | null>>,

    // @ts-ignore
}>(null);



export default function CartProviderComponent({ children }: {
    children: JSX.Element
}) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [cart, setCart] = useState<ProductType[] | null>(null);
    const [checkoutDetails, setCheckoutDetails] = useState<Partial<CheckoutDetailsType> | null>(null); 


    useLocalStorageCartEffect({
        cart, setCart
    });

    const clear = () => {
        setCart([]);
    }

    const add = ({ item }: { item: ProductType }) => {
        setCart(prev => (prev ? [...prev, item] : [item]))
        return false;
    }

    const remove = (props: {
        product_id: string,
        size_id?: string | null
    }) => {

        setCart(prev => {
            if (!prev) {
                return [];
            }
            const filtered = [...prev].filter(x => {
                return !(x.id == props.product_id && x.size == props.size_id)
            })
            return filtered;
        })
        return false;
    }

    const get = (props: {
        price_id: string, size: any
    }) => {
        return null;
    }

    const swap = (props: {
        removedItem: string, newItem: ProductType
    }) => {
        return;
    }

    const close = () => {
        setIsOpen(false);
    }

    const open = () => {
        setIsOpen(true);
    }

    if (!cart) {
        return (
            <div className="flex items-center justify-center w-screen h-screen">
                <span>Loading...</span>
            </div>
        )
    }

    return (
        <CartProvider.Provider value={{
            cart, clear, add, remove, get, close, isOpen, open, checkoutDetails, setCheckoutDetails
        }}>
            {children}
        </CartProvider.Provider>
    )
}


const useLocalStorageCartEffect = ({ cart, setCart }: {
    cart: ProductType[] | null,
    setCart: Dispatch<SetStateAction<ProductType[] | null>>
}) => {

    useEffect(() => {
        if (!cart) {
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
            else {
                setCart([])
            }
        }
    }, [])

    useEffect(() => {
        if (!cart) {
            return;
        }
        localStorage.setItem("cart", JSON.stringify(cart))

    }, [cart])
}
