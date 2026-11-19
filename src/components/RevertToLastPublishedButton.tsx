'use client'

import React, { useState } from 'react'
import {
  Button,
  useConfig,
  useDocumentInfo,
  toast,
  useFormModified,
} from '@payloadcms/ui'

export default function RevertToLastPublishedButton() {
  
  const { id, collectionSlug, globalSlug, hasPublishedDoc } = useDocumentInfo()
  const { config } = useConfig()
  const [isReverting, setIsReverting] = useState(false)

  const handleRevertToPublished = async () => {
    setIsReverting(true)
    try {
      const apiRoute = config.routes?.api || '/api'

      // 1. Find the latest published version ID
      const versionsUrl = globalSlug
        ? `${apiRoute}/globals/${globalSlug}/versions?where[version._status][equals]=published&sort=-updatedAt&limit=1`
        : `${apiRoute}/${collectionSlug}/versions?where[parent][equals]=${id}&where[version._status][equals]=published&sort=-updatedAt&limit=1`

      const versionsRes = await fetch(versionsUrl, {
        credentials: 'include',
      })

      if (!versionsRes.ok) {
        throw new Error('Failed to fetch published version')
      }

      const versionsData = await versionsRes.json()
      const publishedVersion = versionsData?.docs?.[0]

      if (!publishedVersion?.id) {
        toast.error('No published version found to revert to')
        return
      }

      // 2. Restore that published version (creates a new version matching the published state)
      const restoreUrl = globalSlug
        ? `${apiRoute}/globals/${globalSlug}/versions/${publishedVersion.id}`
        : `${apiRoute}/${collectionSlug}/versions/${publishedVersion.id}`

      const restoreRes = await fetch(restoreUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ draft: false }),
      })

      if (!restoreRes.ok) {
        throw new Error('Failed to restore published version')
      }

      toast.success('Reverted to last published version')

      // 3. Reload the editor so form state, live preview, and version history sync cleanly
      window.location.reload()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to revert changes',
      )
    } finally {
      setIsReverting(false)
    }
  }

  // Only show when a published version exists to revert back to
  // if (!hasPublishedDoc) return null

  return (
    <Button
      buttonStyle="secondary"
      size="medium"
      type="button"
      onClick={handleRevertToPublished}
      disabled={isReverting}
    >
      {isReverting ? 'Reverting...' : 'Revert to last published'}
    </Button>
  )
}
