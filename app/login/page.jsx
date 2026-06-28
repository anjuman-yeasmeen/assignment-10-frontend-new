"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { firebaseEnabled } from "@/lib/firebase";
import { apiError } from "@/lib/api";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push(redirect);
    } catch (err) {
      toast.error(apiError(err, "Login failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google");
      router.push(redirect);
    } catch (err) {
      toast.error(apiError(err, "Google sign-in failed"));
    }
  };

  return (
    <div className="section flex min-h-[80vh] items-center justify-center py-12">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Log in to your MediCare account</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Logging in…" : "Login"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" /> OR <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={!firebaseEnabled}
          title={firebaseEnabled ? "" : "Configure Firebase env vars to enable Google login"}
          className="btn-outline w-full"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don’t have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-600">Register</Link>
        </p>
      </div>
    </div>
  );
}
