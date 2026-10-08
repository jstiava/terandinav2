import type { Block, Field } from 'payload'

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { BeautifulMentionsPlugin, BeautifulMentionNode } from "lexical-beautiful-mentions";
import { defaultLexical } from '@/fields/defaultLexical'
import { RelationshipFeature } from '@/features/relationship-feature/server';
import { EmailButton } from '../Button/config';

export const EmailContent: Block = {
  slug: 'emailContent',
  interfaceName: 'EmailContentBlock',
  // imageURL: '/blocks/Content.png',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            BlocksFeature({
              blocks: [EmailButton],
            }),
            RelationshipFeature()
            // BeautifulMentionsFeature()
          ]
        },

      }),
      label: false,
    },
  ],
}
