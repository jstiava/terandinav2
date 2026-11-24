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

export type SearchQuery = {
    query?: string | null,
    sortBy?: string | null,
    order?: 'asc' | 'dec' | null,
    categories?: string[],
    sizes?: string[],
    colors?: string[]
}

export const CartProvider = createContext<{
    cart: ProductType[] | null;
    add: (props: { item: ProductType }) => boolean;
    remove: (props: {
        product_id: string,
        size?: string | null
    }) => boolean;
    get: (props: {
        product_id: string, size: any
    }) => ProductType | null;
    swap: (props: {
        product_id: string,
        size: any,
        item: ProductType
    }) => void;
    clear: () => void;
    close: () => void;
    open: () => void;
    isOpen: boolean;

    checkoutDetails: Partial<CheckoutDetailsType> | null,
    setCheckoutDetails: Dispatch<SetStateAction<Partial<CheckoutDetailsType> | null>>,

    searchQuery: SearchQuery | null,
    setSearchQuery: Dispatch<SetStateAction<SearchQuery | null>>

    // @ts-ignore
}>(null);



export default function CartProviderComponent({ children }: {
    children: JSX.Element
}) {

    const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [cart, setCart] = useState<ProductType[] | null>(null);
    const [checkoutDetails, setCheckoutDetails] = useState<Partial<CheckoutDetailsType> | null>(null);


    useLocalStorageCartEffect({
        cart, setCart
    });

    useLocalStorageCheckoutDetailsEffect({
        checkoutDetails, setCheckoutDetails
    })

    useLocalStorageSearchResults({
        searchQuery,
        setSearchQuery
    })

    const clear = () => {
        setCart([]);
    }

    const add = ({ item }: { item: ProductType }) => {

        const existingItem = get({
            product_id: item.product.id,
            size: item.size
        });
        if (existingItem) {
            return false;
        }

        setCart(prev => {
            return prev ? [...prev, item] : [item];
        })
        return false;
    }

    const remove = (props: {
        product_id: string,
        size?: string | null
    }) => {

        setCart(prev => {
            if (!prev) {
                return [];
            }
            const filtered = [...prev].filter(x => {
                return !(x.id == props.product_id && x.size == props.size)
            })
            return filtered;
        })
        return false;
    }

    const get = (props: {
        product_id: string, size: any
    }) => {

        if (!cart) {
            return null;
        }

        return cart.find(x => x.product.id == props.product_id && x.size == props.size) || null;
    }

    const swap = (props: {
        product_id: string, size: any,
        item: ProductType
    }) => {

        setCart((prev) => {

            if (!prev) {
                setCart([props.item]);
                return null;
            }

            const index = prev.findIndex(
                p => p.product.id == props.product_id && p.size == props.size
            );

            if (index === -1) {
                return [...prev, props.item];
            }

            return [...prev.map((p, i) => i === index ? props.item : p)];
        })

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
            cart, clear, add, remove, get, close, isOpen, open, checkoutDetails, setCheckoutDetails, swap, searchQuery, setSearchQuery
        }}>
            {children}
        </CartProvider.Provider>
    )
}


const useLocalStorageCheckoutDetailsEffect = ({ checkoutDetails, setCheckoutDetails }: {
    checkoutDetails: Partial<CheckoutDetailsType> | null,
    setCheckoutDetails: Dispatch<SetStateAction<Partial<CheckoutDetailsType> | null>>,
}) => {

    useEffect(() => {
        if (!checkoutDetails) {
            const savedValue = localStorage.getItem("checkoutDetails");
            if (savedValue) {
                setCheckoutDetails(JSON.parse(savedValue));
            }
            else {
                setCheckoutDetails({})
            }
        }
    }, [])

    useEffect(() => {
        if (!checkoutDetails) {
            return;
        }

        localStorage.setItem("checkoutDetails", JSON.stringify(checkoutDetails))

    }, [checkoutDetails])
}



const useLocalStorageCartEffect = ({ cart, setCart }: {
    cart: ProductType[] | null,
    setCart: Dispatch<SetStateAction<ProductType[] | null>>,
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


const useLocalStorageSearchResults = ({ searchQuery, setSearchQuery }: {
    searchQuery: SearchQuery | null,
    setSearchQuery: Dispatch<SetStateAction<SearchQuery | null>>,
}) => {

    useEffect(() => {
        if (!searchQuery) {
            const savedValue = localStorage.getItem("searchQuery");

            try {
                if (savedValue) {
                    const parsed = JSON.parse(savedValue);

                    if (typeof parsed === "object") {
                        setSearchQuery(parsed)
                    } else {
                        setSearchQuery({});
                        localStorage.setItem("searchQuery", JSON.stringify({}))
                    }
                }
                else {
                    setSearchQuery({})
                }
            }
            catch (err) {
                setSearchQuery({})
            }
        }
    }, [])

    useEffect(() => {
        if (!searchQuery) {
            return;
        }
        localStorage.setItem("searchQuery", JSON.stringify(searchQuery))

    }, [searchQuery])
}
