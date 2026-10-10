'use server'
import React, { cache, ReactNode } from 'react'
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Button,
  Text,
  Font,
} from '@react-email/components'
import { PROD_WEBSITE_URI } from '@/emails/templates/VerificationEmail'
import config from '@/emails/tailwind.config'
// import tailwindConfig from '../tailwind.config'

export default async function EmailRoot({
  children,
  isTest = false,
}: {
  children: ReactNode
  isTest?: boolean
}) {
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
