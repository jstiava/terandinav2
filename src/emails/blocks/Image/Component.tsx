'use server'
import { richTextToPlainText } from '@/components/Auth/SendInvite/actions'
import { EmailImageBlock as EmailImageBlockProps, Media } from '@/payload-types'
import { Button, Img, Row, Section } from '@react-email/components'

export default async function EmailImageBlock(props: EmailImageBlockProps) {
    try {
        const { image, props: elementProps } = props;

        const parsedElementProps =
            typeof elementProps === 'object' &&
                elementProps !== null &&
                !Array.isArray(elementProps)
                ? elementProps as any
                : {}


        return (
            <Img {...{
                src: (image as Media).url,
                ...JSON.parse(parsedElementProps)
            }} />
        )
    } catch (err) {
        return <p>Could not render.</p>
    }
}
