import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { getStripePromise } from "../lib/stripe/stripeClientSide";

interface paymentProps {
  clientSecret: string;
  bookingId: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (err: string) => void;
}
const PaymentFormInner = ({
  bookingId,
  amount,
  onSuccess,
  onError,
}: paymentProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?booking_id=${bookingId}`,
        },
        redirect: "if_required",
      });
      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "Payment failed");
        } else {
          setMessage("An unexpected error occurred");
        }
        onError(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
      onError("Payment processing failed");
      console.log("error while confirm payment", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Total Amount:{" "}
              <span className="font-bold">${(amount / 100).toFixed(2)}</span>
            </p>
          </div>

          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>

        {message && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default function PaymentForm(props: paymentProps) {
  const stripe = getStripePromise();
  const options = {
    clientSecret: props.clientSecret,
    appearance: {
      theme: "stripe" as const, // or 'flat', 'night', 'none'
    },
  };

  return (
    <Elements stripe={stripe} options={options}>
      <PaymentFormInner {...props} />
    </Elements>
  );
}
