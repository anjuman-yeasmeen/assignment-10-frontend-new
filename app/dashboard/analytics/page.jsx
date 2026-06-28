"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/lib/api";
import { useTitle } from "@/lib/use-title";
import Spinner from "@/components/Spinner";

const COLORS = ["#0d9488", "#0ea5e9", "#6366f1", "#f59e0b"];

export default function AnalyticsPage() {
  useTitle("Analytics");
  const [totals, setTotals] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/stats/admin")
      .then((r) => {
        setTotals(r.data.totals);
        setPerformance(r.data.doctorPerformance);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading analytics…" />;

  const totalsData = totals
    ? [
        { name: "Doctors", value: totals.totalDoctors },
        { name: "Patients", value: totals.totalPatients },
        { name: "Appointments", value: totals.totalAppointments },
        { name: "Reviews", value: totals.totalReviews },
      ]
    : [];

  return (
    <div>
      <h1 className="heading mb-6">Analytics</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Doctor Performance (by rating)</h2>
          {performance.length === 0 ? (
            <p className="text-sm text-slate-400">No rating data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="doctorName" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="avgRating" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Platform Totals</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={totalsData} dataKey="value" nameKey="name" outerRadius={110} label>
                {totalsData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {totalsData.map((t, i) => (
          <div key={t.name} className="card text-center">
            <p className="text-3xl font-bold" style={{ color: COLORS[i % COLORS.length] }}>{t.value}</p>
            <p className="mt-1 text-sm text-slate-500">{t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
