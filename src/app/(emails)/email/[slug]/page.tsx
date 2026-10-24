'use server'

import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import React, { cache } from 'react'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { RenderEmailBlocks } from '@/emails/RenderEmailBlocks'
import { EMAIL_TEMPLATES } from '@/collections/Emails/config'

// @ts-ignore
import '../../../(session)/globals.css'

type Args = {
  params: Promise<{
    slug?: string
  }>
}




export default async function EmailPage({ params: paramsPromise }: Args) {

  console.log('3. Entering EmailPage');

  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug

  const email: RequiredDataFromCollectionSlug<'emails'> | null = await queryEmailPageBySlug({
    slug: decodedSlug,
  });

  if (!email) {
    return (
      <span>No email found.</span>
    )
  }

  if (email.template && email.template != 'custom') {

    console.log('3a. Entering templating area');

    const Template = EMAIL_TEMPLATES.find(x => x.value === email.template)

    if (!Template || !Template.Component) return (
      <p>Could not find template.</p>
    )

    return (
      // @ts-ignore
      <Template.Component
        {...{
          blocks: email.blocks,
          variables: Template.variables
        }}
      />
    )
  }

  console.log('3b. Entering default template rendering');

  return (
    <>
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
    </>
  )
}

const queryEmailPageBySlug = cache(async ({ slug }: { slug: string }) => {
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
