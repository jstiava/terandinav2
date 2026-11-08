'use client'

import { useState } from 'react'
import { Button, PopupList, useDocumentInfo } from '@payloadcms/ui'
import { sendTestEmail } from './EmailService'

export default function SendTestEmailButton() {
    const { id } = useDocumentInfo()
    const [sending, setSending] = useState(false)

    const handleSend = async () => {
        if (!id) return

        setSending(true)

        try {
            await sendTestEmail({
                email_id: String(id),
            })
        } catch (err) {
            console.error(err)
        } finally {
            setSending(false)
        }
    }

    return (
        <PopupList.Button
            {...{
                className: "popup-button-list__button",
                id: "action-send-test-email",
                type: "button",
                disabled: sending || !id,
                onClick: handleSend
            }}
        >
            {sending ? 'Sending...' : 'Send Test Email'}
        </PopupList.Button>
    )

}