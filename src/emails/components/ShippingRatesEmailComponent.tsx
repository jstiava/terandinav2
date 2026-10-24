import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from '@react-email/components'
import { Rate } from 'shippo'

type ShippingRatesEmailProps = {
    rates: Rate[];
}

const attributeLabels: Record<string, string> = {
    CHEAPEST: 'CHEAPEST',
    BESTVALUE: 'BEST VALUE',
    FASTEST: 'FASTEST',
}

export function ShippingRatesEmailComponent({ rates }: ShippingRatesEmailProps) {
    try {
        const sortedRates = [...rates]
            .sort((a, b) => Number(a.amount) - Number(b.amount))
            .slice(0, 3)

        return (
            <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>

                <Text className="m-0 text-[15px] leading-[2] font-bold">
                    Shipping options
                </Text>
                <Text style={{ margin: '0 0 24px', fontSize: '14px', lineHeight: '22px', color: '#666666' }}>Select one of the available shipping options below.</Text>
                {sortedRates.map((rate) => (
                    <Section key={rate.objectId} {...{
                        className: 'w-full mb-[8px] py-[10px] px-[12px] border border-[#e5e5e5] rounded-sm'
                    }} >
                        <Row {...{
                            className: 'w-full'
                        }}>
                            <Column style={{ width: '42px', verticalAlign: 'middle' }}>
                                <Img src={rate.providerImage200} alt={rate.provider} width="32" height="32" style={{ display: 'block', width: '32px', height: '32px', objectFit: 'contain' }} />
                            </Column>
                            <Column style={{ verticalAlign: 'middle', paddingRight: '8px' }}>
                                <Text style={{ margin: '0 0 3px', fontSize: '13px', lineHeight: '17px', fontWeight: 600, color: '#222222' }}>{rate.provider} — {rate.servicelevel.name}</Text>
                                <Text style={{ margin: 0, fontSize: '11px', lineHeight: '15px', color: '#777777' }}>{rate.estimatedDays != null ? `${rate.estimatedDays} business days` : rate.durationTerms || 'Delivery estimate unavailable'}</Text>
                                {rate.attributes?.length > 0 && (
                                    <Text style={{ margin: '4px 0 0', fontSize: '9px', lineHeight: '13px', fontWeight: 700, color: '#287568' }}>
                                        {rate.attributes.map((attribute) => attributeLabels[attribute] ?? attribute.replace(/[_-]/g, ' ')).join(' · ')}
                                    </Text>
                                )}
                            </Column>
                            <Column align="right" style={{ width: '100px', verticalAlign: 'middle' }}>
                                <Text style={{ margin: '0 0 6px', fontSize: '14px', lineHeight: '18px', fontWeight: 700, color: '#222222' }}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: rate.currency }).format(Number(rate.amount))}</Text>
                                <Link
                                    // href={selectRateUrl(rate.objectId)} 
                                    style={{ display: 'inline-block', padding: '6px 9px', borderRadius: '4px', backgroundColor: '#009487', color: '#ffffff', fontSize: '11px', lineHeight: '14px', fontWeight: 600, textDecoration: 'none' }}>Select</Link>
                            </Column>
                        </Row>
                    </Section>
                ))}
            </Container>

        )
    }
    catch (err) {
        return (
            <div className="flex p-4 w-full">
                <div className="flex flex-col w-full error bg-transparent border border-[red] text-[red] p-4">
                    <p>An error occured</p>
                    <p className="debug">{JSON.stringify(rates, null, 2)}</p>
                    {/* <p className='debug'>{JSON.stringify(props.variables, null, 2)}</p> */}
                </div>
            </div>
        )
    }
}
