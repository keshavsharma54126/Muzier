import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { signIn } from "next-auth/react";
import db from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "john@gmail.com",
          required: true,
        },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (existingUser) {
          const passwordValid = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValid) {
            return {
              id: existingUser.id,
              name: existingUser.fullName,
              email: existingUser.email,
            };
          }
          return null;
        }

        try {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const newUser = await db.user.create({
            data: {
              fullName: "Guest",
              email: credentials.email,
              password: hashedPassword,
            },
          });

          return {
            id: newUser.id,
            name: newUser.fullName,
            email: newUser.email,
          };
        } catch (error) {
          console.error("Error creating user:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secret",
  //   pages: {
  //     signIn: "/signin",
  //   },
  callbacks: {
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ account, profile }: any) {
      if (account.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: {
            googleId: account.providerAccountId,
          },
        });
        if (existingUser) {
          return true;
        }
        try {
          await db.user.create({
            data: {
              fullName: profile.name || "New User",
              email: profile.email || "",
              googleId: account.providerAccountId,
              imageUrl: profile.picture,
            },
          });
          return true;
        } catch (e) {
          console.error("Error while creating user with Google account:", e);
          return false;
        }
      }
      return true;
    },
    async redirect() {
      return "/";
    },
  },
};
