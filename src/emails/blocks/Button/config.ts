import type { Block, Field } from 'payload'

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { BeautifulMentionsPlugin, BeautifulMentionNode } from 'lexical-beautiful-mentions'
import { defaultLexical } from '@/fields/defaultLexical'
import { RelationshipFeature } from '@/features/relationship-feature/server'

export const EmailButton: Block = {
  slug: 'emailButton',
  interfaceName: 'EmailButtonBlock',
  // imageURL: '/blocks/Content.png',
  fields: [
    {
      name: 'label',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            RelationshipFeature()
            // BeautifulMentionsFeature()
          ]
        },

      }),
    },
    {
      name: 'url',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            RelationshipFeature()
            // BeautifulMentionsFeature()
          ]
        },

      }),
    },
    {
      name: 'theme',
      type: 'select',
      hasMany: false,
      options: [
        { label: 'Call to Action', value: 'cta' },
        { label: 'Ghost', value: 'ghost' },
        { label: 'Outline', value: 'outline' },
      ],
    },
  ],
}
