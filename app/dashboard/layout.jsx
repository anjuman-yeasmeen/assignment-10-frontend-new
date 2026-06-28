"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Spinner from "@/components/Spinner";

const items = [
  { href: "/dashboard", label: "Overview", roles: ["patient", "doctor", "admin"] },
  // Patient
  { href: "/dashboard/appointments", label: "My Appointments", roles: ["patient"] },
  { href: "/dashboard/payments", label: "Payment History", roles: ["patient"] },
  { href: "/dashboard/reviews", label: "My Reviews", roles: ["patient"] },
  // Doctor
  { href: "/dashboard/requests", label: "Appointment Requests", roles: ["doctor"] },
  { href: "/dashboard/doctor-profile", label: "Doctor Profile", roles: ["doctor"] },
  // Admin
  { href: "/dashboard/users", label: "Manage Users", roles: ["admin"] },
  { href: "/dashboard/manage-doctors", label: "Manage Doctors", roles: ["admin"] },
  { href: "/dashboard/manage-appointments", label: "Appointments", roles: ["admin"] },
  { href: "/dashboard/manage-payments", label: "Payments", roles: ["admin"] },
  { href: "/dashboard/analytics", label: "Analytics", roles: ["admin"] },
  // Shared
  { href: "/dashboard/profile", label: "My Profile", roles: ["patient", "doctor", "admin"] },
];

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (loading) return <Spinner label="Loading dashboard…" />;

  // Protected route: bounce to login if not authenticated (works after reload too).
  if (!user) {
    if (typeof window !== "undefined") {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
    return <Spinner label="Redirecting to login…" />;
  }

  const visible = items.filter((i) => i.roles.includes(user.role));

  return (
    <div className="section flex gap-6 py-8">
      {/* Sidebar */}
      <aside
        className={`${
          open ? "block" : "hidden"
        } fixed inset-0 z-30 bg-black/30 lg:static lg:z-auto lg:block lg:bg-transparent`}
        onClick={() => setOpen(false)}
      >
        <nav
          className="h-full w-72 max-w-[80%] overflow-y-auto bg-white p-4 shadow-lg lg:w-64 lg:rounded-2xl lg:border lg:border-slate-200 lg:shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 rounded-xl bg-brand-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs uppercase tracking-wide text-brand-600">{user.role}</p>
          </div>
          <ul className="space-y-1">
            {visible.map((i) => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === i.href
                      ? "bg-brand-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <button
          onClick={() => setOpen(true)}
          className="btn-outline mb-4 lg:hidden"
        >
          ☰ Menu
        </button>
        {children}
      </div>
    </div>
  );
}
