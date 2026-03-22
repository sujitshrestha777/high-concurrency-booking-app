"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");

  return (
    <div style={{ padding: 40 }}>
      <h1>✅ Payment Successful</h1>
      <p>PaymentIntent: {paymentIntent}</p>
    </div>
  );
}
export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
