import type { NextAuthConfig } from "next-auth";
import { envAuthSecret } from "@/lib/server-env";

/**
 * Edge-compatible auth config — no mongoose, bcrypt, or Node-only deps.
 * Used by middleware. `@/auth.ts` spreads this file and adds the Credentials provider.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  trustHost: true,
  secret: envAuthSecret(),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
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
};
