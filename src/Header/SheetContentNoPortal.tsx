import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/utilities/cn"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close

const SheetContentNoPortal = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <SheetPrimitive.Content
        ref={ref}
        forceMount
        {...props}
        className={cn(
            "fixed left-0 right-0 z-[100]",
            "w-full bg-background outline-none",

            // IMPORTANT: don't use shadcn's slide animations
            "transform-gpu",
            "transition-transform duration-200 ease-out",
            "data-[state=open]:translate-y-0",
            "data-[state=closed]:-translate-y-full",

            className,
        )}
    >
        {children}
    </SheetPrimitive.Content>
))

SheetContentNoPortal.displayName = "SheetContentNoPortal"

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContentNoPortal,
}