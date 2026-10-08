'use client'
import React from 'react'


import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/utilities/cn'
import * as Drawer from '@/components/ui/drawer'
import { useMediaQuery } from '@/utilities/useMediaQuery'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function SubscribeToNewsletterButton() {

    const isMd = useMediaQuery("(min-width: 768px)")

    return (
        <div className={cn(
            "flex flex-col w-full h-fit py-8 px-6 gap-4",
            "md:w-[45rem]"
        )}>
            <Field>
                <FieldLabel>Signup for email updates and promotions</FieldLabel>
                <FieldDescription>Be the first one to find out about the latest product launches and exclusive offers.</FieldDescription>
                <FieldContent>
                    <Drawer.Drawer {...{
                        direction: isMd ? 'left' : 'bottom',
                    }}>
                        <Drawer.DrawerTrigger>
                            <Input />
                        </Drawer.DrawerTrigger>
                        <Drawer.DrawerContent {...{
                            className: isMd ? "fixed inset-y-0 left-0 right-auto z-[101] h-full w-full max-w-[30rem] flex flex-col border-l bg-background outline-none" : "h-fit w-full"
                        }}>
                            <Drawer.DrawerTitle {...{
                                className: "sr-only"
                            }}>Subscribe to our newsletter</Drawer.DrawerTitle>
                            <div className="flex flex-col w-full h-fit">

                                <div {...{
                                    className: "flex w-full h-fit aspect-square bg-border bg-center bg-no-repeat bg-cover",

                                }} />

                                <div className="flex flex-col p-6 gap-6 pb-10">
                                    <h1 {...{
                                        className: "font-bold uppercase text-sm"
                                    }}>Subscribe to our newsletter</h1>
                                    <span {...{
                                        className: "text-xs"
                                    }}>We&apos;ll update you on new product offering, festivals we attend across the country, and special offerings. No more than 1 email per week.</span>

                                    <Field>
                                        <FieldLabel>Email address</FieldLabel>
                                        <FieldContent><Input /></FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Comments</FieldLabel>
                                        <FieldContent><Textarea {...{
                                            rows: 4
                                        }} /></FieldContent>
                                    </Field>
                                    <Button>Subscribe</Button>
                                </div>
                            </div>
                        </Drawer.DrawerContent>
                    </Drawer.Drawer>
                </FieldContent>
            </Field>
        </div>
    )
}
