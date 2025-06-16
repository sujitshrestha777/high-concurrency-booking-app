import { redirect } from "next/navigation";
import { auth } from "../../lib/auth/auth";

const Page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const role = session.user.role;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Welcome, {session.user.name},{role}
      </p>
    </div>
  );
};

export default Page;
