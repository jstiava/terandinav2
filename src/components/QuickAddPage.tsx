'use client'
import { toast, TextInput } from '@payloadcms/ui'
import { useState } from 'react'
import { generateSlug } from '@/utilities/generateSlug';

const QuickAddPage = () => {
  const [title, setTitle] = useState('')

  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return

    setIsLoading(true);

    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        body: JSON.stringify({ title, slug: generateSlug(title)  }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) throw new Error(await res.text())
      toast.success(`Page "${title}" created, reloading...`)

      setTitle('')
      window.location.reload() // refresh list or change this to redirect if you prefer
    } catch (err) {
      console.error(err)
      toast.error('Failed to create page')
    }
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
            onChange={(e : any) => setTitle(e.target.value)}
            placeholder="Enter page name..."
          />
          <div className="list-header__title-actions" style={{
            width: "100%"
          }}>
            <button
              onClick={handleAdd}
              style={{
                width: '100%',
                margin: 0
              }}
              className="btn list-create-new-doc__create-new-button btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
            >
              {isLoading ? (
                 <span className="spinner" />
               ) : (
                 "Create Page"
               )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickAddPage
