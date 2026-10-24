'use server'

import { generateShippoShipment } from '@/app/(session)/(checkout)/checkout/ShippoService'
import { getPayload } from 'payload'
import { SquareClient, SquareEnvironment } from 'square'
import configPromise from '@payload-config'
import { Crm, Order } from '@/payload-types'
import { CheckoutDetailsType, ProductType } from '@/components/Cart/CartProviderComponent'
import { handleApplicationEventWithEmails } from '@/collections/Emails/EmailService'
import Mongo from '@/utilities/mongo'

const square = new SquareClient({
  token: process.env.SQUARE_SANDBOX_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox,
});


export async function processSquarePayment(props: {
  idempotencyKey: string,
  sourceId: string,
  amountInCents: number,
  cart: ProductType[] | null,
  checkoutDetails: Partial<CheckoutDetailsType>
}) {
  try {

    const trustedItemsInCart = await getTrustedItemsInCartAndValidate({
      cart: props.cart
    });

    const newOrder = await createNewUncompleteOrder({
      checkoutDetails: props.checkoutDetails,
      trustedItemsInCart: trustedItemsInCart
    });

    const newCustomer = await createOrUpdateCustomer({
      checkoutDetails: props.checkoutDetails
    })

    // Prepare square billing contact information
    const squareBillingContact = generateSquareBillingContactInformation({
      checkoutDetails: props.checkoutDetails
    });

    // Submit payment to square
    const result = await square.payments.create({
      sourceId: props.sourceId,
      idempotencyKey: props.idempotencyKey,
      amountMoney: {
        amount: BigInt(props.amountInCents),
        currency: 'USD',
      },
      billingAddress: squareBillingContact,
      buyerEmailAddress: squareBillingContact.email ?? undefined,
      shippingAddress: {
        addressLine1: props.checkoutDetails.deliveryTo?.address.line1 ?? undefined,
        addressLine2: props.checkoutDetails.deliveryTo?.address.line2 ?? undefined,
        // @ts-ignore
        country: props.checkoutDetails.deliveryTo?.address.country ?? undefined,
        state: props.checkoutDetails.deliveryTo?.address.state ?? undefined,
        city: props.checkoutDetails.deliveryTo?.address.city ?? undefined
      },
      locationId: process.env.SQUARE_SANDBOX_LOCATION_ID,
    });

    // Decrement inventory
    await decrementInventoryAccordingToCartQuantity({
      cart: trustedItemsInCart
    });

    if (props.checkoutDetails.pickup == 'delivery') {
      const shipment = await getShippoShipment({
        checkoutDetails: props.checkoutDetails
      })
    }

    const { deliveryTo, billingAddress, clientSecret, ...order } = props.checkoutDetails;

    const emails = await handleApplicationEventWithEmails({
      event: 'user:with_successful_purchase_complete',
      variables: {
        ...Object.fromEntries(
          Object.entries(order).map(([key, value]) => [`order.${key}`, value]),
        ),
        ...Object.fromEntries(
          Object.entries(billingAddress ?? {}).map(([key, value]) => [`order.billingAddress.${key}`, value]),
        ),
        ...Object.fromEntries(
          Object.entries(deliveryTo ?? {}).map(([key, value]) => [`order.deliveryTo.${key}`, value]),
        ),
        "order.cart": trustedItemsInCart,
      }
    });

    return {
      success: true,
      payment: result,
    }


  } catch (error) {
    console.error(error)
    return {
      success: false,
      payment: null,
    }
  }
}



const getTrustedItemsInCartAndValidate = async (props: {
  cart: ProductType[] | null
}) => {

  const payload = await getPayload({ config: configPromise });

  // get trusted items in the cart
  const trustedItemsInCart = await payload.find({
    collection: 'products',
    draft: false,
    where: {
      id: {
        in: props.cart?.map(item => item.product.id)
      }
    }
  });

  if (trustedItemsInCart.docs.length != props.cart?.length) {
    throw new Error("Something went wrong. At least one of the items in the cart is unavaliable.")
  }

  // Cart validation check
  for (const item of trustedItemsInCart.docs) {
    if (!item.active) {
      throw new Error(`${item.name} is not active.`)
    }
    const cartProduct = props.cart?.find(x => x.id == item.id)
    const chosen_size = item.sizes?.find(x => x.id == cartProduct?.size);
    if (!chosen_size?.count || chosen_size.count == 0 || chosen_size.count < (cartProduct?.quantity ?? 1)) {
      throw new Error(`${item.name} has insuffienct items in stock for the chosen size.`)
    }
  }

  return props.cart.map(item => {

    const trustedItem = trustedItemsInCart.docs.find(x => x.id == item.product.id);

    if (!trustedItem) {
      throw new Error("Could not find a trusted item.")
    }

    return {
      product: trustedItem,
      product_id: trustedItem?.id,
      quantity: item.quantity,
      size: item.size,
      id: item.id
    }
  })
}


const generateSquareBillingContactInformation = (props: {
  checkoutDetails: Partial<CheckoutDetailsType>
}) => {
  return {
    givenName: props.checkoutDetails.billingAddress?.firstName,
    familyName: props.checkoutDetails.billingAddress?.lastName,
    // phone: props.checkoutDetails.billingAddress?.phone,
    addressLines: [
      props.checkoutDetails.billingAddress?.address.line1,
      props.checkoutDetails.billingAddress?.address.line2,
    ].filter(Boolean),
    city: props.checkoutDetails.billingAddress?.address.city,
    state: props.checkoutDetails.billingAddress?.address.state,
    postalCode: props.checkoutDetails.billingAddress?.address.postal_code,
    countryCode: props.checkoutDetails.billingAddress?.address.country,
    email: props.checkoutDetails.billingAddress?.emailAddress,
  }
}


const decrementInventoryAccordingToCartQuantity = async (props: {
  cart: Awaited<ReturnType<typeof getTrustedItemsInCartAndValidate>>
}) => {

  const mongo = await Mongo.getInstance();

  if (!props.cart) {
    throw new Error("Cart is empty.");
  }

  const commands: any[] = [];
  for (const item of props.cart) {
    commands.push({
      updateOne: {
        filter: { _id: item.product_id },
        update: { $inc: { 'sizes.$[size].count': -1 } },
        arrayFilters: [{ 'size.id': item.size, 'size.count': { $gt: 0 } }],
      },
    },)
  }
  await mongo.clientPromise.bulkWrite(commands)

  return true;

}


const getShippoShipment = async (props: {
  checkoutDetails: Partial<CheckoutDetailsType>
}) => {


  const shipment = await generateShippoShipment({
    addressFrom: {
      name: "Native Sun LLC",
      street1: '1978 Southlake Mall',
      street2: '#144',
      city: 'Merrillville',
      country: 'US',
      zip: '46410',
      state: 'IN',
    },
    addressTo: {
      name: props.checkoutDetails.deliveryTo!.name ?? '',
      street1: props.checkoutDetails.deliveryTo!.address.line1 ?? '',
      street2: props.checkoutDetails.deliveryTo!.address.line2 ?? '',
      city: props.checkoutDetails.deliveryTo!.address.city!,
      country: props.checkoutDetails.deliveryTo!.address.country!,
      zip: props.checkoutDetails.deliveryTo!.address.postal_code!,
      state: props.checkoutDetails.deliveryTo!.address.state!,
    },
    parcels: [
      {
        distanceUnit: 'in',
        massUnit: 'lb',
        weight: "1.5000",
        height: "3.0000",
        length: "12.0000",
        width: "10.0000",
      }
    ]
  });

  return shipment;
}


const createNewUncompleteOrder = async (props: {
  checkoutDetails: Partial<CheckoutDetailsType>,
  trustedItemsInCart: Awaited<ReturnType<typeof getTrustedItemsInCartAndValidate>>
}) => {

  const payload = await getPayload({ config: configPromise });

  // New order starter
  const newOrder: Partial<Order> = {
    name: `${props.checkoutDetails.billingAddress?.firstName} ${props.checkoutDetails.billingAddress?.lastName}`,
    delivery_type: props.checkoutDetails.pickup,
    status: 'incomplete',
    cart: props.trustedItemsInCart.map(item => {
      const theProduct = props.trustedItemsInCart.find(x => x.id == item.product_id)!
      return ({
        product: theProduct.id,
        price: theProduct.product.prices && theProduct.product.prices[0].amount,
        quantity: item.quantity,
        size: item.size
      })
    }),
    delivery_to: {},
    history: [],
    updatedAt: new Date().toString(),
    createdAt: new Date().toString()
  };

  const newOrderAdded = await payload.create({
    collection: 'orders',
    draft: false,
    data: newOrder as any
  })


  return newOrderAdded;
}


const createOrUpdateCustomer = async (props: {
  checkoutDetails: Partial<CheckoutDetailsType>,
}) => {

  const payload = await getPayload({ config: configPromise });

  const newCustomer: Partial<Crm> = {
    firstName: props.checkoutDetails.billingAddress?.firstName,
    lastName: props.checkoutDetails.billingAddress?.lastName,
    fullName: `${props.checkoutDetails.billingAddress?.firstName} ${props.checkoutDetails.billingAddress?.lastName}`,
    emailAddress: props.checkoutDetails.billingAddress?.emailAddress,
    phoneNumber: '',
    isTest: true,
  }

  const found = await payload.find({
    collection: 'crm',
    where: {
      or: [
        { emailAddress: { equals: newCustomer.emailAddress } },
        { phoneNumber: { equals: newCustomer.phoneNumber } }
      ]
    }
  });

  if (found.docs.length > 0) {
    return found.docs[0]
  }

  const newCustomerAdded = await payload.create({
    collection: 'crm',
    draft: false,
    data: newCustomer as any
  })

  return newCustomerAdded;
}