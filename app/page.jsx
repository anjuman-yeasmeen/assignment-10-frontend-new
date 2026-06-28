"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import FeaturedDoctorCard from "@/components/FeaturedDoctorCard";

const SPECIALIZATIONS = [
  { name: "Cardiology", icon: "🫀" },
  { name: "Neurology", icon: "🧠" },
  { name: "Orthopedics", icon: "🦴" },
  { name: "Pediatrics", icon: "🧒" },
  { name: "Dermatology", icon: "🩹" },
  { name: "Dentistry", icon: "🦷" },
];

const BENEFITS = [
  { icon: "🛡️", title: "Trusted & Verified Doctors", desc: "Every doctor is admin-verified before accepting appointments." },
  { icon: "📅", title: "Easy & Fast Appointment", desc: "Find a specialist and confirm your slot in a few clicks." },
  { icon: "🔒", title: "Secure Payments & Data Protection", desc: "Your payments and records are handled securely." },
  { icon: "🎧", title: "24/7 Customer Support", desc: "Our team is here to help you anytime, any day." },
];

export default function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [active, setActive] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    api.get("/api/doctors/featured").then((r) => setDoctors(r.data.data)).catch(() => {});
    api.get("/api/stats/public").then((r) => setStats(r.data)).catch(() => {});
    api.get("/api/reviews").then((r) => setReviews(r.data.data)).catch(() => {});
  }, []);

  const statItems = [
    { label: "Total Doctors", value: stats?.totalDoctors ?? 0, icon: "🩺" },
    { label: "Total Patients", value: stats?.totalPatients ?? 0, icon: "👥" },
    { label: "Total Appointments", value: stats?.totalAppointments ?? 0, icon: "📅" },
    { label: "Total Reviews", value: stats?.totalReviews ?? 0, icon: "⭐" },
  ];

  const scroll = (dir) => {
    carouselRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  const testimonial = reviews[active] || null;

  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-accent-500/5 dark:from-white/5 dark:via-transparent dark:to-transparent">
        <div className="section grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100 dark:bg-white/10 dark:text-brand-300 dark:ring-white/10">
              🛡️ Trusted by Thousands
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl dark:text-white">
              Compassionate Care,
              <br />
              <span className="text-brand-600 dark:text-brand-400">Connected</span> for You
            </h1>
            <p className="mt-6 max-w-md text-lg text-slate-600 dark:text-slate-300">
              Book appointments, consult trusted doctors, and manage your
              healthcare easily with MediCare Connect.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/doctors" className="btn-primary">Find Doctors →</Link>
              <Link href="/doctors" className="btn-outline dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10">
                📅 Book Appointment
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  "https://randomuser.me/api/portraits/women/68.jpg",
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  "https://randomuser.me/api/portraits/women/44.jpg",
                ].map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt="Patient" className="h-9 w-9 rounded-full border-2 border-white object-cover dark:border-[#0c0a1a]" />
                ))}
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                10,000+ Patients trust us <span className="text-amber-400">★★★★★</span>
              </p>
            </div>
          </motion.div>

          {/* Right visual + floating appointment card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative mx-auto w-full max-w-md"
          >
            {/* decorative plus signs */}
            <span className="absolute -left-4 top-8 text-3xl text-brand-300">＋</span>
            <span className="absolute right-6 top-2 text-2xl text-brand-300">＋</span>
            <span className="absolute -bottom-2 left-1/3 text-2xl text-brand-200">＋</span>

            <div className="aspect-square w-full overflow-hidden rounded-full bg-gradient-to-tr from-brand-200 to-accent-500/30 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=80"
                alt="Doctor"
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            <div className="absolute -bottom-4 -right-2 w-64 rounded-2xl border border-brand-100 bg-white p-4 shadow-xl sm:-right-6 dark:border-white/10 dark:bg-[#16132b]">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Upcoming Appointment</p>
              <div className="mt-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Dr. Sarah Ahmed" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Dr. Sarah Ahmed</p>
                  <p className="text-xs text-slate-400">Cardiologist</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400">Wed, 26 Jun 2026 · 10:00 AM</p>
              <span className="mt-2 inline-block rounded-md bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                Confirmed
              </span>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/10">
                <div>
                  <p className="text-xs text-slate-400">Payment Status</p>
                  <span className="mt-1 inline-block rounded-md bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Paid</span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">$50.00</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Platform statistics (animated) ===== */}
      <section className="section -mt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-brand-100 dark:lg:divide-white/10"
        >
          {statItems.map((s) => (
            <div key={s.label} className="flex items-center gap-4 lg:justify-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-xl text-brand-600 dark:bg-white/10">
                {s.icon}
              </span>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}+</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ===== Featured doctors (carousel, dynamic) ===== */}
      <section className="section py-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="heading">Featured Doctors</h2>
          <Link href="/doctors" className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
            View All Doctors →
          </Link>
        </div>
        {doctors.length === 0 ? (
          <p className="text-slate-400">No doctors available yet.</p>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={() => scroll(-1)} className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-brand-100 text-slate-500 hover:bg-brand-50 sm:grid dark:border-white/15 dark:hover:bg-white/10" aria-label="Previous">‹</button>
            <div ref={carouselRef} className="grid flex-1 auto-cols-[minmax(260px,1fr)] grid-flow-col gap-5 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid-cols-2 sm:grid-flow-row lg:grid-cols-4">
              {doctors.map((d) => (
                <FeaturedDoctorCard key={d._id} doctor={d} />
              ))}
            </div>
            <button onClick={() => scroll(1)} className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-brand-100 text-slate-500 hover:bg-brand-50 sm:grid dark:border-white/15 dark:hover:bg-white/10" aria-label="Next">›</button>
          </div>
        )}
      </section>

      {/* ===== Medical specializations (static) ===== */}
      <section className="section py-6">
        <div className="mb-6 text-center">
          <h2 className="heading">Medical Specializations</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Care across every major discipline</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SPECIALIZATIONS.map((s) => (
            <Link
              key={s.name}
              href={`/doctors?specialization=${encodeURIComponent(s.name)}`}
              className="card flex flex-col items-center gap-2 text-center transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <span className="text-3xl">{s.icon}</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{s.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Testimonials + Why Choose (2-column) ===== */}
      <section className="section grid gap-6 py-14 lg:grid-cols-2">
        {/* Patient success stories (dynamic) */}
        <div className="card relative overflow-hidden">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">What Our Patients Say</h2>
          <span className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-2xl text-brand-600 dark:bg-white/10">”</span>
          {testimonial ? (
            <>
              <div className="mt-6 flex items-start gap-5">
                <div className="min-w-0 flex-1">
                  <p className="text-slate-600 dark:text-slate-300">
                    “{testimonial.reviewText || "MediCare Connect made booking my appointment so easy!"}”
                  </p>
                  <div className="mt-2 text-amber-400">{"★".repeat(testimonial.rating)}{"☆".repeat(5 - testimonial.rating)}</div>
                  <p className="mt-4 font-semibold text-slate-500 dark:text-slate-400">— Verified Patient</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://randomuser.me/api/portraits/women/90.jpg"
                  alt="Patient"
                  className="hidden h-24 w-24 shrink-0 rounded-2xl object-cover sm:block"
                />
              </div>
              <div className="mt-6 flex gap-2">
                {reviews.slice(0, 5).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-brand-600" : "w-2 bg-brand-200"}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="mt-6 text-slate-400">No testimonials yet.</p>
          )}
        </div>

        {/* Why choose (static) */}
        <div className="card">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Why Choose MediCare Connect?</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <div key={b.title} className="text-center sm:text-left">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-xl text-brand-600 sm:mx-0 dark:bg-white/10">
                  {b.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{b.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
