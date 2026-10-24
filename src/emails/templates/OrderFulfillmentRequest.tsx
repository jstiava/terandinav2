

// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import { EmailBlockType } from '@/collections/Emails/config';
import { CheckoutDetailsType, ProductType } from '@/components/Cart/CartProviderComponent';
import EmailRoot from '@/emails/components/EmailRoot';
import { ShippingRatesEmailComponent } from '@/emails/components/ShippingRatesEmailComponent';
import { PROD_WEBSITE_URI } from '@/emails/templates/VerificationEmail';
import { Media } from '@/payload-types';
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
import { Block } from 'payload';
import { ComponentProps } from 'react';
import { Rate } from 'shippo';


function OrderFulfillmentRequest(props: {
    variables: {
        checkoutDetails?: Partial<CheckoutDetailsType>
        items?: ProductType[],
        rates?: Rate[],
    },
    blocks: EmailBlockType[]
}) {

    if (!props.variables.checkoutDetails) {
        return (
            <p className='debug'>{JSON.stringify(props.variables)}</p>
        )
    }

    try {

        return (
            <Container className="my-[10px] mx-auto w-[600px] max-w-full border border-[#E5E5E5]">
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
                        New {props.variables.checkoutDetails?.pickup} order placed
                    </Heading>
                    <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium mt-6">
                        Payment has been collected. The customer has chosen {props.variables.checkoutDetails?.pickup == 'pickup' ? 'In-store pickup' : 'delivery. Buy and print out the shipping label below from any of the options. '}.
                    </Text>
                </Section>
                <Hr className="border-[#E5E5E5] m-0" />
                <Section className="py-[22px] px-10">
                    <Text className="m-0 text-[15px] leading-[2] font-bold">
                        Order placed by:
                    </Text>
                    <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                        {props.variables.checkoutDetails?.billingAddress?.name}
                    </Text>
                    <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                        {props.variables.checkoutDetails?.billingAddress?.address.line1} {props.variables.checkoutDetails?.billingAddress?.address.line2}, {props.variables.checkoutDetails?.billingAddress?.address.city}, {props.variables.checkoutDetails?.billingAddress?.address.state}, {props.variables.checkoutDetails?.billingAddress?.address.country} {props.variables.checkoutDetails?.billingAddress?.address.postal_code}
                    </Text>
                    <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                        {props.variables.checkoutDetails?.billingAddress?.emailAddress}
                    </Text>
                </Section>
                <Hr className="border-[#E5E5E5] m-0" />
                <Section className="py-[22px] px-10">
                    <Text className="m-0 text-[15px] leading-[2] font-bold">
                        Delivery/pickup instructions
                    </Text>
                    <Text className="  m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                        {props.variables.checkoutDetails?.pickup == 'pickup' ? 'In-store pickup' : 'Delivery'}
                    </Text>
                    {props.variables.checkoutDetails?.pickup == 'delivery' && (
                        <>
                            <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                                {props.variables.checkoutDetails?.deliveryTo?.name}
                            </Text>
                            <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                                {props.variables.checkoutDetails?.deliveryTo?.address.line1} {props.variables.checkoutDetails?.deliveryTo?.address.line2}, {props.variables.checkoutDetails?.deliveryTo?.address.city}, {props.variables.checkoutDetails?.deliveryTo?.address.state}, {props.variables.checkoutDetails?.deliveryTo?.address.country} {props.variables.checkoutDetails?.deliveryTo?.address.postal_code}
                            </Text>
                            <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                                {props.variables.checkoutDetails?.deliveryTo?.emailAddress}
                            </Text>
                        </>
                    )}
                </Section>
                <Hr className="border-[#E5E5E5] m-0" />
                <Section className="py-10 px-10">

                    <Text className="m-0 text-[15px] leading-[2] font-bold mb-5">
                        Items
                    </Text>

                    {props.variables.items?.map(item => {

                        const chosenSize = item.product.sizes?.find(x => x.id == item.size)

                        return (
                            <Row key={item.id}>
                                <Column {...{
                                    className: 'w-[146px]'
                                }}>
                                    <Img {...{
                                        src: item.product.images && item.product.images.length > 0 ? `${PROD_WEBSITE_URI}${(item.product.images[0].image as Media).sizes?.medium?.url}` : '',
                                        alt: item.product.name,
                                        className: 'float-left',
                                        width: "130px"
                                    }}
                                    />
                                </Column>
                                <Column className="float-left align-top pl-3">
                                    <Text className="m-0 text-[14px] leading-[2] font-medium">
                                        {item.product.name}
                                    </Text>
                                    <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                                        Size: {chosenSize?.label == 'custom' ? chosenSize?.customLabel : chosenSize?.label}
                                    </Text>
                                </Column>
                            </Row>
                        )
                    })}

                </Section>
                <Hr className="border-[#E5E5E5] m-0" />
                {props.variables.rates && (
                    <ShippingRatesEmailComponent {...{
                        rates: props.variables.rates
                    }} />
                )}
                <Hr className="border-[#E5E5E5] m-0" />
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
        )

    }
    catch (err) {

        console.log(err);


        return (
            <div className="flex p-4 w-full">
                <div className="flex flex-col w-full error bg-transparent border border-[red] text-[red] p-4">
                    <p>An error occured</p>
                    <p className="debug">{JSON.stringify(err, null, 2)}</p>
                    <p className='debug'>{JSON.stringify(props.variables, null, 2)}</p>
                </div>
            </div>
        )
    }
};

export default OrderFulfillmentRequest;
