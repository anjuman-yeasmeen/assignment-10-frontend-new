"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { api, apiError } from "@/lib/api";
import { useTitle } from "@/lib/use-title";
import Spinner from "@/components/Spinner";

export default function RequestsPage() {
  useTitle("Appointment Requests");
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

  const setStatus = async (a, status) => {
    try {
      await api.patch(`/api/appointments/${a._id}/status`, { status });
      toast.success(`Appointment ${status}`);
      if (status === "completed") await createPrescription(a);
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  // After completing, capture a prescription (spec: prescription management).
  const createPrescription = async (a) => {
    const { value } = await Swal.fire({
      title: "Create Prescription",
      html:
        `<input id="dg" class="swal2-input" placeholder="Diagnosis">` +
        `<input id="md" class="swal2-input" placeholder="Medications (comma separated)">` +
        `<input id="nt" class="swal2-input" placeholder="Notes">`,
      showCancelButton: true,
      confirmButtonText: "Save Prescription",
      confirmButtonColor: "#0d9488",
      preConfirm: () => ({
        diagnosis: document.getElementById("dg").value,
        medications: document.getElementById("md").value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        notes: document.getElementById("nt").value,
      }),
    });
    if (!value || !value.diagnosis) return;
    try {
      await api.post("/api/prescriptions", {
        patientId: a.patientId,
        appointmentId: a._id,
        ...value,
      });
      toast.success("Prescription saved");
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  if (loading) return <Spinner label="Loading requests…" />;

  return (
    <div>
      <h1 className="heading mb-6">Appointment Requests</h1>
      {appointments.length === 0 ? (
        <div className="card text-center text-slate-400">No appointment requests.</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div key={a._id} className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{a.appointmentDate} · {a.appointmentTime}</p>
                {a.symptoms && <p className="mt-1 text-sm text-slate-500">Symptoms: {a.symptoms}</p>}
                <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                  {a.appointmentStatus} · {a.paymentStatus}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {a.appointmentStatus === "pending" && (
                  <>
                    <button onClick={() => setStatus(a, "accepted")} className="btn-primary px-4 py-2 text-xs">Accept</button>
                    <button onClick={() => setStatus(a, "rejected")} className="px-4 py-2 text-xs font-semibold text-red-600">Reject</button>
                  </>
                )}
                {a.appointmentStatus === "accepted" && (
                  <button onClick={() => setStatus(a, "completed")} className="btn-outline px-4 py-2 text-xs">Mark Completed</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
