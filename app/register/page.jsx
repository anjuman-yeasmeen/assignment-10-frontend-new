"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { firebaseEnabled } from "@/lib/firebase";
import { apiError } from "@/lib/api";

// Spec: ≥6 chars including at least one number and one special character.
const PASSWORD_RE = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
    phone: "",
    gender: "",
    role: "patient",
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!PASSWORD_RE.test(form.password)) {
      toast.error("Password needs 6+ chars with a number and a special character");
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      toast.success("Account created!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(apiError(err, "Registration failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google");
      router.push("/dashboard");
    } catch (err) {
      toast.error(apiError(err, "Google sign-in failed"));
    }
  };

  return (
    <div className="section flex min-h-[80vh] items-center justify-center py-12">
      <div className="card w-full max-w-lg">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">Join MediCare Connect today</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Full Name</label>
            <input className="input" required value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Email</label>
            <input type="email" className="input" required value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Photo URL</label>
            <input className="input" value={form.photo} onChange={(e) => set("photo", e.target.value)} placeholder="https://…" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className="label">Gender</label>
            <select className="input" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Register as</label>
            <select className="input" value={form.role} onChange={(e) => set("role", e.target.value)}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor (requires admin verification)</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Password</label>
            <input type="password" className="input" required value={form.password} onChange={(e) => set("password", e.target.value)} />
            <p className="mt-1 text-xs text-slate-400">
              At least 6 characters, including a number and a special character.
            </p>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full sm:col-span-2">
            {submitting ? "Creating account…" : "Register"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" /> OR <span className="h-px flex-1 bg-slate-200" />
        </div>
        <button onClick={handleGoogle} disabled={!firebaseEnabled} className="btn-outline w-full">
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600">Login</Link>
        </p>
      </div>
    </div>
  );
}
