import { authenticated } from "@/access/authenticated";
import { CollectionConfig } from "payload";



export const CRM: CollectionConfig = {
    slug: "crm",
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },
    admin: {
        useAsTitle: 'fullName',

    },
    fields: [
        {
            name: 'firstName',
            type: 'text',
        },
        {
            name: 'lastName',
            type: 'text',
        },
        {
            name: 'fullName',
            type: 'text',
        },
        {
            name: 'emailAddress',
            type: 'text',
        },
         {
            name: 'phoneNumber',
            type: 'text',
        },
    ]
}