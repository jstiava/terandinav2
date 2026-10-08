import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'

export const Banner: Block = {
    slug: 'banner',
    interfaceName: 'BannerBlock',
    //   imageURL: '/blocks/carousel.png',
    fields: [
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'richText',
            type: 'richText',
            editor: defaultLexical,
            label: false,
        },
        {
            name: "className",
            type: "text",
            admin: {
                description: "Tailwind classes for the carousel item."
            }
        }
    ],
    // labels: {
    //   plural: 'Calls to Action',
    //   singular: 'Call to Action',
    // },
}
