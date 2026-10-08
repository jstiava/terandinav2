import Image from 'next/image'
import React from 'react'

export default function Logo() {
  return (
    <Image
      alt={'Terandina LLC'}
      width={50}
      height={50}
      src="/favicon.ico"
    />
  )
}
