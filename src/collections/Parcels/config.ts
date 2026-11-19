import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'



export const Parcels: CollectionConfig = {
    slug: 'parcels',

    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },

    admin: {

        defaultColumns: [
            'name',
            'width',
            'height',
            'length',
            'weight',
        ],
        useAsTitle: 'name',
    },

    fields: [
        {
            name: "name",
            type: "text",
        },
        {
            name: "length",
            label: "Length (in inches)",
            type: "number",
        },
        {
            name: "width",
            label: "Width (in inches)",
            type: "number",
        },
        {
            name: "height",
            label: "Height (in inches)",
            type: "number",
        },
        {
            name: "weight",
            label: "Weight (in lbs)",
            type: "number",
        },
        {
            name: "products",
            type: "join",
            collection: 'products',
            on: 'parcel',
        }
    ],
}


