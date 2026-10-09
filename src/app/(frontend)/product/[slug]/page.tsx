'use server'

import { LivePreviewListener } from "@/components/LivePreviewListener"
import { draftMode } from "next/headers"
import { getPayload } from "payload"
import configPromise from '@payload-config'
import { cache } from "react" 
import { formatPrice } from "@/collections/Products/formatPrice"
import * as Accordion from "@/components/ui/accordion"
import { PlusIcon } from "lucide-react" 
import { Metadata } from "next"
import ProductSizeSelector from "./ProductSizeSelector"
import ProductProviderComponent from "./ProductProviderComponent"
import AddToCartButton from "./AddToCartButton"
import MobileProductImageCarousel from "./MobileProductImageCarousel"
import { cn } from "@/utilities/cn"
import Mongo from "@/utilities/mongo" 
import ProductCard from "../../products/ProductCard"
import PickupDeliveryOptions from "./PickupDeliveryOptions"

type Args = {
    params: Promise<{
        slug?: string
    }>
}



export async function generateMetadata({
    params: paramsPromise,
}: Args): Promise<Metadata | null> {
    const { slug = 'home' } = await paramsPromise
    const decodedSlug = decodeURIComponent(slug)

    // Fetch your product
    const product = await getProductBySlug({
        slug: decodedSlug
    })

    if (!product) {
        return null;
    }

    return {
        title: product.name,
        description: product.description,
    }
}

export default async function ProductPage({ params: paramsPromise }: Args) {

    const mongo = await Mongo.getInstance();
    const db = mongo.clientPromise.db("terandinav2")

    const recommendedProductsId = await db
        .collection("products")
        .aggregate([
            { $sample: { size: 5 } },
        ])
        .toArray();

    // @ts-ignore
    const recommendedProducts = await getProductFromList({
        ids: recommendedProductsId.map(x => x.slug)
    })

    const { isEnabled: draft } = await draftMode()
    const { slug = 'home' } = await paramsPromise
    const decodedSlug = decodeURIComponent(slug)
    const url = '/' + decodedSlug

    const product = await getProductBySlug({
        slug: decodedSlug
    })

    if (!product) {
        return null;
    }

    return (
        <ProductProviderComponent {...{
            product
        }}>
            <div className="flex flex-col w-full items-center h-fit">
                <div className="relative flex flex-col md:flex-row items-start w-full max-w-[120rem] h-fit">


                    {/* Images on mobile */}
                    <div className="flex md:hidden w-full">
                        <MobileProductImageCarousel {...{
                            images: product.images
                        }} />
                    </div>

                    {/* Images on desktop */}
                    <div className="hidden md:flex flex-1 min-w-0 h-fit">
                        <div className="flex flex-col h-fit w-full">
                            {product.images?.map(image => {

                                if (typeof image.image == 'string') {
                                    return null;
                                }

                                return (
                                    <div
                                        key={image.id}
                                        {...{
                                            className: "flex w-full aspect-[3/4] h-fit bg-cover bg-center",
                                            style: {
                                                backgroundImage: `url("${image.image.url}")`
                                            }
                                        }} />
                                )
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="self-start flex w-full md:w-[45%] max-w-[40rem] pt-2 md:pt-14 ">

                        <div className="sticky top-0 flex flex-col gap-8 w-full max-w-[80rem] h-fit ">

                            <div className={cn(
                                "flex flex-col w-full px-6 py-5  gap-6 ",
                                'md:px-12 md:py-10'
                            )}>
                                {/* <div className="flex gap-1 items-center w-fit">
                                    <StarIcon {...{
                                        className: "size-4",
                                        fill: "gold",
                                        // strokeWidth: 0,
                                        stroke: 'gold'
                                    }} />
                                    <StarIcon {...{
                                        className: "size-4",
                                        fill: "gold",
                                        // strokeWidth: 0,
                                        stroke: 'gold'
                                    }} />
                                    <StarIcon {...{
                                        className: "size-4",
                                        fill: "gold",
                                        // strokeWidth: 0,
                                        stroke: 'gold'
                                    }} />
                                    <StarIcon {...{
                                        className: "size-4",
                                        fill: "gold",
                                        // strokeWidth: 0,
                                        stroke: 'gold'
                                    }} />
                                    <StarIcon {...{
                                        className: "size-4",
                                        fill: "gold",
                                        // strokeWidth: 0,
                                        stroke: 'gold'
                                    }} />
                                    <span {...{
                                        className: "text-xs"
                                    }}>(3 reviews)</span>
                                </div> */}

                                <div className="flex flex-col w-full">


                                    <h1 {...{
                                        className: "font-bold uppercase text-sm"
                                    }}>{product.name}</h1>

                                    {product.prices && product.prices.length > 0 && (
                                        <span {...{
                                            className: 'text-sm'
                                        }}>{formatPrice(product.prices[0].amount * 100, product.prices[0].currency)}</span>
                                    )}
                                </div>

                                {/* Sizes */}
                                <div className="flex flex-col w-full gap-2 ">
                                    <span {...{
                                        className: 'text-xs'
                                    }}>Size</span>
                                    <ProductSizeSelector />
                                </div>

                                <AddToCartButton />

                                <PickupDeliveryOptions />

                                <div className="flex flex-col w-full gap-1">
                                    <span {...{
                                        className: "whitespace-pre-wrap text-sm w-full"
                                    }}>{product.description}</span>
                                </div>
                            </div>


                            <Accordion.Accordion {...{
                                type: 'multiple',
                                className: 'w-full border-t border-b border-gray-300'
                            }}>

                                {/* DESCRIPTION */}
                                {/* <Accordion.AccordionItem
                                key={'description'} {...{
                                    value: 'description',
                                }}  >
                                <Accordion.AccordionTrigger className='flex w-full! p-4'>
                                    <div className="flex justify-between items-center w-full">
                                        <span className='text-sm'>Description</span> 
                                        <PlusIcon className='size-4' />
                                    </div>
                                </Accordion.AccordionTrigger>
                                <Accordion.AccordionContent>
                                    <div className="flex w-full px-4 py-2">

                                        <span {...{
                                            className: "whitespace-pre-wrap text-sm w-full"
                                        }}>{product.description}</span>
                                    </div>
                                </Accordion.AccordionContent>
                            </Accordion.AccordionItem> */}

                                {/* DETAILS */}
                                <Accordion.AccordionItem
                                    key={'details'} {...{
                                        value: 'details',
                                    }}  >
                                    <Accordion.AccordionTrigger className='flex w-full! p-4'>
                                        <div className="flex justify-between items-center w-full">
                                            <span className='text-sm'>Details</span>
                                            {/* <MinusIcon className='size-4' /> */}
                                            <PlusIcon className='size-4' />
                                        </div>
                                    </Accordion.AccordionTrigger>
                                    <Accordion.AccordionContent>
                                        <div className="flex w-full px-4 py-2">
                                            <span {...{
                                                className: "whitespace-pre-wrap text-sm w-full"
                                            }}>{product.details}</span>
                                        </div>
                                    </Accordion.AccordionContent>
                                </Accordion.AccordionItem>


                                {/* SHIPPING */}
                                <Accordion.AccordionItem
                                    key={'shipping'} {...{
                                        value: 'shipping',
                                    }}  >
                                    <Accordion.AccordionTrigger className='flex w-full! p-4'>
                                        <div className="flex justify-between items-center w-full">
                                            <span className='text-sm'>1-2 week free shipping, 30 day return policy</span>
                                            {/* <MinusIcon className='size-4' /> */}
                                            <PlusIcon className='size-4' />
                                        </div>
                                    </Accordion.AccordionTrigger>
                                    <Accordion.AccordionContent>
                                        <div className="flex w-full px-4 py-2">
                                            <span {...{
                                                className: "whitespace-pre-wrap text-sm w-full"
                                            }}>{`We intentionally source in small batches to avoid overproduction and waste. Because of this, some items are ready to ship while others may take a little more time. Please allow 1-2 weeks for shipping - we’ll keep you updated every step of the way. \n\nIf you are not fully satisfied with your order, we are happy to offer returns and exchanges within 30 days of the delivery date. Items must be returned in original, unused condition with all tags still attached.`}</span>
                                        </div>
                                    </Accordion.AccordionContent>
                                </Accordion.AccordionItem>


                            </Accordion.Accordion>


                            <div className="flex flex-col p-2" >
                                <span {...{
                                    className: "uppercase text-sm px-2"
                                }}>RECOMMENDED PRODUCTS</span>

                                <div className={cn(
                                    "grid grid-cols-2",
                                    //    className
                                )}>
                                    {recommendedProducts?.map(product => {
                                        return (
                                            <ProductCard
                                                key={product.id}
                                                {...{
                                                    product,
                                                    className: "w-full md:w-full"
                                                }}
                                            />
                                        )
                                    })}
                                </div>
                            </div>

                            {/* <p>{JSON.stringify(product, null, 2)}</p> */}
                        </div>
                    </div>
                    {draft && <LivePreviewListener />}
                </div>
            </div>
        </ProductProviderComponent>
    )
}


const getProductFromList = cache(async ({ ids }: { ids: string[] }) => {
    const { isEnabled: draft } = await draftMode()

    console.log({ ids })
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
        collection: 'products',
        draft,
        depth: 2,
        pagination: false,
        overrideAccess: draft,
        where: {
            slug: {
                in: ids,
            },
        },
    })

    return result.docs;
})

const getProductBySlug = cache(async ({ slug }: { slug: string }) => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
        collection: 'products',
        draft,
        limit: 1,
        depth: 2,
        pagination: false,
        overrideAccess: draft,
        where: {
            slug: {
                equals: slug,
            },
        },
    })

    const product = result.docs?.[0] || null;

    if (!product) {
        return null;
    }

    return product
})

