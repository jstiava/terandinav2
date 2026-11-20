'use server'

import configPromise from '@payload-config'
import {
  getPayload,
  RequiredDataFromCollection,
} from 'payload'

export async function getCategoryById(props: {
    ids: string[]
}) {

    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
        collection: 'categories',
        pagination: false, 
        where: {
          id: {
            in: props.ids
          },
        },
      })

    return result.docs;
}