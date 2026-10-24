'use server'
import configPromise from '@payload-config'
import {
    getPayload,
} from 'payload'
import EmailRoot from '@/emails/components/EmailRoot';
import Letterhead from '@/emails/blocks/Letterhead/Component';
import { RenderEmailBlocks } from '@/emails/RenderEmailBlocks';
import { render } from '@react-email/components';
import { EMAIL_TEMPLATES, NodemailerEmailTransporter } from '@/collections/Emails/config';
import { ApplicationEventArgs } from '@/collections/Emails/triggers';


const EMAILS_FROM = 'Terandina LLC <no-reply@terandina.com>'
/**
 * Record events, sends emails
 * @returns 
 */
export async function handleApplicationEventWithEmails(props: ApplicationEventArgs) {

    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
        collection: 'emails',
        draft: false,
        depth: 2,
        pagination: false,
        overrideAccess: true,
        where: {
            and: [
                { action: { equals: "byAction" } },
                { trigger: { equals: props.event } }
            ]
        },
    })

    for (const email of result.docs) {

        const Component = (
            <EmailRoot>
                {email.blocks && <RenderEmailBlocks blocks={email.blocks} variables={props.variables} />}
            </EmailRoot>
        )

        const emailHtml = await render(Component)
        const theSubject = await richTextToPlainText(email.subject?.root, props.variables)
        const theRecipients = await richTextToPlainText(email.recipients?.root, props.variables)

        await NodemailerEmailTransporter.sendMail({
            from: EMAILS_FROM,
            to: [...theRecipients.split(',')],
            subject: theSubject,
            html: emailHtml,
        })

        return true;
    }

    return true;
}




export async function sendTestEmail({ email_id }: {
    email_id: string
}) {

    try {

        const payload = await getPayload({ config: configPromise });

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


        const variables = {};
        const Template = theEmail.template && theEmail.template != 'custom' ? EMAIL_TEMPLATES.find(x => x.value === theEmail.template) : null

        const Component = Template ? (
            <EmailRoot>
                {Template.Component && (
                    // @ts-ignore
                    <Template.Component
                        {...{
                            blocks: theEmail.blocks,
                            variables: Template.variables,
                        }}
                    />
                )}
            </EmailRoot>
        ) : (
            <EmailRoot>
                <Letterhead
                    src="https://terandina.com/Terandina_clear.png"
                    imageProps={{
                        width: 80,
                        height: 60,
                        style: { display: "block", margin: "0 auto" }
                    }}
                />
                {theEmail.blocks && <RenderEmailBlocks blocks={theEmail.blocks} variables={variables} />}
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



async function richTextToPlainText(
    doc:
        | {
            type: string
            children: {
                type: any
                version: number
                [k: string]: unknown
            }[]
            direction: ('ltr' | 'rtl') | null
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
            indent: number
            version: number
        }
        | undefined,
    variables?: Record<string, any>,
): Promise<string> {
    if (!doc) return ''

    let output = ''

    const walk = (nodes: any[]) => {
        if (!nodes) return
        for (const n of nodes) {
            if (n.type === 'text') {
                // text node
                output += n.text
            } else if (n.type === 'variable' && variables) {
                const selected = n.selected
                const theVariable = variables[selected.value]
                output += `${theVariable}`
            }

            if (n.children) {
                // walk deeper
                walk(n.children)
            }
        }
    }

    walk(Array.isArray(doc) ? doc : doc.children)

    return output.trim()
}
