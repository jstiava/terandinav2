'use client'
import type { LexicalCommand } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { $insertNodeToNearestRoot } from '@lexical/utils'
import {
  $getPreviousSelection,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from 'lexical'
import { useEffect } from 'react'
import {
  KEY_DOWN_COMMAND,
  COMMAND_PRIORITY_NORMAL,
} from 'lexical';

// import type { PluginComponent } from '../../../typesClient.js'
import type { RelationshipFeatureProps } from '../../server/index.js'
import type { RelationshipData } from '../../server/nodes/RelationshipNode.js'

import { RelationshipDrawer } from '../drawer/index.js'
import { $createRelationshipNode, RelationshipNode } from '../nodes/RelationshipNode.js'
import { useEnabledRelationships } from '../utils/useEnabledRelationships.js'
import { PluginComponent } from '@payloadcms/richtext-lexical'
import { INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND } from '../drawer/commands.js'

export const INSERT_RELATIONSHIP_COMMAND: LexicalCommand<RelationshipData> = createCommand(
  'INSERT_RELATIONSHIP_COMMAND',
)

export const RelationshipPlugin: PluginComponent<RelationshipFeatureProps> = ({ clientProps }) => {
  const [editor] = useLexicalComposerContext()

  const { enabledCollectionSlugs } = useEnabledRelationships({
    collectionSlugsBlacklist: clientProps?.disabledCollections,
    collectionSlugsWhitelist: clientProps?.enabledCollections,
  })

  useEffect(() => {
    if (!editor.hasNodes([RelationshipNode])) {
      throw new Error('RelationshipPlugin: RelationshipNode not registered on editor')
    }

    return editor.registerCommand<RelationshipData>(
      INSERT_RELATIONSHIP_COMMAND,
      (payload) => {
        const selection = $getSelection() || $getPreviousSelection()

        if ($isRangeSelection(selection)) {
          const relationshipNode = $createRelationshipNode(payload)

          // INSERT INLINE
          selection.insertNodes([relationshipNode])

          // Move cursor after the node for smooth typing
          relationshipNode.selectNext()
          // // we need to get the focus node before inserting the block node, as $insertNodeToNearestRoot can change the focus node
          // const { focus } = selection
          // const focusNode = focus.getNode()
          // // Insert relationship node BEFORE potentially removing focusNode, as $insertNodeToNearestRoot errors if the focusNode doesn't exist
          // $insertNodeToNearestRoot(relationshipNode)

          // // Delete the node it it's an empty paragraph
          // if ($isParagraphNode(focusNode) && !focusNode.__first) {
          //   focusNode.remove()
          // }
        }

        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return <RelationshipDrawer enabledCollectionSlugs={enabledCollectionSlugs} />
}




export function HashtagTriggerPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand<string>(
      KEY_DOWN_COMMAND,
      (event : any) => {
        if (event.key === '#') {
          event.preventDefault();
          event.stopPropagation();
          // Your command:
          editor.dispatchCommand(INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND, {
            replace: false,
          });

          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor]);

  return null;
}
