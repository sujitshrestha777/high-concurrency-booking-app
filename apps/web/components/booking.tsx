"use client";

import { getStripePromise } from "lib/stripe/stripe";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function BookingForm() {
  const [classType, setClassType] = useState<"first-class" | "second-class">(
    "first-class",
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
        seatIdParams,
      );

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
          bookingDetails: {
            date,
            time,
            seatId: seatIdParams,
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
    <div className="max-w-md mx-auto p-6 bg-gray-900/50  backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl relative z-10">
      <h2 className="text-2xl font-bold mb-6 text-white">Book Your Ticket</h2>

      <form onSubmit={handleCheckout} className="space-y-4">
        {/* Class Type Selection */}
        <div>
          <label className="block text-xs font-medium mb-2 text-white/50 uppercase tracking-widest">
            Selected Class
          </label>
          <div className="space-y-2">
            <label
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                classTypeParams === "business"
                  ? "border-blue-400/50 bg-blue-400/10 text-white"
                  : "border-white/10 bg-transparent text-white/50 hover:bg-white/5 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="class"
                value="business"
                checked={classTypeParams === "business"}
                // onChange={() => setClassType("business")}
                className="sr-only"
              />
              <div className="flex-1">
                <div
                  className={`font-medium ${classTypeParams === "business" ? "text-white" : "text-white/50"}`}
                >
                  Business Class
                </div>
                <div
                  className={`text-sm ${classTypeParams === "business" ? "text-blue-300/70" : "text-white/30"}`}
                >
                  ${prices["first-class"]} per ticket
                </div>
              </div>
              <div
                className={`w-2 h-2 rounded-full transition-all ${classTypeParams === "business" ? "bg-blue-400" : "bg-white/20"}`}
              />
            </label>

            <label
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                classTypeParams === "economy"
                  ? "border-blue-400/50 bg-blue-400/10 text-white"
                  : "border-white/10 bg-transparent text-white/50 hover:bg-white/5 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="class"
                value="economy"
                checked={classTypeParams === "economy"}
                // onChange={() => setClassType("economy")}
                className="sr-only"
              />
              <div className="flex-1">
                <div
                  className={`font-medium ${classTypeParams === "economy" ? "text-white" : "text-white/50"}`}
                >
                  Economy Class
                </div>
                <div
                  className={`text-sm ${classTypeParams === "economy" ? "text-blue-300/70" : "text-white/30"}`}
                >
                  ${prices["second-class"]} per ticket
                </div>
              </div>
              <div
                className={`w-2 h-2 rounded-full transition-all ${classTypeParams === "economy" ? "bg-blue-400" : "bg-white/20"}`}
              />
            </label>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium mb-2 text-white/50 uppercase tracking-widest">
            Travel Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white/80 focus:outline-none focus:border-blue-400/50 transition-all [color-scheme:dark]"
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-xs font-medium mb-2 text-white/50 uppercase tracking-widest">
            Travel Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white/80 focus:outline-none focus:border-blue-400/50 transition-all [color-scheme:dark]"
            required
          />
        </div>

        {/* Total Price */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
          <div className="flex justify-between text-lg font-bold text-white/90">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500/80 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition-all disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : `Pay $${totalPrice}`}
        </button>
      </form>
    </div>
  );
}
