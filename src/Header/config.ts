import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { menuItem } from '@/fields/menuItem'
import { revalidateHeader } from './revalidateHeader'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { Content } from '@/blocks/Content/config'
import { Catalog } from '@/blocks/Catalog/config'

const blocks = [
  Content,
  Catalog
]

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  admin: {
    components: {
      elements: {
        beforeDocumentControls: [
          '@/components/AutoSaveIndicator',
          '@/components/RevertToLastPublishedButton'
        ]
      },
    },
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          collection: 'header',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        collection: 'header',
        req,
      }),
  },
  fields: [
    {
      name: 'navItems',
      label: "Header items",
      type: 'array',
      fields: [
        menuItem({
          appearances: false,
          disableImage: true,
        }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'presearchRecommendationContent',
      label: "Pre-search recommendation content",
      type: 'blocks',
      blocks,
      required: false,
      admin: {
        initCollapsed: false,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
  versions: {
    drafts: {
      autosave: true
    },
    max: 5
  }
}
