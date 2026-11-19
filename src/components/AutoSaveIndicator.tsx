'use client'

import React, { useState } from 'react'
import {
  Button,
  useConfig,
  useDocumentInfo,
  toast,
  useFormModified,
} from '@payloadcms/ui'

export default function AutoSaveIndicator() {

  const modified = useFormModified()

  if (!modified) {
    return null;
  }

  return (
    <span style={{
      display: "flex",
      alignItems: 'center',
      gap: "0.5rem",
      opacity: 0.5,
      animation: 'pulse 1s ease-in-out infinite',
      padding: '0 1rem'
    }}>
      <span
        style={{
          display: 'inline-block',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderTopColor: 'white',
          animation: 'spin 1s linear infinite',
        }}
      />
      Saving...
    </span>
  )
}
