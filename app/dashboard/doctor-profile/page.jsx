"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, apiError } from "@/lib/api";
import { useTitle } from "@/lib/use-title";
import Spinner from "@/components/Spinner";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DoctorProfilePage() {
  useTitle("Doctor Profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    doctorName: "",
    specialization: "",
    qualifications: "",
    experience: 0,
    consultationFee: 0,
    hospitalName: "",
    profileImage: "",
    availableDays: [],
    availableSlots: "",
  });

  useEffect(() => {
    api
      .get("/api/doctors/me")
      .then((r) => {
        const d = r.data.data;
        if (d) {
          setStatus(d.verificationStatus);
          setForm({
            doctorName: d.doctorName || "",
            specialization: d.specialization || "",
            qualifications: d.qualifications || "",
            experience: d.experience || 0,
            consultationFee: d.consultationFee || 0,
            hospitalName: d.hospitalName || "",
            profileImage: d.profileImage || "",
            availableDays: d.availableDays || [],
            availableSlots: (d.availableSlots || []).join(", "),
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleDay = (day) =>
    setForm((f) => ({
      ...f,
      availableDays: f.availableDays.includes(day)
        ? f.availableDays.filter((d) => d !== day)
        : [...f.availableDays, day],
    }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/doctors", {
        ...form,
        availableSlots: form.availableSlots.split(",").map((s) => s.trim()).filter(Boolean),
      });
      toast.success("Profile saved");
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading profile…" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="heading">Doctor Profile</h1>
        {status && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              status === "verified"
                ? "bg-green-100 text-green-700"
                : status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {status}
          </span>
        )}
      </div>

      {status !== "verified" && (
        <div className="card mb-6 border-amber-200 bg-amber-50 text-sm text-amber-800">
          Your profile is <b>{status || "not submitted"}</b>. An admin must verify
          you before you appear in Find Doctors.
        </div>
      )}

      <form onSubmit={save} className="card grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Display Name</label>
          <input className="input" required value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} />
        </div>
        <div>
          <label className="label">Specialization</label>
          <input className="input" required value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
        </div>
        <div>
          <label className="label">Qualifications</label>
          <input className="input" value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} />
        </div>
        <div>
          <label className="label">Hospital</label>
          <input className="input" value={form.hospitalName} onChange={(e) => setForm({ ...form, hospitalName: e.target.value })} />
        </div>
        <div>
          <label className="label">Experience (years)</label>
          <input type="number" className="input" value={form.experience} onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })} />
        </div>
        <div>
          <label className="label">Consultation Fee ($)</label>
          <input type="number" className="input" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: Number(e.target.value) })} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Profile Image URL</label>
          <input className="input" value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Available Days</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  form.availableDays.includes(d) ? "bg-brand-600 text-white" : "border border-slate-300 text-slate-600"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Available Slots (comma separated)</label>
          <input className="input" placeholder="09:00 AM, 11:00 AM, 02:00 PM" value={form.availableSlots} onChange={(e) => setForm({ ...form, availableSlots: e.target.value })} />
        </div>
        <button type="submit" disabled={saving} className="btn-primary sm:col-span-2">
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
