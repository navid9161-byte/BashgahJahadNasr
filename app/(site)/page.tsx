import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, CalendarDays, ChevronLeft, ClipboardList, Clock, HeartPulse, MapPin, Medal, Trophy, Users,
} from "lucide-react";
import { Hero } from "@/components/home/hero";
import { SportIcon } from "@/components/sport-icon";
import { Badge } from "@/components/badge";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { homeSportOrder, sportImage } from "@/lib/sport-images";
import { fa, formatDate, formatNumber, formatPrice, labels } from "@/lib/utils";

export const dynamic = "force-dynamic";

const features = [
  { icon: Trophy, title: "توسعه توانمندی", text: "در رشته‌های مختلف", fill: false },
  { icon: HeartPulse, title: "سلامت جسم و روان", text: "", fill: true },
  { icon: Users, title: "فضای حرفه‌ای", text: "و استاندارد", fill: true },
  { icon: Medal, title: "مدیریت مجرب", text: "و مربیان متخصص", fill: false },
];

export default async function HomePage() {
  const [user, sports, programs, news, gallery] = await Promise.all([
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
  ]);

  const rank = (slug: string) => {
    const i = homeSportOrder.indexOf(slug);
    return i === -1 ? 100 : i;
  };
  const homeSports = [...sports].sort((x, y) => rank(x.slug) - rank(y.slug) || x.order - y.order).slice(0, 7);

  return (
    <>
      <Hero user={user ? { name: `${user.firstName} ${user.lastName}`, isAdmin: user.role === "ADMIN" } : null} />

      {/* نوار ویژگی‌ها */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-8 px-4 py-9 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text, fill }, i) => (
            <div key={title} className={`flex items-center justify-center gap-4 px-3 ${i % 2 ? "border-r border-slate-300" : ""} ${i === 2 ? "lg:border-r" : ""}`}>
              <span className="grid size-16 shrink-0 place-items-center rounded-full bg-yellow-100 text-navy-800 ring-8 ring-yellow-50 sm:size-20">
                <Icon className="size-8 sm:size-10" fill={fill ? "currentColor" : "none"} strokeWidth={fill ? 1.4 : 2.2} />
              </span>
              <p className="text-base font-black leading-7 text-navy-900 sm:text-lg">
                {title}
                {text && <span className="block">{text}</span>}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* رشته‌های ورزشی */}
      <section className="relative isolate overflow-hidden bg-navy-950 py-14 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,#1b2f9e_0%,#0a1350_70%)]" />
        <div className="halftone absolute inset-0 -z-10 opacity-20" />
        <div className="absolute -left-10 -top-10 -z-10 h-64 w-24 rotate-[35deg] bg-brand-yellow/80" />
        <div className="absolute left-16 -top-16 -z-10 h-64 w-6 rotate-[35deg] bg-navy-400/60" />
        <div className="absolute -right-10 -bottom-16 -z-10 h-64 w-24 rotate-[35deg] bg-brand-yellow/80" />
        <div className="absolute right-20 -bottom-16 -z-10 h-64 w-6 rotate-[35deg] bg-navy-400/60" />

        <div className="mx-auto max-w-[1440px] px-4">
          <div className="mb-10 flex items-center justify-center gap-5">
            <span className="hidden h-1.5 w-40 rounded-full bg-gradient-to-r from-navy-400 to-brand-yellow sm:block" />
            <h2 className="text-2xl font-black sm:text-3xl">رشته‌های ورزشی ما</h2>
            <span className="hidden h-1.5 w-40 rounded-full bg-gradient-to-l from-navy-400 to-brand-yellow sm:block" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7 lg:gap-5">
            {homeSports.map((s) => {
              const img = sportImage(s);
              return (
                <Link
                  key={s.id}
                  href={`/sports/${s.slug}`}
                  className="group overflow-hidden rounded-xl border border-white/20 bg-navy-900 shadow-lg shadow-black/30 transition hover:-translate-y-1.5 hover:border-brand-yellow"
                >
                  <div className="relative aspect-[181/126] overflow-hidden bg-navy-800">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={s.name} className="size-full object-cover transition duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="grid size-full place-items-center text-brand-yellow"><SportIcon name={s.icon} className="size-14" /></div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 border-b-4 border-brand-yellow px-3 py-3">
                    <span className="truncate text-sm font-black sm:text-base">{s.name}</span>
                    <ChevronLeft className="size-5 shrink-0 text-brand-yellow transition group-hover:-translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-12 flex items-center justify-center gap-5">
            <span className="hidden h-1 w-36 rounded-full bg-gradient-to-r from-navy-400 to-brand-yellow sm:block" />
            <p className="text-center text-lg font-black sm:text-xl">با ما سالم‌تر، قوی‌تر و پرانرژی‌تر باشید</p>
            <span className="hidden h-1 w-36 rounded-full bg-gradient-to-l from-navy-400 to-brand-yellow sm:block" />
          </div>
        </div>
      </section>

      {/* معرفی */}
      <section className="container-x mt-20 grid items-center gap-10 lg:grid-cols-2">
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
