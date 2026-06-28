import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-100 bg-white">
      <div className="section grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 text-lg text-white">
              ❤
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-bold text-slate-900">MediCare</span>
              <span className="-mt-1 block text-sm font-semibold text-brand-600">Connect</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-slate-500">
            Your trusted partner in health. Connecting you with the best
            healthcare, anytime, anywhere.
          </p>
          <div className="mt-4 flex gap-2 text-slate-500">
            {["f", "t", "in", "ig", "yt"].map((s) => (
              <a
                key={s}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-brand-100 text-xs hover:bg-brand-50 hover:text-brand-600"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-slate-900">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-brand-600">Home</Link></li>
            <li><Link href="/doctors" className="hover:text-brand-600">Find Doctors</Link></li>
            <li><Link href="/about" className="hover:text-brand-600">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-brand-600">Contact Us</Link></li>
            <li><Link href="/dashboard" className="hover:text-brand-600">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-slate-900">For Patients</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/doctors" className="hover:text-brand-600">Appointments</Link></li>
            <li><Link href="/dashboard/payments" className="hover:text-brand-600">Payments</Link></li>
            <li><Link href="/" className="hover:text-brand-600">Patient Stories</Link></li>
            <li><Link href="/contact" className="hover:text-brand-600">Help Center</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-slate-900">Contact Us</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>123 Healthcare Lane, Dhaka, Bangladesh</li>
            <li>+880 1234 567890</li>
            <li>support@medicareconnect.com</li>
            <li className="pt-1 font-semibold text-brand-600">24/7 Emergency: 10678</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-100 py-5 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} MediCare Connect. All rights reserved.
      </div>
    </footer>
  );
}
