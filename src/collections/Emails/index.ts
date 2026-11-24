


export const EMAILS_FROM = 'Terandina LLC <no-reply@terandina.com>'


export async function richTextToPlainText(
    doc:
        | {
            type: string
            children: {
                type: any
                version: number
                [k: string]: unknown
            }[]
            direction: ('ltr' | 'rtl') | null
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
            indent: number
            version: number
        }
        | undefined,
    variables?: Record<string, any>,
): Promise<string> {
    if (!doc) return ''

    let output = ''

    const walk = (nodes: any[]) => {
        if (!nodes) return
        for (const n of nodes) {
            if (n.type === 'text') {
                // text node
                output += n.text
            } else if (n.type === 'variable' && variables) {
                const selected = n.selected
                const theVariable = variables[selected.value]
                output += `${theVariable}`
            }

            if (n.children) {
                // walk deeper
                walk(n.children)
            }
        }
    }

    walk(Array.isArray(doc) ? doc : doc.children)

    return output.trim()
}
