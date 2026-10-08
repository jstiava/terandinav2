import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import React, { cache } from 'react'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { RenderEmailBlocks } from '@/emails/RenderEmailBlocks'
import { useAuth } from '@payloadcms/ui'
import { Preview } from '@react-email/components'
import EmailRoot from '@/emails/components/EmailRoot'
import Letterhead from '@/emails/blocks/Letterhead/Component'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function EmailPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise

  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug

  const email: RequiredDataFromCollectionSlug<'emails'> | null = await queryPageBySlug({
    slug: decodedSlug,
  })

  return (
    <>
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <EmailRoot isTest={true}>
        <Letterhead isTest />
        {email.blocks && (
          <RenderEmailBlocks
            {...{
              blocks: email.blocks,
              variables: {
                'from.first_name': 'First Name of User',
                'from.name': 'First Last Name Of User',
                'from.email_address': 'user@domain.com',
                'recipient.email_address': 'recipient@domain.com',
              }
            }}
          />
        )}
      </EmailRoot>
      {/*</Preview>*/}
    </>
  )
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'emails',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
