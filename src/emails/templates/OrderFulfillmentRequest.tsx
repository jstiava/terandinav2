

// Get the full source code, including the theme and Tailwind config:
// https://github:com/resend/react-email/tree/canary/apps/demo/emails

import { EmailBlockType } from '@/collections/Emails/config';
import { ACTION_TRIGGERS_WITH_VARIABLES, VariableTypeMap } from '@/collections/Emails/triggers';
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
import { ComponentProps, ReactNode } from 'react';
import { Rate } from 'shippo';


const WithSuccessfullPurchaseComplete = ACTION_TRIGGERS_WITH_VARIABLES.find(x => x.value == 'user:with_successful_purchase_complete')!
export type WithSuccessfullPurchaseCompleteVariables = {
  [V in (typeof WithSuccessfullPurchaseComplete.variables)[number] as V['value']]:
    VariableTypeMap[V['type']]
}

function OrderFulfillmentRequest(props: {
    variables: WithSuccessfullPurchaseCompleteVariables,
    children: ReactNode
}) {

    try {

        return (
            <Container className="my-[10px] mx-auto w-[650px] max-w-full border border-[#E5E5E5]">
                <Section className="py-10 px-[74px] text-center align-center" >
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
                    <Heading className="text-[32px] leading-[1] font-bold font-canela text-center -tracking-[1px]">
                        New {props.variables['order:pickup']} order placed
                    </Heading>
                    <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium mt-6">
                        Payment has been collected: The customer has chosen {props.variables['order:pickup'] == 'pickup' ? 'In-store pickup' : 'delivery: Buy and print out the shipping label below from any of the options: '}:
                    </Text>
                </Section>
                <Hr className="border-[#E5E5E5] m-0" />
                <Section className="py-[22px] px-10" align='left'>
                    <Text className="m-0 text-[15px] leading-[2] font-bold">
                        Order placed by:
                    </Text>
                    <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                        {props.variables['order:billingAddress:name']}
                    </Text>
                    <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                        {props.variables['order:billingAddress:address:line1']} {props.variables['order:billingAddress:address:line2']}, {props.variables['order:billingAddress:address:city']}, {props.variables['order:billingAddress:address:state']}, {props.variables['order:billingAddress:address:country']} {props.variables['order:billingAddress:address:postal_code']}
                    </Text>
                    <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                        {props.variables['order:billingAddress:emailAddress']}
                    </Text>
                </Section>
                <Hr className="border-[#E5E5E5] m-0" />
                <Section className="py-[22px] px-10" align='left'>
                    <Text className="m-0 text-[15px] leading-[2] font-bold">
                        Delivery/pickup instructions
                    </Text>
                    <Text className="  m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                        {props.variables['order:pickup'] == 'pickup' ? 'In-store pickup' : 'Delivery'}
                    </Text>
                    {props.variables['order:pickup'] == 'delivery' && (
                        <>
                            <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                                {props.variables['order:deliveryTo:name']}
                            </Text>
                            <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                                {props.variables['order:deliveryTo:address:line1']} {props.variables['order:deliveryTo:address:line2']}, {props.variables['order:deliveryTo:address:city']}, {props.variables['order:deliveryTo:address:state']}, {props.variables['order:deliveryTo:address:country']} {props.variables['order:deliveryTo:address:postal_code']}
                            </Text>
                            <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                                {props.variables['order:deliveryTo:emailAddress']}
                            </Text>
                        </>
                    )}
                </Section>
                <Hr className="border-[#E5E5E5] m-0" />
                <Section className="py-10 px-10" align='left'>

                    <Text className="m-0 text-[15px] leading-[2] font-bold mb-5">
                        Items
                    </Text>

                    {props.variables['order:cart']?.map((item, index) => {

                        if (!item.product) {
                            return (
                                <span key={`Problem_${index}`}>Problem with product {index} </span>
                            )
                        }
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
                {props.variables['shippo:rates'] && (
                    <ShippingRatesEmailComponent {...{
                        rates: props.variables['shippo:rates']
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
                            Please contact us if you have any questions: (If you reply to
                            this email, we won&apos;t be able to see it:)
                        </Text>
                    </Row>
                    <Row>
                        <Text className="m-0 text-[#AFAFAF] text-[13px] text-center">
                            © 2026 Terandina, Inc. All Rights Reserved.
                        </Text>
                    </Row>
                    <Row>
                        <Text className="m-0 text-[#AFAFAF] text-[13px] text-center">
                            Terandina, INC: 1978 Southlake Mall, #144, Merrillville, IN, USA 46410
                        </Text>
                    </Row>
                </Section>
                {props.children}
            </Container>
        )

    }
    catch (err) {
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
