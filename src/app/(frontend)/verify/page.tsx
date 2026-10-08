
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

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
          `/api/users/verify/${encodeURIComponent(token)}`,
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
    return <p>Verifying your email...</p>
  }

  if (status === 'success') {
    return <p>Your email has been verified successfully!</p>
  }

  return (
    <p>
      We couldn&apos;t verify your email. The link may be invalid
      or expired.
    </p>
  )
}
