'use server'
import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'
import { Row, Section } from '@react-email/components'
import type { EmailContentBlock as EmailContentBlockProps } from '@/payload-types'

export async function EmailContentBlock(props : EmailContentBlockProps) {
  const { richText, variables } = props as any;

  return (
    <Section style={{
      width: "100%"
    }}>
      <Row style={{
        width: "calc(100% - 3rem)",
        margin: "1.5rem"
      }}>
        {richText && <RichText data={richText} enableGutter={false} variables={variables} />}
      </Row>
    </Section>
  )
}
