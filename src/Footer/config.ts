import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { menuItem } from '@/fields/menuItem'

export const Footer: GlobalConfig = {
  slug: 'footer',
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
        {
          name: "children",
          type: 'array',
          fields: [
            menuItem({
              appearances: false,
              disableImage: true,
            }),
          ]
        }
      ],
      maxRows: 8,
      admin: {
        initCollapsed: false,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'socials',
      type: "array",
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'site',
              type: 'select',
              options: [
                { label: "Instagram", value: 'instagram' },
                { label: "Linkedin", value: 'linkedin' },
                { label: "YouTube", value: 'youtube' },
                { label: "Twitter", value: 'twitter' },
                { label: "Facebook", value: 'facebook' },
              ],
              required: true
            },
            {
              name: 'handle',
              type: 'text',
              required: true
            }
          ]
        }
      ]
    }

  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
