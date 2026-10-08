import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Content',
    useAsTitle: 'alt',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
      admin: {
        components: {
          Cell: '@/collections/Media/MediaAltCellWithImagePreview'
        }
      }
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    disableLocalStorage: true,
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    // staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'small',
    focalPoint: false,
    imageSizes: [
      {
        name: 'small',
        width: 70,
      },
      {
        name: 'medium',
        width: 500,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
