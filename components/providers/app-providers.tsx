"use client";

import { Toaster } from "sonner";
import { AuthSessionProvider } from "./session-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      {children}
      <Toaster richColors position="top-center" />
    </AuthSessionProvider>
  );
}
