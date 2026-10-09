// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import config from '@/emails/tailwind.config'
import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

export const PROD_WEBSITE_URI = 'https://terandinav2.vercel.app'

function VerificationEmail(props: {
  companyName: string;
  confirmUrl: string
}) {
  const { companyName, confirmUrl, ...rest } = props
  return (
    <Html>
      <Head>
        <Font
          {...{
            fontFamily: 'Canela',
            fallbackFontFamily: 'Georgia',
            webFont: {
              url: `${PROD_WEBSITE_URI}/fonts/canelaweb-medium.ttf`,
              format: 'truetype',
            },
            fontWeight: 500,
          }}
        />
        <Font
          {...{
            fontFamily: 'Archivo',
            fallbackFontFamily: 'Arial',
            webFont: {
              url: `${PROD_WEBSITE_URI}/fonts/archivo-regular.ttf`,
              format: 'truetype',
            },
            fontWeight: 500,
          }}
        />
      </Head>
      <Tailwind config={config}>
        <Body className="bg-bg-2 m-0 text-center font-sans">
          <Preview>Confirm your email address</Preview>
          <Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-[640px]">
            <Section>
              <Section className="bg-bg mobile:px-2 px-6 py-4">
                <Section className="mb-3 px-6">
                  <Row>
                    <Column className="w-1/2 py-[7px] align-middle">
                      <Row>
                        <Column className="w-[32px] align-middle">
                          <Img
                            src={`${PROD_WEBSITE_URI}/logos/Terandina_clear.png`}
                            alt=""
                            width={23}
                            className="block"
                          />
                        </Column>
                      </Row>
                    </Column>
                    <Column align="right" className="w-1/2 py-[7px] align-middle">
                      <Text className="font-13 m-0 text-right font-sans">
                        <span className="text-fg-3">{companyName}</span>
                      </Text>
                    </Column>
                  </Row>
                </Section>

                <Section className="bg-bg-2 mobile:px-6 mobile:py-12 rounded-[8px] px-[40px] py-[64px] text-center">
                  <Section className="mb-3">
                    <Img
                      src={`${PROD_WEBSITE_URI}/logos/Terandina_clear.png`}
                      alt="Logo"
                      width={48}
                      className="mx-auto mb-5 block"
                    />
                    <Heading as="h1" className="font-28 text-fg m-0 font-canela">
                      We&apos;re almost there!
                    </Heading>
                  </Section>

                  <Text className="font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-[380px] text-center font-sans">
                    Thank you for joining the {companyName} <br/>website editing team.
                    <br />
                    <br />
                    To activate your editor account, please confirm your email address using the
                    button below.
                  </Text>

                  <Section className="mb-6 text-center">
                    <Button
                      href={confirmUrl}
                      className="inline-block rounded-xs bg-[#009487] px-8 py-4 text-center font-sans text-base font-semibold leading-6 text-white"
                    >
                      Confirm email
                    </Button>
                  </Section>

                  <Text className="font-13 text-fg-3 mx-auto mt-8 mb-0 max-w-[400px] text-center font-sans">
                    If you didn&apos;t request this,
                    <br />
                    please ignore this email.
                  </Text>
                </Section>

                {/* Footer */}
                <Section className="bg-bg">
                  <Row>
                    <Column className="px-6 py-10 text-center">

                      <Text className="font-11 text-fg-3 mt-4 mb-5 text-center font-sans">
                        Terandina LLC
                        <br />
                        1978 Southlake Mall, #144
                        <br />
                        Merrillville, IN 46410
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

VerificationEmail.PreviewProps = {
  companyName: 'Terandina LLC',
  confirmUrl: 'https://example.com/',
} satisfies any

export default VerificationEmail
