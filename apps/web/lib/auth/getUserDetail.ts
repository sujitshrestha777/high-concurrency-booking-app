"use server";

import { auth } from "./auth";

export const getUserDetails=async () => {
    const session=await auth();
    return session   
}