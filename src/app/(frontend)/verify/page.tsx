
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon, CircleXIcon, XIcon } from 'lucide-react'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    let cancelled = false

    async function verify() {
      try {
        const response = await fetch(
          `/api/users/verify/${encodeURIComponent(token!)}`,
          { method: 'POST' },
        )

        if (!response.ok) {
          throw new Error('Verification failed')
        }

        if (!cancelled) setStatus('success')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    void verify()

    return () => {
      cancelled = true
    }
  }, [token])

  if (status === 'loading') {
    return (
      <main className="flex min-h-[60vh] w-full items-center justify-center px-6 py-20">
        <div className="flex w-full max-w-md flex-col items-center gap-5 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-[var(--terandina-teal)]/10">
            <div className="size-7 animate-spin rounded-full border-[3px] border-[var(--terandina-teal)]/20 border-t-[var(--terandina-teal)]" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-canela text-3xl tracking-tight">
              Verifying your email
            </h1>
            <p className="font-archivo text-sm leading-6 text-muted-foreground">
              Just a moment while we confirm your email address.
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (status === 'success') {
    return (
      <main className="flex min-h-[60vh] w-full items-center justify-center px-6 py-20">
        <div className="flex w-full max-w-md flex-col items-center gap-5 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-[var(--terandina-teal)]/10 text-[var(--terandina-teal)]">
            <CheckCircleIcon />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-canela text-3xl tracking-tight">
              You&apos;re all set
            </h1>
            <p className="font-archivo text-sm leading-6 text-muted-foreground">
              Your email has been verified successfully. Your account is active.
            </p>
          </div>

          <Link
            href="/admin"
            className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-7 py-3 font-archivo text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Click to login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-[60vh] w-full items-center justify-center px-6 py-20">
      <div className="flex w-full max-w-md flex-col items-center gap-5 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
         <CircleXIcon />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-canela text-3xl tracking-tight">
            Verification unsuccessful
          </h1>
          <p className="font-archivo text-sm leading-6 text-muted-foreground">
            We couldn&apos;t verify your email. Your link may have expired or
            already been used. Please request a new verification email and try
            again.
          </p>
        </div>

        <Link
          href="/"
          className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full border border-border px-7 py-3 font-archivo text-sm font-medium transition-colors hover:bg-muted"
        >
          Return home
        </Link>
      </div>
    </main>
  )

}
