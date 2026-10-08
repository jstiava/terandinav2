import type { Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'
import { Page } from '@/payload-types'
import { linkGroup } from './linkGroup'

export type LinkAppearances = 'default' | 'outline'

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: {
    label: 'Default',
    value: 'default',
  },
  outline: {
    label: 'Outline',
    value: 'outline',
  },
}

type MenuItemType = (options?: {
  disableImage?: boolean
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  overrides?: Partial<GroupField>
}) => Field

export const menuItem: MenuItemType = ({
  appearances,
  disableImage = false,
  disableLabel = false,
  overrides = {},
} = {}) => {
  const linkResult: GroupField = {
    name: 'menuItem',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
              description: 'Standard: Internal links open in same tab, external to a new tab.',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
              {
                label: 'Label ONLY',
                value: 'label',
              },
            ],
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'reference',
            type: 'relationship',
            admin: {
              width: '50%',
              condition: (_, siblingData) => siblingData?.type === 'reference',
            },
            label: 'Document to link to',
            relationTo: ['pages'],
            required: true,
          },
          {
            name: 'query',
            type: 'text',
            admin: {
              style: {
                width: '50%',
              },
              condition: (_, siblingData) => siblingData?.type != 'label',
              placeholder: '?key=value&key2=value2',
              description: 'Advanced field',
            },
            label: 'Query string',
            required: false,
          },
        ],
      },
      {
        name: 'label',
        type: 'text',
        required: true,
      },
      {
        name: 'url',
        type: 'text',
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'custom',
        },
        label: 'Custom URL',
        required: true,
      },
      {
        name: 'photo',
        admin: {
          condition: () => disableImage == false,
        },
        type: 'upload',
        relationTo: 'media',
        required: false,
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
      },
      {
        name: 'className',
        type: 'text',
        label: 'Classname',
        admin: {
          description: 'Tailwind classes. Block is meant to create negative gap between related items.'
        }
      },
    ],
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [appearanceOptions.default, appearanceOptions.outline]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}
