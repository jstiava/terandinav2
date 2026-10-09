import VerificationEmail from "@/emails/templates/VerificationEmail";
import { render } from "@react-email/render";

const PROD_WEBSITE_ADDRESS = 'https://terandinav2.vercel.app'

export default async function VerifyEmail(props: { 
    token : string,
    user : string
}) {

    const confirmUrl = `${PROD_WEBSITE_ADDRESS}/verify?token=${props.token}`;

    const emailHtml = await render(
        <VerificationEmail {...{
            companyName: "",
            confirmUrl,
            key: ""
        }} />
    )

    return emailHtml;
}