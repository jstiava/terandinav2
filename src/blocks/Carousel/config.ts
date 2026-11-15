import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'
import { compileTailwind } from '@/blocks/Content/compileTailwind'

export const Carousel: Block = {
  slug: 'carousel',
  interfaceName: 'CarouselBlock',
  imageURL: '/blocks/carousel.png',
  fields: [
    {
      name: 'slides',
      type: 'array',
      fields: [
        {
          name: "type",
          type: 'radio',
          admin: {
            layout: 'horizontal',
            width: '50%',
          },
          defaultValue: 'image',
          options: [
            { label: "Image", value: 'image' },
            { label: "Video", value: 'video' }
          ]
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          filterOptions: {
            mimeType: {
              contains: 'image',

            },
          },
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'image',
          },
          required: false,
        },
        {
          name: 'coverImage',
          label: "Video cover image",
          type: 'upload',
          filterOptions: {
            mimeType: {
              contains: 'image',
            },
          },
          relationTo: 'media',
          required: false,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'video',
          },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          required: false,
          filterOptions: {
            mimeType: {
              contains: 'video',
            },
          },
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'video',
          },
        },
        {
          name: 'richText',
          type: 'richText',
          editor: defaultLexical,
          label: false,
        },
        {
          type: 'collapsible',
          label: 'Advanced layouts & styling',
          admin: {
            initCollapsed: true,
          },
          fields: [
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
              label: "Compiled styles (read only)",
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
            }
          ]
        }

      ],
    },
  ],
  // labels: {
  //   plural: 'Calls to Action',
  //   singular: 'Call to Action',
  // },
}
