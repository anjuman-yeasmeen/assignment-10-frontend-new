"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Find Doctors" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    toast.success("Logged out");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#0c0a1a]/90">
      <nav className="section flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 text-lg text-white">
            ❤
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-bold text-slate-900">MediCare</span>
            <span className="-mt-1 block text-sm font-semibold text-brand-600">Connect</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-300"
                  : "text-slate-600 hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-300"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!loading && user ? (
            <>
              <Link href="/dashboard" className="hidden btn-outline md:inline-flex">
                Dashboard
              </Link>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pr-3"
                >
                  <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {user.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      user.name?.[0]?.toUpperCase()
                    )}
                  </span>
                  <span className="hidden text-sm font-medium text-slate-700 sm:block">
                    {user.name?.split(" ")[0]}
                  </span>
                </button>
                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    <div className="px-3 py-2 text-xs uppercase tracking-wide text-slate-400">
                      {user.role}
                    </div>
                    <Link
                      href="/dashboard"
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn-outline">Login</Link>
              <Link href="/register" className="btn-primary">Register</Link>
            </div>
          )}
          {!loading && !user && (
            <Link href="/login" className="btn-primary sm:hidden">Login</Link>
          )}

          {/* Mobile toggle */}
          <button
            className="rounded-lg p-2 text-slate-600 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="section flex flex-col py-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-brand-700"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
