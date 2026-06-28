"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useTitle } from "@/lib/use-title";
import Spinner from "@/components/Spinner";

export default function ManageAppointmentsPage() {
  useTitle("All Appointments");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api
      .get("/api/appointments")
      .then((r) => setAppointments(r.data.data))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading appointments…" />;

  const shown =
    filter === "all" ? appointments : appointments.filter((a) => a.appointmentStatus === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="heading">All Appointments</h1>
        <select className="input w-44" value={filter} onChange={(e) => setFilter(e.target.value)}>
          {["all", "pending", "accepted", "completed", "rejected", "cancelled"].map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              <th className="py-2">Date</th>
              <th className="py-2">Time</th>
              <th className="py-2">Status</th>
              <th className="py-2">Payment</th>
              <th className="py-2">Fee</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((a) => (
              <tr key={a._id} className="border-t border-slate-100">
                <td className="py-3">{a.appointmentDate}</td>
                <td className="py-3">{a.appointmentTime}</td>
                <td className="py-3 capitalize">{a.appointmentStatus}</td>
                <td className="py-3 capitalize">{a.paymentStatus}</td>
                <td className="py-3">${a.consultationFee ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
