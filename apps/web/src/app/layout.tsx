import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

const navItems = [
  ["Карта", "/map"],
  ["Экспедиции", "/expeditions"],
  ["Источники", "/sources"],
  ["О проекте", "/about"],
];

export const metadata: Metadata = {
  title: "Экспедиции Витуса Беринга",
  description: "Маршруты, открытия и источники экспедиций Витуса Беринга.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      lang="ru"
    >
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-[1000] border-b border-black/5 bg-white/80 backdrop-blur-xl">
          <div className="container flex items-center justify-between gap-6 py-4">
            <Link
              className="text-lg font-semibold text-[var(--foreground)]"
              href="/"
            >
              Экспедиции Беринга
            </Link>
            <nav className="flex flex-wrap items-center justify-end gap-5 text-sm text-[var(--muted)]">
              {navItems.map(([label, href]) => (
                <Link
                  className="transition hover:text-[var(--foreground)]"
                  href={href}
                  key={href}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-black/5 py-8">
          <div className="container flex flex-col gap-2 text-sm text-[var(--muted)] md:flex-row md:justify-between">
            <p>Экспедиции Витуса Беринга · 2026</p>
            <p>
              Учебный проект студентов ИТМО по дисциплине «ИРС». Преподаватель:
              Богомазов Н. И.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
