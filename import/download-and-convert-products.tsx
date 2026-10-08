
import fs from "fs/promises"
import path from "path"
import { Product } from "@/payload-types";
import sharp from "sharp";
import { UTApi } from 'uploadthing/server'
import { ObjectId } from 'mongodb'

import cliProgress from 'cli-progress'
import Mongo from "@/utilities/mongo";

const progress = new cliProgress.SingleBar(
    {
        format: 'Progress |{bar}| {percentage}% | {value}/{total} | {eta}s',
        barCompleteChar: '█',
        barIncompleteChar: '░',
    },
    cliProgress.Presets.shades_classic,
)


const utapi = new UTApi({
    token: "TODO_TOKEN_HERE"
})


export async function loadJSON<T>(filename: string): Promise<T> {
    const filePath = path.join(process.cwd(), "public", filename)

    const file = await fs.readFile(filePath, "utf-8")

    return JSON.parse(file) as T
}

const CONVERT_DEFAULT_SIZES: Record<string, string> = {
    'XS': "extra-small",
    "S": "small",
    "M": "medium",
    "L": "large",
    "XL": "extra-large",
    "XXL": "extra-extra-large"
}



export async function downloadAndConvertProducts() {

    const products: any[] = await loadJSON('data/products.json');

    const mongo = await Mongo.getInstance();

    const debug = {
        noImage: 0,
        image: 0
    }


    progress.start(products.length, 0)

    const input_products = [];

    for (const product of products) {

        const input_media_field = [];

        for (const image of product.media) {

            const url = new URL(image.large)
            const key = url.pathname.split('/').pop()!

            const mediaItem = await mongo.clientPromise
                .db('terandinav2')
                .collection('media')
                .findOne({
                    $or: [
                        { _key: key },
                        { url: image.large }
                    ]
                })

            if (!mediaItem) {
                console.log({
                    message: "No media",
                    mediaItem,
                    image
                })
                debug.noImage++;
                continue;
            }

            debug.image++;

            const id = new ObjectId().toHexString()

            input_media_field.push({
                image: new ObjectId(mediaItem._id.toString()),
                id
            })
        }

        const input_sizes_field = [];

        for (const [size, quantity] of Object.entries(product.sizes as Record<string, number>)) {

            const id = new ObjectId().toHexString()

            const newSizeItem = {
                label: size in CONVERT_DEFAULT_SIZES ? CONVERT_DEFAULT_SIZES[size] : "custom",
                customLabel: size in CONVERT_DEFAULT_SIZES ? undefined : size,
                count: quantity,
                id
            }

            input_sizes_field.push(newSizeItem);
        }

        const input_price_field = [];

        for (const price of product.prices) {

            const amount = (price.unit_amount / 100).toFixed(2)
            const id = new ObjectId().toHexString()

            const newPriceItem = {
                amount: Number(amount),
                currency: 'usd',
                stripe_price_id: price.id,
                active: true,
                id
            }

            input_price_field.push(newPriceItem)
        }

        const transformedProduct: Partial<Product> = {
            icons: product.icons,
            active: product.active,
            blocks: [],
            categories: [],
            color_for_google_shopping: product.color,
            description: product.description,
            details: product.details,
            images: input_media_field as any,
            name: product.name,
            notes_on_size: "",
            prices: input_price_field as any,
            sizes: input_sizes_field as any,
            slug: product.id,
            stripe_product_id: product.id,
            terandina_v1_id: product._id.$oid,
            _status: 'published',
            __v: 0,

        }

        input_products.push(transformedProduct);

        progress.increment()


    }

    progress.stop()

    console.log(debug)
    console.log("Writing...\n");


    await fs.writeFile(
        './public/data/converted_products.json',
        JSON.stringify(input_products, null, 2),
        'utf-8'
    )


    return;

}




async function getImageMetadata(urlString: string) {
    const url = new URL(urlString)

    const key = url.pathname.split('/').pop()!

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Failed to fetch ${urlString}: ${response.status}`)
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    const mimeType =
        response.headers.get('content-type') ?? 'application/octet-stream'

    const filesize = buffer.length

    const metadata = await sharp(buffer).metadata()

    const extension =
        metadata.format ??
        mimeType.split('/')[1] ??
        'bin'

    const filename = `${key}.${extension}`

    return {
        key,
        filename,
        mimeType,
        filesize,
        width: metadata.width,
        height: metadata.height,
        url: urlString
    }
}