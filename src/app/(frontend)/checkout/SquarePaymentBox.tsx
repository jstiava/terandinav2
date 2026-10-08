'use client'

import { CartProvider } from '@/components/Cart/CartProviderComponent'
import { Button } from '@/components/ui/button'
import { LockIcon } from 'lucide-react'
import Script from 'next/script'
import { useContext, useEffect, useRef, useState } from 'react'
import PayNowButton from './PayNowButton'
import AcceptedCards from './AcceptedCards'

export default function SquarePaymentBox({ amount }: { amount: number }) {
  const cardRef = useRef<any>(null)
  const initializingRef = useRef(false)

  const [squareLoaded, setSquareLoaded] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!squareLoaded) return

    let cancelled = false

    async function initializeSquare() {
      if (initializingRef.current || cardRef.current) return
      initializingRef.current = true

      try {
        setInitializing(true)

        if (!window.Square) {
          throw new Error('Square.js has not loaded')
        }

        const payments = window.Square.payments(
          'sandbox-sq0idb-NZA_DL8678BtDG2ki0QzsA',
          'LJ04DKJQH79JM',
        )

        const card = await payments.card()

        if (cancelled) {
          card.destroy()
          return
        }

        await card.attach('#square-card-container')

        cardRef.current = card

        if (!cancelled) {
          setReady(true)
        }
      } catch (err) {
        console.error({
          message: 'Unable to load payment form',
          err,
        })
        setError('Unable to load payment form.')
      } finally {
        if (!cancelled) {
          setInitializing(false)
          initializingRef.current = false
        }
      }
    }

    initializeSquare()

    return () => {
      cancelled = true
      const card = cardRef.current
      cardRef.current = null

      if (card) {
        card.destroy?.()
      }
    }
  }, [squareLoaded])

  return (
    <>
      <Script
        src="https://sandbox.web.squarecdn.com/v1/square.js"
        strategy="afterInteractive"
        onLoad={() => setSquareLoaded(true)}
        onError={() => setError('Unable to load Square.')}
      />

      <div className="relative">

        {/* Loading block */}
        {!ready && !error && (
          <div className="rounded-lg border p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-10 rounded bg-gray-200" />
              <div className="h-10 rounded bg-gray-200" />
              <div className="h-10 rounded bg-gray-200" />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              {initializing ? 'Initializing payment form...' : 'Loading payment form...'}
            </p>
          </div>
        )}

        <AcceptedCards />

        {/* Square mounts here */}
        <div id="square-card-container" className={!ready ? 'hidden' : ''} />


        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex gap-1 items-center text-xs">
        <LockIcon
          {...{
            className: 'size-3',
          }}
        />
        <span>Secured with Square</span>
      </div>
      <PayNowButton
        {...{
          cardRef,
        }}
      />
    </>
  )
}
