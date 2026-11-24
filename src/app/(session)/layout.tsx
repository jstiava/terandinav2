import type { Metadata } from 'next'
import React from 'react'

import { InitTheme } from '@/providers/Theme/InitTheme'
// @ts-ignore
import './globals.css'

import CartProviderComponent from '@/components/Cart/CartProviderComponent'
import { archivo, canela } from '@/app/fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${canela.variable} ${archivo.variable}`} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <meta name="theme-color" content="#093162" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#093162" media="(prefers-color-scheme: dark)" />
      </head>
      <body>
        <CartProviderComponent>
          <>{children}</>
        </CartProviderComponent>
      </body>
    </html>
  )
}


export const metadata: Metadata = {
  metadataBase: new URL('https://terandina.com'),

  title: {
    default: 'Terandina LLC',
    template: '%s | Terandina LLC | Authentic Clothing & Accessories',
  },

  description:
  'Discover Terandina LLC for thoughtfully designed clothing and apparel. Explore our latest styles and find pieces for everyday wear.',

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
