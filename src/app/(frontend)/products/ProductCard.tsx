'use server'
import { formatPrice } from "@/collections/Products/formatPrice"
import { Product } from "@/payload-types"
import { cn } from "@/utilities/cn"



export default async function ProductCard({ product, className }: {
    product: Product,
    className: string
}) {

    return (
        <div {...{
            className: cn(
                'flex w-1/2 md:w-1/4 p-4 pb-8 normal-case text-xs',
                className
            )
        }}>


            <a
                key={product.id}
                {...{
                    href: `/product/${product.slug}`,
                    className: cn(
                        "group flex flex-col gap-3 h-fit w-full",
                    ),
                }}>
                <div {...{
                    className: "flex aspect-square w-full h-fit bg-border bg-cover bg-center bg-no-repeat",
                    style: {
                        backgroundImage: product.images && product.images.length > 0 ? `url("${(product.images[0].image as any).url}")` : ""
                    }
                }} />
                <div className="flex flex-col w-full md:pr-10">
                    <span {...{
                        className: "font-archivo group-hover:underline"
                    }}>{product.name}</span>
                    <span {...{
                        className: "font-archivo"
                    }}>{product.prices && product.prices.length > 0 && formatPrice(product.prices[0].amount * 100, product.prices[0].currency)}</span>
                </div>
            </a>
        </div>
    )
}