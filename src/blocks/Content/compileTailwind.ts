import tailwindConfig from '../../../tailwind.config.mjs'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'

export type CompiledTailwind = {
  inline: any
  scoped: string
}

const toCamelCase = (property: string) =>
  property.startsWith('--')
    ? property
    : property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())

const isElementVariant = (selector: string) => /(?:^|\\)h[1-6]\\:/.test(selector)

const isSafelisted = (className: string) => {
  return (tailwindConfig.safelist ?? []).some((entry) => {
    if (typeof entry === 'string') return entry === className
    if (Array.isArray(entry)) return entry.includes(className)
    if (entry.pattern) return entry.pattern.test(className)
    return false
  })
}

const isSafelistedSelector = (selector: string) => {
  const className = selector.match(/^\.(.+)$/)?.[1]
  if (!className) return false

  const unescapedClassName = className.replace(/\\/g, '')
  return isSafelisted(unescapedClassName)
}

export const compileTailwind = async (props: {
  className: string
  id: string
}): Promise<CompiledTailwind> => {
  const scope = `[data-block-id="${props.id}"]`



  const classNames = props.className.split(/\s+/).filter(Boolean)
  const classesToCompile = classNames.filter((className) => !isSafelisted(className))


  console.log({
    classNames,
    classesToCompile
  })

  const result = await postcss([
    tailwindcss({
      ...tailwindConfig,
      content: [
        {
          raw: `<div class="${classesToCompile.join(' ').replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"></div>`,
          extension: 'html',
        },
      ],
      // DO NOT INCLUDE SAFELIST
      safelist: [],
      corePlugins: { preflight: false },
    }),
  ]).process('@tailwind utilities;', { from: undefined })

  result.root.walkAtRules(/^(?:-webkit-)?keyframes$/, (rule) => {
    if (rule.params === 'enter' || rule.params === 'exit') {
      rule.remove()
    }
  })

  const inline: Record<string, string> = {}
  const scopedRoot = postcss.root()

  const processNodes = (container: postcss.Container, inAtRule = false) => {
    container.each((node) => {
      if (node.type === 'atrule') {
        if (
          /^(?:-webkit-)?keyframes$/.test(node.name) &&
          ['enter', 'exit'].includes(node.params.trim())
        ) {
          node.remove()
          return
        }

        const clone = node.clone()
        processNodes(clone, true);

        clone.walkRules((rule) => {
          if (rule.selectors.every(isSafelistedSelector)) {
            rule.remove()
          }
        })

        if (clone.nodes?.length) {
          scopedRoot.append(clone)
        }
        node.remove()
        return
      }

      if (node.type !== 'rule') return

      const originalSelectors = node.selectors
      const inlineSelectors = originalSelectors.filter((selector) => {
        return (
          !inAtRule &&
          !selector.includes(':') &&
          !selector.includes(' ') &&
          !selector.includes('>') &&
          !selector.includes('~') &&
          !selector.includes('+')
        )
      })

      const canInline =
        node.parent?.type === 'root' && inlineSelectors.length === originalSelectors.length

      // Do not add safelisted selectors inline
      if (inlineSelectors.some(isSafelistedSelector)) {
        node.remove()
        return
      }

      if (canInline) {

        node.walkDecls((decl) => {
          inline[toCamelCase(decl.prop)] = decl.value
        })
        node.remove()
        return
      }

      node.selectors = originalSelectors.map((selector) => {
        const hasElementVariant = isElementVariant(selector)
        // Element variants target descendants; other variants target // the block itself unless Tailwind has already emitted a descendant.

        if (hasElementVariant) {
          return `${scope} ${selector}`
        }
        return `${scope}${selector}`
      })
    })
  }

  processNodes(result.root)

  // @ts-ignore
  result.root.each((node) => scopedRoot.append(node.clone()))

  return {
    inline,
    scoped: scopedRoot.toString(),
  }
}
