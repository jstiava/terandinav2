'use server'

import { LivePreviewListener } from "@/components/LivePreviewListener"
import { draftMode, headers } from "next/headers"
import { getPayload } from "payload"
import configPromise from '@payload-config'
import { formatPrice } from "@/collections/Products/formatPrice"
import * as Accordion from "@/components/ui/accordion"
import { PencilIcon, PlusIcon } from "lucide-react"
import { Metadata } from "next"
import ProductSizeSelector from "./ProductSizeSelector"
import ProductProviderComponent from "./ProductProviderComponent"
import AddToCartButton from "./AddToCartButton"
import MobileProductImageCarousel from "./MobileProductImageCarousel"
import { cn } from "@/utilities/cn"
import Mongo from "@/utilities/mongo"
import ProductCard from "../../products/ProductCard"
import PickupDeliveryOptions from "./PickupDeliveryOptions"
import payloadConfig from "@payload-config"
import { Button } from "@/components/ui/button"
import ProductNotFound from "@/app/(session)/(frontend)/product/[slug]/ProductNotFound"
import { unstable_cache } from "next/cache"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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
    const db = mongo.clientPromise.db("terandinav2");

    const payload = await getPayload({ config: payloadConfig })

    const { user } = await payload.auth({
        headers: await headers(),
    })

    const recommendedProductsId = await db
        .collection("products")
        .aggregate([
            { $match: { active: true } },
            { $sample: { size: 5 } },
        ])
        .toArray();


    // @ts-ignore
    const recommendedProducts = await getProductFromList({
        ids: recommendedProductsId.map(x => x.slug)
    })

    console.log({
        requested: recommendedProductsId.map(x => x.slug),
        returned: recommendedProducts.map(x => x.slug)
    })

    const { isEnabled: draft } = await draftMode()
    const { slug = 'home' } = await paramsPromise
    const decodedSlug = decodeURIComponent(slug)
    const url = '/' + decodedSlug

    const product = await getProductBySlug_cached({
        slug: decodedSlug
    })

    if (!product) {
        return <ProductNotFound />;
    }

    if (!product.active && !user) {
        return <ProductNotFound />;
    }


    return (
        <ProductProviderComponent {...{
            product
        }}>
            <div className="flex flex-col w-full items-center h-fit">
                <div className="relative flex flex-col md:flex-row items-start w-full max-w-[140rem] h-fit">


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
                    <div className="self-start flex w-full md:w-[45%] max-w-[45rem] pt-2 md:pt-14 ">

                        <div className="sticky top-0 flex flex-col gap-8 w-full max-w-[80rem] h-fit ">

                            <div className={cn(
                                "flex flex-col w-full px-6 py-5  gap-6 ",
                                'md:px-12 md:py-10'
                            )}>



                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Product is not active</AlertTitle>
                                    <AlertDescription>
                                        This product is currently unavailable. You can only see this product preview because you are signed in.
                                    </AlertDescription>
                                </Alert>

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

                                {user && (
                                    <Button {...{
                                        asChild: true,
                                        size: 'lg',
                                        variant: 'outline'
                                    }}>
                                        <a {...{
                                            href: `/admin/collections/products/${product.id}`
                                        }}><PencilIcon /> Edit</a>
                                    </Button>
                                )}
                            </div>


                            <Accordion.Accordion {...{
                                type: 'multiple',
                                className: 'w-full border-t border-b border-gray-300'
                            }}>

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
                        </div>
                    </div>
                    {draft && <LivePreviewListener />}
                </div>
            </div>
        </ProductProviderComponent>
    )
}


const getProductFromList = async ({ ids }: { ids: string[] }) => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
        collection: 'products',
        draft: false,
        depth: 2,
        pagination: false,
        where: {
            slug: {
                in: ids,
            },
        },
    })

    return result.docs;
};

const getProductBySlug = async ({ slug }: { slug: string }) => {
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
}


async function getProductBySlug_cached(props: { slug: string }) {
    return unstable_cache(
        async () => {
            const products = await getProductBySlug(props);
            return products;
        },
        ["product"],
        { tags: [props.slug] }
    )();
}


