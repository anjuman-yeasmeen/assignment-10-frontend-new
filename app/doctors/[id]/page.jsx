"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { api, apiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Spinner from "@/components/Spinner";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ appointmentDate: "", appointmentTime: "", symptoms: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/api/doctors/${id}`).then((r) => setDoctor(r.data.data)),
      api.get(`/api/reviews`, { params: { doctorId: id } }).then((r) => setReviews(r.data.data)),
    ])
      .catch(() => setDoctor(null))
      .finally(() => setLoading(false));
  }, [id]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
      : 0;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/doctors/${id}`);
      return;
    }
    if (user.role !== "patient") {
      toast.error("Only patients can book appointments");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/api/appointments", { doctorId: id, ...booking });
      const appointment = data.data;

      const result = await Swal.fire({
        title: "Confirm & Pay",
        html: `Consultation fee: <b>$${doctor?.consultationFee}</b><br/>Pay now to confirm your appointment.`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Pay Now",
        confirmButtonColor: "#0d9488",
      });

      if (result.isConfirmed) {
        await api.post("/api/payments/pay", { appointmentId: appointment._id });
        toast.success("Appointment booked & paid!");
      } else {
        toast.success("Appointment created (unpaid). Pay from your dashboard.");
      }
      router.push("/dashboard/appointments");
    } catch (err) {
      toast.error(apiError(err, "Booking failed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner label="Loading doctor…" />;
  if (!doctor) return <div className="section py-20 text-center text-slate-400">Doctor not found.</div>;

  return (
    <div className="section grid gap-8 py-12 lg:grid-cols-3">
      {/* Doctor info */}
      <div className="lg:col-span-2">
        <div className="card">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-3xl bg-brand-100 text-4xl font-bold text-brand-700">
              {doctor.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={doctor.profileImage} alt={doctor.doctorName} className="h-full w-full object-cover" />
              ) : (
                doctor.doctorName?.[0]
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{doctor.doctorName}</h1>
              <p className="font-medium text-brand-600">{doctor.specialization}</p>
              {doctor.hospitalName && <p className="text-sm text-slate-400">{doctor.hospitalName}</p>}
              <div className="mt-2 text-amber-500">
                ★ <span className="font-semibold">{avgRating.toFixed(1)}</span>{" "}
                <span className="text-slate-400">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Info label="Experience" value={`${doctor.experience} years`} />
            <Info label="Consultation Fee" value={`$${doctor.consultationFee}`} />
            <Info label="Qualifications" value={doctor.qualifications || "—"} />
          </div>

          {doctor.availableDays && doctor.availableDays.length > 0 && (
            <div className="mt-6">
              <p className="label">Available Days</p>
              <div className="flex flex-wrap gap-2">
                {doctor.availableDays.map((d) => (
                  <span key={d} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">{d}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="card mt-6">
          <h2 className="text-lg font-bold text-slate-900">Patient Reviews</h2>
          {reviews.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No reviews yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {reviews.map((r) => (
                <li key={r._id} className="border-b border-slate-100 pb-4 last:border-0">
                  <div className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  <p className="mt-1 text-sm text-slate-600">{r.reviewText}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Booking */}
      <div>
        <form onSubmit={handleBook} className="card sticky top-20">
          <h2 className="text-lg font-bold text-slate-900">Book Appointment</h2>
          <p className="mt-1 text-sm text-slate-500">Fee: ${doctor.consultationFee}</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                required
                className="input"
                value={booking.appointmentDate}
                onChange={(e) => setBooking({ ...booking, appointmentDate: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Time</label>
              <select
                required
                className="input"
                value={booking.appointmentTime}
                onChange={(e) => setBooking({ ...booking, appointmentTime: e.target.value })}
              >
                <option value="">Select slot</option>
                {(doctor.availableSlots?.length
                  ? doctor.availableSlots
                  : ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"]
                ).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Symptoms</label>
              <textarea
                className="input"
                rows={3}
                value={booking.symptoms}
                onChange={(e) => setBooking({ ...booking, symptoms: e.target.value })}
                placeholder="Briefly describe your symptoms"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Booking…" : "Book & Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-700">{value}</p>
    </div>
  );
}
