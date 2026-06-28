import Link from "next/link";

export default function DoctorCard({ doctor }) {
  return (
    <div className="card flex h-full flex-col">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-brand-100 text-2xl font-bold text-brand-700">
          {doctor.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doctor.profileImage}
              alt={doctor.doctorName}
              className="h-full w-full object-cover"
            />
          ) : (
            doctor.doctorName?.[0]?.toUpperCase() ?? "D"
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900">
            {doctor.doctorName}
          </h3>
          <p className="text-sm font-medium text-brand-600">{doctor.specialization}</p>
          {doctor.hospitalName && (
            <p className="truncate text-xs text-slate-400">{doctor.hospitalName}</p>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <p className="text-xs text-slate-400">Experience</p>
          <p className="font-semibold text-slate-700">{doctor.experience} yrs</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <p className="text-xs text-slate-400">Fee</p>
          <p className="font-semibold text-slate-700">${doctor.consultationFee}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-sm text-amber-500">
        ★ <span className="font-semibold">{(doctor.avgRating ?? 0).toFixed(1)}</span>
        <span className="text-slate-400">({doctor.reviewCount ?? 0})</span>
      </div>

      <Link href={`/doctors/${doctor._id}`} className="btn-primary mt-5 w-full">
        View Details
      </Link>
    </div>
  );
}
