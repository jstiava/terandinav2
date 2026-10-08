'use client'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CarouselBlock as CarouselBlockProps, Media } from '@/payload-types'
import * as Carousel from '@/components/ui/carousel'
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from '@/utilities/cn'
import RichText from '@/components/RichText'

export default function CarouselBlockClient({
  slides,
  children,
}: {
  slides: CarouselBlockProps['slides']
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

  if (!slides) {
    return null;
  }

  return (
    <Carousel.Carousel {...{
      className: 'w-full',
      orientation: 'horizontal',
      setApi
    }}>
      {slides && slides.length > 1 && (
        <>
          <div className="z-2 absolute flex bottom-1  items-center gap-2 w-full justify-end p-4 px-6">
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
                disabled: slides.length == current + 1,
                className: "p-0 size-10 h-fit aspect-square bg-white text-black border-2 hover:bg-white/75",
                onClick: e => {
                  api?.scrollNext();
                }
              }}>
                <ChevronRight />
              </Button>
            </div>
          </div>

          <div className="z-2 absolute bottom-0 left-0 flex w-full gap-0 items-center">
            {slides.map((slide, index) => {

              return (
                <Button
                  key={slide.id}
                  {...{
                    variant: "custom",
                    className: cn('p-0 h-[4px] rounded-none', index == current ? 'bg-white' : 'bg-transparent'),
                    onClick: e => {
                      api?.scrollTo(index)
                    },
                    style: {
                      width: `calc(100% / ${slides.length})`
                    }
                  }}
                />
              )

            })}
          </div>
        </>
      )}

      {/* Slides */}
      <Carousel.CarouselContent {...{
        className: 'w-full  ml-0'
      }}>
        {slides.map(slide => {

          return (
            <Carousel.CarouselItem key={slide.id} {...{
              className: cn(
                "flex items-end justify-center w-full bg-border w-full p-0",
                "aspect-[9/16] h-fit max-h-[90dvh]",
                "bg-cover bg-center bg-no-repeat"
              ),
              style: {
                backgroundImage: slide.image && `url("${(slide.image as Media).url}")`
              }
            }}>

              <div {...{
                className: cn(
                  "z-[3] flex items-end w-full h-full  p-4",
                ),

              }}>
                {slide.richText && <RichText data={slide.richText} enableGutter={false} className={cn(
                  "flex flex-col gap-4 p-4",
                  slides.length > 1 ? 'mb-8' : 'mb-0',
                  slide.className
                )} />}
              </div>

              <div {...{
                className: "-z-1 w-full h-full absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_82%,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.2)_35%,transparent_75%)]",
              }} />

            </Carousel.CarouselItem>
          )
        })}
      </Carousel.CarouselContent>
    </Carousel.Carousel>
  )
}
