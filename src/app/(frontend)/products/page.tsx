import configPromise from '@payload-config'
import {
    getPayload,
    RequiredDataFromCollection,
} from 'payload'
import { draftMode } from 'next/headers'
import { Page } from '@/payload-types'
import React, { cache } from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import ProductCard from './ProductCard'



export default async function ProductsPage(props: any) {

    const { isEnabled: draft } = await draftMode()
    const page: RequiredDataFromCollection<Page> | null = await queryPageBySlug();

    const products = await getAllProducts();

    return (
        <div className="flex items-center justify-start flex-col gap-0 h-fit">
            <div className="flex flex-col items-center w-full max-w-[80rem] py-10 gap-4">

                <h1 {...{
                    className: "font-canela text-4xl py-6"
                }}>All Products</h1>


                {/* Product grid */}
                <div className="flex w-full gap-0 flex-wrap">
                    {products.map(product => {

                        return (
                            <ProductCard
                                key={product.id}
                                {...{
                                    product,
                                    className: ""
                                }} />
                        )
                    })}

                </div>


                {page?.blocks && <RenderBlocks blocks={page.blocks} />}
            </div>
            {draft && <LivePreviewListener />}
        </div>
    )
}


const getAllProducts = cache(async () => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
        collection: 'products',
        draft,
        depth: 2,
        pagination: false,
        overrideAccess: draft,
        where: {
            active: {
                equals: true
            }
        }
    })

    return result.docs;
})

const queryPageBySlug = cache(async () => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
        collection: 'pages',
        draft,
        limit: 1,
        depth: 2,
        pagination: false,
        overrideAccess: draft,
        where: {
            slug: {
                equals: 'products',
            },
        },
    })

    const page = result.docs?.[0] || null;
    return page
})


export async function generateMetadata() {

    return {
        title: "Terandina LLC"
    }
}
