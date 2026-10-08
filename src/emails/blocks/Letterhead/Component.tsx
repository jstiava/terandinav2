'use server'
import React, { cache } from 'react'
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Button,
  Text,
} from '@react-email/components'
import fs from "fs";
import path from "path";

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
