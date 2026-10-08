import type { SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode.js'
import type { CollectionSlug, DataFromCollectionSlug } from 'payload'
import type { JSX } from 'react'

import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode.js'
import { addClassNamesToElement } from '@lexical/utils'
import {
  $applyNodeReplacement,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type ElementFormatType,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
} from 'lexical'
import { StronglyTypedLeafNode } from '@payloadcms/richtext-lexical'
import { serialize } from 'node_modules/cheerio/dist/esm/api/forms'

// import type { StronglyTypedLeafNode } from '../../../../nodeTypes.js'

export type RelationshipData = {
  selected: {
    label: string,
    value: string
  }
}

export type SerializedRelationshipNode = RelationshipData &
  StronglyTypedLeafNode<SerializedDecoratorBlockNode, 'relationship'>

function $relationshipElementToServerNode(domNode: HTMLDivElement): DOMConversionOutput | null {
  const value = domNode.getAttribute('data-lexical-variable-id')
   const label = domNode.getAttribute('data-lexical-variable-label')

  if (value != null && label != null) {
    const node = $createServerRelationshipNode({
      selected: {
        value, label
      }
    })
    return { node }
  }
  return null
}

export class RelationshipServerNode extends DecoratorBlockNode {
  __data: RelationshipData

  constructor({
    data,
    format,
    key,
  }: {
    data: RelationshipData
    format?: ElementFormatType
    key?: NodeKey
  }) {
    super(format, key)
    this.__data = data
  }

  static override clone(node: RelationshipServerNode): RelationshipServerNode {
    return new this({
      data: node.__data,
      format: node.__format,
      key: node.__key,
    })
  }

  static override getType(): string {
    return 'variable'
  }

  static override importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      div: (domNode: HTMLDivElement) => {
        if (
          !domNode.hasAttribute('data-lexical-variable-id')
        ) {
          return null
        }
        return {
          conversion: $relationshipElementToServerNode,
          priority: 2,
        }
      },
    }
  }

  static override importJSON(serializedNode: SerializedRelationshipNode): RelationshipServerNode {

    const importedData: RelationshipData = {
      selected: serializedNode.selected
    }
    const node = $createServerRelationshipNode(importedData)
    node.setFormat(serializedNode.format)
    return node
  }

  static isInline(): true {
    return true
  }

  // @ts-expect-error
  isInline() {
    return true;
  }

  override createDOM(config?: EditorConfig): HTMLElement {
    const element = document.createElement('span')
    addClassNamesToElement(element, config?.theme?.relationship)
    element.style.display = "inline-flex";
    element.style.padding = "0";
    return element
  }

  override decorate(_editor: LexicalEditor, _config: EditorConfig): JSX.Element {
    return null as unknown as JSX.Element
  }

  override exportDOM(): DOMExportOutput {
    const element = document.createElement('div')
    element.setAttribute(
      'data-lexical-variable-id',
      String(this.__data?.selected?.value),
    )
    element.setAttribute(
      'data-lexical-variable-label',
      String(this.__data?.selected?.label),
    )

    const text = document.createTextNode(this.getTextContent())
    element.append(text)
    return { element }
  }

  override exportJSON(): SerializedRelationshipNode {
    return {
      ...super.exportJSON(),
      ...this.getData(),
      type: 'variable' as any,
      version: 2,
    }
  }

  getData(): RelationshipData {
    return this.getLatest().__data
  }

  override getTextContent(): string {
    return `${this.__data?.selected.label} (${this.__data?.selected.value})`
  }

  setData(data: RelationshipData): void {
    const writable = this.getWritable()
    writable.__data = data
  }
}

export function $createServerRelationshipNode(data: RelationshipData): RelationshipServerNode {
  return $applyNodeReplacement(
    new RelationshipServerNode({
      data,
    }),
  )
}

export function $isServerRelationshipNode(
  node: LexicalNode | null | RelationshipServerNode | undefined,
): node is RelationshipServerNode {
  return node instanceof RelationshipServerNode
}
