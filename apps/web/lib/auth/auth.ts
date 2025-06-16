// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./authConfig";

export const auth = () => getServerSession(authOptions);
