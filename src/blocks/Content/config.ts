import type { Block } from 'payload'

import { defaultLexical } from '@/fields/defaultLexical'
import { compileTailwind } from '@/blocks/Content/compileTailwind'


export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  imageURL: '/blocks/Content.png',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: defaultLexical,
      label: false,
    },
    {
      name: "className",
      type: "textarea",
      admin: {
        description: 'Use Tailwind class names. See changes in compiled styles below. Common classes will not appear below if they are apart of the global stylesheet. Open Tailwind cheatsheet: https://nerdcave.com/tailwind-cheat-sheet.'
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
    }
  ],
}
