import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { defaultLexical } from '@/fields/defaultLexical'


export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  imageURL: '/blocks/Content.png',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: defaultLexical,
      label: false,
    },
    {
      name: "className",
      type: "text",
    },
  ],
}
