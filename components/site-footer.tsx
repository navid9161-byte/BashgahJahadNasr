import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, User } from "lucide-react";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-navy-950 text-white/80">
      <div className="h-2 bg-gradient-to-l from-brand-yellow via-brand-yellow to-navy-600" />
      <div className="halftone absolute inset-0 opacity-20" />
      <div className="container-x relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4">
            <Image src="/images/logo-shield.png" alt="" width={72} height={73} />
            <div>
              <p className="text-sm text-white/60">باشگاه فرهنگی ورزشی</p>
              <p className="text-2xl font-black text-white">جهاد نصر کرمان</p>
              <p className="mt-1 text-xs text-brand-yellow">شماره ثبت: {site.registrationNo} — تأسیس {site.foundedYear}</p>
            </div>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/65">
            مجموعه‌ای وابسته به {site.holding} با هدف ارتقای نشاط سازمانی، تقویت سرمایه انسانی و توسعه فعالیت‌های فرهنگی و ورزشی در میان کارکنان و خانواده‌های آنان.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">دسترسی سریع</h3>
          <ul className="grid gap-2 text-sm">
            {[
              ["/about", "معرفی باشگاه"],
              ["/sports", "رشته‌های ورزشی"],
              ["/schedule", "جدول برنامه‌ها و ثبت‌نام"],
              ["/news", "اخبار و اطلاعیه‌ها"],
              ["/gallery", "گالری تصاویر"],
              ["/register", "عضویت پرسنل"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-brand-yellow">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">ارتباط با ما</h3>
          <ul className="grid gap-3 text-sm">
            <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-brand-yellow" /> {site.address}</li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand-yellow" />
              <a href={`tel:${site.phoneRaw}`} dir="ltr" className="hover:text-brand-yellow">{site.phone}</a>
            </li>
            <li className="flex gap-2"><User className="mt-0.5 size-4 shrink-0 text-brand-yellow" /> {site.director.title}: {site.director.name}</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" }).format(new Date())} — تمامی حقوق برای {site.name} محفوظ است.
      </div>
    </footer>
  );
}
