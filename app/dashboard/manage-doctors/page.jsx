"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, apiError } from "@/lib/api";
import { useTitle } from "@/lib/use-title";
import Spinner from "@/components/Spinner";

export default function ManageDoctorsPage() {
  useTitle("Manage Doctors");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/api/doctors", { params: { verifiedOnly: false, limit: 50 } })
      .then((r) => setDoctors(r.data.data))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => load(), [load]);

  const setVerification = async (d, status) => {
    try {
      await api.patch(`/api/doctors/${d._id}/verify`, { status });
      toast.success(`Doctor ${status}`);
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  if (loading) return <Spinner label="Loading doctors…" />;

  return (
    <div>
      <h1 className="heading mb-6">Manage Doctors</h1>
      <div className="space-y-4">
        {doctors.map((d) => (
          <div key={d._id} className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-slate-900">{d.doctorName}</p>
              <p className="text-sm text-brand-600">{d.specialization} · ${d.consultationFee}</p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  d.verificationStatus === "verified"
                    ? "bg-green-100 text-green-700"
                    : d.verificationStatus === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {d.verificationStatus}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {d.verificationStatus !== "verified" && (
                <button onClick={() => setVerification(d, "verified")} className="btn-primary px-4 py-2 text-xs">Verify</button>
              )}
              {d.verificationStatus !== "rejected" && (
                <button onClick={() => setVerification(d, "rejected")} className="px-4 py-2 text-xs font-semibold text-red-600">Reject</button>
              )}
              {d.verificationStatus === "verified" && (
                <button onClick={() => setVerification(d, "pending")} className="btn-outline px-4 py-2 text-xs">Cancel Verification</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
