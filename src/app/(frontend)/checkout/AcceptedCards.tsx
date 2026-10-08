'use client'


import Image from 'next/image'

export default function AcceptedCards() {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="shrink-0 text-xs text-muted-foreground">
        We accept
      </span>

      <div className="flex items-center gap-1.5">
        <Image
          src={`/payment_providers.png`}
          alt={'We accept the following credit cards.'}
          width={200}
          height={20}
          className="h-auto max-h-5 w-auto"
        />
      </div>
    </div>
  )
}
