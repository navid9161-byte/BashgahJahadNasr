import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, CalendarDays, ClipboardList, Clock, HeartPulse, MapPin, Star, Trophy, Users,
} from "lucide-react";
import { Hero } from "@/components/home/hero";
import { SportIcon } from "@/components/sport-icon";
import { Badge } from "@/components/badge";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { fa, formatDate, formatNumber, formatPrice, labels } from "@/lib/utils";

export const dynamic = "force-dynamic";

const features = [
  { icon: Star, title: "ورزش برای همه", text: "در تمامی رده‌های سنی" },
  { icon: Users, title: "تیم حرفه‌ای", text: "با مربیان مجرب" },
  { icon: HeartPulse, title: "سلامت و نشاط", text: "زندگی سالم‌تر" },
  { icon: Trophy, title: "توسعه استعدادها", text: "ورزش برای آینده بهتر" },
];

export default async function HomePage() {
  const [user, sports, programs, news, gallery, memberCount, programCount] = await Promise.all([
    getCurrentUser(),
    db.sport.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    db.program.findMany({
      where: { isOpen: true },
      include: { sport: true, _count: { select: { enrollments: { where: { status: { in: ["PENDING", "APPROVED"] } } } } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    db.news.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    db.galleryImage.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    db.user.count({ where: { role: "MEMBER", status: "ACTIVE" } }),
    db.program.count({ where: { isOpen: true } }),
  ]);

  const years = new Intl.DateTimeFormat("en-u-ca-persian", { year: "numeric" }).format(new Date());
  const stats = [
    { value: formatNumber(sports.length), label: "رشته ورزشی" },
    { value: formatNumber(programCount), label: "کلاس فعال" },
    { value: formatNumber(memberCount), label: "عضو فعال" },
    { value: fa(Math.max(1, parseInt(years) - 1397)), label: "سال فعالیت" },
  ];

  return (
    <>
      <Hero
        sports={sports.map((s) => ({ slug: s.slug, name: s.name, icon: s.icon }))}
        user={user ? { name: `${user.firstName} ${user.lastName}`, isAdmin: user.role === "ADMIN" } : null}
      />

      {/* نوار ویژگی‌ها */}
      <section className="relative bg-white">
        <div className="container-x grid grid-cols-2 gap-y-8 py-10 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className={`flex items-center justify-center gap-4 px-4 ${i % 2 ? "border-r border-slate-200" : ""} ${i === 2 ? "lg:border-r" : ""}`}>
              <Icon className="size-11 shrink-0 text-navy-800" strokeWidth={1.6} />
              <div>
                <p className="font-black text-navy-900">{title}</p>
                <p className="text-sm text-slate-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-navy-800 py-5">
          <div className="container-x flex items-center justify-center gap-6 text-white">
            <span className="hidden h-px flex-1 bg-white/40 sm:block" />
            <p className="text-center text-lg font-black sm:text-xl">با ما قوی‌تر، سالم‌تر و موفق‌تر باشید</p>
            <span className="hidden h-px flex-1 bg-white/40 sm:block" />
          </div>
        </div>
      </section>

      {/* آمار */}
      <section className="container-x -mt-px">
        <div className="relative -mb-10 mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-6 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-4xl font-black text-navy-800">{s.value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* رشته‌ها */}
      <section className="container-x pt-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">رشته‌های ورزشی</p>
            <h2 className="section-title">در رشته مورد علاقه‌ات بدرخش</h2>
          </div>
          <Link href="/sports" className="btn-outline">همه رشته‌ها <ArrowLeft className="size-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {sports.map((s) => (
            <Link
              key={s.id}
              href={`/sports/${s.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 p-6 text-white shadow-lg shadow-navy-900/10 transition hover:-translate-y-1"
            >
              <div className="halftone absolute inset-0 opacity-30" />
              <div className="absolute -left-8 -top-8 size-24 rounded-full bg-brand-yellow/20 transition group-hover:scale-150" />
              <span className="relative grid size-14 place-items-center rounded-2xl bg-brand-yellow text-navy-900">
                <SportIcon name={s.icon} className="size-7" />
              </span>
              <p className="relative mt-5 text-lg font-black">{s.name}</p>
              <p className="relative mt-1 line-clamp-2 text-xs leading-6 text-white/70">{s.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* معرفی */}
      <section className="container-x mt-24 grid items-center gap-10 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-brand-yellow" />
          <Image src="/images/hall.jpg" alt="سالن ورزشی چندمنظوره شهید محمد عسکری" width={782} height={438} className="relative w-full rounded-3xl object-cover shadow-xl" />
          <div className="absolute -top-5 left-6 rounded-2xl bg-navy-800 px-5 py-3 text-white shadow-lg">
            <p className="text-xs text-white/70">تأسیس</p>
            <p className="text-2xl font-black">{site.foundedYear}</p>
          </div>
        </div>
        <div>
          <p className="section-kicker">درباره باشگاه</p>
          <h2 className="section-title">ارتقای نشاط سازمانی و سرمایه انسانی</h2>
          <p className="mt-5 leading-8 text-slate-600">{site.intro}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {site.activities.slice(0, 4).map((a) => (
              <li key={a} className="flex gap-2 text-sm leading-6 text-slate-700">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-brand-yellow ring-4 ring-yellow-100" /> {a}
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn-primary mt-8">بیشتر بدانید <ArrowLeft className="size-4" /></Link>
        </div>
      </section>

      {/* کلاس‌های در حال ثبت‌نام */}
      {programs.length > 0 && (
        <section className="mt-24 bg-gradient-to-b from-navy-50 to-transparent py-16">
          <div className="container-x">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="section-kicker">ثبت‌نام آنلاین</p>
                <h2 className="section-title">کلاس‌های در حال ثبت‌نام</h2>
              </div>
              <Link href="/schedule" className="btn-outline">جدول کامل برنامه‌ها <ArrowLeft className="size-4" /></Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {programs.map((p) => {
                const left = Math.max(0, p.capacity - p._count.enrollments);
                return (
                  <div key={p.id} className="card flex flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-12 place-items-center rounded-xl bg-navy-800 text-brand-yellow">
                        <SportIcon name={p.sport.icon} className="size-6" />
                      </span>
                      <Badge>{labels.gender[p.gender]}</Badge>
                    </div>
                    <h3 className="mt-4 text-lg font-black text-navy-900">{p.title}</h3>
                    <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                      <li className="flex gap-2"><CalendarDays className="size-4 text-navy-500" /> {p.days}</li>
                      <li className="flex gap-2"><Clock className="size-4 text-navy-500" /> {fa(p.startTime)} تا {fa(p.endTime)}</li>
                      <li className="flex gap-2"><MapPin className="size-4 text-navy-500" /> {p.location} — {p.city}</li>
                    </ul>
                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                      <span className="font-bold text-navy-800">{formatPrice(p.fee)}</span>
                      <span className={left ? "text-emerald-600" : "text-rose-600"}>{left ? `${formatNumber(left)} ظرفیت خالی` : "تکمیل ظرفیت"}</span>
                    </div>
                    <Link href={`/panel/programs#${p.id}`} className="btn-yellow mt-4">ثبت‌نام آنلاین</Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* اخبار */}
      {news.length > 0 && (
        <section className="container-x mt-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">اخبار و اطلاعیه‌ها</p>
              <h2 className="section-title">تازه‌ترین رویدادهای باشگاه</h2>
            </div>
            <Link href="/news" className="btn-outline">آرشیو اخبار <ArrowLeft className="size-4" /></Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {news.map((n) => (
              <Link key={n.id} href={`/news/${n.slug}`} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[16/9] overflow-hidden bg-navy-800">
                  {n.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.cover} alt="" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="halftone grid size-full place-items-center">
                      <Image src="/images/logo-shield.png" alt="" width={72} height={73} className="opacity-90" />
                    </div>
                  )}
                  <Badge className="absolute right-3 top-3 !bg-brand-yellow !text-navy-900">{labels.newsCategory[n.category]}</Badge>
                </div>
                <div className="p-5">
                  <p className="text-xs text-slate-400">{formatDate(n.createdAt)}</p>
                  <h3 className="mt-2 line-clamp-2 font-black leading-7 text-navy-900 group-hover:text-navy-600">{n.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{n.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* نظرسنجی و نیازسنجی */}
      <section className="container-x mt-20">
        <div className="relative overflow-hidden rounded-3xl bg-navy-800 p-8 text-white sm:p-12">
          <div className="halftone absolute inset-0 opacity-30" />
          <div className="absolute -left-16 top-0 h-full w-56 -skew-x-12 bg-brand-yellow" />
          <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto] lg:pl-48">
            <div>
              <ClipboardList className="mb-4 size-10 text-brand-yellow" />
              <h2 className="text-2xl font-black sm:text-3xl">نظر شما برای ما مهم است</h2>
              <p className="mt-3 max-w-2xl leading-8 text-white/80">
                با شرکت در نظرسنجی‌ها و فرم نیازسنجی ورزشی، به ما کمک کنید برنامه‌های باشگاه را بر اساس نیاز و علاقه پرسنل طراحی کنیم.
              </p>
            </div>
            <Link href="/panel/surveys" className="btn-yellow px-8 py-3.5 text-base">شرکت در نظرسنجی <ArrowLeft className="size-5" /></Link>
          </div>
        </div>
      </section>

      {/* گالری */}
      {gallery.length > 0 && (
        <section className="container-x mt-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">گالری تصاویر</p>
              <h2 className="section-title">لحظه‌های ماندگار</h2>
            </div>
            <Link href="/gallery" className="btn-outline">مشاهده گالری <ArrowLeft className="size-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {gallery.map((g, i) => (
              <div key={g.id} className={`overflow-hidden rounded-2xl bg-slate-200 ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.title} className="aspect-square size-full object-cover transition duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
