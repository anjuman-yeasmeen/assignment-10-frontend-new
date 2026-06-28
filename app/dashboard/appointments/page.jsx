"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { api, apiError } from "@/lib/api";
import { useTitle } from "@/lib/use-title";
import Spinner from "@/components/Spinner";

const statusColor = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-slate-200 text-slate-600",
};

export default function MyAppointmentsPage() {
  useTitle("My Appointments");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/api/appointments")
      .then((r) => setAppointments(r.data.data))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => load(), [load]);

  const pay = async (a) => {
    try {
      await api.post("/api/payments/pay", { appointmentId: a._id });
      toast.success("Payment successful");
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const cancel = async (a) => {
    const res = await Swal.fire({
      title: "Cancel appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      confirmButtonColor: "#dc2626",
    });
    if (!res.isConfirmed) return;
    try {
      await api.patch(`/api/appointments/${a._id}`, { appointmentStatus: "cancelled" });
      toast.success("Appointment cancelled");
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const reschedule = async (a) => {
    const { value } = await Swal.fire({
      title: "Reschedule",
      html:
        `<input id="d" type="date" class="swal2-input" value="${a.appointmentDate}">` +
        `<input id="t" type="text" class="swal2-input" placeholder="Time" value="${a.appointmentTime}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      preConfirm: () => ({
        appointmentDate: document.getElementById("d").value,
        appointmentTime: document.getElementById("t").value,
      }),
    });
    if (!value) return;
    try {
      await api.patch(`/api/appointments/${a._id}`, value);
      toast.success("Appointment rescheduled");
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  if (loading) return <Spinner label="Loading appointments…" />;

  return (
    <div>
      <h1 className="heading mb-6">My Appointments</h1>
      {appointments.length === 0 ? (
        <div className="card text-center text-slate-400">No appointments booked yet.</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div key={a._id} className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">
                  {a.appointmentDate} · {a.appointmentTime}
                </p>
                {a.symptoms && <p className="mt-1 text-sm text-slate-500">{a.symptoms}</p>}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor[a.appointmentStatus]}`}>
                    {a.appointmentStatus}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${a.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {a.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {a.paymentStatus === "unpaid" && a.appointmentStatus !== "cancelled" && (
                  <button onClick={() => pay(a)} className="btn-primary px-4 py-2 text-xs">Pay Now</button>
                )}
                {["pending", "accepted"].includes(a.appointmentStatus) && (
                  <>
                    <button onClick={() => reschedule(a)} className="btn-outline px-4 py-2 text-xs">Reschedule</button>
                    <button onClick={() => cancel(a)} className="px-4 py-2 text-xs font-semibold text-red-600">Cancel</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
