

"use client";

import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement
} from "@stripe/react-stripe-js";
import { Layout } from "@stripe/stripe-js";
import Stripe from "stripe";
import { Button } from "../ui/button";

export default function CheckoutForm({
  subtotal,
  emailAddress,
  address
}: {
  subtotal: string,
  emailAddress: string | null,
  address: {
    name: string;
    firstName?: string;
    lastName?: string;
    address: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    phone?: string;
  }
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
    setConfirmed(param !== null);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-complete`,
        payment_method_data: {
          billing_details: {
            ...address,
            email: emailAddress,
          }
        }
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      console.log(error)
      setMessage("An error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs' as Layout,
    inputs: 'condensed'
  };

  if (!stripe || !elements) {
    return <></>;
  }

  return (
    <div className="column gap-4" id="payment-form" style={{ width: "100%" }}>
      <AddressElement
      className="mb-[1rem]"
        options={{
          mode: "shipping"
        }}
      />
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
      />

      <Button className="w-full mt-[2rem]" onClick={handleSubmit}
        disabled={!emailAddress} >
        Checkout - {subtotal}
      </Button>
      {message && <div id="payment-message">{message}</div>}
    </div>
  );
}
