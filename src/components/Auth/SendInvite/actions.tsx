'use server'
import Letterhead from '@/emails/blocks/Letterhead/Component'
import EmailRoot from '@/emails/components/EmailRoot'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import {
  render,
} from '@react-email/components'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import React, { cache } from 'react'
import { RenderEmailBlocks } from '@/emails/RenderEmailBlocks'
import nodemailer from 'nodemailer'

const ses = new SESv2Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SES_SECRET_KEY!,
  },
})

export async function handleInvite({
  user,
  recipient,
}: {
  user: {
    name: string
    email: string
  }
  recipient: {
    email: string
  }
}) {

  const payload = await getPayload({ config: configPromise })
  const transporter = nodemailer.createTransport({
    streamTransport: true, // <-- generates raw data only
    buffer: true, // <-- keeps raw in memory
    newline: 'unix',
  })

  const emails = await getEmailsTriggeredByInvite()
  console.log(emails)


  const newUser = await payload.create({
    collection: 'users',
    data: {
      name: recipient.email,
      email: recipient.email,
      username: recipient.email,
      password: process.env.TEMP_USER_PASSWORD,
    } as any,
  })

  const result = await payload.forgotPassword({
    collection: 'users',
    data: {
      email: recipient.email,
    },
    disableEmail: true,
  })

  const variables: Record<string, string | number> = {
    'from.first_name': user.name,
    'from.name': user.name,
    'from.email_address': user.email,
    'recipient.email_address': recipient.email,
    'password_reset_token': result
  }



  for (const email of emails) {
    const Component = (
      <EmailRoot>
        <Letterhead src="https://chicago-hope-academy-website.vercel.app/media/cha_letterhead_white.png" />
        {email.blocks && <RenderEmailBlocks blocks={email.blocks} variables={variables} />}
      </EmailRoot>
    )
    const emailHtml = await render(Component)

    console.log(emailHtml)

    const theSubject = await richTextToPlainText(email.subject?.root, variables)

    console.log({
      subject: theSubject,
    })
    const theRecipients = await richTextToPlainText(email.recipients?.root, variables)

    console.log({
      recipients: theRecipients,
    })

    const info = await transporter.sendMail({
      from: 'Chicago Hope Academy <no-reply@terandina.com>',
      to: [...theRecipients.split(',')],
      subject: theSubject,
      html: emailHtml
    })

    await ses.send(
      new SendEmailCommand({
        Content: {
          Raw: {
            Data: info.message as any,
          },
        },
      }),
    )
  }

  return
}

const getEmailsTriggeredByInvite = cache(async () => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'emails',
    draft,
    limit: 10,
    pagination: false,
    overrideAccess: draft,
    where: {
      'action.trigger': {
        equals: 'iam:invite',
      },
    },
  })

  return result.docs
})

export async function richTextToPlainText(
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
