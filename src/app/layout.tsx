import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Паспорт объекта",
    template: "%s — Паспорт объекта",
  },
  description:
    "Паспорт объекта платформы «Интегратор 7/1»: основные данные, этапы работ и смета.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${geist.variable} antialiased`}>
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
