'use server'

import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2';
import configPromise from '@payload-config'
import {
    getPayload,
    RequiredDataFromCollection,
} from 'payload'
import nodemailer from 'nodemailer'
import EmailRoot from '@/emails/components/EmailRoot';
import Letterhead from '@/emails/blocks/Letterhead/Component';
import { RenderEmailBlocks } from '@/emails/RenderEmailBlocks';
import { render } from '@react-email/components';

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

        const sesClient = new SESv2Client({
            region: process.env.AWS_SES_REGION ?? 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_SES_ACCESS_KEY!,
                secretAccessKey: process.env.AWS_SES_SECRET_KEY!,
            },
        })

        const transporter = nodemailer.createTransport({
            SES: {
                sesClient,
                SendEmailCommand,
            },
        })

        const variables = {};

        const Component = (
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

        await transporter.sendMail({
            from: 'Terandina LLC <no-reply@terandina.com>',
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
    variables: Record<string, any>,
): Promise<string> {
    if (!doc) return ''

    let output = ''

    const walk = (nodes: any[]) => {
        if (!nodes) return
        for (const n of nodes) {
            if (n.type === 'text') {
                // text node
                output += n.text
            } else if (n.type === 'variable') {
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
