"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth-context";

export function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{ style: { borderRadius: "10px" } }}
      />
    </AuthProvider>
  );
}
