import { menuItem } from '@/fields/menuItem'
import type { Block } from 'payload'

export const ButtonBlock: Block = {
    slug: 'buttonBlock',
    labels: {
        plural: "Buttons",
        singular: "Button"
    },
    interfaceName: 'ButtonBlock',
    fields: [
        menuItem({
            appearances: false,
            disableImage: true,
        }),
    ],
}
