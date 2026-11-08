import React, { Fragment } from 'react'

import type { Email } from '@/payload-types'

import { EmailContentBlock } from './blocks/Content/Component'
import EmailButtonBlock from './blocks/Button/Component'
import EmailImageBlock from './blocks/Image/Component'
import { render } from '@react-email/components'
import { EmailBlockType } from '@/collections/Emails/config'

export const blockComponents = {
  emailContent: EmailContentBlock,
  emailButton: EmailButtonBlock,
  emailImage: EmailImageBlock
}

export const RenderEmailBlocks: React.FC<{
  blocks: EmailBlockType[],
  variables?: Record<string, any>
}> = async (props) => {

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

  if (!hasBlocks) return null

  const html = await render(
    <Fragment>
      {blocks.map((block, index) => {
        // @ts-ignore
        const { blockType } = block

        if (blockType && blockType in blockComponents) {
          // @ts-ignore
          const Block = blockComponents[blockType]

          if (Block) {
            return (
              <Block
                // @ts-ignore
                key={`${index}_${block.blockName ?? 'no_id'}`}
                {...{ variables, ...block }}
              />
            )
          }
        }

        return null
      })}
    </Fragment>
  )

  return (
    <iframe
      title="Email Preview"
      srcDoc={html}
      style={{ width: '100%', height: '100vh', border: 0 }}
    />
  )
}