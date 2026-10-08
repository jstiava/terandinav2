import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'
export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { richText, className } = props


  return (
    <>
      {richText && <RichText {...{
        data: richText,
        enableGutter: false,
        className: cn(
          'w-[90vw] max-w-[80rem] mx-auto py-[1rem] lg:py-[2rem]',
          className ?? ""
        )
      }} />}
    </>
  )
}
