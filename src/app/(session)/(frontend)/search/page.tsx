import React from 'react'
import { Header } from '@/Header/Component'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function SearchPage({ params: paramsPromise }: Args) {

  return (
    <>

      <div
        className=" flex flex-col gap-0 min-h-[calc(100vh-5rem)] lg:h-[calc(98vh)] overflow-x-hidden w-full"
        style={{
          backgroundColor: '#161D26',
        }}
      >
        <div className="relative w-full flex h-[calc(100vh-5rem)] lg:h-[calc(98vh)] p-0">
        </div>
      </div>
    </>
  )
}
