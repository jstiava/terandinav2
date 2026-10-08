'use client'

import { $isNodeSelection } from 'lexical'

import type { RelationshipFeatureProps } from '../server/index.js'

// import { slashMenuBasicGroupWithItems } from '../../shared/slashMenu/basicGroup.js'
// import { toolbarAddDropdownGroupWithItems } from '../../shared/toolbar/addDropdownGroup.js'
import { INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND } from './drawer/commands.js'
import { $isRelationshipNode, RelationshipNode } from './nodes/RelationshipNode.js'
import { HashtagTriggerPlugin, RelationshipPlugin } from './plugins/index.js'
import { Variable } from 'lucide-react'
import { createClientFeature, slashMenuBasicGroupWithItems, toolbarAddDropdownGroupWithItems } from '@payloadcms/richtext-lexical/client'

export const RelationshipFeatureClient = createClientFeature<RelationshipFeatureProps>({
  nodes: [RelationshipNode],
  plugins: [
    {
      Component: RelationshipPlugin,
      position: 'normal',
    },
    {
      Component: HashtagTriggerPlugin,
      position: 'bottom'
    }
  ],
  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          Icon: Variable,
          key: 'variable',
          keywords: ['variables', 'variable', 'var'],
          label: ({ i18n }) => {
            return 'Variables'
          },
          onSelect: ({ editor }) => {
            // dispatch INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND
            editor.dispatchCommand(INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND, {
              replace: false,
            })
          },
        },
      ]),
    ],
  },
  toolbarFixed: {
    groups: [
      toolbarAddDropdownGroupWithItems([
        {
          ChildComponent: Variable,
          isActive: ({ selection }) => {
            if (!$isNodeSelection(selection) || !selection.getNodes().length) {
              return false
            }

            const firstNode = selection.getNodes()[0]
            return $isRelationshipNode(firstNode)
          },
          key: 'variable',
          label: ({ i18n }) => {
            return 'Variables'
          },
          onSelect: ({ editor }) => {
            // dispatch INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND
            editor.dispatchCommand(INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND, {
              replace: false,
            })
          },
        },
      ]),
    ],
  },
})
