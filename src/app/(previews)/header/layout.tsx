import React from 'react'
import { Footer } from '@/Footer/Component'
import TopLoadingBar from '@/components/LoadingBar'
import { Header } from '@/Header/Component'
import configPromise from '@payload-config'
import {
    getPayload,
    RequiredDataFromCollection,
} from 'payload'
import { draftMode } from 'next/headers'
import { LivePreviewListener } from '@/components/LivePreviewListener'



export default async function RootLayout({ children }: { children: React.ReactNode }) {

    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise });

    const headerData = await payload.findGlobal({
        slug: 'header',
    depth: 1,
        draft,
    });

    return (
        <>
            <Header data={headerData} />
            {children}
             {draft && <LivePreviewListener />}
            {/* <Footer /> */}
        </>
    )
}


