import { compileTailwind } from '@/blocks/Content/compileTailwind';
import { fallbackLexical } from '@/fields/fallbackLexical';
import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: "className",
      type: "textarea",
      admin: {
        description: 'Use Tailwind class names. See changes in compiled styles below. Common classes will not appear below if they are apart of the global stylesheet. Open Tailwind cheatsheet: https://nerdcave.com/tailwind-cheat-sheet.'
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: fallbackLexical,
      label: false,
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
