import Link from "next/link";

// Compact horizontal card used in the home "Featured Doctors" carousel.
export default function FeaturedDoctorCard({ doctor }) {
  return (
    <Link
      href={`/doctors/${doctor._id}`}
      className="card flex w-72 shrink-0 items-center gap-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md sm:w-auto"
    >
      <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-100 text-xl font-bold text-brand-700 dark:bg-white/10">
        {doctor.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={doctor.profileImage} alt={doctor.doctorName} className="h-full w-full object-cover" />
        ) : (
          doctor.doctorName?.[0]?.toUpperCase() ?? "D"
        )}
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-semibold text-slate-900 dark:text-white">{doctor.doctorName}</h3>
        <p className="truncate text-sm text-slate-500 dark:text-slate-400">{doctor.specialization}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">⏱ {doctor.experience}+ Yrs</span>
          <span className="flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-300">💲 ${doctor.consultationFee}</span>
        </div>
      </div>
    </Link>
  );
}
