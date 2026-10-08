import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { menuItem } from '@/fields/menuItem'

export const Settings: GlobalConfig = {
  slug: 'settings',
  admin: {
    group: 'Settings'
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'frontPage',
      type: 'relationship',
      relationTo: 'pages',
      required: true,
    },
    {
      name: 'socialAccounts',
      type: 'group',
      fields: [
        {
          name: 'instagram',
          type: 'text',
          admin: {
            description: 'HTTPS Link to your account',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          admin: {
            description: 'HTTPS Link to your account',
          },
        },
        {
          name: 'youtube',
          type: 'text',
          admin: {
            description: 'HTTPS Link to your account',
          },
        },
        {
          name: 'twitter',
          type: 'text',
          admin: {
            description: 'HTTPS Link to your account',
          },
        },
        {
          name: 'facebook',
          type: 'text',
          admin: {
            description: 'HTTPS Link to your account',
          },
        },
      ],
    },
  ],
}
