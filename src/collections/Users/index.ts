import type { CollectionConfig } from 'payload'
import { authenticated, isAdmin } from '../../access/authenticated'
import VerifyEmail from '@/collections/Users/VerifyEmail';
import ResetPasswordEmail from '@/collections/Users/ResetPasswordEmail';



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
    group: 'Settings'
  },
  auth: {
    verify: {
      generateEmailSubject: () => 'Verify your email address',
      generateEmailHTML: VerifyEmail,
    },
    forgotPassword: {
      generateEmailSubject: () => 'Reset your password',
      generateEmailHTML: ResetPasswordEmail
    },
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
    {
      name: 'password',
      type: 'text',
      hidden: true,
      access: {
        update: () => false,
      },
    },
  ],
  timestamps: true,
}