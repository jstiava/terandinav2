import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'
import { compileTailwind } from '@/blocks/Content/compileTailwind';

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
            type: "textarea",
            admin: {
                description: 'Use Tailwind class names. See changes in compiled styles below. Common classes will not appear below if they are apart of the global stylesheet. [Open Tailwind cheatsheet](https://nerdcave.com/tailwind-cheat-sheet).'
            },
        },
        {
            name: 'compiledStyles',
            type: 'json',
            admin: {
                hidden: false,
                readOnly: true,
                className: "js-custom-json-admin-field",
                description: "The compiler reduces to inline css elements where possible. Responsive styles and hover actions are rendered as pure CSS snippets alongside the block."
            },
            hooks: {
                beforeChange: [
                    async ({ siblingData }) => {
                        const styles = await compileTailwind({
                            id: String(siblingData.id),
                            className: String(siblingData?.className ?? '')
                        });
                        return styles
                    },
                ],
            },
        },
        {
            name: "classNamePerProduct",
            type: "textarea",
            admin: {
                description: 'Use Tailwind class names. See changes in compiled styles below. Common classes will not appear below if they are apart of the global stylesheet. [Open Tailwind cheatsheet](https://nerdcave.com/tailwind-cheat-sheet).'
            },
        },
    ],
    // labels: {
    //   plural: 'Calls to Action',
    //   singular: 'Call to Action',
    // },
}
