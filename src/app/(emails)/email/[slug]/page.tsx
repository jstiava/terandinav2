'use server'

import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import React, { cache } from 'react'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { blockComponents, RenderEmailBlocks } from '@/emails/RenderEmailBlocks'
import { EMAIL_TEMPLATES } from '@/collections/Emails/config'

// @ts-ignore
import '../../../(session)/globals.css'
import { Body, Container, Font, Head, Html, render, Row, Section, Tailwind } from '@react-email/components'
import EmailRoot from '@/emails/components/EmailRoot'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import config from '@/emails/tailwind.config'
import { PROD_WEBSITE_URI } from '@/emails/templates/VerificationEmail'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Args = {
  params: Promise<{
    slug?: string
  }>
}


const baseURL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

export default async function EmailPage({ params: paramsPromise }: Args) {

  console.log('3. Entering EmailPage');
  const { isEnabled: draft } = await draftMode()
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

    console.log('3c. Render email component');

    const html = await render(
      <Html style={{
        boxSizing: 'content-box'
      }}>

        <Head>
          <Font
            {...{
              fontFamily: 'Canela',
              fallbackFontFamily: 'Georgia',
              webFont: {
                url: `${PROD_WEBSITE_URI}/fonts/canelaweb-medium.ttf`,
                format: 'truetype',
              },
              fontWeight: 500,
            }}
          />
          <Font
            {...{
              fontFamily: 'Archivo',
              fallbackFontFamily: 'Arial',
              webFont: {
                url: `${PROD_WEBSITE_URI}/fonts/archivo-regular.ttf`,
                format: 'truetype',
              },
              fontWeight: 500,
            }}
          />
        </Head>
        <Tailwind config={config}>


          <Body className="bg-[#f6f9fc] py-2.5 font-sans" >
            {/* @ts-ignore */}
            <Template.Component
              {...{
                variables: email.variables ?? Template.variables
              }}
            >
              {email.blocks?.map((block, index) => {

                const { blockType } = block

                if (blockType && blockType in blockComponents) {
                  const Block = blockComponents[blockType]

                  if (!block.id) {
                    return null;
                  }

                  return (
                    <Block
                    // @ts-ignore
                      key={block.id}
                      {...block}
                    />
                  )
                }

              })
              }
            </Template.Component>
          </Body>
        </Tailwind>
      </Html>
    )

    console.log('3d. Push email html into iFrame');

    return (
      <>
        <iframe srcDoc={html} style={{ width: '100%', height: '100vh', border: 0 }} />)
        {draft && <LivePreviewListener />}
      </>
    )
  }

  console.log('3b. Entering default template rendering');

  return (
    <>
      <Head>
        <Font
          {...{
            fontFamily: 'Canela',
            fallbackFontFamily: 'Georgia',
            webFont: {
              url: `${PROD_WEBSITE_URI}/fonts/canelaweb-medium.ttf`,
              format: 'truetype',
            },
            fontWeight: 500,
          }}
        />
        <Font
          {...{
            fontFamily: 'Archivo',
            fallbackFontFamily: 'Arial',
            webFont: {
              url: `${PROD_WEBSITE_URI}/fonts/archivo-regular.ttf`,
              format: 'truetype',
            },
            fontWeight: 500,
          }}
        />
      </Head>
      <>
        {draft && <LivePreviewListener />}
        <Container className="my-[10px] mx-auto w-[650px] max-w-full border border-[#E5E5E5]">

          {email.blocks && (
            // @ts-ignore
            <RenderEmailBlocks
              {...{
                blocks: email.blocks,
                variables: email.variables
              }}
            />
          )}
        </Container>


        <div className="flex flex-col p-8 gap-2">
          <span>Email preview area with no template</span>
          <p className="debug">{JSON.stringify(email.blocks, null, 2)}</p>
        </div>

      </>

    </>
  )
}

const queryEmailPageBySlug = async ({ slug }: { slug: string }) => {
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
}
