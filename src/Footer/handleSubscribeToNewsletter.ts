'use server'
import configPromise from '@payload-config'
import { handleApplicationEventWithEmails } from "@/collections/Emails/handleApplicationEventWithEmails";
import { getPayload } from "payload";
import { headers } from 'next/headers';

export default async function handleSubscribeToNewsletter(props: {
    email_address: string,
    comments?: string | null,

}) {

    try {

        const emails = await handleApplicationEventWithEmails({
            event: 'user:with_subscribe_to_newsletter',
            variables: {
                "customer:email_address": props.email_address,
                'customer:comment': props.comments ?? "",
                "customer:name": ""
            }
        });

        return {
            success: true,
            emails
        }
    }
    catch (err) {

        console.log(err);

        return {
            success: false
        }
    }

}