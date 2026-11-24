import RichText from '@/components/RichText'
import { Column, Row, Section } from '@react-email/components'
import type { EmailContentBlock as EmailContentBlockProps } from '@/payload-types'

export function EmailContentBlock(props: EmailContentBlockProps) {
  const { richText, variables } = props as any;

  console.count('Content: component entered')

  // Existing component logic

  console.count('Content: reaching return')

  return (
    <Section style={{ width: "100%" }}>
      <Row style={{ width: "100%" }}>
        <Column style={{ padding: "24px" }}>
          {richText && <RichText {...{
            data: richText,
            variables
          }}/>}
        </Column>
      </Row>
    </Section>
  )
}
