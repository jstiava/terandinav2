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
        {/*<Tailwind config={tailwindConfig as any}>*/}
        {!isTest && (
          <Head>
            {/*<Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />*/}
          </Head>
        )}
        <Body
          style={{
            fontFamily: 'Helvetica',
            backgroundColor: 'white',
            margin: 0,
          }}
        >
          <Container
            style={{
              width: '100%',
              maxWidth: '700px',
              margin: '1.5rem auto',
              backgroundColor: '#ffffff',
            }}
          >
            <Container
              style={{
                width: 'calc(100% - 2rem)',
                maxWidth: '640px',
                margin: '0 auto',
                backgroundColor: 'white',
              }}
            >
              {children}
            </Container>
          </Container>
        </Body>
        {/*</Tailwind>*/}
      </Html>
    </>
  )
}
