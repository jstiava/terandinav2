'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

export default function CustomBlockLabel({
    path,
    clientProps,
    exportName,
    serverProps,
}: {
    path: string
    clientProps?: Record<string, unknown>
    exportName?: string
    serverProps?: Record<string, unknown>
}) {
    const labelPath = `${path}.blockName`

    const { value, setValue } = useField<string>({
        path: labelPath,
    })

    return (
        <input
            type="text"
            value={value ?? ''}
            placeholder="Block name"
            onChange={(event) => setValue(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
            style={{
                width: '100%',
                border: 0,
                outline: 0,
                background: 'transparent',
                color: 'inherit',
                font: 'inherit',
            }}
        />
    )
}