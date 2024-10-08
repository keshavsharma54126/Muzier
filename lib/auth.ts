import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
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
            existingUser.password || ""
          );
          if (passwordValid) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
            };
          }
          return null;
        }

        try {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const newUser = await db.user.create({
            data: {
              name: "Guest",
              email: credentials.email,
              password: hashedPassword,
            },
          });

          return {
            id: newUser.id,
            name: newUser.name,
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        const dbUser = await db.user.findUnique({
          where: { email: session.user.email },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },
    async signIn({ account, profile }: any) {
      if (account.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: {
            email: profile.email,
          },
        });
        if (existingUser) {
          if (!existingUser.googleId) {
            await db.user.update({
              where: { id: existingUser.id },
              data: { googleId: account.providerAccountId },
            });
          }
          return true;
        }
        try {
          const newUser = await db.user.create({
            data: {
              name: profile.name,
              email: profile.email,
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
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
