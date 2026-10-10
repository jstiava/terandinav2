"use client"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon, XIcon } from "lucide-react"
import { ReactNode, useContext } from "react"
import { HeaderProvider } from "./StickyHeader"

export function MobileNavigationMenu({
    children
}: {
    children: ReactNode
}) {

    const { ...HeaderContext } = useContext(HeaderProvider);

    return (
        <Sheet {...{
            modal: false,
            onOpenChange: (open) => {
                HeaderContext.setIsMenuOpen(open);
            }
        }}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="aspect-square w-11 h-fit"
                >
                    <MenuIcon />
                    <span className="sr-only">
                        Open navigation menu
                    </span>
                </Button>
            </SheetTrigger>

            <SheetContent
                side="top"
                className="
        fixed left-0 right-0 z-[4]
        h-screen w-full
        rounded-none border-0 p-0
        duration-50 ease-out
        data-[state=open]:!duration-75
        data-[state=closed]:!duration-75

        data-[state=open]:animate-in 
        data-[state=open]:fade-in-0 
        data-[state=open]:slide-in-from-top-4
        data-[state=closed]:animate-out 
        data-[state=closed]:fade-out-0 
        data-[state=closed]:slide-out-to-top-4
    "
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>
                        Navigation
                    </SheetTitle>
                </SheetHeader>

                {children}

                <div className="flex px-6">
                    <SheetClose asChild>
                        <Button {...{
                            variant: "outline",
                            className: "w-full",
                            size: "lg"
                        }}>
                            <XIcon /> Close
                        </Button>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    )
}