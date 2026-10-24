import React from 'react'
import { Footer } from '@/Footer/Component'
import TopLoadingBar from '@/components/LoadingBar'
import { Header } from '@/Header/Component'
import { Metadata } from 'next'
import GoogleAnalytics from '@/components/GoogleAnalytics/Component'



export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <TopLoadingBar />
      <GoogleAnalytics />
      <Header />
      {children}
      <Footer />
    </>
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
