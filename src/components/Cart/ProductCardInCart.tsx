import { formatPrice } from "@/collections/Products/formatPrice";
import { CartProvider } from "@/components/Cart/CartProviderComponent";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { Button } from "@/components/ui/button";
import { Product } from "@/payload-types";
import { Minus, PlusIcon, XIcon } from "lucide-react";
import { useContext } from "react";



export default function ProductCardInCart(props: {
    product: Product,
    size: NonNullable<Product["sizes"]>[number],
    totalQuantity: number,
    quantity: number
}) {

    const { ...CartContext } = useContext(CartProvider);

    const sizeId = props.size.id;

    if (!sizeId) {
        return (
            <div className="flex w-full p-4 text-red-400">
                <span className="font-bold">Something went wrong</span>
            </div>
        )
    }

    return (
        <div

            {...{
                className: "flex w-full gap-4 p-6 border rounded-sm"
            }}>
            <div className="flex flex-1 gap-4 min-w-0">
                <ImageWithSkeleton {...{
                    className: "flex size-36 aspect-square bg-border bg-cover bg-center bg-no-repeat",
                    src: props.product.images && props.product.images.length > 0 ? (props.product.images[0].image as any).url : "",
                    alt: props.product.images && props.product.images.length > 0 ? (props.product.images[0].image as any).alt : ""
                }} />
                <div className="flex flex-col gap-2 text-xs">
                    <span {...{
                        className: "uppercase "
                    }}>{props.product.name}</span>
                    <span >{props.size?.label == 'custom' ? props.size.customLabel : defaultSizeToPlaintext(props.size?.label ?? props.size.customLabel ?? props.size.id ?? "No size label")}</span>
                    <span >Quantity: {props.quantity}</span>

                    <div className="flex items-center w-full flex-wrap gap-2 pt-2">
                        {props.totalQuantity > 1 && (
                            <>
                                <Button {...{
                                    variant: "outline",
                                    disabled: props.quantity <= 1,
                                    className: "w-fit text-xs py-1 px-4 gap-1 flex items-center rounded-full",
                                    onClick: e => {
                                        CartContext.swap({
                                            product_id: props.product.id,
                                            size: props.size,
                                            item: {
                                                id: props.product.id,
                                                product: props.product,
                                                size: sizeId,
                                                quantity: props.quantity - 1
                                            }
                                        });
                                    }
                                }}><Minus /> Remove 1</Button>

                                <Button {...{
                                    variant: "outline",
                                    disabled: props.quantity == props.totalQuantity,
                                    className: "w-fit text-xs py-1 px-4 gap-1 flex items-center rounded-full",
                                    onClick: e => {
                                        CartContext.swap({
                                            product_id: props.product.id,
                                            size: props.size,
                                            item: {
                                                id: props.product.id,
                                                product: props.product,
                                                size: sizeId,
                                                quantity: props.quantity + 1
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
                                    product_id: props.product.id,
                                    size: props.size.id
                                })
                            }
                        }}><XIcon /> Remove</Button>
                    </div>
                </div>
            </div>
            {props.quantity == 1 ? (
                <div key={'quantity_1'} className="flex flex-col w-fit items-end text-xs gap-0">
                    <span className="font-bold">{props.product.prices && props.product.prices.length > 0 ? formatPrice(props.product.prices[0].amount * 100 * props.quantity, props.product.prices[0].currency) : "--"}</span>
                </div>
            ) : (
                <div key={'multi_quantity'} className="flex flex-col w-fit items-end text-xs gap-0">
                    <span>{props.quantity}  x  {props.product.prices && props.product.prices.length > 0 ? formatPrice(props.product.prices[0].amount * 100, props.product.prices[0].currency) : "--"}</span>
                    <span className="font-bold">{props.product.prices && props.product.prices.length > 0 ? formatPrice(props.product.prices[0].amount * 100 * props.quantity, props.product.prices[0].currency) : "--"}</span>
                </div>
            )}


        </div>
    )
}


const defaultSizeToPlaintext = (target: string) => {

    try {
        const DEFAULT_CONVERSION_VALUES = {
            "extra-small": "Extra small",
            "small": "Small",
            "medium": "Medium",
            "large": "Large",
            "extra-large": "Extra large",
            "extra-extra-large": "Extra extra large"
        }

        // @ts-ignore
        return DEFAULT_CONVERSION_VALUES[target];
    }
    catch (err) {
        return target
    }
}