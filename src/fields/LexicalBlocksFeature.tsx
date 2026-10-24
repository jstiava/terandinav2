
import { BlocksFeature } from '@payloadcms/richtext-lexical'
import { MediaBlock } from '@/blocks/MediaBlock/config' 
import { ButtonBlock } from '@/blocks/Button/config'

export const LexicalBlocksFeature = BlocksFeature({
  blocks: [MediaBlock, ButtonBlock],
})