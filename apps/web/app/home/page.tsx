"use client";

import { useSession, SessionProvider } from "next-auth/react";

function DashboardClient() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You are not signed in</p>;
  }

  const role = session.user.role;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Welcome, {session.user.name}, {role}
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <SessionProvider>
      <DashboardClient />
    </SessionProvider>
  );
}
