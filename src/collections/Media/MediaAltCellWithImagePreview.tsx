'use client'

import type { DefaultCellComponentProps } from 'payload'
import { ReactNode } from 'react'

export default function MediaAltCellWithImagePreview({ rowData }: { rowData: any }): ReactNode {
    const url =
        typeof rowData.thumbnailURL === 'string'
            ? rowData.thumbnailURL
            : typeof rowData.url === 'string'
                ? rowData.url
                : null

    if (!url) {
        return null
    }

    return (
        <img
            src={url}
            alt={typeof rowData.alt === 'string' ? rowData.alt : ''}
            style={{
                width: '60px',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '4px',
                display: 'block',
            }}
        />
    )
}