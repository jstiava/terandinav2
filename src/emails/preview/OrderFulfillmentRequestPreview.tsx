// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import { EmailBlockType } from '@/collections/Emails/config';
import { CheckoutDetailsType, ProductType } from '@/components/Cart/CartProviderComponent';
import EmailRoot from '@/emails/components/EmailRoot';
import OrderFulfillmentRequest from '@/emails/templates/OrderFulfillmentRequest';
import { Tailwind } from '@react-email/tailwind';
import { Block } from 'payload';
import { ComponentProps } from 'react';
import { Rate } from 'shippo';


function OrderFulfillmentRequestPreview(props: {
    variables: {
        checkoutDetails: Partial<CheckoutDetailsType>
        items: ProductType[],
        rates: Rate[],

    },
    blocks: EmailBlockType[]
}) {

    return (

        <EmailRoot>
            <OrderFulfillmentRequest {...props} />
        </EmailRoot>
    )
};

OrderFulfillmentRequestPreview.PreviewProps = {
    blocks: [],
    variables: {
        checkoutDetails: {
            
            billingAddress: {
                address: {
                    city: 'City',
                    line1: 'Line 1',
                    line2: 'Line 2',
                    country: 'Country ',
                    postal_code: 'Zipcode',
                    state: 'State'
                },
                complete: true,
                emailAddress: 'test@email.com',
                firstName: 'First name',
                lastName: 'Last name',
                name: "First last"
            },
            deliveryTo: {
                address: {
                    line1: 'Line 1',
                    line2: 'Line 2',
                    city: 'City',
                    country: 'Country',
                    postal_code: 'Zipcode',
                    state: 'State'
                },
                complete: false
            },
            clientSecret: '',
            emailAddress: 'test@email.com',
            isSendMeMarketingEmails: true,
            isShippingSameAsBillingAddress: true,
            paymentIntentId: 'my_intent',
            pickup: 'delivery',
            subtotal: 5600,
            tax: 500,
            totalDue: 6100
        },
        items: [
            // @ts-ignore
            {
                quantity: 1,
                size: '6ab976e072cb34343eca8530',
                product: { "icons": ["ships_from_us", "returns", "hypoallergenic", "indigenous_artisans"], "active": true, "blocks": [], 
                    // @ts-ignore
                    "categories": [{ "createdAt": "2026-10-04T01:14:29.643Z", "updatedAt": "2026-10-04T01:14:29.643Z", "pageActive": false, "type": "category", "_status": "draft", "products": { "docs": ["6ab976e98d6b564444181153", "6ab976e98d6b564444181158", "6ab976e98d6b56444418115f", "6ab976e98d6b564444181162", "6ab976e98d6b56444418117a", "6ab976e98d6b56444418118b", "6ab976e98d6b564444181190", "6ab976e98d6b564444181195", "6ab976e98d6b564444181196"], "hasNextPage": false }, "id": "6ac1a8755fbb6b876411f864", "images": [], "blocks": [] }], "color_for_google_shopping": "blue", "description": "Add a unique and cozy touch to any bed, sofa, or chair in your home with our luxurious alpaca blankets. Made in the Andes Mountains by members of our Indigenous Quechua community, these blankets offer durability, warmth, and exceptional softness - perfect for cool evenings, camping, or indoor lounging. \n\nHaving been used by ancient Andean civilizations, alpaca fibers are known for their warmth, breathability, and superior comfort. They remain lightweight and versatile, making them perfect for any season. ", "details": "-\t80% Alpaca, 20% Acrylic Fibers\n-\tQueen Size\n-\tMade with Hypoallergenic Alpaca\n-\tMachine Wash Cold, Lay Flat to Dry\n\nCheck our size guide for measurements.\n\nPlease note that slight variations in color and pattern may occur. ", "images": [{ "image": { "alt": "", "_key": "zzMJdtYlsE1VWRn6NspbWx4rJP6pLcjsV3OiYG1FZzX0oISm", "filename": "large-Coyote Blue - Alpaca Blanket.webp - zzMJdtYlsE1VWRn6NspbWx4rJP6pLcjsV3OiYG1FZzX0oISm", "filesize": 73948, "mimeType": "image/webp", "width": 1000, "height": 1000, "sizes": { "small": { "filename": "small-Coyote Blue - Alpaca Blanket.webp - zzMJdtYlsE1VR4G4TLreHNn8vkTrigjfJM93GLYEqAo2shw4", "mimeType": "image/webp", "filesize": 872, "width": 70, "height": 70, "url": "/api/media/file/small-Coyote%20Blue%20-%20Alpaca%20Blanket.webp%20-%20zzMJdtYlsE1VR4G4TLreHNn8vkTrigjfJM93GLYEqAo2shw4", "_key": "zzMJdtYlsE1VR4G4TLreHNn8vkTrigjfJM93GLYEqAo2shw4" }, "medium": { "filename": "medium-Coyote Blue - Alpaca Blanket.webp - zzMJdtYlsE1VG8nbB9RMES2fjD38qg5Oce60CaQU9TpBkiY7", "mimeType": "image/webp", "filesize": 13884, "width": 500, "height": 500, "url": "/api/media/file/medium-Coyote%20Blue%20-%20Alpaca%20Blanket.webp%20-%20zzMJdtYlsE1VG8nbB9RMES2fjD38qg5Oce60CaQU9TpBkiY7", "_key": "zzMJdtYlsE1VG8nbB9RMES2fjD38qg5Oce60CaQU9TpBkiY7" }, "og": { "width": null, "height": null, "mimeType": null, "filesize": null, "filename": null, "url": null } }, "url": "/api/media/file/large-Coyote%20Blue%20-%20Alpaca%20Blanket.webp%20-%20zzMJdtYlsE1VWRn6NspbWx4rJP6pLcjsV3OiYG1FZzX0oISm", "id": "6ab96c81846e3ca2f38f53d6", "thumbnailURL": "/api/media/file/small-Coyote%20Blue%20-%20Alpaca%20Blanket.webp%20-%20zzMJdtYlsE1VR4G4TLreHNn8vkTrigjfJM93GLYEqAo2shw4" }, "id": "6ab976e072cb34343eca852e" }, { "image": { "alt": "", "_key": "zzMJdtYlsE1VmCN3i0QH63fTpSAwXbsZoj2LkKa57zJGPNed", "filename": "large-Coyote Blue Blanket 2_.jpg.webp - zzMJdtYlsE1VmCN3i0QH63fTpSAwXbsZoj2LkKa57zJGPNed", "filesize": 1520233, "mimeType": "image/webp", "width": 2500, "height": 2500, "sizes": { "small": { "filename": "small-Coyote Blue Blanket 2_.jpg.webp - zzMJdtYlsE1VAmxI4zZKW0PxzJLQ5fOq2BZ6Y8vhrdwji1Rp", "mimeType": "image/webp", "filesize": 2006, "width": 70, "height": 70, "url": "/api/media/file/small-Coyote%20Blue%20Blanket%202_.jpg.webp%20-%20zzMJdtYlsE1VAmxI4zZKW0PxzJLQ5fOq2BZ6Y8vhrdwji1Rp", "_key": "zzMJdtYlsE1VAmxI4zZKW0PxzJLQ5fOq2BZ6Y8vhrdwji1Rp" }, "medium": { "filename": "medium-Coyote Blue Blanket 2_.jpg.webp - zzMJdtYlsE1VLO9GHLgJ0D3Abj4yxCG5BtvnONUsoHlqheaz", "mimeType": "image/webp", "filesize": 38536, "width": 500, "height": 500, "url": "/api/media/file/medium-Coyote%20Blue%20Blanket%202_.jpg.webp%20-%20zzMJdtYlsE1VLO9GHLgJ0D3Abj4yxCG5BtvnONUsoHlqheaz", "_key": "zzMJdtYlsE1VLO9GHLgJ0D3Abj4yxCG5BtvnONUsoHlqheaz" }, "og": { "width": null, "height": null, "mimeType": null, "filesize": null, "filename": null, "url": null } }, "url": "/api/media/file/large-Coyote%20Blue%20Blanket%202_.jpg.webp%20-%20zzMJdtYlsE1VmCN3i0QH63fTpSAwXbsZoj2LkKa57zJGPNed", "id": "6ab96c44846e3ca2f38f5389", "thumbnailURL": "/api/media/file/small-Coyote%20Blue%20Blanket%202_.jpg.webp%20-%20zzMJdtYlsE1VAmxI4zZKW0PxzJLQ5fOq2BZ6Y8vhrdwji1Rp" }, "id": "6ab976e072cb34343eca852f" }], "name": "Coyote Blue - Alpaca Blanket", "notes_on_size": "", "prices": [{ "id": "6ab976e072cb34343eca8531", "amount": 135, "currency": "usd", "stripe_price_id": "price_1R7s1uBNjcHRVZ2abrodAwgV", "active": true }], "sizes": [{ "label": "custom", "customLabel": "Queen", "count": 3, "id": "6ab976e072cb34343eca8530" }], "slug": "prod_S1vtky1WoopgwJ", "stripe_product_id": "prod_S1vtky1WoopgwJ", "terandina_v1_id": "67e865f5919195baa4222c57", "_status": "published", "updatedAt": "2026-10-07T16:01:39.695Z", "parcel": { "createdAt": "2026-10-07T15:44:50.385Z", "updatedAt": "2026-10-07T15:44:50.385Z", "name": "Blanket Parcel", "width": 16, "height": 6, "length": 20, "weight": 5, "products": { "docs": ["6ab976e98d6b56444418118b"], "hasNextPage": false }, "id": "6ac668f2e29686486212549a" }, "id": "6ab976e98d6b56444418118b" },
            }
        ],
        rates: [
            {
                "amount": "8.07",
                "amountLocal": "8.07",
                "currency": "USD",
                "currencyLocal": "USD",
                "attributes": [],
                "carrierAccount": "85f3429352074cbd9e0edb0ffa822f9e",
                "durationTerms": "Delivery within 1, 2, or 3 days based on where your package started and where it’s being sent.",
                "estimatedDays": 3,
                "messages": [],
                // @ts-ignore
                "objectCreated": "2026-10-10T23:03:58.447Z",
                "objectId": "0145bc5b68d446c6afa09b5eab686a5f",
                "objectOwner": "jeremystiava@gmail.com",
                "provider": "USPS",
                "providerImage75": "https://shippo-static.s3.amazonaws.com/providers/75/USPS.png",
                "providerImage200": "https://shippo-static.s3.amazonaws.com/providers/200/USPS.png",
                "servicelevel": {
                    "name": "Priority Mail",
                    "terms": "",
                    "token": "usps_priority",
                    "extendedToken": "usps_priority"
                },
                "shipment": "670d33fe3d9240b99afe334685e7ded9",
                "test": true,
                "zone": "1"
            },
            {
                "amount": "54.01",
                "amountLocal": "54.01",
                "currency": "USD",
                "currencyLocal": "USD",
                "arrivesBy": "08:30:00",
                "attributes": [
                    "FASTEST"
                ],
                "carrierAccount": "1319724cf8d04c72b9b0fec83a7923fa",
                "durationTerms": "Next business day delivery by 8:30 a.m., 9:00 a.m., or 9:30 a.m. ",
                "estimatedDays": 1,
                "messages": [],
                // @ts-ignore
                "objectCreated": "2026-10-10T23:03:58.447Z",
                "objectId": "1d3a8cf175dc450a9481f2a50eacb3fb",
                "objectOwner": "jeremystiava@gmail.com",
                "provider": "UPS",
                "providerImage75": "https://shippo-static.s3.amazonaws.com/providers/75/UPS.png",
                "providerImage200": "https://shippo-static.s3.amazonaws.com/providers/200/UPS.png",
                "servicelevel": {
                    "name": "Next Day Air® Early",
                    "terms": "",
                    "token": "ups_next_day_air_early_am",
                    "extendedToken": "ups_next_day_air_early_am"
                },
                "shipment": "670d33fe3d9240b99afe334685e7ded9",
                "test": true
            },
            {
                "amount": "7.56",
                "amountLocal": "7.56",
                "currency": "USD",
                "currencyLocal": "USD",
                "attributes": [
                    "BESTVALUE"
                ],
                "carrierAccount": "1319724cf8d04c72b9b0fec83a7923fa",
                "durationTerms": "Delivery times vary. Delivered usually in 1-5 business days.",
                "estimatedDays": 2,
                "messages": [],
                // @ts-ignore
                "objectCreated": "2026-10-10T23:03:58.447Z",
                "objectId": "1f293a1a9aca4168a0a557c4300ad1ec",
                "objectOwner": "jeremystiava@gmail.com",
                "provider": "UPS",
                "providerImage75": "https://shippo-static.s3.amazonaws.com/providers/75/UPS.png",
                "providerImage200": "https://shippo-static.s3.amazonaws.com/providers/200/UPS.png",
                "servicelevel": {
                    "name": "Ground",
                    "terms": "",
                    "token": "ups_ground",
                    "extendedToken": "ups_ground"
                },
                "shipment": "670d33fe3d9240b99afe334685e7ded9",
                "test": true
            }
        ]
    }
} satisfies ComponentProps<typeof OrderFulfillmentRequestPreview>;

export default OrderFulfillmentRequestPreview;
