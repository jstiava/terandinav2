import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { Content } from '@/blocks/Content/config'
import { Row } from '@/blocks/Row/config'
import { Carousel } from '@/blocks/Carousel/config'
import { Catalog } from '@/blocks/Catalog/config'
import { slugify } from '@/utilities/slugify'
import { revalidateTag } from 'next/cache'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    components: {
      edit: {
        beforeDocumentControls: [
          '@/components/AutoSaveIndicator',
          '@/components/RevertToLastPublishedButton'
        ]
      },
    },
    livePreview: {
      url: ({ data, req }) => {
        if (!data.pageActive) {
          return null;
        }

        return generatePreviewPath({
          slug: data?.slug as string,
          collection: 'categories',
          req,
        })
      }
    },
    preview: (data, { req }) => {
      if (!data.pageActive) {
        return null;
      }
      return generatePreviewPath({
        slug: data?.slug as string,
        collection: 'categories',
        req,
      })
    }
  },

  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: "Required to display the page preview"
      },
    },
    {
      name: 'showInSearch',
      label: "Show in search",
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',

      tabs: [
        {
          label: 'General',

          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: "type",
              type: 'select',
              defaultValue: 'category',
              admin: {
                description: "Variants are show immidiately beside the product each individual product page."
              },
              options: [
                { label: "Category", value: "category" },
                { label: "Variant", value: "variant" },
                { label: "Group", value: "group" }
              ]
            },
            {
              name: 'images',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
            {
              name: 'products',
              type: 'join',
              collection: 'products',
              on: 'categories',
            },
          ],
        }
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) {
          return data
        }

        if ((!data.slug || data.slug === '') && data.name) {
          data.slug = slugify(data.name)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc }) => {
        if (!doc) return;

        if (doc._status == 'published') {
          revalidateTag('categories')
        }
        else if (previousDoc._status == 'published') {
          revalidateTag('categories')
        }
      }
    ]
  },
  versions: {
    drafts: {
      autosave: true,
      // schedulePublish: true,
    },
    maxPerDoc: 5,
  },
}
