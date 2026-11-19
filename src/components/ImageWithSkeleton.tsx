'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/utilities/ui"
import Image from "next/image"
import { ReactNode, useEffect, useState } from "react"


export default function ImageWithSkeleton(props: {
    src: string,
    alt: string,
    className: string,
    [key: string]: any,
}) {

    const { src, alt, className, ...rest } = props;

    const [isLoaded, setIsLoaded] = useState<string | null>(null)

    useEffect(() => {
        const img = new window.Image()
        img.onload = () => setIsLoaded('loaded')
        img.onerror = () => {
            setIsLoaded('error')
        }
        img.src = props.src
    }, [props.src]);

    if (isLoaded == null) {
        return (
            <Skeleton {...{
                className: cn(
                    props.className,
                    "bg-border animate-pulse",
                ),
                ...rest
            }} />
        )
    }

    if (isLoaded == 'error') {
        return (
            <div {...{
                className: cn(
                    props.className,
                    "relative"
                ),
                ...rest
            }}>
                <div className="flex absolute top-0 left-0 text-xs text-red-400">
                    <span>Something went wrong.</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <div {...{ 
                className: cn(
                    "bg-cover bg-no-repeat bg-center",
                    props.className
                ),
                style: {
                    ...rest.style,
                    backgroundImage: `url("${props.src}")`,
                },
                alt: props.alt,
                ...rest
            }} />
        </>
    )
}