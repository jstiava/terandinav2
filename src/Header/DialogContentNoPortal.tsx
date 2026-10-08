"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/utilities/cn"

const DialogContentNoPortal = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
    return (
        <DialogPrimitive.Content
            ref={ref}
            {...props}
            className={cn(
                "fixed left-0 top-14 z-[100]",
                "w-screen",
                "h-[calc(100dvh-3.5rem)]",
                "bg-white/80 backdrop-blur-xl",
                "outline-none",
                "p-0",

                // animation
                "data-[state=open]:animate-in",
                "data-[state=closed]:animate-out",
                "data-[state=open]:slide-in-from-top-2",
                "data-[state=closed]:slide-out-to-top-2",
                "data-[state=open]:fade-in-0",
                "data-[state=closed]:fade-out-0",
                "duration-150",

                className,
            )}
        >
            {children}
        </DialogPrimitive.Content>
    )
})

DialogContentNoPortal.displayName = "DialogContentNoPortal"

export { DialogContentNoPortal }