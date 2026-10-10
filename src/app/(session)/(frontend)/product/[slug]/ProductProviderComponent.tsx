'use client'

import { Product } from "@/payload-types";
import { createContext, JSX, useState } from "react"

type Size = NonNullable<Product["sizes"]>[number]

export const ProductProvider = createContext<{
    product: Product,
    size: Size | null,
    quantity: number,
    incrementQuantity: () => any,
    decrementQuantity: () => any,
    changeSize: (newSize: Size) => any
    // @ts-ignore
}>(null);

export default function ProductProviderComponent({ children, product }: {
    children: JSX.Element,
    product: Product
}) {

    const [size, setSize] = useState<Size | null>(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
    const [quantity, setQuantity] = useState(1);

    const changeSize = (newSize: Size) => {
        setSize(newSize);
    }

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1)
        return;
    }

    const decrementQuantity = () => {
        setQuantity(prev => {
            if (prev == 0) return prev;
            return prev - 1;
        })
        return;
    }

    return (
        <ProductProvider.Provider value={{
            product, size, changeSize, quantity, incrementQuantity, decrementQuantity
        }}>
            {children}
        </ProductProvider.Provider>
    )
}