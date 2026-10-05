import Image from "next/image";
import { Building2, Eye, Phone, Target, User } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/site";

export const metadata = { title: "معرفی باشگاه" };

export default function AboutPage() {
  return (
    <>
      <PageHero kicker="معرفی باشگاه" title={site.name} subtitle={`شماره ثبت ${site.registrationNo} — زیرمجموعه ${site.holding} — حوزه فعالیت: ${site.activity}`} />

      <section className="container-x mt-14 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="section-kicker">معرفی</p>
          <h2 className="section-title">ما که هستیم؟</h2>
          <p className="prose-fa mt-5 text-justify">{site.intro}</p>
        </div>
        <Image src="/images/logo-full.png" alt="لوگوی باشگاه فرهنگی ورزشی جهاد نصر کرمان" width={1100} height={780} className="mx-auto w-full max-w-md" />
      </section>

      <section id="activities" className="container-x mt-20 scroll-mt-28">
        <p className="section-kicker">محورهای اصلی فعالیت‌ها</p>
        <h2 className="section-title">آنچه انجام می‌دهیم</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {site.activities.map((a, i) => (
            <div key={a} className="card flex items-start gap-4 p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy-800 font-black text-brand-yellow">
                {new Intl.NumberFormat("fa-IR").format(i + 1)}
              </span>
              <p className="pt-1.5 leading-7 text-slate-700">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="facilities" className="container-x mt-20 scroll-mt-28">
        <p className="section-kicker">اماکن و امکانات</p>
        <h2 className="section-title">زیرساخت‌های ورزشی باشگاه</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {site.facilities.map((f) => (
            <div key={f.title} className="card overflow-hidden">
              {f.image ? (
                <Image src={f.image} alt={f.title} width={782} height={438} className="aspect-video w-full object-cover" />
              ) : (
                <div className="halftone grid aspect-video place-items-center bg-gradient-to-br from-navy-700 to-navy-900">
                  <Building2 className="size-14 text-brand-yellow" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-black text-navy-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="vision" className="container-x mt-20 scroll-mt-28">
        <div className="relative overflow-hidden rounded-3xl bg-navy-800 p-8 text-white sm:p-12">
          <div className="halftone absolute inset-0 opacity-30" />
          <div className="relative grid gap-8 md:grid-cols-[auto_1fr]">
            <span className="grid size-16 place-items-center rounded-2xl bg-brand-yellow text-navy-900"><Eye className="size-8" /></span>
            <div>
              <h2 className="text-2xl font-black">چشم‌انداز</h2>
              <p className="mt-4 leading-9 text-white/85">{site.vision}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x mt-20 grid gap-6 md:grid-cols-3">
        <div className="card flex items-center gap-4 p-6">
          <User className="size-10 text-navy-700" />
          <div><p className="text-sm text-slate-500">{site.director.title}</p><p className="font-black text-navy-900">{site.director.name}</p></div>
        </div>
        <div className="card flex items-center gap-4 p-6">
          <Phone className="size-10 text-navy-700" />
          <div><p className="text-sm text-slate-500">تلفن باشگاه</p><a href={`tel:${site.phoneRaw}`} className="font-black text-navy-900" dir="ltr">{site.phone}</a></div>
        </div>
        <div className="card flex items-center gap-4 p-6">
          <Target className="size-10 text-navy-700" />
          <div><p className="text-sm text-slate-500">حوزه فعالیت</p><p className="font-black text-navy-900">{site.activity}</p></div>
        </div>
      </section>
    </>
  );
}
