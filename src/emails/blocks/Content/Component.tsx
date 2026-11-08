import RichText from '@/components/RichText'
import { Row, Section } from '@react-email/components'
import type { EmailContentBlock as EmailContentBlockProps } from '@/payload-types'

export function EmailContentBlock(props : EmailContentBlockProps) {
  const { richText, variables } = props as any;

  console.count('Content: component entered')

  // Existing component logic

  console.count('Content: reaching return')

  return (
    <Section style={{
      width: "100%"
    }}>
      <Row style={{
        width: "calc(100% - 3rem)",
        margin: "1.5rem"
      }}>
        {richText && <RichText data={richText} />}
      </Row>
    </Section>
  )
}
