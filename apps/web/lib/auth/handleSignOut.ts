import { signOut } from "next-auth/react";

export const handleSignOut = async () => {
  try {
    await signOut({callbackUrl:"/home"});
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
