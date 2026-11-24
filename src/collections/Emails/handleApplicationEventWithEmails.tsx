'use server'

import configPromise from '@payload-config'
import {
    getPayload,
} from 'payload'
import EmailRoot from '@/emails/components/EmailRoot';
import { blockComponents, RenderEmailBlocks } from '@/emails/RenderEmailBlocks';
import { render } from '@react-email/components';
import { EMAIL_TEMPLATES, NodemailerEmailTransporter } from '@/collections/Emails/config';
import { ApplicationEventArgs } from '@/collections/Emails/triggers';
import { EMAILS_FROM, richTextToPlainText } from '@/collections/Emails';
import Letterhead from '@/emails/blocks/Letterhead/Component';

export async function handleApplicationEventWithEmails(props: ApplicationEventArgs) {

    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
        collection: 'emails',
        draft: false,
        depth: 2,
        pagination: false,
        where: {
            and: [
                { "action.type": { equals: "byAction" } },
                { "action.trigger": { equals: props.event } }
            ]
        }
    });

    console.dir({ message: "Ready to send the following emails", emails: result.docs.map(x => x.title, props) }, { depth: null });

    for (const email of result.docs) {

        try {
            const variables = props.variables;
            const Template = email.template && email.template != 'custom' ? EMAIL_TEMPLATES.find(x => x.value === email.template) : null

            const Component = Template ? (
                <EmailRoot>
                    {Template.Component && (
                        // @ts-ignore
                        <Template.Component
                            {...{
                                blocks: email.blocks,
                                variables: email.variables
                            }}
                        >
                            <div style={{ display: "block", width: "100%" }}>
                                {/* @ts-ignore */}
                                {email.blocks.map((block, index) => {
                                    const { blockType } = block

                                    if (blockType && blockType in blockComponents) {
                                        // @ts-ignore
                                        const Block = blockComponents[blockType]

                                        if (Block) {
                                            // @ts-ignore
                                            return <Block key={`${index}_${block.blockName ?? 'no_id'}`} {...{ variables, ...block }} />
                                        }
                                    }

                                    return null
                                })}
                            </div>
                        </Template.Component>
                    )}
                </EmailRoot>
            ) : (
                <EmailRoot noTailwind>
                    <Letterhead
                        src="https://terandina.com/Terandina_clear.png"
                        imageProps={{
                            width: 80,
                            height: 60,
                            style: { display: "block", margin: "0 auto" }
                        }}
                    />
                    {/* @ts-ignore */}
                    {email.blocks.map((block, index) => {
                        const { blockType } = block

                        if (blockType && blockType in blockComponents) {
                            // @ts-ignore
                            const Block = blockComponents[blockType]

                            if (Block) {
                                return (
                                    <Block
                                        // @ts-ignore
                                        key={`${index}_${block.blockName ?? 'no_id'}`}
                                        {...{ variables, ...block }}
                                    />
                                )
                            }
                        }

                        return null
                    })}
                </EmailRoot>
            )

            const emailHtml = await render(Component)
            const theSubject = await richTextToPlainText(email.subject?.root, props.variables)
            const theRecipients = await richTextToPlainText(email.recipients?.root, props.variables)

            const info = await NodemailerEmailTransporter.sendMail({
                from: EMAILS_FROM,
                to: [...theRecipients.split(',')],
                subject: theSubject,
                html: emailHtml,
            });

            console.dir({ message: "Email sent successfully", info }, { depth: null });
        }
        catch (err) {
            console.log({
                message: "Could not send an email",
                err
            });
        }

    }

    return true;
}
