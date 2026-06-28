"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, apiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useTitle } from "@/lib/use-title";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  useTitle("My Profile");

  const [form, setForm] = useState({ name: "", photo: "", phone: "", gender: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        photo: user.photo || "",
        phone: user.phone || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/api/users/me", form);
      await refresh();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <h1 className="heading mb-6">My Profile</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card flex flex-col items-center text-center">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-brand-100 text-3xl font-bold text-brand-700">
            {form.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.photo} alt={form.name} className="h-full w-full object-cover" />
            ) : (
              form.name?.[0]?.toUpperCase()
            )}
          </div>
          <p className="mt-4 font-semibold text-slate-900">{user.name}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
          <span className="mt-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase text-brand-700">
            {user.role}
          </span>
        </div>

        <form onSubmit={save} className="card lg:col-span-2 space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Photo URL</label>
            <input className="input" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
