import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { Media, MediaBlock as MediaBlockProps } from '@/payload-types'

export const MediaBlock: React.FC<MediaBlockProps> = (props) => {

  if (props.type == 'video') {

    return (
      <div className={cn(
        "flex flex-col w-full h-fit",
        props.className
      )}>
        {props.media && (
          <div className="flex flex-1">
            <div
              className={cn('rounded-[0.5rem] bg-cover bg-center bg-no-repeat w-full h-10')}
              style={{
                backgroundImage: `url("${(props.media as Media).url}")`,
                ...(props.compiledStyles && ((props.compiledStyles as any)?.inline as React.CSSProperties)),
              }}
            />
            <video {...{
              autoPlay: true,
              muted: true,
              loop: true,
              playsInline: true,
              preload: 'auto',
              poster: (props.coverImage as Media).url ?? ''
            }}
            >
              <source {...{
                src: (props.video as Media).url ?? '',
              }} />
            </video>
          </div>
        )}
        {props.richText && (
          <RichText data={props.richText} enableGutter={false} />
        )}
        {/* <p className="debug">{JSON.stringify(media, null, 2)}</p> */}
        {props.compiledStyles && (props.compiledStyles as any).scoped && (
          <style>{(props.compiledStyles as any).scoped}</style>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-col w-full h-fit",
      props.className
    )}>
      {props.media && (
        <div className="flex flex-1">
          <div
            className={cn('rounded-[0.5rem] bg-cover bg-center bg-no-repeat w-full h-10')}
            style={{
              backgroundImage: `url("${(props.media as Media).url}")`,
              ...(props.compiledStyles && ((props.compiledStyles as any)?.inline as React.CSSProperties)),
            }}
          />
        </div>
      )}
      {props.richText && (
        <RichText data={props.richText} enableGutter={false} />
      )}
      {/* <p className="debug">{JSON.stringify(media, null, 2)}</p> */}
      {props.compiledStyles && (props.compiledStyles as any).scoped && (
        <style>{(props.compiledStyles as any).scoped}</style>
      )}
    </div>
  )
}
