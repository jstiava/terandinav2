// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import { EmailBlockType } from '@/collections/Emails/config';
import { CheckoutDetailsType, ProductType } from '@/components/Cart/CartProviderComponent';
import EmailRoot from '@/emails/components/EmailRoot';
import { RenderEmailBlocks } from '@/emails/RenderEmailBlocks';
import OrderFulfillmentRequest from '@/emails/templates/OrderFulfillmentRequest';
import TextOnlyEmailTemplate from '@/emails/templates/TextOnlyEmailTemplate';
import { Tailwind } from '@react-email/tailwind';
import { Block } from 'payload';
import { ComponentProps } from 'react';
import { Rate } from 'shippo';


function TextOnlyEmailPreview(props: {
    variables: any,
    blocks: EmailBlockType[]
}) {

    return (

        <EmailRoot>
            {/* @ts-ignore */}
            <TextOnlyEmailTemplate {...props}>
                <RenderEmailBlocks {...{
                    blocks: props.blocks,
                    variables: props.variables
                }} />
            </TextOnlyEmailTemplate>
        </EmailRoot>
    )
};

TextOnlyEmailPreview.PreviewProps = {
    blocks: [],
    variables: { }
} satisfies ComponentProps<typeof TextOnlyEmailPreview>;

export default TextOnlyEmailPreview;
