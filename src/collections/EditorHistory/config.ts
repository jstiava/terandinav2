import type { CollectionConfig } from 'payload'

export const EditorHistory: CollectionConfig = {
    slug: 'editor-history',

    admin: {
        hidden: true,
        useAsTitle: 'action',
    },

    access: {
        create: () => false,
        update: () => false,
        delete: () => false,
        read: () => false,
    },

    fields: [

        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: false,
            index: true,
        },

        {
            name: 'action',
            type: 'text',
            required: true,
            index: true,
        },

        {
            name: 'collection',
            type: 'text',
            required: true,
            index: true,
        },

        {
            name: 'documentId',
            type: 'text',
            required: false,
            index: true,
        },

        {
            name: 'changes',
            type: 'json',
            required: false,
        },

        {
            name: 'metadata',
            type: 'json',
            required: false,
        },

        {
            name: 'createdAt',
            type: 'date',
            required: true,
            index: true,
        },
    ],
}