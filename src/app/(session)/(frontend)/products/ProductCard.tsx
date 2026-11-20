import { formatPrice } from "@/collections/Products/formatPrice"
import ImageWithSkeleton from "@/components/ImageWithSkeleton"
import { Product } from "@/payload-types"
import { cn } from "@/utilities/cn"



export default function ProductCard({ product, className, style = {} }: {
    product: Product,
    className: string,
    style?: any
}) {

    const isSoldOut = (!product.sizes || product.sizes.length == 0) || (product.sizes.reduce((sum, item) => sum + (item.count ?? 0), 0) == 0);

    return (
        <div {...{
            className: cn(
                'flex w-1/2 md:w-1/4 p-4 pb-8 normal-case text-xs',
                className,
                style
            ),
            'data-block-id': product.id
        }}>
            <a
                {...{
                    href: `/product/${product.slug}`,
                    className: cn(
                        "group flex flex-col gap-3 h-fit w-full",
                    ),
                }}>

                <ImageWithSkeleton {...{
                    className: "relative flex aspect-square w-full h-fit bg-border bg-cover bg-center bg-no-repeat",
                    src: product.images && product.images.length > 0 ? (product.images[0]?.image as any).url : "",
                    alt: product.images && product.images.length > 0 ? (product.images[0]?.image as any).alt : ""
                }} />
                <div className="flex flex-col w-full md:pr-10">
                    <span {...{
                        className: "font-archivo group-hover:underline"
                    }}>{product.name}</span>
                    <span {...{
                        className: "font-archivo"
                    }}>{product.prices && product.prices.length > 0 && formatPrice(product.prices[0].amount * 100, product.prices[0].currency)}</span>
                    {isSoldOut && (
                        <span className="font-bold uppercase text-[--terandina-gold-darker] ">Sold out</span>
                    )}
                </div>
            </a>
        </div>
    )
}