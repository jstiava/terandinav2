import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { menuItem } from '@/fields/menuItem'
import { revalidateHeader } from './revalidateHeader'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

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
