// app/booking/layout.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="booking-layout">{children}</div>
    </SessionProvider>
  );
}
