import React from 'react'

import { Footer } from '@/Footer/Component'

import TopLoadingBar from '@/components/LoadingBar'

import { Header } from '@/Header/Component'
export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <TopLoadingBar />
      <Header />
      {children}
      <Footer />
    </>
  )
}


