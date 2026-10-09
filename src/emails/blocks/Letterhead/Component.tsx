'use server'
import React from 'react'
import {
  Img,
  Section,
} from '@react-email/components'

export default async function Letterhead({
  isTest = false,
  src,
  imageProps = {}
}: {
  isTest?: boolean,
  src?: string,
  imageProps?: any
}) {

  return (
    <>
      <Section {...{
        style: {
          width: "100%",
          borderTop: '2px solid #ffffff',
          margin: "0",
          backgroundColor: '#ffffff',
          height: "4rem"
        }
      }}>
        <Img {...{
          src: src ? src : isTest ? '/logos/Terandina_clear.png' : 'cid:letterhead',
          width: 80,
          height: 60,
          ...imageProps,
          style: {
            margin: "0 auto",
            display: "block",
            ...imageProps.style,
          }
        }}
        />
      </Section>
    </>
  )
}
