

import { Button } from "@/components/ui/button";
import { ButtonBlock as ButtonBlockProps } from '@/payload-types'

export default function ButtonBlock({ menuItem }: ButtonBlockProps) {

    if (menuItem.type == 'reference') {
        return (
            <Button {...{
                asChild: true,
                className: menuItem.className ?? ""
            }}>
                <a {...{
                    href: (menuItem.reference?.value as any).slug ?? "",
                }}>{menuItem.label ?? (menuItem.reference?.value as any).name}</a>
            </Button>
        )
    }

    if (menuItem.type == 'custom') {
        return (
            <Button {...{
                asChild: true,
                className: menuItem.className ?? ""
            }}>
                <a {...{
                    href: menuItem.url ?? ""
                }}>{menuItem.label}</a>
            </Button>
        )
    }
    if (menuItem.type == 'label') {

        return (
            <Button {...{
                asChild: true,
                className: menuItem.className ?? ""
            }}>
                {menuItem.label}
            </Button>
        )
    }

    return <span>{JSON.stringify(menuItem, null, 2)}</span>
}