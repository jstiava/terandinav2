import React, { Fragment } from 'react'

import type { Email } from '@/payload-types'

import { EmailContentBlock } from './blocks/Content/Component'
import EmailButtonBlock from './blocks/Button/Component'
import EmailImageBlock from './blocks/Image/Component'

export const blockComponents = {
  emailContent: EmailContentBlock,
  emailButton: EmailButtonBlock,
  emailImage: EmailImageBlock
}

export const RenderEmailBlocks: React.FC<{
  blocks: Email['blocks'],
  variables?: Record<string, any>
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
              return <Block
              // @ts-ignore
                key={`${index}_${block.blockName ?? "no_id"}`}
                {...{
                  variables,
                  ...block,
                }} />
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
