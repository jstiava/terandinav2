import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generateSlug } from '@/utilities/generateSlug'
import { Carousel } from '@/blocks/Carousel/config'
import { Content } from '@/blocks/Content/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { Catalog } from '@/blocks/Catalog/config'



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


