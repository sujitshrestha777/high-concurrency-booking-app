"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");

  return (
    <div style={{ padding: 40 }}>
      <h1>✅ Payment Successful</h1>
      <p>PaymentIntent: {paymentIntent}</p>
    </div>
  );
}
