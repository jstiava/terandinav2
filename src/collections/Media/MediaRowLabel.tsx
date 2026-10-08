import React from 'react'

export default function MediaRowLabel(props: any) {
    const { data, index } = props

    return data?.alt || `Image ${index + 1}`
}