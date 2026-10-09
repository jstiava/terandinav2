// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'

import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { Emails } from './collections/Emails/config'
import { Settings } from './collections/Settings'

import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { Products } from './collections/Products/config'
import { Categories } from './collections/Categories/config'
import { Media } from './collections/Media/config'
import { Orders } from './collections/Orders/config'
import { Parcels } from './collections/Parcels/config'
import { CRM } from '@/collections/CRM/config'

const collections = [
  Pages,
  Emails,
  Media,
  Categories,
  Products,
  Orders,
  Parcels,
  CRM,
  Users,
]

const globals = [Header, Footer, Settings]

const sesClient = new SESv2Client({
  region: process.env.AWS_SES_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SES_SECRET_KEY!,
  },
})

export default buildConfig({
  admin: {
    meta: {
      title: 'Terandina - Admin',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.png',
        },
      ],
    },
    autoRefresh: true,
    components: {
      beforeNavLinks: ['@/components/AfterNavLinks'],
      beforeDashboard: ['@/components/BeforeDashboard'],
      graphics: {
        Logo: '@/components/BeforeLogin',
        Icon: '@/graphics/Logo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      collections: ['pages', 'emails', 'products', 'categories'],
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
    connectOptions: {
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 10000,
      serverSelectionTimeoutMS: 10000,
    },
  }),
  collections,
  cors: [getServerSideURL()].filter(Boolean),
  globals,
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) {
          if (req.user.role === 'contributor') {
            return false
          }
          return true
        }

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
  email: nodemailerAdapter({
    defaultFromAddress: process.env.EMAIL_FROM!,
    defaultFromName: 'Terandina',
    transport: nodemailer.createTransport({
      SES: {
        sesClient,
        SendEmailCommand,
      },
    }),
  }),
})
