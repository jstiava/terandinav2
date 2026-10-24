'use server'

import React, { ReactNode } from 'react'
import {
  Body,
  Head,
  Html,
  Font,
  Tailwind,
} from '@react-email/components'
import { PROD_WEBSITE_URI } from '@/emails/templates/VerificationEmail'
import { draftMode } from 'next/headers'
import config from '@/emails/tailwind.config'
// import tailwindConfig from '../tailwind.config'

export default async function EmailRoot({
  children,
  isTest = false,
}: {
  children: ReactNode
  isTest?: boolean
}) {

  console.log('2. Entering EmailRoot');

  return (
    <>
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
            {children}
          </Body>
        </Tailwind>
      </Html>
    </>
  )
}
