import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { menuItem } from '@/fields/menuItem'
import { revalidateHeader } from './revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        menuItem({
          appearances: false,
          disableImage: true,
        }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: false,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
