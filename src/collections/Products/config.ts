import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generateSlug } from '@/utilities/generateSlug'
import { Carousel } from '@/blocks/Carousel/config'
import { Content } from '@/blocks/Content/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { Catalog } from '@/blocks/Catalog/config'

const blocks = [
    Content,
    Carousel,
    Catalog
]



export const Products: CollectionConfig = {
    slug: 'products',

    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticatedOrPublished,
        update: authenticated,
    },

    admin: {
        components: {
            views: {
                edit: {
                    myCustomView: {
                        Component: '@/collections/Products/CustomProductView',
                        path: '/custom-product-view',
                        tab: {
                            label: 'Another Custom View',
                            href: '/custom-product-view',
                            order: 100,
                        },
                    },
                }
            }
        },


        defaultColumns: [
            'name',
            'images',
            'active',
            'categories',
            'icons',
            'updatedAt',
        ],

        livePreview: {
            url: ({ data, req }) =>
                generatePreviewPath({
                    slug: data?.slug,
                    collection: 'products',
                    req,
                }),
        },
        preview: (data, { req }) =>
            generatePreviewPath({
                slug: data?.slug as string,
                collection: 'products',
                req,
            }),
        useAsTitle: 'name',
    },

    fields: [
        {
            name: 'slug',
            type: 'text',
            required: true,
            admin: {
                position: 'sidebar',
                description: "Required to display the page preview"
            },
        },
        {
            name: 'active',
            type: 'checkbox',
            defaultValue: true,
            admin: {
                position: 'sidebar',
            },
        },
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
                            name: 'images',
                            type: 'array',
                            minRows: 1,
                            fields: [
                                {
                                    name: 'image',
                                    type: 'upload',
                                    relationTo: 'media',
                                    required: true,
                                },
                            ],
                            admin: {
                                components: {
                                    Cell: '@/collections/Products/ProductImagesCell#default'
                                }
                            }
                        },
                        {
                            name: 'description',
                            type: 'textarea',
                            required: true,
                        },
                        {
                            name: 'details',
                            type: 'textarea',
                        },
                        {
                            name: 'categories',
                            type: 'relationship',
                            relationTo: 'categories',
                            hasMany: true,
                        },
                        {
                            name: 'icons',
                            type: 'select',
                            hasMany: true,
                            options: [
                                {
                                    label: 'Ships from US',
                                    value: 'ships_from_us',
                                },
                                {
                                    label: 'Free Returns',
                                    value: 'returns',
                                },
                                {
                                    label: 'Hypoallergenic',
                                    value: 'hypoallergenic',
                                },
                                {
                                    label: 'Indigenous Artisans',
                                    value: 'indigenous_artisans',
                                },
                            ],
                            admin: {
                                description: 'Select up to 4 icons to display on the product.',
                            },
                        },



                    ],
                },
                {
                    label: 'Page Content',
                    description: 'Edit the content displayed on this page.',
                    fields: [
                        {
                            name: 'blocks',
                            type: 'blocks',
                            blocks,
                            required: false,
                            admin: {
                                initCollapsed: false,
                            },
                        },
                    ],
                },
                {
                    label: 'Variants & Sizing',

                    fields: [
                        {
                            name: "sizes",
                            label: "Sizes and inventory",
                            type: "array",
                            admin: {

                            },
                            fields: [
                                {
                                    type: 'row',
                                    fields: [
                                        {
                                            name: 'label',
                                            type: 'select',
                                            options: [
                                                {
                                                    label: 'XS',
                                                    value: 'extra-small',
                                                },
                                                {
                                                    label: 'S',
                                                    value: 'small',
                                                },
                                                {
                                                    label: 'M',
                                                    value: 'medium',
                                                },
                                                {
                                                    label: 'L',
                                                    value: 'large',
                                                },
                                                {
                                                    label: 'XL',
                                                    value: 'extra-large',
                                                },
                                                {
                                                    label: 'XXL',
                                                    value: 'extra-extra-large',
                                                },
                                                {
                                                    label: 'Custom',
                                                    value: 'custom',
                                                },
                                            ],
                                        },
                                        {
                                            name: 'customLabel',
                                            type: 'text',
                                            admin: {
                                                condition: (_, siblingData) => siblingData?.label === 'custom',
                                            },
                                        },
                                        {
                                            name: "count",
                                            type: 'number',
                                        }
                                    ]
                                }

                            ]
                        },
                        {
                            name: 'prices',
                            label: "Prices (USD)",
                            admin: {
                                description: "Two-way integration w/ Stripe or Square"
                            },
                            type: 'array',
                            fields: [
                                {
                                    name: 'id',
                                    type: 'text',
                                    admin: {
                                        hidden: true
                                    }
                                },
                                {
                                    name: 'amount',
                                    type: 'number',
                                    required: true,
                                },
                                {
                                    name: 'currency',
                                    type: 'text',
                                    required: true,
                                    defaultValue: 'usd',
                                    admin: {
                                        hidden: true
                                    }
                                },
                                {
                                    name: 'stripe_price_id',
                                    type: 'text',
                                    admin: {
                                        hidden: true
                                    }
                                },
                                {
                                    name: 'square_variant_id',
                                    type: 'text',
                                    admin: {
                                        hidden: true
                                    }
                                },
                                {
                                    name: 'active',
                                    type: 'checkbox',
                                    defaultValue: true,
                                },
                            ],
                        },
                        {
                            name: 'notes_on_size',
                            type: 'textarea',
                            label: 'Notes on Size',
                        },
                        {
                            name: "parcel",
                            type: "relationship",
                            relationTo: "parcels"
                        }

                    ],
                },
                {
                    label: 'Metadata',

                    fields: [
                        {
                            name: 'stripe_product_id',
                            type: 'text',
                            admin: {
                                description: 'ID assigned to this product by the Stripe.',
                            },
                        },
                        {
                            name: 'square_catalog_item_id',
                            type: 'text',
                            admin: {
                                description: 'ID assigned to this product by the Square.',
                            },
                        },
                        {
                            name: 'terandina_v1_id',
                            type: 'text',
                            admin: {
                                description: 'ID assigned in the first iteration of the Terandina website.',
                            },
                        },
                        {
                            name: 'color_for_google_shopping',
                            type: 'text',
                            admin: {
                                description: 'General color for google shopping search optimization.',
                            },
                        },

                    ],
                },
            ],
        },
    ],

    hooks: {
        // beforeChange: [populatePublishedAt],

        beforeValidate: [
            ({ data }) => {
                if (!data) {
                    return data
                }

                if ((!data.slug || data.slug === '') && data.name) {
                    data.slug = generateSlug(data.name)
                }

                return data
            },
        ],
    },

    versions: {
        drafts: {
            autosave: true
        },
        maxPerDoc: 5,
    },
}


