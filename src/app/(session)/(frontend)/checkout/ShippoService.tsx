'use server'
import { AddressCreateRequest, ParcelCreateRequest, Shippo } from "shippo";

const shippo = new Shippo({
    apiKeyHeader: process.env.SHIPPO_TEST_TOKEN,
    // the API version can be globally set, though this is normally not required
    // shippoApiVersion: "<YYYY-MM-DD>",
});

export async function generateShippoShipment({
    addressFrom,
    addressTo,
    parcels
}: {
    addressFrom: AddressCreateRequest,
    addressTo: AddressCreateRequest,
    parcels: ParcelCreateRequest[]
}) {

    const shipment = await shippo.shipments.create({
        addressFrom,
        addressTo,
        parcels,
        async: false
    });

    if (!shipment.rates) {
        throw new Error("No shipping rates returned.")
    }

    return shipment
}

export async function purchaseShippoLabel({rateId, orderId}: {
    rateId: string,
    orderId: string
}) {

    const transaction = await shippo.transactions.create({
        rate: rateId,
        labelFileType: 'PDF_4x6',
        async: false,
        metadata: `Order ${orderId}`,
    })

    if (transaction.status !== 'SUCCESS') {
        throw new Error(
            `Label purchase failed: ${transaction.messages?.map((message) => message.text).join(', ') || transaction.status}`,
        )
    }

    const label = {
        transactionId: transaction.objectId,
        labelUrl: transaction.labelUrl,
        trackingNumber: transaction.trackingNumber,
        trackingUrl: transaction.trackingUrlProvider, 
    }

    return {
        label
    }
}