

// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import { EmailBlockType } from '@/collections/Emails/config';
import { blockComponents } from '@/emails/RenderEmailBlocks';
import {
    Container,
} from '@react-email/components';


function BlankTemplate(props: {
    variables: any,
    children: any
}) {

    return (
        <Container className="my-[10px] mx-auto w-[650px] max-w-full border border-[#E5E5E5]">
            {props.children}
        </Container>
    )
};

export default BlankTemplate;
