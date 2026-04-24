import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const p = loginSchema.safeParse(creds);
        if (!p.success) return null;
        const { email, password } = p.data;
        if (!isDbConfigured()) {
          if (
            process.env.ADMIN_DEV_EMAIL &&
            process.env.ADMIN_DEV_PASSWORD &&
            email === process.env.ADMIN_DEV_EMAIL &&
            password === process.env.ADMIN_DEV_PASSWORD
          ) {
            return { id: "dev-admin", email, name: "Admin" };
          }
          return null;
        }
        const conn = await connectDB();
        if (!conn) return null;
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin?.passwordHash) return null;
        const ok = await bcrypt.compare(password, admin.passwordHash);
        if (!ok) return null;
        return { id: admin._id.toString(), email: admin.email, name: admin.name };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || "";
      }
      return session;
    },
  },
});
