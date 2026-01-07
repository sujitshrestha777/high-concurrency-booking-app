"use client";

import { getStripePromise } from "lib/stripe/stripe";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function BookingForm() {
  const [classType, setClassType] = useState<"first-class" | "second-class">(
    "first-class"
  );
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seatId, setSeatID] = useState("");

  const searchparams = useSearchParams();
  const seatIdParams = searchparams.get("id");
  const classTypeParams = searchparams.get("class");

  const prices = {
    "first-class": 250,
    "second-class": 100,
  };

  const totalPrice = prices[classType] * quantity;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: Create checkout session
      console.log(
        "classtypeparams and seatIdParams",
        classTypeParams,
        seatIdParams
      );

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classType,
          quantity,
          bookingDetails: {
            date,
            time,
            seatId: seatIdParams,
            userId: "user_123", // Replace with actual user ID
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Step 2: Redirect to Stripe Checkout
      const stripe = await getStripePromise();
      const { error } = await stripe!.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        setError(error.message || "Payment failed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Book Your Ticket</h2>

      <form onSubmit={handleCheckout} className="space-y-4">
        {/* Class Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Class</label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="class"
                value="first-class"
                checked={classType === "first-class"}
                onChange={(e) => setClassType(e.target.value as "first-class")}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="font-medium">First Class {seatIdParams}</div>
                <div className="text-sm text-gray-600">
                  ${prices["first-class"]} per ticket
                </div>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="class"
                value="second-class"
                checked={classType === "second-class"}
                onChange={(e) => setClassType(e.target.value as "second-class")}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="font-medium">Second Class</div>
                <div className="text-sm text-gray-600">
                  ${prices["second-class"]} per ticket
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Tickets
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Travel Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium mb-2">Travel Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Total Price */}
        <div className="bg-gray-50 p-4 rounded">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : `Pay $${totalPrice}`}
        </button>
      </form>
    </div>
  );
}
