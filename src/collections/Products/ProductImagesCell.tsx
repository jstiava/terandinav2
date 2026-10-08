"use server"

import { Media, Product } from "@/payload-types";

type Image = NonNullable<Product["images"]>[number]

export default async function ProductImagesCell(props: any) {

  const { cellData, rowData, field, collectionSlug } = props

  return (
    <div className="flex w-full gap-0">
      {cellData.slice(0, 4).map((item: Image, index: number) => {
        const image = item.image as Media;

        if (index != 0) {
          return null;
        }

        if (!image?.url) return null;

        return (
          <img
            key={item.id}
            {...{
              src: image.thumbnailURL || image.url,
              alt: image.alt || "",
              className: "size-6 rounded-sm object-cover"
            }}
          />
        )

      })}
    </div>
  )
}