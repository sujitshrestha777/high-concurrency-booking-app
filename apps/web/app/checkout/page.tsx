"use client";
import React, { useEffect, useState } from "react";
import PaymentForm from "../../components/PaymentForm";
import { useRouter } from "next/navigation";

const page = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  let bookingId;
  const bookingData = {
    id: bookingId || "1234",
    service: "Premium Consultation",
    date: "2024-12-15",
    time: "14:00",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    price: 15000, // $150.00 in cents
  };

  useEffect(() => {
    createPaymentIntent();
  }, [bookingId]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: bookingData.price,
          currency: "usd",
          bookingId: bookingData.id,
          customerEmail: bookingData.customerEmail,
          metadata: {
            service: bookingData.service,
            date: bookingData.date,
            time: bookingData.time,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent");
      }

      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initialize payment"
      );
    } finally {
      setLoading(false);
    }
  };
  const handlePaymentSuccess = (paymentIntentId: string) => {
    router.push(
      `/payment/success?booking_id=${bookingId}&payment_intent=${paymentIntentId}`
    );
  };
  const handlePaymentError = (error: string) => {
    setError(error);
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6">
        <div className="bg-red-100 border border-red-200 rounded-md p-4">
          <h2 className="text-red-800 font-semibold">Payment Error</h2>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Complete Your Booking</h1>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Booking Details</h2>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Service:</span>{" "}
              {bookingData.service}
            </p>
            <p>
              <span className="font-medium">Date:</span> {bookingData.date}
            </p>
            <p>
              <span className="font-medium">Time:</span> {bookingData.time}
            </p>
            <p>
              <span className="font-medium">Customer:</span>{" "}
              {bookingData.customerName}
            </p>
          </div>
        </div>
      </div>
      {clientSecret && (
        <PaymentForm
          clientSecret={clientSecret}
          bookingId={bookingData.id}
          amount={bookingData.price}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </div>
  );
};

export default page;
