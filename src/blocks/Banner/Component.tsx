'use server'
import RichText from '@/components/RichText';
import { Media, RowBlock as RowBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn';

export default async function BannerBlock({ slides, ...rest }: RowBlockProps) {

    if (!slides) {
        return null;
    }

    return (
        <div className="flex flex-col sm:flex-row w-full">
            {slides.map(slide => {
                return (
                    <div
                        key={slide.id}
                        {...{
                            className: "flex w-[calc(100%/${slides.length})] sm:w-full items-end justify-start aspect-square bg-cover bg-center bg-no-repeat h-fit",
                            style: {
                                backgroundImage: slide.image && `url("${(slide.image as Media).url}")`,
                            }
                        }}
                    >
                        {slide.richText && <RichText data={slide.richText} enableGutter={false} className={cn(
                            "flex flex-col gap-4 p-6",
                            slide.className
                        )} />}
                    </div>
                )
            })}
        </div>
    )
}