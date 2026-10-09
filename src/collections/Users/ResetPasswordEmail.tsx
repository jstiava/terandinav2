import ResetPasswordRequestEmail from "@/emails/templates/ResetPasswordRequestEmail";
import { render } from "@react-email/render"; 
import { PayloadRequest } from "payload";


const PROD_WEBSITE_ADDRESS = 'https://terandinav2.vercel.app'

export default async function ResetPasswordEmail(props?: { req?: PayloadRequest; token?: string; user?: any; } | undefined): Promise<string> {

    
    const resetPasswordLink = `${PROD_WEBSITE_ADDRESS}/admin/reset/${props?.token}`;

    const emailHtml = await render(
        <ResetPasswordRequestEmail {...{
            userFirstname: props!.user.name,
            resetPasswordLink 
        }} />
    )

    return emailHtml;
}