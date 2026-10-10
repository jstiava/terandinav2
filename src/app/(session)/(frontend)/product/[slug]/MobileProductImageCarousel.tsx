'use client'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Media, Product } from '@/payload-types'
import * as Carousel from '@/components/ui/carousel'
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from '@/utilities/cn'
import RichText from '@/components/RichText'

export default function MobileProductImageCarousel({
    images,
    children,
}: {
    images: Product['images']
    children?: any
}) {

    const [api, setApi] = useState<Carousel.CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    if (!images) {
        return null;
    }

    return (
        <Carousel.Carousel {...{
            className: 'w-full',
            orientation: 'horizontal',
            setApi
        }}>
            <div className="z-[3] absolute flex bottom-1  items-center gap-2 w-full justify-end p-4 px-6">


                <div className="flex items-center gap-2 w-fit ">
                    <Button {...{
                        variant: "custom",
                        disabled: current == 0,
                        className: "p-0 size-10 h-fit aspect-square bg-white text-black border-2 hover:bg-white/75",
                        onClick: e => {
                            api?.scrollPrev();
                        }
                    }}>
                        <ChevronLeft />
                    </Button>

                    <Button {...{
                        variant: "custom",
                        disabled: images.length == current + 1,
                        className: "p-0 size-10 h-fit aspect-square bg-white text-black border-2 hover:bg-white/75",
                        onClick: e => {
                            api?.scrollNext();
                        }
                    }}>
                        <ChevronRight />
                    </Button>

                </div>
            </div>

            <div className="z-[4] absolute bottom-0 left-0 flex w-full gap-0 items-center">
                {images.map((image, index) => {

                    return (
                        <Button
                            key={image.id}
                            {...{
                                variant: "custom",
                                className: cn('p-0 h-[4px] rounded-none', index == current ? 'bg-white' : 'bg-transparent'),
                                onClick: e => {
                                    api?.scrollTo(index)
                                },
                                style: {
                                    width: `calc(100% / ${images.length})`
                                }
                            }}
                        />
                    )

                })}
            </div>

            {/* Slides */}
            <Carousel.CarouselContent {...{
                className: 'w-full  ml-0'
            }}>
                {images.map(image => {

                    return (
                        <Carousel.CarouselItem key={image.id} {...{
                            className: cn(
                                "w-full bg-border w-full p-0",
                                "aspect-square h-fit max-h-[90dvh]"
                            )
                        }}>
                            <div {...{
                                className: cn(
                                    "flex items-end w-full h-full  p-4",
                                    "bg-cover bg-center bg-no-repeat"
                                ),
                                style: {
                                    backgroundImage: image.image && `url("${(image.image as Media).url}")`
                                }
                            }}>
                                {/* {slide.richText && <RichText data={slide.richText} enableGutter={false} className={cn(
                  "flex flex-col gap-4 mb-8 p-4",
                  slide.className
                )} />} */}
                            </div>
                        </Carousel.CarouselItem>
                    )
                })}
            </Carousel.CarouselContent>
        </Carousel.Carousel>
    )
}
