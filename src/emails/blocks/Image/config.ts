import type { Block } from 'payload'


export const EmailImage: Block = {
    slug: 'emailImage',
    interfaceName: 'EmailImageBlock',
    // imageURL: '/blocks/Content.png',
    fields: [
        {
            name: "image",
            type: "relationship",
            relationTo: 'media',
            required: true
        },
        {
            name: "props",
            type: "json",
            defaultValue: {
                width: 100,
                height: 100
            }
        }
    ],
}
