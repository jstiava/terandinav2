import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
// import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
} from '@payloadcms/plugin-seo/fields'
import { generateSlug } from '@/utilities/generateSlug'
import { EmailContent } from '@/emails/blocks/Content/config'
import { FixedToolbarFeature, lexicalEditor, ParagraphFeature } from '@payloadcms/richtext-lexical'
import { RelationshipFeature } from '@/features/relationship-feature/server'
import { EmailButton } from '@/emails/blocks/Button/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { EmailImage } from '@/emails/blocks/Image/config'
import { ACTION_TRIGGERS_WITH_VARIABLES } from '@/collections/Emails/triggers'
import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2'
import nodemailer from 'nodemailer' 
import OrderFulfillmentRequest from '@/emails/templates/OrderFulfillmentRequest'
import OrderFulfillmentRequestPreview from '@/emails/preview/OrderFulfillmentRequestPreview'
import { EmailButtonBlock, EmailContentBlock, EmailImageBlock } from '@/payload-types'

const EMAIL_BLOCKS = [EmailContent, EmailButton, EmailImage]
export type EmailBlockType = (EmailContentBlock | EmailButtonBlock | EmailImageBlock)[] | null | undefined

export const sesClient = new SESv2Client({
  region: process.env.AWS_SES_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SES_SECRET_KEY!,
  },
})


export const NodemailerEmailTransporter = nodemailer.createTransport({
  SES: {
    sesClient,
    SendEmailCommand,
  },
})


export const EMAIL_TEMPLATES = [
  // { 
  //   label: "Order Shipping Receipt", 
  //   value: "order_shipping_receipt", 
  //   Component: OrderShippingReceipt,
  //   variables: OrderShippingReceipt.PreviewProps,

  // },
  { 
    label: "Order Fufillment Receipt", 
    value: "order_fufillment_receipt", 
    Component: OrderFulfillmentRequest,
    variables: OrderFulfillmentRequestPreview.PreviewProps.variables
  },
  { 
    label: "Custom", 
    value: "custom", 
    Component: null,
    variables: {}
  }
]



export const Emails: CollectionConfig<'pages'> = {
  slug: 'emails',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    group: 'Content',
    defaultColumns: ['title', '_status', 'slug', 'updatedAt'],
    components: {
      edit: {
        beforeDocumentControls: [
          '@/collections/Emails/SendTestEmailButton',
        ],
      },
    },
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'emails',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'emails',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            MetaDescriptionField({
              hasGenerateFn: true,
              overrides: {
                minLength: 100,
                maxLength: 150,
                name: 'description',
              },
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            {
              name: 'publishedAt',
              type: 'date',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          fields: [
            {
              name: 'action',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      hasMany: false,
                      defaultValue: 'byAction',
                      options: [
                        {
                          label: 'Triggered by action',
                          value: 'byAction',
                        },
                        {
                          label: 'Daily',
                          value: 'daily',
                        },
                        {
                          label: 'Weekly',
                          value: 'weekly',
                        },
                        {
                          label: 'Bi-weekly',
                          value: 'biweekly',
                        },
                        {
                          label: 'Monthly',
                          value: 'monthly',
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'trigger',
                  type: 'select',
                  hasMany: false,
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'byAction',
                  },
                  options: ACTION_TRIGGERS_WITH_VARIABLES.map(x => ({
                    label: x.label,
                    value: x.value
                  })),
                },
                {
                  name: 'startTime',
                  type: 'date',
                  label: 'Start Time',
                  admin: {
                    condition: (_, siblingData) =>
                      siblingData?.type != 'byAction',
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm a',
                    },
                  },
                  required: false,
                },
                {
                  name: 'dow',
                  type: 'select',
                  hasMany: true,
                  admin: {
                    condition: (_, siblingData) =>
                      siblingData?.type != 'byAction' && siblingData?.type != 'monthly',
                  },
                  options: [
                    { label: 'Sun', value: 'sun' },
                    { label: 'Mon', value: 'mon' },
                    { label: 'Tue', value: 'tue' },
                    { label: 'Wed', value: 'wed' },
                    { label: 'Thu', value: 'thu' },
                    { label: 'Fri', value: 'fri' },
                    { label: 'Sat', value: 'sat' },
                  ],
                  required: false
                },
              ],
            },
            {
              name: 'access',
              type: 'select',
              hasMany: false,
              defaultValue: 'authenticated',
              options: [
                { label: 'Admin only', value: 'admin' },
                { label: 'Authenticated', value: 'authenticated' },
              ],
              required: true,
            },
          ],
          label: 'Schedule',
        },
        {
          fields: [
            {
              name: 'subject',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [ParagraphFeature(), RelationshipFeature(), FixedToolbarFeature()]
                },
              }),
            },
            {
              name: 'recipients',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [ParagraphFeature(), RelationshipFeature(), FixedToolbarFeature()]
                },
              }),
            },
            {
              name: "template",
              type: 'select',
              options: EMAIL_TEMPLATES.map(x => ({
                label: x.label,
                value: x.value
              }))
            },
            {
              name: 'blocks',
              type: 'blocks',
              blocks: EMAIL_BLOCKS,
              required: false,
              admin: {
                initCollapsed: false,
              },
            },
          ],
          label: 'Content',
        },
      ],
    },
  ],
  hooks: {
    // afterChange: [revalidatePage],
    // beforeChange: [populatePublishedAt],
    // afterDelete: [revalidateDelete],
    beforeValidate: [
      ({ data }) => {
        if (!data) {
          return data
        }
        if ((!data.slug || data.slug == '') && data.name) {
          data.slug = generateSlug(data.name)
        }
        return data
      },
    ],
  },
  versions: {
    drafts: {
      autosave: true,
      // schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
