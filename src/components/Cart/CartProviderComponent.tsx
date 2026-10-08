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
    paymentIntentId?: string,
    clientSecret?: string,
    totalDue: number,
    tax?: number,
    subtotal: number
}

export type StripeLocationDetails = { "name"?: string | null, "firstName"?: string | null, "lastName"?: string | null, "address": { "line1": string | null, "line2": string | null, "city": string | null, "country": string | null, "postal_code": string | null, "state": string | null }, "complete": boolean }

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
    checkout: () => void;
    clear: () => void;
    close: () => void;
    open: () => void;
    isOpen: boolean;

    pickup: 'pickup' | 'delivery',
    setPickup: Dispatch<SetStateAction<'pickup' | 'delivery'>>,

    location: StripeLocationDetails | null,
    changeLocation: (arg: StripeLocationDetails | null) => any,
    checkoutDetails: CheckoutDetailsType | null,
    setCheckoutDetails: Dispatch<SetStateAction<CheckoutDetailsType | null>>,
    tokenizedCartWithPaymentReady: string | null,
    setTokenizedCartWithPaymentReady: Dispatch<SetStateAction<string | null>>,
    // @ts-ignore
}>(null);



export default function CartProviderComponent({ children }: {
    children: JSX.Element
}) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [cart, setCart] = useState<ProductType[] | null>(null);
    const [pickup, setPickup] = useState<'pickup' | 'delivery'>('delivery');
    const [location, setLocation] = useState<StripeLocationDetails | null>(null);
    const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetailsType | null>(null);
    const [tokenizedCartWithPaymentReady, setTokenizedCartWithPaymentReady] = useState<string | null>(null);


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

    const changeLocation = (newLocation: StripeLocationDetails | null) => {
        setLocation(newLocation)
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
            cart, clear, add, remove, get, close, isOpen, open, pickup, setPickup, location, changeLocation, checkoutDetails, setCheckoutDetails, tokenizedCartWithPaymentReady, setTokenizedCartWithPaymentReady
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