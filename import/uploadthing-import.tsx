import { getPayload } from 'payload'
import { UTApi } from 'uploadthing/server'

const UPLOADTHING_APP_ID = "65bog6nsnm"
const utapi = new UTApi({
  token: "TOKEN HERE"
})

export async function importUploadThingMedia() {
  // const payload = await getPayload({
  //   config: configPromise,
  // })

  let offset = 0
  const limit = 500

  let imported = 0
  let skipped = 0

  while (true) {
    const result = await utapi.listFiles({
      limit,
      offset,
    })

    const files = result.files

    if (!files.length) {
      break
    }

    console.log(files)

    // for (const file of files) {
    //   const filename = file.name

    //   // Prevent duplicate imports
    //   const existing = await payload.find({
    //     collection: 'media',
    //     where: {
    //       filename: {
    //         equals: filename,
    //       },
    //     },
    //     limit: 1,
    //   })

    //   if (existing.docs.length > 0) {
    //     console.log(`Skipping existing file: ${filename}`)
    //     skipped++
    //     continue
    //   }

    //   const fileKey = file.key

    //   const appId = process.env.UPLOADTHING_APP_ID

    //   if (!appId) {
    //     throw new Error(
    //       'UPLOADTHING_APP_ID is not configured',
    //     )
    //   }

    //   const url = `https://${appId}.ufs.sh/f/${fileKey}`

    //   await payload.db.collections.media.insertOne({
    //     filename,
    //     mimeType: file.type,
    //     filesize: file.size,
    //     url,
    //     width: file.width ?? undefined,
    //     height: file.height ?? undefined,
    //   })

    //   console.log(`Imported: ${filename}`)

    //   imported++
    // }

    // offset += files.length

    // if (files.length < limit) {
    //   break
    // }
  }

  console.log('')
  console.log('UploadThing migration complete')
  console.log(`Imported: ${imported}`)
  console.log(`Skipped: ${skipped}`)
}