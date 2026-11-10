
import fs from "fs/promises"
import path from "path"
import cliProgress from 'cli-progress'
import Mongo from "../src/utilities/mongo";
import { ObjectId } from "mongodb";
import { EJSON } from "bson";

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

    const products: any[] = await loadJSON('data/products.json');


    progress.start(products.length, 0);


    for (const product of products) {

        // const id = randomBytes(12).toString('hex');

        const newProduct = {
            ...product,
            _id: new ObjectId(),
            images: product.images.map(x => ({
                image: x.image['$oid'] ? new ObjectId(x.image['$oid']) : new ObjectId(x.image),
                id: new ObjectId().toString()
            })),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await mongo.clientPromise.db('terandinav2').collection('products').insertOne(newProduct);

        await mongo.clientPromise.db('terandinav2').collection('_products_versions').insertOne({
            _id: new ObjectId(),
            parent: newProduct._id,
            version: newProduct,
            createdAt: new Date(),
            updatedAt: new Date(),
            autosave: false,
            "__v": 0,
            latest: true
        });

        progress.increment()

    }


    progress.stop()


}
