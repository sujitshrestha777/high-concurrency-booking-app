"use client";

import { useLock } from "context/SeatLockcontext";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [wsStatus, setWsStatus] = useState<
    "connecting" | "confirmed" | "failed"
  >("connecting");
  const [wsMessage, setWsMessage] = useState<string>("");
  const { data } = useSession();
  const { clearLock } = useLock();

  useEffect(() => {
    if (!data) return;
    console.log("session data", data);

    const userId = data.user.id;
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
    const ws = new WebSocket(socketUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "payment_initiated", userId }));
      console.log("payment_initiated confirmed");
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data.toString());
      console.log("payment_initiated event messsage", data);

      if (data.type === "bookingConfirmed") {
        setWsStatus("confirmed");
        clearLock(data.seatId);
      }
      if (data.type === "bookingFailed") {
        setWsStatus("failed");
        setWsMessage(data.message || "Payment failed");
      }
    };
    ws.onerror = () => setWsStatus("confirmed");
    return () => ws.close();
  }, [data]);

  useEffect(() => {
    if (sessionId) setLoading(false);
    else setLoading(false);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── FAILED STATE ──────────────────────────────────────────────────────────
  if (wsStatus === "failed") {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black px-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-slate-900" />

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* X icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/40">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <span className="text-sm font-semibold text-red-400 tracking-wider uppercase">
                Booking Failed
              </span>
              <h1 className="mt-2 text-4xl font-bold text-white tracking-tight">
                Payment{" "}
                <span className="bg-gradient-to-r from-red-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">
                  Unsuccessful
                </span>
              </h1>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                We were unable to complete your booking.
              </p>
            </div>

            <div className="border-t border-white/10 mb-6" />

            {/* Error reason */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4">
              <p className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-1">
                Reason
              </p>
              <p className="text-sm text-red-300">
                {wsMessage || "Payment failed due to seat lock mismatch"}
              </p>
            </div>

            {/* Refund notice */}
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-6 flex gap-3 items-start">
              <svg
                className="w-4 h-4 text-purple-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <div>
                <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-0.5">
                  Refund Initiated
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  If any amount was charged, a full refund has been initiated
                  automatically. It will reflect in your account within{" "}
                  <span className="text-white font-medium">
                    3–5 business days
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Session ID */}
            {sessionId && (
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-6">
                <p className="text-xs text-gray-500 mb-1">Session ID</p>
                <p className="text-xs font-mono text-gray-300 break-all">
                  {sessionId}
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-3">
              <button
                onClick={() => (window.location.href = "/booking")}
                className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
              >
                Try Again
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="py-3 px-4 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm font-medium transition-all"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── SUCCESS STATE ─────────────────────────────────────────────────────────
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-slate-900" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Check icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <span className="text-sm font-semibold text-purple-400 tracking-wider uppercase">
              Payment Successful
            </span>
            <h1 className="mt-2 text-4xl font-bold text-white tracking-tight">
              Booking{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Confirmed!
              </span>
            </h1>
            <p className="mt-2 text-gray-400 text-sm leading-relaxed">
              Your seat is secured. A confirmation email will be sent to you
              shortly.
            </p>
          </div>

          <div className="border-t border-white/10 mb-6" />

          {/* Booking details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Date</span>
              <span className="text-white font-medium">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Time</span>
              <span className="text-white font-medium">
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Payment</span>
              <span className="text-green-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Paid
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Booking status</span>
              <span className="text-green-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                {wsStatus === "connecting" ? "Processing..." : "Confirmed"}
              </span>
            </div>
          </div>

          {sessionId && (
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-6">
              <p className="text-xs text-gray-500 mb-1">Session ID</p>
              <p className="text-xs font-mono text-gray-300 break-all">
                {sessionId}
              </p>
            </div>
          )}

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
          >
            Back to Home
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
