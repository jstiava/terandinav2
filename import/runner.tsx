// src/migrations/run-import-uploadthing-media.ts

import { downloadAndConvertProducts } from "./download-and-convert-products"
import downloadUploadThingMedia from "./download-up-media"
import { importTerandinaProducts } from "./import-products"
import { importUploadThingMedia } from "./uploadthing-import"

await importTerandinaProducts()
process.exit(0)