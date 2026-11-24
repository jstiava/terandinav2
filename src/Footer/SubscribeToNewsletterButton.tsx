'use client'
import React, { useState } from 'react'


import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/utilities/cn'
import { useMediaQuery } from '@/utilities/useMediaQuery'
import { Button } from '@/components/ui/button'
import * as Dialog from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useDataStore from '@/components/useDataStore'
import handleSubscribeToNewsletter from '@/Footer/handleSubscribeToNewsletter'

export default function SubscribeToNewsletterButton() {

    const [isOpen, setIsOpen] = useState(false);
    const { data, handleChangeData } = useDataStore<{ email: string, comments: string }>(null);
    const [sending, setSending] = useState(false)

    const handleSubmit = async (e: any) => {
        setSending(true)

        try {
            if (!data?.email) {
                throw Error("No email provided.")
            }
            const result = await handleSubscribeToNewsletter({
                email_address: data?.email,
                comments: data?.comments
            })

            if (!result) {
                throw Error("Event did not complete properly.")
            }

            setSending(false);
            setIsOpen(false);
        } catch (err) {
            console.error(err)
        } finally {
            setSending(false)
        }

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
                    <Dialog.Dialog {...{
                        open: isOpen,
                        onOpenChange: setIsOpen
                    }}>
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
                                        placeholder: "your-email@provider.com",
                                        value: data?.email ?? "",
                                        onChange: handleChangeData,
                                        name: "email"
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
                                        className: "text-lg",
                                        value: data?.comments ?? "",
                                        onChange: handleChangeData,
                                        name: "comments"
                                        // value: notifyEmail ?? "",
                                        // onChange: e => {
                                        //     setNotifyEmail(e.target.value);
                                        // }
                                    }} />
                                </FieldContent>
                            </Field>
                            <Button {...{
                                disabled: !data || !data.email,
                                onClick: handleSubmit
                            }}>{sending ? 'Pending...' : "Subscribe"}</Button>
                        </Dialog.DialogContent>
                    </Dialog.Dialog>
                </FieldContent>
            </Field>
        </div>
    )
}
