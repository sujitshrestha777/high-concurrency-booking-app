import { signIn } from "next-auth/react";

export const handleGoogleSignIn = async () => {
  try {
    await signIn("google", { callbackUrl: "/" });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
