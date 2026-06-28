"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { api, apiError } from "@/lib/api";
import { useTitle } from "@/lib/use-title";
import Spinner from "@/components/Spinner";

export default function MyReviewsPage() {
  useTitle("My Reviews");
  const [reviews, setReviews] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ doctorId: "", rating: 5, reviewText: "" });

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/api/appointments").then((r) => setAppointments(r.data.data)),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => load(), [load]);

  // Distinct doctors the patient has appointments with (can be reviewed).
  const reviewableDoctors = Array.from(new Set(appointments.map((a) => a.doctorId)));

  // Reviews are filtered client-side from the public list scoped by doctor.
  const loadMyReviews = useCallback(async () => {
    const all = [];
    for (const d of reviewableDoctors) {
      const { data } = await api.get("/api/reviews", { params: { doctorId: d } });
      all.push(...data.data);
    }
    setReviews(all);
  }, [reviewableDoctors]);

  useEffect(() => {
    if (reviewableDoctors.length) loadMyReviews();
  }, [appointments.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e) => {
    e.preventDefault();
    if (!form.doctorId) return toast.error("Select a doctor");
    try {
      await api.post("/api/reviews", form);
      toast.success("Review added");
      setForm({ doctorId: "", rating: 5, reviewText: "" });
      loadMyReviews();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const edit = async (r) => {
    const { value } = await Swal.fire({
      title: "Edit review",
      html:
        `<input id="rt" class="swal2-input" value="${r.reviewText || ""}">` +
        `<input id="rr" type="number" min="1" max="5" class="swal2-input" value="${r.rating}">`,
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      preConfirm: () => ({
        reviewText: document.getElementById("rt").value,
        rating: Number(document.getElementById("rr").value),
      }),
    });
    if (!value) return;
    try {
      await api.patch(`/api/reviews/${r._id}`, value);
      toast.success("Review updated");
      loadMyReviews();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const remove = async (r) => {
    const res = await Swal.fire({
      title: "Delete review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    });
    if (!res.isConfirmed) return;
    try {
      await api.delete(`/api/reviews/${r._id}`);
      toast.success("Review deleted");
      loadMyReviews();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  if (loading) return <Spinner label="Loading reviews…" />;

  return (
    <div>
      <h1 className="heading mb-6">My Reviews</h1>

      <form onSubmit={submit} className="card mb-6 grid gap-4 sm:grid-cols-4">
        <select className="input sm:col-span-2" value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
          <option value="">Select doctor…</option>
          {reviewableDoctors.map((d) => (
            <option key={d} value={d}>{d.slice(-6)}</option>
          ))}
        </select>
        <select className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} ★</option>
          ))}
        </select>
        <input className="input sm:col-span-3" placeholder="Write a review…" value={form.reviewText} onChange={(e) => setForm({ ...form, reviewText: e.target.value })} />
        <button className="btn-primary">Add Review</button>
      </form>

      {reviews.length === 0 ? (
        <div className="card text-center text-slate-400">No reviews yet.</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="card flex items-center justify-between">
              <div>
                <div className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                <p className="mt-1 text-sm text-slate-600">{r.reviewText}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => edit(r)} className="btn-outline px-3 py-1.5 text-xs">Edit</button>
                <button onClick={() => remove(r)} className="px-3 py-1.5 text-xs font-semibold text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
