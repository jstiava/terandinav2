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


