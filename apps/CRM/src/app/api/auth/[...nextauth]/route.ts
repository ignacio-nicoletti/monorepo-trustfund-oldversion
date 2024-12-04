import NextAuth from "next-auth/next";
import { authOptions } from "./authOptions";

const handler = NextAuth(authOptions);

export { handler as POST, handler as GET };