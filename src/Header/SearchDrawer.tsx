'use client'

import { ReactNode, useContext, useEffect, useState } from "react"
import * as Drawer from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header, Product } from "@/payload-types";
import Fuse from 'fuse.js';
import { RenderBlocks } from "@/blocks/RenderBlocks";
import ProductCard from "@/app/(session)/(frontend)/products/ProductCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartProvider } from "@/components/Cart/CartProviderComponent";


export default function SearchDrawer(props: {
    children: ReactNode,
    products: Product[]
}) {

    const { searchQuery, setSearchQuery, ...CartContext } = useContext(CartProvider);

    const [theFuse] = useState(() => new Fuse(props.products, {
        includeScore: true,
        threshold: 0.3,
        keys: ['name', 'description', 'details'],
    }));

    const [searchResults, setSearchResults] = useState<Product[] | null>(null);
    const [isBuffering, setIsBuffering] = useState(false);

    useEffect(() => {

        const timeout = setTimeout(() => {
            if (!searchQuery) {
                setSearchResults(null);
                return;
            }
            setSearchResults(theFuse.search(searchQuery).map(x => x.item));
            setIsBuffering(false);
        }, 250);

        return () => clearTimeout(timeout);
    }, [searchQuery, theFuse]);

    const handleSearchQuery = (target: string) => {
        setIsBuffering(true);
        setSearchQuery(target);
    };

    const [isSearchOpen, setIsSearchOpen] = useState(false);


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
                    <Drawer.DrawerTitle {...{
                        className: "sr-only"
                    }}>Search Drawer</Drawer.DrawerTitle>
                    <div className="flex flex-1 min-w-0" onClick={e => {
                        setIsSearchOpen(false);
                    }}>
                        <div className="flex w-full">

                        </div>
                    </div>
                    <div className="flex flex-col py-6 px-4 md:px-8 md:py-10 w-full h-screen gap-4 bg-white w-full max-w-[40rem] min-h-screen shadow-[-2px_2px_4px_rgba(0,0,0,0.08)]">
                        <div {...{
                            className: 'flex flex-col w-full h-full'
                        }}>
                            <div className="flex flex-col p-2 gap-8 w-full h-full">

                                <div {...{
                                    className: "group flex gap-4 items-center w-full h-fit",
                                }}>
                                    <SearchIcon {...{
                                        className: 'size-6'
                                    }} />
                                    <Input {...{
                                        className: "h-10 text-base",
                                        autoFocus: true,
                                        value: searchQuery ?? "",
                                        onChange: e => {
                                            handleSearchQuery(e.target.value)
                                        },
                                        onPointerDown: e => e.stopPropagation()
                                    }} />
                                    <Button {...{
                                        onClick: e => {
                                            setSearchQuery(null);
                                            setSearchResults(null)
                                        },
                                        variant: 'ghost',
                                        size: 'sm'
                                    }}>
                                        <XIcon /> Clear
                                    </Button>
                                </div>

                                <div className="flex flex-1 min-h-0 w-full">


                                    {(searchResults != null || isBuffering) && (
                                        <ScrollArea key={'searchResults'} {...{
                                            id: 'scroll-area',
                                            className: 'flex w-full h-full'
                                        }}>
                                            <div className="flex flex-col w-full h-fit">
                                                {isBuffering ? (
                                                    <div className="flex w-full h-full items-center justify-center">
                                                        <div
                                                            {...{
                                                                className:
                                                                    'h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black',
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="grid md:grid-cols-3 grid-cols-2 w-full h-fit">
                                                        {searchResults?.map(product => {

                                                            return (
                                                                <ProductCard
                                                                    key={product.id} {...{
                                                                        className: 'w-full md:w-full',
                                                                        product,

                                                                    }}
                                                                />
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                        </ScrollArea>
                                    )}

                                    {!searchResults && (
                                        <div className="flex flex-1 min-h-0 w-full">
                                            <div className="flex flex-col w-full h-fit">
                                                {props.children}
                                                {/* <div className='flex aspect-square w-full max-h-[30rem] bg-[#009487]'></div> */}

                                            </div>
                                        </div>
                                    )}



                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </Drawer.DrawerContent>
        </Drawer.Drawer>


    )

}