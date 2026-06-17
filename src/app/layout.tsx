import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "كأس العالم 2026 | World Cup 2026",
  description: "موقع كأس العالم 2026 — مباريات مباشرة، نتائج، ترتيب المجموعات، شجرة الإقصائيات، الهدافون والمزيد. Canada · Mexico · USA.",
  keywords: ["World Cup 2026", "كأس العالم 2026", "FIFA", "football", "soccer", "knockout", "groups"],
  authors: [{ name: "WC 2026" }],
  openGraph: {
    title: "كأس العالم 2026",
    description: "موقع كأس العالم 2026 — تغطية شاملة للبطولة",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="dark">
      <head>
        <meta name="theme-color" content="#0B0F19" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Cairo', 'Inter', var(--font-geist-sans), sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
