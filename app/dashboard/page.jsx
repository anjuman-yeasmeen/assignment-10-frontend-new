"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useTitle } from "@/lib/use-title";

function StatCard({ label, value }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-brand-600">{value}</p>
    </div>
  );
}

export default function DashboardOverview() {
  const { user } = useAuth();
  useTitle("Dashboard");

  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [adminTotals, setAdminTotals] = useState(null);

  useEffect(() => {
    if (!user) return;
    api.get("/api/appointments").then((r) => setAppointments(r.data.data)).catch(() => {});
    if (user.role === "patient") {
      api.get("/api/payments").then((r) => setPayments(r.data.data)).catch(() => {});
    }
    if (user.role === "admin") {
      api.get("/api/stats/admin").then((r) => setAdminTotals(r.data.totals)).catch(() => {});
    }
  }, [user]);

  if (!user) return null;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <h1 className="heading mb-6">Welcome, {user.name.split(" ")[0]} 👋</h1>

      {user.role === "patient" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Upcoming Appointments"
            value={appointments.filter((a) => ["pending", "accepted"].includes(a.appointmentStatus)).length}
          />
          <StatCard label="Total Appointments" value={appointments.length} />
          <StatCard
            label="Total Paid"
            value={`$${payments.reduce((s, p) => s + p.amount, 0)}`}
          />
          <StatCard
            label="Completed Visits"
            value={appointments.filter((a) => a.appointmentStatus === "completed").length}
          />
        </div>
      )}

      {user.role === "doctor" && (
        <div className="grid gap-6 sm:grid-cols-3">
          <StatCard
            label="Total Patients"
            value={new Set(appointments.map((a) => a.patientId)).size}
          />
          <StatCard
            label="Today's Appointments"
            value={appointments.filter((a) => a.appointmentDate === today).length}
          />
          <StatCard
            label="Pending Requests"
            value={appointments.filter((a) => a.appointmentStatus === "pending").length}
          />
        </div>
      )}

      {user.role === "admin" && adminTotals && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Doctors" value={adminTotals.totalDoctors} />
          <StatCard label="Total Patients" value={adminTotals.totalPatients} />
          <StatCard label="Total Appointments" value={adminTotals.totalAppointments} />
          <StatCard label="Total Reviews" value={adminTotals.totalReviews} />
        </div>
      )}

      <div className="card mt-8">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Recent Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-sm text-slate-400">No appointments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400">
                <tr>
                  <th className="py-2">Date</th>
                  <th className="py-2">Time</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((a) => (
                  <tr key={a._id} className="border-t border-slate-100">
                    <td className="py-2">{a.appointmentDate}</td>
                    <td className="py-2">{a.appointmentTime}</td>
                    <td className="py-2 capitalize">{a.appointmentStatus}</td>
                    <td className="py-2 capitalize">{a.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
