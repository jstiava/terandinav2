import React, { Fragment } from 'react'

import type { Email, Page } from '@/payload-types'

import { EmailContentBlock } from './blocks/Content/Component'
import { Variable } from '@/components/RichText'
import EmailButtonBlock from './blocks/Button/Component'

export const blockComponents = {
  emailContent: EmailContentBlock,
  emailButton: EmailButtonBlock
}

export const RenderEmailBlocks: React.FC<{
  blocks: Email['blocks'],
  variables?: Record<string, string | number>
}> = (props) => {
  const { blocks, variables = {} } = props
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0
  const debug = false

  if (debug) {
    return (
      <p
        style={{
          whiteSpace: 'pre-wrap',
        }}
      >
        {JSON.stringify(blocks, null, 2)}
      </p>
    )
  }

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return <Block key={`${index}_${block.blockName}`} {...(block as any)} variables={variables} />
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
