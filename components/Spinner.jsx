export default function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-slate-500">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
