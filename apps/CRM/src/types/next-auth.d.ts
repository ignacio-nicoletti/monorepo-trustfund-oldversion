// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";
import { JWT as DefaultJWTType } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image?: string | null;
      role: number; // Agrega `role` si lo necesitas
      warrantiesWon: number | null;
      image_profile: string | null;
      organization: number;
    } & DefaultSession["user"];
    access_token?: string; // Agrega la propiedad `access_token` a la sesión
  }

  interface JWT {
    access_token?: string; // Agrega la propiedad `access_token` al JWT
  }
}
