import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db, { eq, users } from "@repo/database/db";
import { compare } from "~/src/utils/encrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@email.com",
        },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const userFound = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!userFound || !userFound.password) {
          throw new Error("Usuario no registrado.");
        }

        if (userFound && userFound?.status === "Deleted") {
          throw new Error("Usuario inactivo, credenciales revocadas.");
        }

        const matchPassword = await compare(
          credentials.password,
          userFound.password
        );

        if (!matchPassword) {
          throw new Error("Correo electrónico o contraseña incorrectos.");
        }

        return userFound;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role; // Incluye el rol en el token
        token.organization = user.organizationId;
        token.image_profile = user.image_profile;
        token.warrantiesWon = user.warrantiesWon;
      }
      return token;
    },
    session({ session, token }: { session: Session; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.organization = token.organization;
        session.user.image_profile = token.image_profile;
        session.user.warrantiesWon = token.warrantiesWon;
      }
      return session;
    },
  },
};
