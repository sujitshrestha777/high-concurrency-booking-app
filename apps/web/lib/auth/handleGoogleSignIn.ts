import { signIn } from "next-auth/react";

export const handleGoogleSignIn = async () => {
  try {
    await signIn("google", { callbackUrl: "/"},{prompt: "select_account" });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
