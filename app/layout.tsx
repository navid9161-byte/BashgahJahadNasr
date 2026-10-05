import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/lib/site";

const vazir = localFont({
  src: "./fonts/Vazirmatn.woff2",
  variable: "--font-vazir",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.shortName}` },
  description:
    "باشگاه فرهنگی ورزشی جهاد نصر کرمان — ثبت‌نام آنلاین کلاس‌های ورزشی، برنامه تمرینات، اخبار و نظرسنجی پرسنل",
  icons: { icon: "/images/logo-shield.png" },
};

export const viewport: Viewport = { themeColor: "#12237a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
