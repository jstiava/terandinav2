'use client'

import { ReactNode, useContext, useEffect, useState } from "react"
import * as Drawer from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronDownIcon, ChevronUpIcon, FilterIcon, SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Category, Header, Product } from "@/payload-types";
import Fuse from 'fuse.js';
import { RenderBlocks } from "@/blocks/RenderBlocks";
import ProductCard from "@/app/(session)/(frontend)/products/ProductCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartProvider } from "@/components/Cart/CartProviderComponent";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useRouter } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { DropdownMenuGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";



const SORT_OPTIONS = [
    { label: "A-Z", value: "a-z" },
    { label: "Latest selection", value: "latest" }
]

export default function SearchDrawer(props: {
    children: ReactNode,
    products: Product[],
    categories: Category[]
}) {

    const router = useRouter();
    const { searchQuery, setSearchQuery, ...CartContext } = useContext(CartProvider);

    const [theFuse] = useState(() => new Fuse(props.products, {
        includeScore: true,
        threshold: 0.3,
        ignoreLocation: true,
        keys: ['name'],
    }));

    const [searchResults, setSearchResults] = useState<Product[] | null>(null);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isSortsFiltersOpen, setIsSortsFiltersOpen] = useState(true)

    useEffect(() => {

        const timeout = setTimeout(() => {

            if (
                !searchQuery || (
                    (!searchQuery.query || searchQuery.query == "")
                    && (!searchQuery.categories || searchQuery.categories.length == 0)
                    && (!searchQuery.sortBy)
                )
            ) {
                setSearchResults(null);
                return;
            }

            const results = searchQuery.query && searchQuery.query.length > 0 ? theFuse.search(searchQuery.query).map(x => x.item) : props.products;
            let final: Product[] = results;

            if (searchQuery.categories && searchQuery.categories.length > 0) {
                const filtered = results.filter(x => {
                    const cats = (x.categories as any[]).map(y => y.id);
                    return searchQuery.categories?.some(x => cats.includes(x))
                });
                console.log({
                    results,
                    filtered
                })
                final = [...filtered];
            }

            if (searchQuery.sortBy) {
                if (searchQuery.sortBy == 'latest') {
                    final = final.sort((a, b) => new Date(b.releaseDate ?? new Date()).getTime() - new Date(b.releaseDate ?? new Date()).getTime())
                }
                else if (searchQuery.sortBy == 'a-z') {
                    final = final.sort((a, b) => a.name.localeCompare(b.name))
                }
            }

            setSearchResults(final)
            setIsBuffering(false);

        }, 500);

        return () => clearTimeout(timeout);

    }, [searchQuery, theFuse]);

    const handleSearchQuery = (target: string) => {
        setIsBuffering(true);
        setSearchQuery(prev => ({
            ...prev,
            query: target
        }));
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
                            <div className="relative flex flex-col px-2 gap-4 w-full h-full">

                                <div className="z-[100] absolute bg-transparent top-0 flex flex-col gap-2 h-fit w-full pointer-events-none">


                                    <div {...{
                                        className: "-z-[1] absolute inset-0 w-full h-full",
                                        style: {
                                            background: `linear-gradient(to bottom, #fff 0%, #fff 25%, rgba(255,255,255,0.95) 45%, rgba(255,255,255,0.65) 70%, transparent 100%)`
                                        }
                                    }} />

                                    <div {...{
                                        className: "group flex gap-4 items-center w-full h-fit pr-4",
                                    }}>

                                        <InputGroup {...{
                                            className: "h-12 pointer-events-auto",
                                        }}>
                                            <InputGroupAddon {...{
                                                align: 'inline-start'
                                            }}>
                                                <SearchIcon {...{
                                                    className: 'size-4'
                                                }} />
                                            </InputGroupAddon>
                                            <InputGroupAddon {...{
                                                align: 'inline-end'
                                            }}>
                                                <Button {...{
                                                    onClick: e => {
                                                        setSearchQuery(null);
                                                        setSearchResults(null)
                                                    },
                                                    variant: 'ghost',
                                                    size: 'sm',
                                                    disabled: !searchQuery || !searchQuery.query || searchQuery.query.length == 0
                                                }}>
                                                    Clear
                                                </Button>
                                            </InputGroupAddon>
                                            <InputGroupInput {...{
                                                className: "text-base",
                                                autoFocus: true,
                                                value: searchQuery?.query ?? "",
                                                onChange: e => {
                                                    handleSearchQuery(e.target.value)
                                                },
                                                onPointerDown: e => e.stopPropagation()
                                            }} />
                                        </InputGroup>
                                        <Button {...{
                                            onClick: e => {
                                                setIsSearchOpen(false);
                                            },
                                            variant: 'ghost',
                                            size: 'sm',
                                            className: 'pointer-events-auto'
                                        }}>
                                            <XIcon /> Close
                                        </Button>


                                    </div>

                                    <Collapsible {...{
                                        open: isSortsFiltersOpen,
                                        onOpenChange: open => setIsSortsFiltersOpen(open)
                                    }}>
                                        <CollapsibleContent className="flex items-center w-full gap-1 flex-wrap pointer-events-auto">

                                            <DropdownMenu.DropdownMenu>
                                                <DropdownMenu.DropdownMenuTrigger>
                                                    <Button {...{
                                                        variant: 'outline',
                                                        className: "rounded-full  mb-1"
                                                    }}>{searchQuery && searchQuery.sortBy ? `${SORT_OPTIONS.find(x => x.value == searchQuery.sortBy)?.label ?? "Sort by*"}` : 'Sort by'} <ChevronDownIcon /></Button>
                                                </DropdownMenu.DropdownMenuTrigger>
                                                <DropdownMenu.DropdownMenuContent align="start">
                                                    <DropdownMenu.DropdownMenuRadioGroup {...{
                                                        value: searchQuery?.sortBy ?? "",
                                                        onValueChange: (value) => {
                                                            setSearchQuery(prev => {
                                                                if (!prev) {
                                                                    return { sortBy: value }
                                                                }
                                                                return { ...prev, sortBy: value }
                                                            })
                                                        }
                                                    }}>

                                                        {SORT_OPTIONS.map(option => {
                                                            return (
                                                                <DropdownMenuRadioItem
                                                                    key={option.value}
                                                                    {...{
                                                                        value: option.value
                                                                    }}
                                                                >{option.label}</DropdownMenuRadioItem>
                                                            )
                                                        })}
                                                    </DropdownMenu.DropdownMenuRadioGroup>
                                                </DropdownMenu.DropdownMenuContent>
                                            </DropdownMenu.DropdownMenu>

                                            {props.categories?.map(category => {

                                                const checked = searchQuery?.categories?.includes(category.id) ?? false;

                                                if (!checked) {
                                                    return false;
                                                }

                                                return (
                                                    <Toggle
                                                        key={category.id}
                                                        {...{
                                                            variant: 'outline',
                                                            className: "rounded-full mb-1",
                                                            pressed: true,
                                                            onPressedChange: pressed => {
                                                                setSearchQuery(prev => {
                                                                    const categories = new Set(prev?.categories ?? [])

                                                                    if (pressed) {
                                                                        categories.add(category.id)
                                                                    } else {
                                                                        categories.delete(category.id)
                                                                    }

                                                                    return {
                                                                        ...prev,
                                                                        categories: [...categories]
                                                                    }
                                                                })
                                                            }
                                                        }}>{category.title} <XIcon /></Toggle>
                                                )
                                            })}

                                            {props.categories && props.categories.length > 0 && (
                                                <DropdownMenu.DropdownMenu>
                                                    <DropdownMenu.DropdownMenuTrigger>
                                                        <Button {...{
                                                            variant: 'outline',
                                                            className: "rounded-full  mb-1"
                                                        }}>Categories <ChevronDownIcon /></Button>
                                                    </DropdownMenu.DropdownMenuTrigger>
                                                    <DropdownMenu.DropdownMenuContent align="start">
                                                        <FieldGroup className="flex flex-col max-w-screen w-[15rem] p-2 gap-0">
                                                            {props.categories.map(category => {

                                                                const checked = searchQuery?.categories?.includes(category.id) ?? false;

                                                                if (checked) {
                                                                    return false;
                                                                }

                                                                return (

                                                                    <Field key={category.id} orientation="horizontal" className="h-8">
                                                                        <Checkbox
                                                                            {...{
                                                                                id: category.id,
                                                                                name: category.title,
                                                                                checked,
                                                                                onCheckedChange: checked => {
                                                                                    setSearchQuery(prev => {
                                                                                        const categories = new Set(prev?.categories ?? [])

                                                                                        if (checked) {
                                                                                            categories.add(category.id)
                                                                                        } else {
                                                                                            categories.delete(category.id)
                                                                                        }

                                                                                        return {
                                                                                            ...prev,
                                                                                            categories: [...categories]
                                                                                        }
                                                                                    })
                                                                                }
                                                                            }}
                                                                        />
                                                                        <Label htmlFor={category.id}>{category.title}</Label>
                                                                    </Field>
                                                                )
                                                            })}
                                                        </FieldGroup>
                                                    </DropdownMenu.DropdownMenuContent>
                                                </DropdownMenu.DropdownMenu>
                                            )}




                                        </CollapsibleContent>
                                        <CollapsibleTrigger>
                                            <Button {...{
                                                variant: 'outline',
                                                className: "rounded-full mb-1 pointer-events-auto"
                                            }}>{isSortsFiltersOpen ? <>Hide <ChevronUpIcon /></> : <><SlidersHorizontalIcon /> Filters</>}</Button>
                                        </CollapsibleTrigger>
                                    </Collapsible>
                                </div>

                                <div className="flex flex-1 min-h-0 w-full">

                                    {(
                                        (searchResults && searchResults.length > 0)
                                    ) ? (
                                        <ScrollArea key={'searchResults'} {...{
                                            id: 'scroll-area',
                                            className: 'flex w-full h-full'
                                        }}>
                                            <div className="flex flex-col w-full h-fit pb-20  pt-[9rem]">
                                                {isBuffering ? (
                                                    <div key={"buffering"} className="flex w-full max-h-full h-[10rem] items-center justify-center">
                                                        <div
                                                            {...{
                                                                className:
                                                                    'h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black',
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div key={"not_buffering"} className="grid md:grid-cols-3 grid-cols-2 w-full h-fit">
                                                        {searchResults?.map(product => {

                                                            return (
                                                                <ProductCard
                                                                    key={product.id} {...{
                                                                        className: 'w-full md:w-full',
                                                                        product,
                                                                        disabledTitleIndent: true
                                                                    }}
                                                                />
                                                            )
                                                        })}
                                                    </div>
                                                )}

                                                <Button {...{
                                                    variant: 'outline',
                                                    onClick: e => {
                                                        setSearchQuery(prev => {
                                                            if (!prev) return null;
                                                            return {
                                                                query: prev.query ?? ""
                                                            }
                                                        });
                                                    }
                                                }}>Clear all filters</Button>
                                            </div>
                                        </ScrollArea>
                                    ) : (
                                        <>

                                            {(
                                                searchQuery &&
                                                (
                                                    (searchQuery.query && searchQuery.query.length > 0)
                                                    || (searchQuery.categories && searchQuery.categories.length > 0)
                                                    || (searchQuery.sortBy)
                                                )
                                            ) ? (
                                                <>
                                                    {isBuffering ? (
                                                        <div className="flex w-full h-[4rem] items-center justify-center">
                                                            <div
                                                                {...{
                                                                    className:
                                                                        'h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black',
                                                                }}
                                                            />
                                                        </div>
                                                    ) : <span className="text-xs flex w-full justify-center items-center py-10">No results</span>}
                                                </>
                                            ) : (
                                                <ScrollArea key={'searchResults_placehodler'} {...{
                                                    id: 'scroll-area-no-search',
                                                    className: 'flex w-full h-full min-w-0 '
                                                }}>
                                                    <div className="flex flex-1 min-h-0 w-full pt-[9rem]">
                                                        <div className="flex flex-col w-full h-fit">
                                                            {props.children}
                                                            {/* <div className='flex aspect-square w-full max-h-[30rem] bg-[#009487]'></div> */}
                                                        </div>
                                                    </div>
                                                </ScrollArea>
                                            )}

                                        </>
                                    )}
                                </div>


                                <div className="flex flex-col w-full p-4">

                                    <p className="debug">{JSON.stringify(searchQuery, null, 2)}</p>
                                    <Button {...{
                                        size: 'lg',
                                        className: 'w-full',
                                        onClick: e => {
                                            router.push('/products')
                                        }
                                    }}>
                                        See All Products
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </Drawer.DrawerContent>
        </Drawer.Drawer >


    )

}