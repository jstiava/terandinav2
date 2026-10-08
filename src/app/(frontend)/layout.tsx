import type { Metadata } from 'next'
import { cn } from '@/utilities/ui'
import React from 'react'

import { Footer } from '@/Footer/Component'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { draftMode } from 'next/headers'

import NextNProgress from "nextjs-progressbar";
// @ts-ignore
import './globals.css'
import TopLoadingBar from '@/components/LoadingBar'

import localFont from 'next/font/local'
import { Archivo } from 'next/font/google'
import CartProviderComponent from '@/components/Cart/CartProviderComponent'
import { Header } from '@/Header/Component'
import Script from 'next/script'
import StripeWindowWrapper from './checkout/StripeWindowWrapper'

export const canela = localFont({
  src: [
    { path: '../../../public/fonts/canelaweb-black.ttf', weight: '900', style: 'normal', },
    { path: '../../../public/fonts/canelaweb-medium.ttf', weight: '500', style: 'normal', },
    { path: '../../../public/fonts/canelaweb-thin.ttf', weight: '100', style: 'normal', },
  ], variable: '--font-canela', display: 'swap',
})

export const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={`${canela.variable} ${archivo.variable}`} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <meta name="theme-color" content="#093162" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#093162" media="(prefers-color-scheme: dark)" />
      </head>
      <body>
        <CartProviderComponent>
          <>
            <TopLoadingBar />
            <Header />
            {children}
            <Footer />
          </>
        </CartProviderComponent>
      </body>
    </html>
  )
}



export const metadata: Metadata = {
  metadataBase: new URL('https://terandina.com'),

  title: {
    default: 'Terandina LLC',
    template: '%s | Terandina LLC',
  },

  description: 'Independent clothing brand creating ...',

  applicationName: 'Terandina LLC',

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  openGraph: {
    type: 'website',
    siteName: 'Your Brand',
    title: 'Your Brand',
    description: 'Independent clothing brand creating ...',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Terandina LLC',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Terandina LLC',
    description: 'Independent clothing brand creating ...',
    images: ['/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
  },
}