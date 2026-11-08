import { CheckoutDetailsType, ProductType } from "@/components/Cart/CartProviderComponent"
import { Product } from "@/payload-types"
import { Field } from "payload"
import { Parcel, Rate } from "shippo"

export type ApplicationTriggerEvents = typeof ACTION_TRIGGERS_WITH_VARIABLES[number]['value']

export type ApplicationTriggerVariables = {
  [T in typeof ACTION_TRIGGERS_WITH_VARIABLES[number]as T['value']]: T['variables'][number]['value']
}

// export type ApplicationEventArgs = {
//   [T in typeof ACTION_TRIGGERS_WITH_VARIABLES[number] as T['value']]: {
//     event: T['value']
//     variables: Partial<Record<T['variables'][number]['value'], any | null>>
//   }
// }[typeof ACTION_TRIGGERS_WITH_VARIABLES[number]['value']];

export type VariableTypeMap = {
  string: string
  number: number 
  boolean: boolean
  array: any[],
  'array:products': ProductType[],
  'shippo:rates': Rate[],
  'shippo:parcel': Parcel,
  'cart': {
    product: Product | undefined;
    product_id: string | undefined;
    quantity: number;
    size: string | null | undefined;
    id: string;
  }[]
}

export const TriggerVariableToPayloadType: Record<string, Field['type'] | 'custom'> = {
  string: 'text',
  number: 'number',
  boolean: 'checkbox',
  array: 'array',
  'array:products': 'array',
  'shippo:rates': 'json',
  'shippo:parcel': 'json',
  'cart': 'custom'
}

type VariableDefinition = {
  label: string
  value: string
  type?: keyof VariableTypeMap
}

export type ApplicationEventArgs = {
  [T in typeof ACTION_TRIGGERS_WITH_VARIABLES[number]as T['value']]: {
    event: T['value']
    variables: {
      [V in T['variables'][number]as V extends { required: true } ? V['value'] : never]-?: V extends { type: infer K extends keyof VariableTypeMap }
      ? VariableTypeMap[K]
      : any
    } & {
      [V in T['variables'][number]as V extends { required: true } ? never : V['value']]?: V extends { type: infer K extends keyof VariableTypeMap }
      ? VariableTypeMap[K] | null
      : any | null
    }
  }
}[typeof ACTION_TRIGGERS_WITH_VARIABLES[number]['value']];


const SHIPPO_DEFAULT_RATES = [
  {
    "amount": "8.07",
    "amountLocal": "8.07",
    "currency": "USD",
    "currencyLocal": "USD",
    "attributes": [],
    "carrierAccount": "85f3429352074cbd9e0edb0ffa822f9e",
    "durationTerms": "Delivery within 1, 2, or 3 days based on where your package started and where it’s being sent.",
    "estimatedDays": 3,
    "messages": [],
    // @ts-ignore
    "objectCreated": "2026-10-10T23:03:58.447Z",
    "objectId": "0145bc5b68d446c6afa09b5eab686a5f",
    "objectOwner": "jeremystiava@gmail.com",
    "provider": "USPS",
    "providerImage75": "https://shippo-static.s3.amazonaws.com/providers/75/USPS.png",
    "providerImage200": "https://shippo-static.s3.amazonaws.com/providers/200/USPS.png",
    "servicelevel": {
      "name": "Priority Mail",
      "terms": "",
      "token": "usps_priority",
      "extendedToken": "usps_priority"
    },
    "shipment": "670d33fe3d9240b99afe334685e7ded9",
    "test": true,
    "zone": "1"
  },
  {
    "amount": "54.01",
    "amountLocal": "54.01",
    "currency": "USD",
    "currencyLocal": "USD",
    "arrivesBy": "08:30:00",
    "attributes": [
      "FASTEST"
    ],
    "carrierAccount": "1319724cf8d04c72b9b0fec83a7923fa",
    "durationTerms": "Next business day delivery by 8:30 a.m., 9:00 a.m., or 9:30 a.m. ",
    "estimatedDays": 1,
    "messages": [],
    // @ts-ignore
    "objectCreated": "2026-10-10T23:03:58.447Z",
    "objectId": "1d3a8cf175dc450a9481f2a50eacb3fb",
    "objectOwner": "jeremystiava@gmail.com",
    "provider": "UPS",
    "providerImage75": "https://shippo-static.s3.amazonaws.com/providers/75/UPS.png",
    "providerImage200": "https://shippo-static.s3.amazonaws.com/providers/200/UPS.png",
    "servicelevel": {
      "name": "Next Day Air® Early",
      "terms": "",
      "token": "ups_next_day_air_early_am",
      "extendedToken": "ups_next_day_air_early_am"
    },
    "shipment": "670d33fe3d9240b99afe334685e7ded9",
    "test": true
  },
  {
    "amount": "7.56",
    "amountLocal": "7.56",
    "currency": "USD",
    "currencyLocal": "USD",
    "attributes": [
      "BESTVALUE"
    ],
    "carrierAccount": "1319724cf8d04c72b9b0fec83a7923fa",
    "durationTerms": "Delivery times vary. Delivered usually in 1-5 business days.",
    "estimatedDays": 2,
    "messages": [],
    // @ts-ignore
    "objectCreated": "2026-10-10T23:03:58.447Z",
    "objectId": "1f293a1a9aca4168a0a557c4300ad1ec",
    "objectOwner": "jeremystiava@gmail.com",
    "provider": "UPS",
    "providerImage75": "https://shippo-static.s3.amazonaws.com/providers/75/UPS.png",
    "providerImage200": "https://shippo-static.s3.amazonaws.com/providers/200/UPS.png",
    "servicelevel": {
      "name": "Ground",
      "terms": "",
      "token": "ups_ground",
      "extendedToken": "ups_ground"
    },
    "shipment": "670d33fe3d9240b99afe334685e7ded9",
    "test": true
  }
];




export const ACTION_TRIGGERS_WITH_VARIABLES = [
  // IAM
  {
    label: 'Invite user by email',
    value: 'iam:invite_user_by_email',
    variables: [
      { label: "From's First Name", value: 'from:first_name', type: 'string' },
      { label: "From's Name", value: 'from:name', type: 'string' },
      { label: "From's Email", value: 'from:email_address', type: 'string' },
      { label: "Recipient's Email", value: 'recipient:email_address', type: 'string' },
      { label: 'Password Reset Token', value: 'password_reset_token', type: 'string' },
    ]
  },
  {
    label: 'New user confirmed',
    value: 'iam:new_user_confirmed',
    variables: [
      { label: 'New User First Name', value: 'new_user:first_name', type: 'string' },
      { label: 'New User Name', value: 'new_user:name', type: 'string' },
      { label: 'New User Email', value: 'new_user:email_address', type: 'string' },
      { label: 'New User Role', value: 'new_user:role', type: 'string' },
    ]
  },
  {
    label: 'User logged in',
    value: 'iam:user_log_in',
    variables: [
      { label: 'User First Name', value: 'user:first_name', type: 'string' },
      { label: 'User Name', value: 'user:name', type: 'string' },
      { label: 'User Email', value: 'user:email_address', type: 'string' },
      { label: ' User Role', value: 'user:role', type: 'string' },
    ]
  },

  // User
  {
    label: 'With Successful Purchase Complete',
    value: "user:with_successful_purchase_complete",
    variables: [

      // Checkout details
      {
        label: 'Pickup or Delivery', value: 'order:pickup', type: 'string', defaultValue: "pickup", options: [
          { label: "Pickup", value: "pickup" },
          { label: "Delivery", value: "delivery" }
        ]
      },
      { label: 'Send Marketing Emails', value: 'order:isSendMeMarketingEmails', type: 'boolean' },
      { label: 'Shipping Same as Billing Address', value: 'order:isShippingSameAsBillingAddress', type: 'boolean' },
      { label: 'Payment Intent ID', value: 'order:paymentIntentId', type: 'string' },
      { label: 'Payment Client Secret', value: 'order:clientSecret', type: 'string' },
      { label: 'Total Due', value: 'order:totalDue', type: 'number' },
      { label: 'Tax', value: 'order:tax', type: 'number' },
      { label: 'Subtotal', value: 'order:subtotal', type: 'number' },

      { label: 'Order cart', value: 'order:cart', type: 'cart', config: {
        type: "array",
        fields: [
          {
            name: "product",
            type: "relationship",
            relationTo: 'products',
            hasMany: false
          },
          {
            name: "size",
            label: "Size id",
            type: 'text',
          },
          {
            name: "quantity",
            type: "number",
            defaultValue: 1
          }
        ] as Field[]
      } },
      { label: "Shippo delivery rates", value: "shippo:rates", type: 'shippo:rates', defaultValue: SHIPPO_DEFAULT_RATES },
      { label: "Shippo parcel", value: "shippo:parcel", type: "shippo:parcel" },

      // Billing address
      { label: 'Email Address', value: 'order:billingAddress:emailAddress', type: 'string' },
      { label: 'Full Name', value: 'order:billingAddress:name', type: 'string' },
      { label: 'First Name', value: 'order:billingAddress:firstName', type: 'string' },
      { label: 'Last Name', value: 'order:billingAddress:lastName', type: 'string' },
      { label: 'Address Line 1', value: 'order:billingAddress:address:line1', type: 'string' },
      { label: 'Address Line 2', value: 'order:billingAddress:address:line2', type: 'string' },
      { label: 'City', value: 'order:billingAddress:address:city', type: 'string' },
      { label: 'Country', value: 'order:billingAddress:address:country', type: 'string' },
      { label: 'Postal Code', value: 'order:billingAddress:address:postal_code', type: 'string' },
      { label: 'State', value: 'order:billingAddress:address:state', type: 'string' },
      { label: 'Address Complete', value: 'order:billingAddress:complete', type: 'boolean' },

      // Delivery to
      { label: 'Email Address', value: 'order:deliveryTo:emailAddress', type: 'string' },
      { label: 'Full Name', value: 'order:deliveryTo:name', type: 'string' },
      { label: 'First Name', value: 'order:deliveryTo:firstName', type: 'string' },
      { label: 'Last Name', value: 'order:deliveryTo:lastName', type: 'string' },
      { label: 'Address Line 1', value: 'order:deliveryTo:address:line1', type: 'string' },
      { label: 'Address Line 2', value: 'order:deliveryTo:address:line2', type: 'string' },
      { label: 'City', value: 'order:deliveryTo:address:city', type: 'string' },
      { label: 'Country', value: 'order:deliveryTo:address:country', type: 'string' },
      { label: 'Postal Code', value: 'order:deliveryTo:address:postal_code', type: 'string' },
      { label: 'State', value: 'order:deliveryTo:address:state', type: 'string' },
      { label: 'Address Complete', value: 'order:deliveryTo:complete', type: 'boolean' },

    ]
  },
  {
    label: "With subscription to newsletter",
    value: "user:with_subscribe_to_newsletter",
    variables: [
      { label: "Customer's Name", value: 'customer:name', type: 'string' },
      { label: "Customer's Email Address", value: 'customer:email_address', type: 'string' },
      { label: "Customer's Comment", value: 'customer:comment', type: 'string' },
    ],
  },


  // Fufillment
  {
    label: "Fulfillment: Purchase shipping label complete",
    value: "fulfillment:with_purchase_of_shipping_label",
    variables: [

    ]
  },

  // Editor
  {
    label: "New announcement made",
    value: "editor:new_announcement_made",
    variables: []
  },
] as const;



