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

const EMAIL_BLOCKS = [EmailContent, EmailButton, EmailImage]

export const ACTION_TRIGGERS_WITH_VARIABLES = [
  // IAM
  {
    label: 'Invite user by email',
    value: 'iam:invite_user_by_email',
    variables: [
      { label: "From's First Name", value: 'from.first_name' },
      { label: "From's Name", value: 'from.name' },
      { label: "From's Email", value: 'from.email_address' },
      { label: "Recipient's Email", value: 'recipient.email_address' },
      { label: 'Password Reset Token', value: 'password_reset_token' },
    ]
  },
  {
    label: 'New user confirmed',
    value: 'iam:new_user_confirmed',
    variables: [
      { label: 'New User First Name', value: 'new_user.first_name' },
      { label: 'New User Name', value: 'new_user.name' },
      { label: 'New User Email', value: 'new_user.email_address' },
      { label: 'New User Role', value: 'new_user.role' },
    ]
  },

  // User
  {
    label: 'With Successful Purchase Complete',
    value: "user:with_successful_purchase_complete",
    variables: [
      { label: "Customer's Name", value: 'customer.name' },
      { label: "Customer's Email Address", value: 'customer.email_address' },
      { label: 'Order Amount', value: 'order.amount' },
    ]
  },
  {
    label: "With subscription to newsletter",
    value: "user:with_subscribe_to_newsletter",
    variables: [
      { label: "Customer's Name", value: 'customer.name' },
      { label: "Customer's Email Address", value: 'customer.email_address' },
    ]
  },

  // Editor
  {
    label: "New announcement made",
    value: "editor:new_announcement_made",
    variables: []
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
