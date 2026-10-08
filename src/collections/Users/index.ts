import type { CollectionConfig } from 'payload'
import configPromise from '@payload-config'

import { authenticated, isAdmin } from '../../access/authenticated'
import { getPayload } from 'payload'

export const Users: CollectionConfig = {
  labels: {
    plural: 'IAM',
    singular: 'IAM',
  },
  slug: 'users',
  access: {
    admin: authenticated,
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'createdAt'],
    useAsTitle: 'name',
    components: {
      listMenuItems: ['@/components/Auth/SendInvite/Component#default'],
    },
    group: 'Settings'
  },
  auth: {
    verify: {
      generateEmailSubject: () => 'Verify your email address',

      generateEmailHTML: ({ token, user }) => {
        const url = `${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${token}`

        return `
          <h1>Verify your email</h1>

          <p>Hi ${user.email},</p>

          <p>
            Thanks for creating an account.
            Click the button below to verify your email address.
          </p>

          <p>
            <a href="${url}">
              Verify my email
            </a>
          </p>

          <p>
            If you did not create this account, you can ignore this email.
          </p>
        `
      },
    },

    tokenExpiration: 7200,
    maxLoginAttempts: 10,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
        { label: 'Contributor', value: 'contributor' },
      ],
    },
  ],
  timestamps: true,
}
