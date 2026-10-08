'use server'
import CarouselBlockClient from './Component.client'
import { CarouselBlock as CarouselBlockProps } from '@/payload-types'

export default async function CarouselBlock({ slides, ...rest }: CarouselBlockProps) {


  return (
    <div className="relative items-center justify-center flex flex-col w-full h-fit">
      <CarouselBlockClient {...{
        slides
      }} />
    </div>
  )
}
