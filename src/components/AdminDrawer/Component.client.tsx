'use client'

import { ReactNode, useState } from "react"
import * as Drawer from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { CircleUserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/payload-types";
import TokenHealthWidget from "@/components/AdminDrawer/TokenHealthWidget";



export default function AdminDrawerClient(props: {
    children?: ReactNode,
    user: User,
    token: string
}) {

    const router = useRouter();
    const [isAdminOpen, setIsAdminOpen] = useState(false);


    return (
        <Drawer.Drawer {...{
            direction: 'right',
            open: isAdminOpen,
            onOpenChange: (open) => setIsAdminOpen(open),
        }}>
            <Drawer.DrawerTrigger asChild>
                <Button {...{
                    variant: "ghost",
                    className: `aspect-square w-11 h-fit`
                }}>
                    <CircleUserIcon />
                </Button>
            </Drawer.DrawerTrigger>
            <Drawer.DrawerContent {...{
                className: "fixed inset-y-0 right-0 left-auto z-[101] h-full w-full max-w-[30rem] flex flex-col border-l bg-background outline-none"
            }}>
                <div className="flex w-full h-screen">
                    <Drawer.DrawerTitle {...{
                        className: "sr-only"
                    }}>Admin Drawer</Drawer.DrawerTitle>
                    <div className="flex flex-col w-full h-full p-8 gap-4">
                        <span className="text-xl font-black tracking-tight">Hi, {props.user.name}</span>
                        <span className="text-base">You are seeing this panel because you are signed in.</span>
                        <TokenHealthWidget initialToken={props.token} />
                    </div>
                </div>
            </Drawer.DrawerContent>
        </Drawer.Drawer >


    )

}