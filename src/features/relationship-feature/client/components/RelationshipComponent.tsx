'use client'
import type { ElementFormatType } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { getTranslation } from '@payloadcms/translations'
import { Button, useConfig, usePayloadAPI, useTranslation } from '@payloadcms/ui'
import { $getNodeByKey } from 'lexical'
import React, { useCallback, useReducer, useRef, useState } from 'react'

import type { RelationshipData } from '../../server/nodes/RelationshipNode.js'

// import { useLexicalDocumentDrawer } from '../../../../utilities/fieldsDrawer/useLexicalDocumentDrawer.js'
import './index.scss'
import { INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND } from '../drawer/commands.js'
import { useLexicalDocumentDrawer } from '@payloadcms/richtext-lexical/client'

const initialParams = {
  depth: 0,
}

type Props = {
  className: string
  data: RelationshipData
  format?: ElementFormatType
  nodeKey?: string
}

export const RelationshipComponent: React.FC<Props> = (props) => {
  const {
    className: baseClass,
    data: { selected },
    nodeKey,
  } = props

  // if (typeof value === 'object') {
  //   throw new Error(
  //     'Relationship value should be a string or number. The Lexical Relationship component should not receive the populated value object.',
  //   )
  // }

  const relationshipElemRef = useRef<HTMLDivElement | null>(null)

  const [editor] = useLexicalComposerContext()
  const isEditable = useLexicalEditable()
  const {
    config: {
      routes: { api },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const { i18n, t } = useTranslation()
  const [cacheBust, dispatchCacheBust] = useReducer((state) => state + 1, 0)

  const removeRelationship = useCallback(() => {
    editor.update(() => {
      $getNodeByKey(nodeKey!)?.remove()
    })
  }, [editor, nodeKey])

  const updateRelationship = React.useCallback(() => {
    // do nothing
  }, [])

  return (
    <span
      contentEditable={false}
      ref={relationshipElemRef}
      style={{
        display: 'inline',
        alignItems: 'center',
        // padding: '2px 4px',
        borderRadius: '4px',
        color: "inherit",
        fontSize: '0.9em',
        fontWeight: 500,
        width: 'fit-content',
      }}
    >
      <span
        style={{
          width: 'fit-content',
          padding: "0.5rem"
        }}
      >
        {selected.label}
      </span>
      <Button
        buttonStyle="icon-label"
        className={`${baseClass}__removeButton`}
        disabled={!isEditable}
        icon="x"
        onClick={(e) => {
          e.preventDefault()
          removeRelationship()
        }}
        round
        tooltip={t('fields:removeRelationship')}
      />
    </span>
  )
}
