# MediCare Connect — Client (Next.js)

Frontend for **MediCare Connect**, a hospital appointment & healthcare management platform connecting patients, doctors, and administrators in one secure system.

> Backend (Express + MongoDB) lives in a separate repository: **medicare-expressjs**.

## Features

- **Authentication** — email/password + Google (Firebase) login, JWT session that survives page reloads, strong-password validation.
- **Role-based dashboards** — separate Patient, Doctor, and Admin experiences behind protected routes.
- **Patients** — search/sort/paginate doctors, book & pay for appointments, reschedule/cancel, payment history, review CRUD.
- **Doctors** — manage profile & schedule, accept/reject/complete appointment requests, write prescriptions.
- **Admin** — manage users (suspend/delete), verify doctors, monitor appointments & payments, analytics (Recharts).
- **Polish** — Framer Motion animations, toast/SweetAlert notifications, custom loading & 404 pages, dynamic page titles, fully responsive.

## Tech Stack

Next.js 16 (App Router) · React 19 · JavaScript (JSX) · Tailwind CSS v4 · Framer Motion · Recharts · Axios · Firebase Auth · React Hot Toast · SweetAlert2

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # then fill in values
npm run dev                        # http://localhost:3000
```

Make sure the **API server** (medicare-expressjs) is running on `http://localhost:5001`.

### Environment Variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the Express API (e.g. `http://localhost:5001`) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key (Google login) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project id |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender id |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app id |

> Google login is optional until Firebase env vars are set; email/password works without it.

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

## Architecture Notes

- **Auth** lives in `lib/auth-context.jsx` (`AuthProvider` / `useAuth`). On mount it calls `GET /api/auth/me` so the session is restored from the httpOnly cookie after a reload. `axios` is configured with `withCredentials` in `lib/api.js`.
- **Protected routes** — `app/dashboard/layout.jsx` guards authentication and renders a role-aware sidebar; the backend additionally enforces role authorization on every API call.
- **Dynamic titles** — server pages export `metadata`; client pages use the `useTitle` hook (`lib/use-title.js`).
- This project targets **Next.js 16**, which has breaking changes vs. earlier versions (e.g. `params` is a Promise). See `AGENTS.md`.

## Important Folders

```
app/               # routes (home, doctors, auth, dashboard, error/404/loading)
components/         # Navbar, Footer, DoctorCard, Spinner
lib/                # api client, auth context, firebase, types, hooks
```
