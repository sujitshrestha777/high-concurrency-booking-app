// import { redirect } from "next/navigation";
// import { auth } from "../../lib/auth/auth";

// const Page = async () => {
//   const session = await auth();

//   if (!session) {
//     redirect("/auth/sign-in");
//   }

//   const role = session.user.role;

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>
//         Welcome, {session.user.name},{role}
//       </p>
//     </div>
//   );
// };

// export default Page;
// app/dashboard/DashboardClient.tsx
"use client";

import { useSession } from "next-auth/react";

export default function DashboardClient() {
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
