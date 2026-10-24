import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { Media, MediaBlock as MediaBlockProps } from '@/payload-types'

export const MediaBlock: React.FC<MediaBlockProps> = (props) => {
  const {
    className,
    media,
    compiledStyles,
    richText
  } = props

  return (
    <div className={cn(
      "flex flex-col w-full h-fit",
      className
    )}>
      {media && (
        <div className="flex flex-1">
          <div
            className={cn('rounded-[0.5rem] bg-cover bg-center bg-no-repeat w-full h-10')}
            style={{
              backgroundImage: `url("${(media as Media).url}")`,
              ...(compiledStyles && ((compiledStyles as any)?.inline as React.CSSProperties)),
            }}
          />
        </div>
      )}
      {richText && (
        <RichText data={richText} enableGutter={false} />
      )}
      {/* <p className="debug">{JSON.stringify(media, null, 2)}</p> */}
      {compiledStyles && (compiledStyles as any).scoped && (
        <style>{(compiledStyles as any).scoped}</style>
      )}
    </div>
  )
}
