import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dynamic page titles: child pages set `title` and it fills "%s | MediCare Connect".
export const metadata = {
  title: {
    default: "MediCare Connect — Hospital Appointment & Healthcare Management",
    template: "%s | MediCare Connect",
  },
  description:
    "Book appointments with trusted doctors, manage healthcare records, and connect with hospitals on MediCare Connect.",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Apply saved theme before paint to avoid a flash of the wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-slate-900 dark:bg-[#0c0a1a] dark:text-slate-100">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
