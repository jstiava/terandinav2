
import { config } from '@/fields/fallbackLexical'
import { LexicalBlocksFeature } from '@/fields/LexicalBlocksFeature'
import { lexicalEditor } from '@payloadcms/richtext-lexical'


export const defaultLexical = lexicalEditor({
  ...config,
  features: [
    ...config.features,
    LexicalBlocksFeature,
  ]
})
