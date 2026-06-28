export const metadata = { title: "About Us" };

const values = [
  { title: "Patient First", desc: "Every decision we make starts with patient wellbeing." },
  { title: "Trust & Safety", desc: "Doctors are verified and records are kept secure." },
  { title: "Accessibility", desc: "Quality care should be a few clicks away for everyone." },
];

export default function AboutPage() {
  return (
    <div className="section py-14">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="heading">About MediCare Connect</h1>
        <p className="mt-4 text-lg text-slate-600">
          MediCare Connect is a modern healthcare management platform that
          connects patients with doctors and hospitals through a single,
          centralized online system — digitizing appointments, reducing waiting
          times, and keeping healthcare records secure.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="card">
            <h3 className="text-lg font-semibold text-slate-900">{v.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="card mt-12">
        <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
        <p className="mt-3 text-slate-600">
          To provide a seamless healthcare experience by improving doctor
          schedule management, enabling secure digital payments, and giving
          patients full control over their appointments and medical history.
        </p>
      </div>
    </div>
  );
}
