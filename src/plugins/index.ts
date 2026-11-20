import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing';

import { Page } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  // nestedDocsPlugin({
  //   collections: ['categories'],
  //   generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  // }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  uploadthingStorage({
    collections: {
      media: {
        disablePayloadAccessControl: true,
        disableLocalStorage: true,
      },
    },
    clientUploads: true,
    options: {
      token: process.env.UPLOADTHING_TOKEN,
      acl: 'public-read',

    },
  }),
  // formBuilderPlugin({
  //   fields: {
  //     payment: false,
  //   },
  //   formOverrides: {
  //     fields: ({ defaultFields }) => {
  //       return defaultFields.map((field) => {
  //         if ('name' in field && field.name === 'confirmationMessage') {
  //           return {
  //             ...field,
  //             editor: lexicalEditor({
  //               features: ({ rootFeatures }) => {
  //                 return [
  //                   ...rootFeatures,
  //                   FixedToolbarFeature(),
  //                   HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
  //                 ]
  //               },
  //             }),
  //           }
  //         }
  //         return field
  //       })
  //     },
  //   },
  // }),
  // searchPlugin({
  //   collections: ['posts'],
  //   beforeSync: beforeSyncWithSearch,
  //   searchOverrides: {
  //     fields: ({ defaultFields }) => {
  //       return [...defaultFields, ...searchFields]
  //     },
  //   },
  // }),
]
