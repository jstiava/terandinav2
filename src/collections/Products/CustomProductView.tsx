import React from 'react'
import type { DocumentTabServerProps } from 'payload'
import { Link } from '@payloadcms/ui'

export default function CustomProductView(props: DocumentTabServerProps) {
    return (
        <Link href="/custom-product-view">This is a custom Document Tab (Server)</Link>
    )
}

export function CustomProductViewTab(props: DocumentTabServerProps) {


    return (
        <Link href="/custom-product-view">Event History</Link>

    )
}