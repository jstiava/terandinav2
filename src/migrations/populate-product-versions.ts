import type {
    MigrateUpArgs,
    MigrateDownArgs,
} from '@payloadcms/db-mongodb'

export async function up({
    payload,
    req,
}: MigrateUpArgs): Promise<void> {
    const { docs } = await payload.find({
        collection: 'products',
        limit: 0,
        pagination: false,
        req,
    })

    const VersionsModel = payload.db.versions['products']

    // Bypass Mongoose validation by using the native MongoDB collection driver
    const versionsToInsert = docs.map((product) => ({
        parent: product.id,
        version: {
            ...product,
            _status: 'published',
        },
        createdAt: product.createdAt ? new Date(product.createdAt) : new Date(),
        updatedAt: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        autosave: false,
        latest: true,
    }))

    if (versionsToInsert.length > 0) {
        // collection.insertMany bypasses Mongoose schema validation entirely
        await VersionsModel.collection.insertMany(versionsToInsert)
    }
}

export async function down({
    payload,
}: MigrateDownArgs): Promise<void> {
    const VersionsModel = payload.db.versions['products']

    await VersionsModel.collection.deleteMany({})
}