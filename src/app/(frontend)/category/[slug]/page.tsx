import { draftMode } from "next/headers"
import { getPayload } from "payload"
import { cache } from "react"
import configPromise from '@payload-config'
import { LivePreviewListener } from "@/components/LivePreviewListener"
import { RenderBlocks } from "@/blocks/RenderBlocks"

type Args = {
    params: Promise<{
        slug?: string
    }>
}

export default async function CategoryPage({ params: paramsPromise }: Args) {

    const { isEnabled: draft } = await draftMode()
    const { slug = 'home' } = await paramsPromise
    const decodedSlug = decodeURIComponent(slug)
    const url = '/' + decodedSlug

    const category = await getCategoryBySlug({
        slug: decodedSlug
    })

    if (!category) {
        return null;
    }

    return (
        <div className="flex flex-col w-full items-center h-fit pt-14">
            <div className="relative flex items-start w-full max-w-[80rem]">
                <div className="flex flex-col w-full">
                    {category?.blocks && <RenderBlocks blocks={category.blocks} />}
                </div>
                {draft && <LivePreviewListener />}
            </div>
        </div>
    )

}


const getCategoryBySlug = cache(async ({ slug }: { slug: string }) => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
        collection: 'categories',
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

