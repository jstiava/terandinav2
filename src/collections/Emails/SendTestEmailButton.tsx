'use client'

import { useState } from 'react'
import { Button, useDocumentInfo } from '@payloadcms/ui'
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
        <Button
            type="button"
            buttonStyle="secondary"
            size="medium"
            disabled={sending || !id}
            onClick={handleSend}
        >
            {sending ? 'Sending...' : 'Send Test Email'}
        </Button>
    )
}