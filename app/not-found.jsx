import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="text-[120px] font-black leading-none text-brand-600">404</div>
      <svg
        viewBox="0 0 200 120"
        className="mb-6 h-32 w-64 text-brand-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path d="M10 70 h40 l10 -25 l15 50 l12 -35 l10 20 h83" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h1 className="heading">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-500">
        The page you are looking for doesn’t exist or has been moved. Let’s get
        you back to safety.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back to Home
      </Link>
    </div>
  );
}
