import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Content } from '../../blocks/Content/config'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
} from '@payloadcms/plugin-seo/fields'
import { generateSlug } from '@/utilities/generateSlug'
import { Carousel } from '@/blocks/Carousel/config'
import { Row } from '@/blocks/Row/config'
import { Catalog } from '@/blocks/Catalog/config'

const blocks = [
  Carousel,
  Content,
  Row,
  Catalog
]

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    group: 'Content',
    components: {
      edit: {
        beforeDocumentControls: ['@/components/MakeFrontPageButton'],
      },
      listMenuItems: ['@/components/QuickAddPage'],
    },
    defaultColumns: ['title', '_status', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
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
              name: 'blocks',
              type: 'blocks',
              blocks,
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
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
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
    maxPerDoc: 5,
  },
}
