'use client'
import React, { useState } from 'react'


import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/utilities/cn'
import { useMediaQuery } from '@/utilities/useMediaQuery'
import { Button } from '@/components/ui/button'
import * as Dialog from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

export default function SubscribeToNewsletterButton() {

    const isMd = useMediaQuery("(min-width: 768px)");
    const [isOpen, setIsOpen] = useState(false);

    const handleSubscrbe = (e: any) => {
        // handleSub
    }

    return (
        <div className={cn(
            "flex flex-col w-full h-fit py-8 px-6 gap-4",
            "md:w-[45rem]"
        )}>
            <Field>
                <FieldLabel>Signup for email updates and promotions</FieldLabel>
                <FieldDescription>Be the first one to find out about the latest product launches and exclusive offers.</FieldDescription>
                <FieldContent>
                    <Dialog.Dialog>
                        <Dialog.DialogTrigger asChild>
                            <Input {...{
                                className: "h-12 text-lg cursor-pointer",
                            }} />
                        </Dialog.DialogTrigger>
                        <Dialog.DialogContent {...{
                            className: 'flex flex-col gap-4 items-end'
                        }}>
                            <Dialog.DialogTitle className='w-full '>Subscribe to our newsletter</Dialog.DialogTitle>
                            <Dialog.DialogDescription>We&apos;ll update you on new product offering, festivals we attend across the country, and special offerings. No more than 1 email per week.</Dialog.DialogDescription>
                            <Field>
                                <FieldLabel>Email address</FieldLabel>
                                <FieldContent>
                                    <Input {...{
                                        className: "h-12 text-lg",
                                        placeholder: "your-email@provider.com"
                                        // value: notifyEmail ?? "",
                                        // onChange: e => {
                                        //     setNotifyEmail(e.target.value);
                                        // }
                                    }} />
                                </FieldContent>
                            </Field>
                            <Field>
                                <FieldLabel>Comments</FieldLabel>
                                <FieldContent>
                                    <Textarea {...{
                                        className: "text-lg"
                                        // value: notifyEmail ?? "",
                                        // onChange: e => {
                                        //     setNotifyEmail(e.target.value);
                                        // }
                                    }} />
                                </FieldContent>
                            </Field>
                            <Button {...{
                                // disabled: !notifyEmail
                            }}>Subscribe</Button>
                        </Dialog.DialogContent>
                    </Dialog.Dialog>
                </FieldContent>
            </Field>
        </div>
    )
}
