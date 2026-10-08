
import fs from "fs/promises"
import path from "path"
import { Product } from "@/payload-types";
import sharp from "sharp";
import configPromise from '@payload-config'

import cliProgress from 'cli-progress'
import { randomBytes } from "crypto";
import { getPayload } from "payload";
import Mongo from "@/utilities/mongo";

const progress = new cliProgress.SingleBar(
    {
        format: 'Progress |{bar}| {percentage}% | {value}/{total} | {eta}s',
        barCompleteChar: '█',
        barIncompleteChar: '░',
    },
    cliProgress.Presets.shades_classic,
)


export async function loadJSON<T>(filename: string): Promise<T> {
    const filePath = path.join(process.cwd(), "public", filename)

    const file = await fs.readFile(filePath, "utf-8")

    return JSON.parse(file) as T
}



export async function importTerandinaProducts() {

    const mongo = await Mongo.getInstance();

    const products: any[] = await loadJSON('data/converted_products.json');


    progress.start(products.length, 0);


    for (const product of products) {

        // const id = randomBytes(12).toString('hex');

        await mongo.clientPromise.db('terandinav2').collection('products').insertOne(product)

        progress.increment()

    }


    progress.stop()


}
