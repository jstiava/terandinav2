import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'


import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import CarouselBlock from './Carousel/Component'
import RowBlock from './Row/Component'
import ButtonBlock from './Button/Component'
import CatalogBlock from './Catalog/Component'

export const blockComponents = {
  carousel: CarouselBlock,
  content: ContentBlock,
  mediaBlock: MediaBlock,
  row: RowBlock,
  buttonBlock: ButtonBlock,
  catalog: CatalogBlock


  // formBlock: FormBlock,
  // card: CardBlock,
  // cardSlider: CardSliderBlock,
  // athleticTrophyBanner: AthleticTrophyBannerBlock,
  // map: MapBlock,
  // dramaticBanner: DramaticBannerBlock,
  // statisticsBanner: StatisticsBannerBlock,
  // voidBlock: VoidBlock
}

export const RenderBlocks: React.FC<{
  blocks: Page['blocks']
}> = (props) => {
  const { blocks } = props
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0
  const debug = false

  try {


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
                return <Block key={`${index}_${block.blockName}`} {...(block as any)} />
              }
            }
            return null
          })}
        </Fragment>
      )
    }
  }
  catch (err) {
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

  return null
}
