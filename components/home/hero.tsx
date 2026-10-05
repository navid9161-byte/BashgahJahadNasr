import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, LayoutDashboard, User } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";
import { SportIcon } from "@/components/sport-icon";
import { site } from "@/lib/site";

type HeroSport = { slug: string; name: string; icon: string };

function Brush({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 400 60" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M4 34 C40 18 90 14 150 12 L300 6 C340 5 372 4 396 2 L390 14 L398 20 L360 26 L392 30 L330 38 C260 44 190 46 120 50 L60 54 L20 58 L28 50 L2 48 L18 42 Z"
      />
    </svg>
  );
}

export function Hero({ sports, user }: { sports: HeroSport[]; user: { name: string; isAdmin: boolean } | null }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-800 text-white">
      {/* پس‌زمینه */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_20%,#2c4fd0_0%,#13238a_45%,#091554_100%)]" />
      <div className="halftone absolute inset-0 -z-10 opacity-30" />
      <div className="absolute -z-10 left-[38%] top-[-10%] h-[130%] w-40 rotate-[24deg] bg-brand-yellow/90 blur-[1px]" />
      <div className="absolute -z-10 left-[46%] top-[-10%] h-[130%] w-10 rotate-[24deg] bg-white/70" />
      <div className="absolute -z-10 -left-10 bottom-10 h-24 w-[60%] -rotate-[10deg] bg-brand-yellow/90" />
      <div className="absolute -z-10 -right-20 bottom-0 h-16 w-[45%] -rotate-[22deg] bg-brand-yellow" />

      <div className="container-x grid items-center gap-8 py-10 lg:grid-cols-[340px_1.3fr_1fr] lg:gap-6 lg:py-14">
        {/* کارت ورود (راست) */}
        <div className="order-3 lg:order-1">
          <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white text-slate-800 shadow-2xl shadow-navy-950/40 ring-4 ring-white/20 animate-fade-up">
            <div className="flex items-center justify-center gap-3 bg-navy-800 px-6 py-5 text-white">
              <User className="size-7" />
              <h2 className="text-xl font-black">{user ? "خوش آمدید" : "ورود به سامانه"}</h2>
            </div>
            <div className="p-6">
              {user ? (
                <div className="grid gap-4 text-center">
                  <p className="text-lg font-bold text-navy-900">{user.name}</p>
                  <p className="text-sm text-slate-500">برای ثبت‌نام در کلاس‌ها و شرکت در نظرسنجی‌ها وارد پنل شوید.</p>
                  <Link href={user.isAdmin ? "/admin" : "/panel"} className="btn-primary py-3.5 text-base">
                    <LayoutDashboard className="size-5" /> {user.isAdmin ? "پنل مدیریت" : "پنل کاربری"}
                  </Link>
                </div>
              ) : (
                <LoginForm compact />
              )}
            </div>
          </div>
        </div>

        {/* تصویر ورزشکاران (وسط) */}
        <div className="order-2 lg:order-2">
          <div className="relative mx-auto aspect-[618/722] w-full max-w-md lg:max-w-none lg:scale-110">
            <Image
              src="/images/hero-athletes.jpg"
              alt="ورزشکاران باشگاه جهاد نصر در رشته‌های بسکتبال، والیبال، کاراته و شنا"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="hero-mask object-cover"
            />
          </div>
        </div>

        {/* شعار (چپ) */}
        <div className="order-1 lg:order-3">
          <div className="relative inline-block">
            <h1 className="text-5xl font-black leading-[1.35] drop-shadow-lg sm:text-6xl">
              ورزش،
              <br />
              سبک زندگی ماست
            </h1>
            <Brush className="absolute -bottom-5 right-0 h-8 w-full text-brand-yellow" />
          </div>
          <p className="mt-10 max-w-md text-lg leading-9 text-white/90">
            {site.name} با هدف ارتقای سلامت، نشاط و رشد استعدادهای ورزشی در کنار شماست.
          </p>
          <div className="mt-8 flex">
            {sports.slice(0, 5).map((s, i) => (
              <Link key={s.slug} href={`/sports/${s.slug}`} className={`group flex min-w-0 flex-1 flex-col items-center gap-2 px-1 sm:max-w-[5rem] ${i ? "border-r border-white/25" : ""}`}>
                <span className="grid size-12 place-items-center rounded-full border-[3px] xl:size-14 border-brand-yellow bg-navy-900/40 transition group-hover:scale-110 group-hover:bg-brand-yellow group-hover:text-navy-900">
                  <SportIcon name={s.icon} className="size-6 xl:size-7" />
                </span>
                <span className="whitespace-nowrap text-center text-[11px] font-bold sm:text-xs">{s.name}</span>
              </Link>
            ))}
          </div>
          <Link href="/sports" className="btn-yellow mt-8 px-7 py-3.5 text-base">
            مشاهده همه رشته‌ها <ChevronLeft className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
