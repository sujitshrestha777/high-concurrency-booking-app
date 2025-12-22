"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Optional: Verify the session on your backend
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <div className="mb-4">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600">
          Your payment was successful. You will receive a confirmation email
          shortly.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded mb-4">
        <p className="text-sm text-gray-600">Session ID:</p>
        <p className="text-xs font-mono break-all">{sessionId}</p>
      </div>

      <button
        onClick={() => (window.location.href = "/")}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Back to Home
      </button>
    </div>
  );
}
