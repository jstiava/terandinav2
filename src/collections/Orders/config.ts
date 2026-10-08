import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generateSlug } from '@/utilities/generateSlug'
import { Carousel } from '@/blocks/Carousel/config'
import { Content } from '@/blocks/Content/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { Catalog } from '@/blocks/Catalog/config'


export const Orders: CollectionConfig = {
    slug: 'orders',

    access: {
        create: () => false,
        delete: () => false,
        read: authenticated,
        update: () => false,
    },

    admin: {

        defaultColumns: [
            'name',
            'updatedAt',
        ],
        useAsTitle: 'name',
    },

    fields: [
        {
            type: 'tabs',

            tabs: [
                {
                    label: 'General',

                    fields: [
                        {
                            name: 'name',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'delivery_type',
                            type: 'select',
                            options: [
                                { label: "Pickup", value: "pickup" },
                                { label: "Delivery", value: 'delivery' }
                            ],
                            required: true
                        },
                        {
                            name: 'delivery_address_details',
                            type: 'textarea',
                        },
                        {
                            name: 'status',
                            type: 'select',
                            options: [
                                { label: "Incomplete", value: "incomplete" },
                                { label: "Paid", value: 'paid' },
                                { label: "En-route", value: 'en-route' },
                                { label: "Received", value: "received" },
                                { label: "Triggered return", value: 'triggered_return' },
                                { label: "Refunded", value: "refunded" }
                            ],
                            required: true
                        },
                    ],
                },
                {
                    label: 'Order Contents',

                    fields: [
                        {
                            name: "cart",
                            type: "array",
                            fields: [
                                {
                                    name: 'product',
                                    type: 'relationship',
                                    relationTo: 'products'
                                },
                                {
                                    name: "size",
                                    type: 'text'
                                },
                                {
                                    name: "quantity",
                                    type: 'number'
                                },
                                {
                                    name: "price",
                                    type: "number"
                                }
                            ]
                        },


                    ],
                },
                {
                    label: "History",
                    fields: [
                        {
                            name: 'history',
                            type: "array",
                            fields: [
                                {
                                    name: "type",
                                    type: "select",
                                    options: [
                                        { label: "Action required", value: "action_required" },
                                        { label: "Progress made", value: "progress_made" },
                                        { label: "Default", value: "default" }
                                    ]
                                },
                                {
                                    name: "description",
                                    type: "text",
                                    required: true
                                },

                            ]
                        }
                    ]
                }
            ],
        },
    ],
}


