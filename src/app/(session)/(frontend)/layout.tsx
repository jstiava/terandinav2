import React from 'react'
import { Footer } from '@/Footer/Component'
import TopLoadingBar from '@/components/LoadingBar'
import { Header } from '@/Header/Component'
import { Metadata } from 'next'
import GoogleAnalytics from '@/components/GoogleAnalytics/Component'
import { getCachedGlobal } from '@/utilities/getGlobals'



export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const headerData = await getCachedGlobal('header', 1)();
  
  return (
    <>
      <TopLoadingBar />
      <GoogleAnalytics />
      <Header data={headerData} />
      {children}
      <Footer />
    </>
  )
}


