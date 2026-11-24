
"use client"

import { useMediaQuery } from "@/utilities/useMediaQuery"


export default function MediaQuery({ children, query = "(min-width: 640px)", fallback = null }: {
    children: React.ReactNode
    query?: string
    fallback?: React.ReactNode
}) {
    const matches = useMediaQuery(query)

    return matches ? children : fallback
}
