import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import ButtonBlock from '@/blocks/Button/Component'

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<MediaBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return `/${slug}`
}

const jsxConverters = ({ defaultConverters, variables }: any) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  heading: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    if (node.tag === 'h1') {
      return (
        <h1 className="inline-block font-canela font-black m-0 text-3xl ">
          {children}
        </h1>
      )
    }
    else if (node.tag === 'h2') {
      return (
        <h2 className="inline-block font-canela m-0 p-0 text-3xl ">
          {children}
        </h2>
      )
    }
    else if (node.tag === 'h3') {
      return (
        <h3 className="inline-block font-canela m-0 p-0 text-2xl ">
          {children}
        </h3>
      )
    }
    else if (node.tag === 'h4') {
      return (
        <h4 className="inline-block font-canela m-0 p-0 text-xl ">
          {children}
        </h4>
      )
    }

    const Tag = node.tag

    return <Tag>{children}</Tag>
  },
  variable: ({ node }: any) => {
    if (!node?.selected) return null

    try {

      const matchedValue = variables[node.selected.value]
      return (
        <span
          style={{
            display: 'inline',
          }}
        >
          {matchedValue}
        </span>
      )
    } catch (err) {
      return (
        <span
          style={{
            display: 'inline',
          }}
        >
          {JSON.stringify({
            selected: node.selected,
            variables
          })}
        </span>
      )
    }
  },
  blocks: {
    buttonBlock: ({ node }: any) => (
      <ButtonBlock {...node.fields} />
    ),
    mediaBlock: ({ node }: any) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    // emailButton: ({ node }: any) => <EmailButtonBlock {...node.fields} variables={variables} />,
    code: ({ node }: any) => <CodeBlock className="col-start-2" {...node.fields} />,
  },
})

export type Variable = {
  label: string
  value: string
  dataType: string
  format: string
}

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  variables?: Record<string, string | number>
} & React.HTMLAttributes<HTMLDivElement>


export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={(({ defaultConverters }) => {
        return jsxConverters({
          defaultConverters,
          variables: rest.variables
        })
      })}
      variables={rest.variables}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'not-prose w-full flex flex-col': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
