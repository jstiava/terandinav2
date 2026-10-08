'use client'

import { Button } from "@/components/ui/button"
import { Product } from "@/payload-types"
import { useContext } from "react"
import { ProductProvider } from "./ProductProviderComponent"
import { cn } from "@/utilities/cn"
import { CheckIcon, CircleCheckIcon } from "lucide-react"

const SIZE_PRESET_LABELS: Record<string, string> = {
    'small': "S",
    'medium': "M",
    'large': "L",
    'extra-large': "XL",
    'extra-extra-large': "XXL",
}

export default function ProductSizeSelector() {

    const { product, size: selectedSize, changeSize } = useContext(ProductProvider);

    return (
        <div className="flex flex-wrap gap-2">

            {product.sizes?.map(size => {

                const isSelectedSize = selectedSize?.id == size.id;

                return (
                    <Button
                        key={size.id}
                        {...{
                            variant: "custom",
                            className: cn("relative flex flex-1 h-8 min-w-0 ",
                                isSelectedSize ? 'border bg-primary/25 hover:bg-primary/50 border-black' : 'border hover:bg-primary/25 border-primary/25'
                            ),
                            onClick: e => {
                                changeSize(size);
                            }
                        }}
                    >
                        {isSelectedSize && (
                            <div {...{
                                className: "absolute flex items-center justify-center top-[-0.35rem] right-[-0.35rem] rounded-full bg-black p-[2px]"
                            }}><div {...{
                                className: "flex"
                            }}><CheckIcon {...{
                                className: "text-white",
                                style: {
                                    width: "0.7rem",
                                    height: "0.7rem"
                                }
                            }} /></div></div>
                        )}
                        <div className="flex w-full h-full items-center justify-center">
                            <span {...{
                                className: 'text-xs'
                            }}>{size.label == 'custom' ? size.customLabel : size.label ? SIZE_PRESET_LABELS[size.label] : 'custom'}</span>
                        </div>
                    </Button>
                )
            })}
        </div>
    )
}