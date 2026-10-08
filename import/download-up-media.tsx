import Mongo from '@/utilities/mongo';
import 'dotenv/config'
import { UTApi } from 'uploadthing/server'
import fs from "fs/promises"
import cliProgress from 'cli-progress'
import path from 'path'
import sharp from 'sharp';

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


const utapi = new UTApi({
    token: "TODO_TOKEN_HERE"
})

const BLANK_MEDIA = {
    width: null,
    height: null,
    mimeType: null,
    filesize: null,
    filename: null,
    url: null
};

export default async function downloadUploadThingMedia() {

    const mongo = await Mongo.getInstance();

    const products: any[] = await loadJSON('data/products.json');

    const files = await utapi.listFiles({
        limit: 1500,
        offset: 0,
    })

    const debug = {
        errors: 0,
        success: 0
    }

    progress.start(files.files.length, 0);

    for (const file of files.files) {

        if (
            file.name.startsWith('small-') ||
            file.name.startsWith('medium-') ||
            !file.name.startsWith('large-')
        ) {
            progress.increment()
            continue
        }

        try {

            const baseName = file.name.replace(/^large-/, '')


            let exampleOfUseOfLarge = null;

            for (const product of products) {
                const media = (product.media as any[]).find((media: any) => {
                    if (media.large == `https://65bog6nsnm.ufs.sh/f/${file.key}`) {
                        return true;
                    }
                    return false;
                });
                if (media) {
                    exampleOfUseOfLarge = media;
                    break;
                }

            }

            console.log(exampleOfUseOfLarge)

            if (!exampleOfUseOfLarge) {
                throw Error("No example of image use found.")
            }

            const small_stub = files.files.find(x => x.key == new URL(exampleOfUseOfLarge.small).pathname.split('/').pop()!)
            const medium_stub = files.files.find(x => x.key == new URL(exampleOfUseOfLarge.medium).pathname.split('/').pop()!)

            if (!small_stub || !medium_stub) {
                throw Error("No small or medium stub.")
            }

            const small_metadata = await getImageMetadata(exampleOfUseOfLarge.small);
            const mediu_metadata = await getImageMetadata(exampleOfUseOfLarge.medium);
            const large_metadata = await getImageMetadata(exampleOfUseOfLarge.large);

            await mongo.clientPromise.db('terandinav2').collection('media').insertOne({
                alt: "",
                _key: file.key,
                filename: `${file.name} - ${file.key}`,
                filesize: large_metadata.filesize,
                mimeType: large_metadata.mimeType,
                width: large_metadata.width,
                height: large_metadata.height,
                sizes: {
                    small: small_metadata ? {
                        ...small_metadata,
                        filename: `${small_stub.name} - ${small_metadata.key}`,
                        _key: small_metadata.key
                    } : BLANK_MEDIA,
                    medium: mediu_metadata ? {
                        ...mediu_metadata,
                        filename: `${medium_stub.name} - ${mediu_metadata.key}`,
                        _key: mediu_metadata.key
                    } : BLANK_MEDIA,
                    og: BLANK_MEDIA
                },
                url: large_metadata.url,
                thumbailURL: `https://65bog6nsnm.ufs.sh/f/${small_metadata.key}`
            })

            debug.success++;

        }
        catch (err) {
            console.log(err);
            debug.errors++;
        }


        progress.increment()
    }



    console.log(debug)

    progress.stop()
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


/**
 * {
  _id: ObjectId('6ab81b9695502312ca4edfe4'),
  createdAt: ISODate('2026-09-26T19:23:02.401Z'),
  updatedAt: ISODate('2026-09-26T19:23:02.401Z'),
  alt: 'Test image',
  _key: 'zzMJdtYlsE1V4PQfgaOGT0CKxn2LQVktEAfI7YHdZPJBgmyr',
  filename: 'pngwing.com.png',
  mimeType: 'image/png',
  filesize: NumberInt('303367'),
  width: NumberInt('800'),
  height: NumberInt('600'),
  sizes: {
    small: {
      _key: 'zzMJdtYlsE1V48oHWMMOGT0CKxn2LQVktEAfI7YHdZPJBgmy',
      width: NumberInt('70'),
      height: NumberInt('53'),
      mimeType: 'image/png',
      filesize: NumberInt('5887'),
      filename: 'pngwing.com-70x53.png'
    },
    medium: {
      _key: 'zzMJdtYlsE1V90XjcH8JtSFRG6irQEzMPUpuVxfd1bsc4O8D',
      width: NumberInt('500'),
      height: NumberInt('375'),
      mimeType: 'image/png',
      filesize: NumberInt('134711'),
      filename: 'pngwing.com-500x375.png'
    },
    og: {
      width: null,
      height: null,
      mimeType: null,
      filesize: null,
      filename: null
    }
  },
  __v: NumberInt('0')
}
 */