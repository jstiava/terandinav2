import { PayloadRequest } from 'payload'

const collectionPrefixMap: Partial<Record<string, string>> = {
  pages: '',
  products: '/product',
  categories: '/category',
  emails: '/email',
  header: '/header'
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug?: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    const encodedParams = new URLSearchParams({
      collection,
      path: `${collectionPrefixMap[collection]}`,
      previewSecret: process.env.PREVIEW_SECRET || '',
    })

    const url = `/next/preview?${encodedParams.toString()}`

    return url;
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path: `${collectionPrefixMap[collection]}/${encodedSlug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
