export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="section grid gap-8 py-14 lg:grid-cols-2">
      <div>
        <h1 className="heading">Get in Touch</h1>
        <p className="mt-4 text-slate-600">
          Have a question or need help? Reach out and our team will get back to
          you as soon as possible.
        </p>
        <ul className="mt-8 space-y-4 text-slate-700">
          <li className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700">📍</span>
            123 Health Avenue, Wellness City
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700">✉️</span>
            support@medicareconnect.com
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700">📞</span>
            +1 (555) 010-2030
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-100 text-red-600">🚨</span>
            Emergency Hotline: 911 / 999
          </li>
        </ul>
      </div>

      <form className="card space-y-4">
        <div>
          <label className="label">Name</label>
          <input className="input" placeholder="Your name" />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label className="label">Message</label>
          <textarea className="input" rows={5} placeholder="How can we help?" />
        </div>
        <button type="button" className="btn-primary w-full">Send Message</button>
      </form>
    </div>
  );
}
