'use client'
import { toast, TextInput, useAuth } from '@payloadcms/ui'
import { useState } from 'react'
import { handleInvite } from './actions'

const SendInviteEmail = () => {
  const auth = useAuth()
  const [title, setTitle] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const handleAdd = async () => {
    if (!title.trim()) return

    setIsLoading(true)

    if (!auth.user) {
      return;
    }

    try {

      console.log(auth)
      await handleInvite({
        user: {
          name: auth.user.name ?? "",
          email: auth.user.email ?? "",
        },
        recipient: {
          email: title
        }
      })
    } catch (err) {
      console.error(err)
      toast.error('Failed to send invite')
    }

      setIsLoading(false)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0 0.5rem',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          width: 'fit-content',
          alignItems: 'flex-end',
        }}
      >
        <div
          className="list-header__title-and-actions"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TextInput
            className="w-full"
            style={{
              width: '15rem',
            }}
            path="title"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            placeholder="Enter email..."
          />
          <div
            className="list-header__title-actions"
            style={{
              width: '100%',
            }}
          >
            <button
              onClick={handleAdd}
              style={{
                width: '100%',
                margin: 0,
              }}
              className="btn list-create-new-doc__create-new-button btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
            >
              {isLoading ? <span className="spinner" /> : 'Send Invite'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SendInviteEmail
