import { CheckoutDetailsType, ProductType } from "@/components/Cart/CartProviderComponent"
import { Product } from "@/payload-types"
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

type VariableTypeMap = {
  string: string
  number: number
  boolean: boolean
  array: any[],
  'array.products': ProductType[],
  'shippo.rates': Rate[],
  'shippo.parcel': Parcel,
  'cart': {
    product: Product | undefined;
    product_id: string | undefined;
    quantity: number;
    size: string | null | undefined;
    id: string;
}[]
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
}[typeof ACTION_TRIGGERS_WITH_VARIABLES[number]['value']]

export const ACTION_TRIGGERS_WITH_VARIABLES = [
  // IAM
  {
    label: 'Invite user by email',
    value: 'iam:invite_user_by_email',
    variables: [
      { label: "From's First Name", value: 'from.first_name' },
      { label: "From's Name", value: 'from.name' },
      { label: "From's Email", value: 'from.email_address' },
      { label: "Recipient's Email", value: 'recipient.email_address' },
      { label: 'Password Reset Token', value: 'password_reset_token' },
    ]
  },
  {
    label: 'New user confirmed',
    value: 'iam:new_user_confirmed',
    variables: [
      { label: 'New User First Name', value: 'new_user.first_name' },
      { label: 'New User Name', value: 'new_user.name' },
      { label: 'New User Email', value: 'new_user.email_address' },
      { label: 'New User Role', value: 'new_user.role' },
    ]
  },
  {
    label: 'User logged in',
    value: 'iam:user_log_in',
    variables: [
      { label: 'User First Name', value: 'user.first_name' },
      { label: 'User Name', value: 'user.name' },
      { label: 'User Email', value: 'user.email_address' },
      { label: ' User Role', value: 'user.role' },
    ]
  },

  // User
  {
    label: 'With Successful Purchase Complete',
    value: "user:with_successful_purchase_complete",
    variables: [

      // Checkout details
      { label: 'Pickup or Delivery', value: 'order.pickup', type: 'string' },
      { label: 'Send Marketing Emails', value: 'order.isSendMeMarketingEmails', type: 'boolean' },
      { label: 'Shipping Same as Billing Address', value: 'order.isShippingSameAsBillingAddress', type: 'boolean' },
      { label: 'Payment Intent ID', value: 'order.paymentIntentId', type: 'string' },
      { label: 'Payment Client Secret', value: 'order.clientSecret', type: 'string' },
      { label: 'Total Due', value: 'order.totalDue', type: 'number' },
      { label: 'Tax', value: 'order.tax', type: 'number' },
      { label: 'Subtotal', value: 'order.subtotal', type: 'number' },

      { label: 'Order cart', value: 'order.cart', type: 'cart' },
      { label: "Shippo delivery rates", value: "shippo.rates", type: 'shippo.rates' },
      { label: "Shippo parcel", value: "shippo.parcel", type: "shippo.parcel" },

      // Billing address
      { label: 'Email Address', value: 'order.billingAddress.emailAddress', type: 'string' },
      { label: 'Full Name', value: 'order.billingAddress.name', type: 'string' },
      { label: 'First Name', value: 'order.billingAddress.firstName', type: 'string' },
      { label: 'Last Name', value: 'order.billingAddress.lastName', type: 'string' },
      { label: 'Address Line 1', value: 'order.billingAddress.address.line1', type: 'string' },
      { label: 'Address Line 2', value: 'order.billingAddress.address.line2', type: 'string' },
      { label: 'City', value: 'order.billingAddress.address.city', type: 'string' },
      { label: 'Country', value: 'order.billingAddress.address.country', type: 'string' },
      { label: 'Postal Code', value: 'order.billingAddress.address.postal_code', type: 'string' },
      { label: 'State', value: 'order.billingAddress.address.state', type: 'string' },
      { label: 'Address Complete', value: 'order.billingAddress.complete', type: 'boolean' },

      // Delivery to
      { label: 'Email Address', value: 'order.deliveryTo.emailAddress', type: 'string' },
      { label: 'Full Name', value: 'order.deliveryTo.name', type: 'string' },
      { label: 'First Name', value: 'order.deliveryTo.firstName', type: 'string' },
      { label: 'Last Name', value: 'order.deliveryTo.lastName', type: 'string' },
      { label: 'Address Line 1', value: 'order.deliveryTo.address.line1', type: 'string' },
      { label: 'Address Line 2', value: 'order.deliveryTo.address.line2', type: 'string' },
      { label: 'City', value: 'order.deliveryTo.address.city', type: 'string' },
      { label: 'Country', value: 'order.deliveryTo.address.country', type: 'string' },
      { label: 'Postal Code', value: 'order.deliveryTo.address.postal_code', type: 'string' },
      { label: 'State', value: 'order.deliveryTo.address.state', type: 'string' },
      { label: 'Address Complete', value: 'order.deliveryTo.complete', type: 'boolean' },

    ]
  },
  {
    label: "With subscription to newsletter",
    value: "user:with_subscribe_to_newsletter",
    variables: [
      { label: "Customer's Name", value: 'customer.name' },
      { label: "Customer's Email Address", value: 'customer.email_address' },
      { label: "Customer's Comment", value: 'customer.comment' },
    ],
  },


  // Fufillment
  {
    label: "Fulfillment: Purchase shipping label complete",
    value: "fulfillment:with_purchase_of_shipping_label",
    variables: [

    ]
  },
  {
    label: "Fulfillment: Lead generation",
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