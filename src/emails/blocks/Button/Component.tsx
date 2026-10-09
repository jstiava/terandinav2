'use server'
import { richTextToPlainText } from '@/components/Auth/SendInvite/actions'
import { EmailButtonBlock as EmailButtonBlockProps } from '@/payload-types'
import { Button, Row } from '@react-email/components'

export default async function EmailButtonBlock(props: EmailButtonBlockProps) {
  try {
    const { label, url, variables } = props as any

    const theLabel = await richTextToPlainText(label.root, variables)
    const theLink = await richTextToPlainText(url.root, variables)

    return (
      <Row
        style={{
          width: '100%',
        }}
      >
        <Button
          href={theLink}
          style={{
            width: '100%',
            padding: '1rem 0',
            backgroundColor: '#093162',
            fontFamily: 'Helvetica',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            color: 'white',
            textAlign: 'center',
            borderRadius: '0.5rem',
            fontSize: '1.125rem',
          }}
        >
          {theLabel}
        </Button>
      </Row>
    )
  } catch (err) {
    return <p>Could not render.</p>
  }
}
