'use server'
import configPromise from '@payload-config'
import {
    getPayload,
} from 'payload'
import EmailRoot from '@/emails/components/EmailRoot';
import Letterhead from '@/emails/blocks/Letterhead/Component';
import { blockComponents, RenderEmailBlocks } from '@/emails/RenderEmailBlocks';
import { Column, render, Row } from '@react-email/components';
import { EMAIL_TEMPLATES, NodemailerEmailTransporter } from '@/collections/Emails/config';
import { ApplicationEventArgs } from '@/collections/Emails/triggers';
import { EMAILS_FROM, richTextToPlainText } from '@/collections/Emails';
import { headers } from 'next/headers';



export async function sendTestEmail({ email_id }: {
    email_id: string
}) {

    try {

        const payload = await getPayload({ config: configPromise });

        const { user } = await payload.auth({
           headers: await headers(),
         });

         if (!user) {
            throw Error("You must be signed in to use this method.")
         }
       

        const result = await payload.find({
            collection: 'emails',
            draft: true,
            limit: 1,
            depth: 2,
            pagination: false,
            overrideAccess: true,
            where: {
                id: {
                    equals: email_id
                }
            },
        })

        const theEmail = result.docs?.[0] || null;

        const variables = theEmail.variables;
        const Template = theEmail.template && theEmail.template != 'custom' ? EMAIL_TEMPLATES.find(x => x.value === theEmail.template) : null

        const Component = Template ? (
            <EmailRoot>
                {Template.Component && (
                    // @ts-ignore
                    <Template.Component
                        {...{
                            blocks: theEmail.blocks,
                            variables: theEmail.variables
                        }}
                    >
                        <div style={{ display: "block", width: "100%" }}>
                            {/* @ts-ignore */}
                            {theEmail.blocks.map((block, index) => {
                                const { blockType } = block

                                if (blockType && blockType in blockComponents) {
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
                {theEmail.blocks.map((block, index) => {
                    const { blockType } = block

                    if (blockType && blockType in blockComponents) {
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
        const theSubject = await richTextToPlainText(theEmail.subject?.root, variables)
        const theRecipients = await richTextToPlainText(theEmail.recipients?.root, variables)

        await NodemailerEmailTransporter.sendMail({
            from: EMAILS_FROM,
            to: [...theRecipients.split(',')],
            subject: theSubject,
            html: emailHtml,
        })

        return true;

    }
    catch (err) {
        console.log(err)
        return false;
    }

}