import { EmailImageBlock as EmailImageBlockProps, Media } from '@/payload-types'
import { Img } from '@react-email/components';

export default function EmailImageBlock(props: EmailImageBlockProps) {

    console.log("Email image block...")
    const { image, props: elementProps } = props;

    return (
        // @ts-ignore
        // eslint-disable-next-line @next/next/no-img-element
        <Img
            {...{
                id: "",
                alt: "",
                src: `${'https://terandina.com'}${(image as Media).url}`,
                className: 'aspect-square',
                style: {
                    display: 'block',
                    width: "100%",
                    height: "h-fit",
                    outline: 'none',
                    border: 'none',
                    textDecoration: 'none',
                },
            }}
        />
    )
}
