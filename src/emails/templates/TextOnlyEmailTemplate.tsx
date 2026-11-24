// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails
import { PROD_WEBSITE_URI } from '@/emails/templates/VerificationEmail';
import {
    Column,
    Container,
    Heading,
    Hr,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from '@react-email/components';
const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

const textOnlyTitle = 'A quick note from Barebones';

const textOnlyParagraphs = [
    'This is the text-only layout: no hero image and no primary call-to-action. Use it for concise product notes, receipts, account updates, and other plain-language emails where the message should stay front and center.',
    'Keep paragraphs short and focused so the content is easy to scan on mobile. If you need richer visuals or a conversion button, switch to another collage template.',
    'Replace this placeholder copy by editing this template file directly.',
];

interface TextOnlyEmailProps {
    companyName: string;
    url: string;
}

const TextOnlyEmailTemplate = (props: {
    variables: any,
    children: any
}) => (
    <>
        <Preview>A note from Terandina LLC</Preview>
        <Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-[640px]">
            <Section>
                <Section className="bg-bg mobile:px-1 px-3 py-2">
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
                                    <span className="text-fg-3">Terandina LLC</span>
                                </Text>
                            </Column>
                        </Row>
                    </Section>

                    <Section className="bg-[#dddddd] mobile:px-2 mobile:py-3 rounded-[8px] px-[10px] py-5 text-left">
                        {props.children}
                    </Section>

                    {/* Footer */}
                    {/* <Section className="bg-bg">
                        <Row>
                            <Column className="px-6 py-10 text-center">
                                <Text className="font-13 text-fg-3 mx-auto mt-0 mb-8 max-w-[280px] text-center font-sans">
                                    Barebones is the catchy slogan that perfectly encapsulates
                                    the vision of our company.
                                </Text>

                                <Section className="mb-8">
                                    <Link
                                        href="https://example.com/"
                                        className="inline-block px-2 align-middle"
                                    >
                                        <Img
                                            src={`${baseUrl}/static/shared/social-x-black.png`}
                                            alt="X"
                                            width={18}
                                            className="block"
                                        />
                                    </Link>
                                    <Link
                                        href="https://example.com/"
                                        className="inline-block px-2 align-middle"
                                    >
                                        <Img
                                            src={`${baseUrl}/static/shared/social-in-black.png`}
                                            alt="LinkedIn"
                                            width={18}
                                            className="block"
                                        />
                                    </Link>
                                    <Link
                                        href="https://example.com/"
                                        className="inline-block px-2 align-middle"
                                    >
                                        <Img
                                            src={`${baseUrl}/static/shared/social-yt-black.png`}
                                            alt="YouTube"
                                            width={18}
                                            className="block"
                                        />
                                    </Link>
                                    <Link
                                        href="https://example.com/"
                                        className="inline-block px-2 align-middle"
                                    >
                                        <Img
                                            src={`${baseUrl}/static/shared/social-gh-black.png`}
                                            alt="GitHub"
                                            width={18}
                                            className="block"
                                        />
                                    </Link>
                                </Section>

                                <Text className="font-11 text-fg-3 mt-4 mb-5 text-center font-sans">
                                    123 Market Street, Floor 1
                                    <br />
                                    Tech City, CA, 94102
                                </Text>
                                <Text className="font-11 text-fg-3 m-0 text-center font-sans">
                                    <Link href="https://example.com/" className="text-fg-3">
                                        Unsubscribe
                                    </Link>{' '}
                                    from Terandina LLC marketing emails.
                                </Text>

                            </Column>
                        </Row>
                    </Section> */}
                </Section>
            </Section>
        </Container>
    </>
);




export default TextOnlyEmailTemplate;