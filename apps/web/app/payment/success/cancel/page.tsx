"use client";
export default function CancelPage() {
  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <div className="text-6xl mb-4">❌</div>
      <h1 className="text-3xl font-bold text-red-600 mb-2">
        Payment Cancelled
      </h1>
      <p className="text-gray-600 mb-6">
        Your booking was not completed. No charges were made.
      </p>

      <button
        onClick={() => (window.location.href = "/")}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}
