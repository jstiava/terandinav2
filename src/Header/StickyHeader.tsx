"use client"

import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react"
import { cn } from "@/utilities/cn"
import { usePathname } from "next/navigation";


export const HeaderProvider = createContext<{
    isMenuOpen: boolean,
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>
}>
    // @ts-ignore
    (null);


export function StickyHeader({
    children,
}: {
    children: React.ReactNode
}) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [stuck, setStuck] = useState(false);

    const pathname = usePathname()
    const isHomePage = pathname === "/"

    useEffect(() => {
        const sentinel = document.createElement("div")

        sentinel.style.position = "absolute"
        sentinel.style.top = "0"
        sentinel.style.height = "1px"
        sentinel.style.width = "1px"

        document.body.prepend(sentinel)

        const observer = new IntersectionObserver(([entry]) => {
            setStuck(!entry.isIntersecting)
        })

        observer.observe(sentinel)

        return () => {
            observer.disconnect()
            sentinel.remove()
        }
    }, []);

    return (
        <HeaderProvider.Provider value={{
            isMenuOpen, setIsMenuOpen
        }}>
            <header
                className={cn(
                    "fixed h-14 top-0 flex justify-center items-center w-full p-2 transition-colors ",
                    isHomePage ? isMenuOpen ? 'text-black' : 'text-white' : 'text-black',
                    stuck && "border-b shadow-sm bg-white/75 backdrop-blur-md text-black",
                )}
            >
                {children}
            </header>
        </HeaderProvider.Provider>
    )
}