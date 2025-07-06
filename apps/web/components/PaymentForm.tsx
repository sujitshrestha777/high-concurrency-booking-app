import React from "react";
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
const PaymentForm = ({
  clientSecret,
  bookingId,
  amount,
  onSuccess,
  onError,
}: paymentProps) => {
  const stripe = useStripe();
  const Elements = useElements();
  const stripePromise = getStripePromise();
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe", // or 'flat', 'night', 'none'
    },
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div>
      <Elements stripe={stripePromise} options={options}>
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
            {isProcessing
              ? "Processing..."
              : `Pay $${(amount / 100).toFixed(2)}`}
          </button>
        </form>
      </Elements>
    </div>
  );
};

export default PaymentForm;
