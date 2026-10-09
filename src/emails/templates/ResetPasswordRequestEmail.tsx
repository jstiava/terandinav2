// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import config from '@/emails/tailwind.config';
import { PROD_WEBSITE_URI } from '@/emails/templates/VerificationEmail';
import {
    Body,
    Button,
    Container,
    Font,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

interface DropboxResetPasswordEmailProps {
    userFirstname?: string;
    resetPasswordLink?: string;
}


const ResetPasswordRequestEmail = ({
    userFirstname,
    resetPasswordLink,
}: DropboxResetPasswordEmailProps) => {
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
                <Body className="bg-[#f6f9fc] py-2.5 font-sans">
                    <Preview >Terandina reset your password</Preview>
                    <Container className="bg-white border border-solid border-[#f0f0f0] p-[45px]">
                         <Img
                            src={`${PROD_WEBSITE_URI}/logos/Terandina_clear.png`}
                            alt="Terandina LLC"
                            width={23}
                            className="block"
                          />
                        <Section>
                            <Text className="text-base font-light text-[#404040] leading-[26px]">
                                Hi {userFirstname},
                            </Text>
                            <Text className="text-base font-light text-[#404040] leading-[26px]">
                                Someone recently requested a password change for your Terandina
                                account. If this was you, you can set a new password here:
                            </Text>
                             <Button
                      href={resetPasswordLink}
                      className="inline-block rounded-xs bg-[#009487] px-8 py-2 text-center font-sans text-base font-semibold leading-6 text-white"
                    >
                      Reset password
                    </Button>
                            <Text className="text-base font-light text-[#404040] leading-[26px]">
                                If you don&apos;t want to change your password or didn&apos;t
                                request this, just ignore and delete this message.
                            </Text>
                            <Text className="text-base font-light text-[#404040] leading-[26px]">
                                To keep your account secure, please don&apos;t forward this
                                email to anyone.
                            </Text>
                            <Text className="text-base font-light text-[#404040] leading-[26px]">
                                Thank you,<br/>Terandina.com
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

ResetPasswordRequestEmail.PreviewProps = {
    userFirstname: 'Alan',
    resetPasswordLink: 'https://www.dropbox.com',
} as DropboxResetPasswordEmailProps;

ResetPasswordRequestEmail.tailwindConfig = config;

export default ResetPasswordRequestEmail;
