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



export default async function HomePage(props: any) {

  const { isEnabled: draft } = await draftMode()
  const page: RequiredDataFromCollection<Page> | null = await queryPageBySlug();

  if (!page) {

    return (
      <span>No home page found.</span>
    )
  }


  return (
    <div className="flex items-center justify-start flex-col gap-0 h-fit">
      <div className="flex flex-col w-full">
        {page?.blocks && <RenderBlocks blocks={page.blocks} />}
        {/* <div className='flex aspect-square w-full max-h-[30rem] bg-[#009487]'></div> */}
      </div>
      {draft && <LivePreviewListener />}
    </div>
  )
}


const queryPageBySlug = cache(async () => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise });

  const settings = await payload.findGlobal({
    slug: 'settings',
    depth: 1,
    draft,
  });

  if (!settings.frontPage) {
    return null;
  }

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    depth: 2,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: (settings.frontPage as Page).slug,
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
