'use client'
import type { LexicalEditor } from 'lexical'
import type { CollectionSlug } from 'payload'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import {
  Button,
  type ListDrawerProps,
  TextField,
  toast,
  useDocumentForm,
  useDocumentInfo,
  useField,
  useFormFields,
} from '@payloadcms/ui'
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
} from '@payloadcms/richtext-lexical/lexical'
import React, { useCallback, useEffect, useState } from 'react'

// import { useLexicalListDrawer } from '../../../../utilities/fieldsDrawer/useLexicalListDrawer.js'
import { $createRelationshipNode } from '../nodes/RelationshipNode.js'
import { INSERT_RELATIONSHIP_COMMAND } from '../plugins/index.js'
import { INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND } from './commands.js'
import { useLexicalListDrawer } from '@payloadcms/richtext-lexical/client'
import { Combobox } from '@/components/ui/combobox'
import { Popover, PopoverContent } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandInputWithStyles,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Check, Search } from 'lucide-react'
import { cn } from '@/utilities/cn.js'
import { ACTION_TRIGGERS_WITH_VARIABLES } from '@/collections/Emails/triggers.js'

const insertRelationship = ({
  editor,
  replaceNodeKey,
  selected,
}: {
  editor: LexicalEditor
  replaceNodeKey: null | string
  selected: {
    label: string
    value: string
  }
}) => {
  console.log(selected)
  if (!replaceNodeKey) {
    editor.dispatchCommand(INSERT_RELATIONSHIP_COMMAND, {
      selected,
    })
  } else {
    editor.update(() => {
      const node = $getNodeByKey(replaceNodeKey)
      if (node) {
        node.replace($createRelationshipNode({ selected }))
      }
    })
  }
}

type Props = {
  enabledCollectionSlugs: CollectionSlug[]
}

const VALID_TRIGGERS = ['iam:invite_user_by_email', 'iam:new_user_confirmed', 'user:with_successful_purchase_complete', 'user:with_subscribe_to_newsletter', 'editor:new_announcement_made']

const RelationshipDrawerComponent: React.FC<Props> = ({ enabledCollectionSlugs }) => {
  const [editor] = useLexicalComposerContext()

  const [replaceNodeKey, setReplaceNodeKey] = useState<null | string>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [value, setValue] = useState<string | null>(null)
  const document = useDocumentForm()

  const [options, setOptions] = useState<
    {
      label: string
      value: string
    }[]
  >([])
  const field = useField()

  useEffect(() => {
    console.log({
      message: 'useEffect, relationship feature',
      document,
    })
    if (!document) {
      return
    }

    const theTrigger = document.getField('action.trigger')

    if (!theTrigger) {
      return
    }

    console.log({
      theTrigger,
      options,
    })
    if (!VALID_TRIGGERS.some((x) => x === theTrigger.value)) {
      return
    }

    const newOptions = ACTION_TRIGGERS_WITH_VARIABLES.find(x => x.value == theTrigger.value);

    if (newOptions) {
      setOptions(newOptions.variables)
    }

  }, [document]);


  const onSelect = useCallback(
    (value: string) => {
      console.log({
        message: 'onSelect',
        value,
        options,
      })
      const selected = options.find((o) => o.value === value)

      if (!selected) {
        return
      }
      insertRelationship({
        editor,
        replaceNodeKey,
        selected,
      })
      // closeListDrawer()
      setIsMenuOpen(false)
    },
    [editor, replaceNodeKey, options],
  )

  useEffect(() => {
    return editor.registerCommand<{
      replace: { nodeKey: string } | false
    }>(
      INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND,
      (payload) => {
        try {
          editor.getEditorState().read(() => {
            const domSelection = window.getSelection()

            console.log(domSelection)

            if (!domSelection) {
              return null
            } else if (domSelection.anchorOffset === 0) {
              throw Error('No node')
            } else {
              const range = domSelection.getRangeAt(0)
              const rect = range.getBoundingClientRect()

              setPosition({
                x: rect.left,
                y: rect.top,
              })
            }
          })
        } catch (err) {
          console.error('Error while obtaining caret coordinates.')
          const root = editor.getRootElement()
          const rootRect = root?.getBoundingClientRect()
          setPosition({
            x: rootRect?.left ?? 0,
            y: rootRect?.top ?? 0,
          })
        }

        setReplaceNodeKey(payload?.replace ? payload?.replace.nodeKey : null)
        setIsMenuOpen(true)
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return (
    <>
      <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <PopoverContent
          style={{
            position: 'fixed',
            zIndex: 9999,
            left: position && position.x ? position.x : 0,
            top: position && position.y ? position.y : 0,
            backgroundColor: '#000',
            color: '#fff',
            width: '20rem',
            padding: '0.5rem',
          }}
        >
          <Command>
            <div
              style={{
                display: 'flex',
                height: 'fit-content',
                alignItems: 'center',
                gap: 2,
                borderBottom: '1px solid',
                padding: '0.5rem',
                marginTop: '-0.5rem',
                width: '100%',
              }}
            >
              <Search size={20} />
              <div
                style={{
                  width: '100%',
                  paddingLeft: '0.5rem',
                }}
              >
                <CommandInputWithStyles {...{
                  className: 'h-10 rounded-xs'
                }} />
              </div>
            </div>
            <CommandList>
              <CommandEmpty>No variables found for the event trigger {JSON.stringify(document.getField('action.trigger'))}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue: any) => {
                      setValue(currentValue === value ? '' : currentValue)
                      setIsMenuOpen(false)
                      onSelect(currentValue)
                    }}
                    className="popup-button-list__button"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                    }}
                  >
                    {option.label}
                    <Check
                      style={{
                        opacity: value === option.value ? 1 : 0,
                      }}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}

const RelationshipDrawerComponentFallback: React.FC = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand<{
      replace: { nodeKey: string } | false
    }>(
      INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND,
      () => {
        toast.error('No relationship collections enabled')
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return null
}

export const RelationshipDrawer = ({ enabledCollectionSlugs }: Props): React.ReactNode => {
  if (!enabledCollectionSlugs?.length) {
    return <RelationshipDrawerComponentFallback />
  }

  return <RelationshipDrawerComponent enabledCollectionSlugs={enabledCollectionSlugs} />
}
