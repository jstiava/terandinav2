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
      name: 'alignment',
      type: 'select',
      required: true,
      defaultValue: 'w-full',
      options: [
        { label: 'Left (wrap text)', value: 'float-left' },
        { label: 'Right (wrap text)', value: 'float-right' },
        { label: 'Center (block)', value: 'mx-auto block' },
        { label: 'Full Width', value: 'w-full'}
      ],
    },
  ],
}
