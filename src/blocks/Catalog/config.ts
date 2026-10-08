import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'

export const Catalog: Block = {
    slug: 'catalog',
    interfaceName: 'CatalogBlock',
    //   imageURL: '/blocks/carousel.png',
    fields: [
        {
            name: "limit",
            type: "number",
        },
        {
            name: "filters",
            type: "array",
            fields: [
                {
                    type: "row",
                    fields: [
                        {
                            name: "field",
                            type: "select",
                            required: true,
                            options: [
                                { label: "Category", value: 'categories' },
                                { label: "Is active", value: 'active' },
                                { label: "Icons", value: 'icons' },
                                { label: "Sizes", value: 'sizes' },
                                { label: "Prices", value: 'prices' },
                            ]
                        },
                        {
                            name: "operator",
                            type: "select",
                            required: true,
                            options: [
                                { label: "is", value: 'is' },
                                { label: "is NOT", value: 'is_not' },
                            ]
                        },
                        {
                            name: "value__categories",
                            type: 'relationship',
                            relationTo: "categories",
                            admin: {
                                condition: (_, siblingData) => siblingData?.field === 'categories',
                            },
                            hasMany: true
                        },
                        {
                            name: "value__active",
                            type: 'select',
                            defaultValue: "true",
                            options: [
                                { label: "True", value: 'true' },
                                { label: "False", value: 'false' }
                            ],
                            admin: {
                                condition: (_, siblingData) => siblingData?.field === 'active',
                            }
                        },
                        {
                            name: "value__icons",
                            type: 'select',
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
                                condition: (_, siblingData) => siblingData?.field === 'icons',
                            },
                            hasMany: true
                        },
                        {
                            name: "value__sizes",
                            type: "select",
                            admin: {
                                condition: (_, siblingData) => siblingData?.field === 'sizes',
                            },
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
                        }
                    ]
                },
            ]
        },
        {
            name: "className",
            type: "text",
        },
        {
            name: "classNamePerProduct",
            type: "text",
        },
    ],
    // labels: {
    //   plural: 'Calls to Action',
    //   singular: 'Call to Action',
    // },
}
