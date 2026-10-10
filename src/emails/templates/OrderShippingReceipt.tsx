// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import EmailRoot from '@/emails/components/EmailRoot';
import { PROD_WEBSITE_URI } from '@/emails/templates/VerificationEmail';
import { Media, Product } from '@/payload-types';
import {
    Column,
    Container,
    Heading,
    Hr,
    Img,
    Link,
    Row,
    Section,
    Text,
} from '@react-email/components';
import { ComponentProps } from 'react';


function NikeReceiptEmail(props: {
    items: Product[]
}) {

    return (

        <EmailRoot>
            {/* <Preview>
                Get your order summary, estimated delivery date and more
            </Preview> */}
            <Container className="my-[10px] mx-auto w-[600px] max-w-full border border-[#E5E5E5]">
                {/* <Section className="py-[22px] px-10 bg-[#F7F7F7]">
                    <Row>
                        <Column>
                            <Text className="m-0 text-[14px] leading-[2] font-bold">
                                Tracking Number
                            </Text>
                            <Text className="mt-3 mb-0 font-medium text-[14px] leading-[1.4] text-[#6F6F6F]">
                                1ZV218970300071628
                            </Text>
                        </Column>
                        <Column align="right">
                            <Link className="border border-solid border-[#929292] text-[16px] no-underline py-[10px] px-0 w-[220px] block text-center font-medium text-black">
                                Track Package
                            </Link>
                        </Column>
                    </Row>
                </Section>
                <Hr className="border-[#E5E5E5] m-0" /> */}
                <Section className="py-10 px-[74px] text-center align-center">
                    <Row>
                        <Column align='center' className="w-[32px] align-middle">
                            <Img
                                src={`${PROD_WEBSITE_URI}/logos/Terandina_clear.png`}
                                alt=""
                                width={23}
                                className="block"
                            />
                        </Column>
                    </Row>
                    <Heading className="text-[32px] leading-[1.3] font-bold font-canela text-center -tracking-[1px]">
                        We&apos;ve got your order.
                    </Heading>
                    <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium mt-6">
                        We´ve charged your payment method for the cost of your order
                        and will be removing any authorization holds.
                    </Text>
                </Section>
                <Hr className="border-[#E5E5E5] m-0" />
                <Section className="py-[22px] px-10">
                    <Text className="m-0 text-[15px] leading-[2] font-bold">
                        Shipping to: Alan Turing
                    </Text>
                    <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                        2125 Chestnut St, San Francisco, CA 94123
                    </Text>
                    <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                        We´ll send you another email when your package is on its way.
                    </Text>
                </Section>
                <Hr className="border-[#E5E5E5] m-0" />
                <Section className="py-10 px-10">

                    {props.items.map(item => {

                        return (
                            <Row key={item.id}>
                                <Column {...{
                                    className: 'w-[146px]'
                                }}>
                                    <Img {...{
                                        src: item.images && item.images.length > 0 ? `${PROD_WEBSITE_URI}${(item.images[0].image as Media).sizes?.medium?.url }` : '',
                                        alt: item.name,
                                        className: 'float-left',
                                        width: "130px"
                                    }}  
                                    />
                                </Column>
                                <Column className="float-left align-top pl-3">
                                    <Text className="m-0 text-[14px] leading-[2] font-medium">
                                        {item.name}
                                    </Text>
                                    <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                                        Size L (12–14)
                                    </Text>
                                </Column>
                            </Row>
                        )
                    })}

                </Section>
                <Hr className="border-[#E5E5E5] m-0" />
                <Hr className="border-[#E5E5E5] m-0" />
                <Section className="px-5 pt-5 bg-[#F7F7F7]">
                    <Row>
                        <Text className="px-5 font-bold">Get Help</Text>
                    </Row>
                    <Row className="py-[22px] px-5">
                        <Column className="w-1/3" colSpan={1}>
                            <Link
                                href="https://www.nike.com/"
                                className="text-[13.5px] mt-0 font-medium text-black"
                            >
                                Shipping Status
                            </Link>
                        </Column>
                        <Column className="w-1/3" colSpan={1}>
                            <Link
                                href="https://www.nike.com/"
                                className="text-[13.5px] mt-0 font-medium text-black"
                            >
                                Shipping & Delivery
                            </Link>
                        </Column>
                        <Column className="w-1/3" colSpan={1}>
                            <Link
                                href="https://www.nike.com/"
                                className="text-[13.5px] mt-0 font-medium text-black"
                            >
                                Returns & Exchanges
                            </Link>
                        </Column>
                    </Row>
                    <Row className="pb-[22px] px-5 pt-0">
                        <Column className="w-1/3" colSpan={1}>
                            <Link
                                href="https://www.nike.com/"
                                className="text-[13.5px] mt-0 font-medium text-black"
                            >
                                How to Return
                            </Link>
                        </Column>
                        <Column className="w-2/3" colSpan={2}>
                            <Link
                                href="https://www.nike.com/"
                                className="text-[13.5px] mt-0 font-medium text-black"
                            >
                                Contact Options
                            </Link>
                        </Column>
                    </Row>
                    <Hr className="border-[#E5E5E5] m-0" />
                    <Row className="px-5 pt-8 pb-[22px]">
                        <Column>
                            <Row>
                                <Column className="w-4">
                                    <Img
                                        src={`${PROD_WEBSITE_URI}/static/nike-phone.png`}
                                        alt="Nike Phone"
                                        width="16px"
                                        height="26px"
                                        className="pr-[14px]"
                                    />
                                </Column>
                                <Column>
                                    <Text className="text-[13.5px] mt-0 font-medium text-black mb-0">
                                        1-800-806-6453
                                    </Text>
                                </Column>
                            </Row>
                        </Column>
                        <Column>
                            <Text className="text-[13.5px] mt-0 font-medium text-black mb-0">
                                4 am - 11 pm PT
                            </Text>
                        </Column>
                    </Row>
                </Section>
                <Hr className="border-[#E5E5E5] m-0" />
                <Section className="py-[22px]">
                    <Row>
                        <Text className="font-canela text-[32px] leading-[1.3] font-bold text-center -tracking-[1px]">
                            TERANDINA
                        </Text>
                    </Row>
                    <Row className="w-[370px] mx-auto pt-3">
                        <Column align="center">
                            <Link
                                href="https://terandina.com/products"
                                className="font-medium text-black"
                            >
                                See All Products
                            </Link>
                        </Column>
                    </Row>
                </Section>
                <Hr className="border-[#E5E5E5] m-0 mt-3" />
                <Section className="py-[22px]">
                    <Row className="w-[166px] mx-auto">
                        <Column>
                            <Text className="m-0 text-[#AFAFAF] text-[13px] text-center">
                                Privacy Policy
                            </Text>
                        </Column>
                    </Row>
                    <Row>
                        <Text className="m-0 text-[#AFAFAF] text-[13px] text-center py-[30px]">
                            Please contact us if you have any questions. (If you reply to
                            this email, we won&apos;t be able to see it.)
                        </Text>
                    </Row>
                    <Row>
                        <Text className="m-0 text-[#AFAFAF] text-[13px] text-center">
                            © 2026 Terandina, Inc. All Rights Reserved.
                        </Text>
                    </Row>
                    <Row>
                        <Text className="m-0 text-[#AFAFAF] text-[13px] text-center">
                            Terandina, INC. 1978 Southlake Mall, #144, Merrillville, IN, USA 46410.
                        </Text>
                    </Row>
                </Section>
            </Container>
        </EmailRoot>
    )
};

NikeReceiptEmail.PreviewProps = {
    items: [
        // @ts-ignore
        {"icons":["ships_from_us","returns","hypoallergenic","indigenous_artisans"],"active":true,"blocks":[],"categories":[{"createdAt":"2026-10-04T01:14:29.643Z","updatedAt":"2026-10-04T01:14:29.643Z","pageActive":false,"type":"category","_status":"draft","products":{"docs":["6ab976e98d6b564444181153","6ab976e98d6b564444181158","6ab976e98d6b56444418115f","6ab976e98d6b564444181162","6ab976e98d6b56444418117a","6ab976e98d6b56444418118b","6ab976e98d6b564444181190","6ab976e98d6b564444181195","6ab976e98d6b564444181196"],"hasNextPage":false},"id":"6ac1a8755fbb6b876411f864","images":[],"blocks":[]}],"color_for_google_shopping":"blue","description":"Add a unique and cozy touch to any bed, sofa, or chair in your home with our luxurious alpaca blankets. Made in the Andes Mountains by members of our Indigenous Quechua community, these blankets offer durability, warmth, and exceptional softness - perfect for cool evenings, camping, or indoor lounging. \n\nHaving been used by ancient Andean civilizations, alpaca fibers are known for their warmth, breathability, and superior comfort. They remain lightweight and versatile, making them perfect for any season. ","details":"-\t80% Alpaca, 20% Acrylic Fibers\n-\tQueen Size\n-\tMade with Hypoallergenic Alpaca\n-\tMachine Wash Cold, Lay Flat to Dry\n\nCheck our size guide for measurements.\n\nPlease note that slight variations in color and pattern may occur. ","images":[{"image":{"alt":"","_key":"zzMJdtYlsE1VWRn6NspbWx4rJP6pLcjsV3OiYG1FZzX0oISm","filename":"large-Coyote Blue - Alpaca Blanket.webp - zzMJdtYlsE1VWRn6NspbWx4rJP6pLcjsV3OiYG1FZzX0oISm","filesize":73948,"mimeType":"image/webp","width":1000,"height":1000,"sizes":{"small":{"filename":"small-Coyote Blue - Alpaca Blanket.webp - zzMJdtYlsE1VR4G4TLreHNn8vkTrigjfJM93GLYEqAo2shw4","mimeType":"image/webp","filesize":872,"width":70,"height":70,"url":"/api/media/file/small-Coyote%20Blue%20-%20Alpaca%20Blanket.webp%20-%20zzMJdtYlsE1VR4G4TLreHNn8vkTrigjfJM93GLYEqAo2shw4","_key":"zzMJdtYlsE1VR4G4TLreHNn8vkTrigjfJM93GLYEqAo2shw4"},"medium":{"filename":"medium-Coyote Blue - Alpaca Blanket.webp - zzMJdtYlsE1VG8nbB9RMES2fjD38qg5Oce60CaQU9TpBkiY7","mimeType":"image/webp","filesize":13884,"width":500,"height":500,"url":"/api/media/file/medium-Coyote%20Blue%20-%20Alpaca%20Blanket.webp%20-%20zzMJdtYlsE1VG8nbB9RMES2fjD38qg5Oce60CaQU9TpBkiY7","_key":"zzMJdtYlsE1VG8nbB9RMES2fjD38qg5Oce60CaQU9TpBkiY7"},"og":{"width":null,"height":null,"mimeType":null,"filesize":null,"filename":null,"url":null}},"url":"/api/media/file/large-Coyote%20Blue%20-%20Alpaca%20Blanket.webp%20-%20zzMJdtYlsE1VWRn6NspbWx4rJP6pLcjsV3OiYG1FZzX0oISm","id":"6ab96c81846e3ca2f38f53d6","thumbnailURL":"/api/media/file/small-Coyote%20Blue%20-%20Alpaca%20Blanket.webp%20-%20zzMJdtYlsE1VR4G4TLreHNn8vkTrigjfJM93GLYEqAo2shw4"},"id":"6ab976e072cb34343eca852e"},{"image":{"alt":"","_key":"zzMJdtYlsE1VmCN3i0QH63fTpSAwXbsZoj2LkKa57zJGPNed","filename":"large-Coyote Blue Blanket 2_.jpg.webp - zzMJdtYlsE1VmCN3i0QH63fTpSAwXbsZoj2LkKa57zJGPNed","filesize":1520233,"mimeType":"image/webp","width":2500,"height":2500,"sizes":{"small":{"filename":"small-Coyote Blue Blanket 2_.jpg.webp - zzMJdtYlsE1VAmxI4zZKW0PxzJLQ5fOq2BZ6Y8vhrdwji1Rp","mimeType":"image/webp","filesize":2006,"width":70,"height":70,"url":"/api/media/file/small-Coyote%20Blue%20Blanket%202_.jpg.webp%20-%20zzMJdtYlsE1VAmxI4zZKW0PxzJLQ5fOq2BZ6Y8vhrdwji1Rp","_key":"zzMJdtYlsE1VAmxI4zZKW0PxzJLQ5fOq2BZ6Y8vhrdwji1Rp"},"medium":{"filename":"medium-Coyote Blue Blanket 2_.jpg.webp - zzMJdtYlsE1VLO9GHLgJ0D3Abj4yxCG5BtvnONUsoHlqheaz","mimeType":"image/webp","filesize":38536,"width":500,"height":500,"url":"/api/media/file/medium-Coyote%20Blue%20Blanket%202_.jpg.webp%20-%20zzMJdtYlsE1VLO9GHLgJ0D3Abj4yxCG5BtvnONUsoHlqheaz","_key":"zzMJdtYlsE1VLO9GHLgJ0D3Abj4yxCG5BtvnONUsoHlqheaz"},"og":{"width":null,"height":null,"mimeType":null,"filesize":null,"filename":null,"url":null}},"url":"/api/media/file/large-Coyote%20Blue%20Blanket%202_.jpg.webp%20-%20zzMJdtYlsE1VmCN3i0QH63fTpSAwXbsZoj2LkKa57zJGPNed","id":"6ab96c44846e3ca2f38f5389","thumbnailURL":"/api/media/file/small-Coyote%20Blue%20Blanket%202_.jpg.webp%20-%20zzMJdtYlsE1VAmxI4zZKW0PxzJLQ5fOq2BZ6Y8vhrdwji1Rp"},"id":"6ab976e072cb34343eca852f"}],"name":"Coyote Blue - Alpaca Blanket","notes_on_size":"","prices":[{"id":"6ab976e072cb34343eca8531","amount":135,"currency":"usd","stripe_price_id":"price_1R7s1uBNjcHRVZ2abrodAwgV","active":true}],"sizes":[{"label":"custom","customLabel":"Queen","count":3,"id":"6ab976e072cb34343eca8530"}],"slug":"prod_S1vtky1WoopgwJ","stripe_product_id":"prod_S1vtky1WoopgwJ","terandina_v1_id":"67e865f5919195baa4222c57","_status":"published","updatedAt":"2026-10-07T16:01:39.695Z","parcel":{"createdAt":"2026-10-07T15:44:50.385Z","updatedAt":"2026-10-07T15:44:50.385Z","name":"Blanket Parcel","width":16,"height":6,"length":20,"weight":5,"products":{"docs":["6ab976e98d6b56444418118b"],"hasNextPage":false},"id":"6ac668f2e29686486212549a"},"id":"6ab976e98d6b56444418118b"}
    ]
} satisfies ComponentProps<typeof NikeReceiptEmail>;

export default NikeReceiptEmail;
