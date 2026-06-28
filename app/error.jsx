"use client";

import Link from "next/link";

export default function Error({ reset }) {
  return (
    <div className="section flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="text-6xl">⚠️</div>
      <h1 className="heading mt-4">Something went wrong</h1>
      <p className="mt-3 max-w-md text-slate-500">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex gap-3">
        <button onClick={reset} className="btn-primary">Try Again</button>
        <Link href="/" className="btn-outline">Back Home</Link>
      </div>
    </div>
  );
}
