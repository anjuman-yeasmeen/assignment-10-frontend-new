"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import DoctorCard from "@/components/DoctorCard";
import Spinner from "@/components/Spinner";

const SPECIALIZATIONS = [
  "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "Dentistry",
];

const SORTS = [
  { value: "", label: "Newest" },
  { value: "fee_asc", label: "Fee: Low to High" },
  { value: "fee_desc", label: "Fee: High to Low" },
  { value: "experience", label: "Most Experienced" },
  { value: "rating", label: "Highest Rated" },
];

const LIMIT = 6;

export default function DoctorsPage() {
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState(params.get("specialization") || "");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const [doctors, setDoctors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Reset to page 1 whenever a filter changes.
  useEffect(() => {
    setPage(1);
  }, [search, specialization, sort]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      api
        .get("/api/doctors", {
          params: { search, specialization, sort, page, limit: LIMIT },
        })
        .then((r) => {
          setDoctors(r.data.data);
          setTotalPages(r.data.totalPages || 1);
          setTotal(r.data.total || 0);
        })
        .catch(() => setDoctors([]))
        .finally(() => setLoading(false));
    }, 300); // debounce search
    return () => clearTimeout(t);
  }, [search, specialization, sort, page]);

  return (
    <div className="section py-12">
      <div className="mb-8 text-center">
        <h1 className="heading">Find Your Doctor</h1>
        <p className="mt-2 text-slate-500">
          Search verified specialists and book your appointment
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8 grid gap-4 md:grid-cols-3">
        <div>
          <label className="label">Search</label>
          <input
            className="input"
            placeholder="Name or specialization…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Specialization</label>
          <select className="input" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
            <option value="">All</option>
            {SPECIALIZATIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Sort by</label>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Spinner label="Finding doctors…" />
      ) : doctors.length === 0 ? (
        <div className="card text-center text-slate-400">No doctors match your filters.</div>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">{total} doctor(s) found</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <DoctorCard key={d._id} doctor={d} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                className="btn-outline px-3 py-2 disabled:opacity-40"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹ Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-10 w-10 rounded-lg text-sm font-semibold ${
                    p === page ? "bg-brand-600 text-white" : "border border-slate-300 text-slate-600"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                className="btn-outline px-3 py-2 disabled:opacity-40"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
