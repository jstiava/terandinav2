'use client'

import { useState } from "react"
import * as Drawer from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Product } from "@/payload-types";


export default function SearchDrawer() {

    const [query, setQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<Product[] | null>(null);

    return (
        <Drawer.Drawer {...{
            direction: 'right',
            open: isSearchOpen,
            onOpenChange: setIsSearchOpen
        }}>
            <Drawer.DrawerTrigger asChild>
                <Button {...{
                    variant: "ghost",
                    className: `aspect-square w-11 h-fit`

                }}>
                    <SearchIcon />
                </Button>
            </Drawer.DrawerTrigger>
            <Drawer.DrawerContent {...{
                className: "fixed inset-y-0 right-0 left-auto z-[101] h-full w-full flex flex-col border-l bg-transparent outline-none border-none"
            }}>
                <div className="flex w-full h-screen">
                    <div className="flex-1 min-w-0" onClick={e => {
                        setIsSearchOpen(false);
                    }}>
                        <div className="flex w-full">

                        </div>
                    </div>
                    <div className="flex flex-col py-6 px-4 md:px-8 md:py-10 w-full h-fit gap-4 bg-white w-full max-w-[40rem] min-h-screen shadow-[-2px_2px_4px_rgba(0,0,0,0.08)]">
                        <Drawer.DrawerTitle {...{
                            className: "sr-only"
                        }}>Search Drawer</Drawer.DrawerTitle>
                        <div className="flex flex-col p-2 gap-8">
                            <div className="group flex gap-4 items-center">
                                <SearchIcon {...{
                                    className: 'size-6'
                                }} />
                                <Input {...{
                                    className: "h-10",
                                    autoFocus: true
                                }} />
                            </div>
                            {searchResults && (
                                <p>{searchResults.length} products found.</p>
                            )}
                            {!searchResults && (
                                <p>Recommend products pre-search.</p>
                            )}
                        </div>
                    </div>
                </div>

            </Drawer.DrawerContent>
        </Drawer.Drawer>


    )

}