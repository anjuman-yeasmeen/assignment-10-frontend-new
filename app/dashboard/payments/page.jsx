"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useTitle } from "@/lib/use-title";
import Spinner from "@/components/Spinner";

export default function PaymentsPage() {
  useTitle("Payment History");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/payments")
      .then((r) => setPayments(r.data.data))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading payments…" />;

  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <h1 className="heading mb-6">Payment History</h1>
      <div className="card mb-6">
        <p className="text-sm text-slate-500">Total Paid</p>
        <p className="text-3xl font-bold text-brand-600">${total}</p>
      </div>
      {payments.length === 0 ? (
        <div className="card text-center text-slate-400">No payments yet.</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="py-2">Transaction ID</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-t border-slate-100">
                  <td className="py-2 font-mono text-xs">{p.transactionId}</td>
                  <td className="py-2 font-semibold">${p.amount}</td>
                  <td className="py-2">{new Date(p.paymentDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
