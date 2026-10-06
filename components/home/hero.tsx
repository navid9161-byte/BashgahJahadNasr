import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, User } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";

export function Hero({ user }: { user: { name: string; isAdmin: boolean } | null }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-800 text-white">
      {/* پس‌زمینه */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_55%_40%,#2348c9_0%,#132a9a_40%,#0a1663_100%)]" />
      <div className="halftone absolute inset-0 -z-20 opacity-25" />
      <div className="absolute -z-10 left-[34%] top-[-20%] h-[150%] w-24 rotate-[28deg] bg-gradient-to-b from-brand-yellow to-brand-yellow/0" />
      <div className="absolute -z-10 left-[40%] top-[-20%] h-[150%] w-5 rotate-[28deg] bg-navy-400/50" />
      <div className="absolute -z-10 bottom-0 left-0 h-3 w-[46%] bg-brand-yellow [clip-path:polygon(0_0,96%_0,100%_100%,0_100%)]" />

      {/* تصویر تجهیزات ورزشی (سمت چپ) */}
      <div className="absolute inset-y-0 left-0 -z-10 hidden w-[44%] lg:block">
        <Image
          src="/images/hero-equipment.jpg"
          alt="تجهیزات ورزشی: توپ بسکتبال، فوتبال، والیبال، راکت تنیس و دمبل"
          fill
          priority
          sizes="44vw"
          className="object-cover object-left [mask-image:linear-gradient(to_left,transparent,#000_22%)]"
        />
      </div>

      <div className="mx-auto grid w-full max-w-[1536px] items-center gap-8 px-4 py-10 lg:min-h-[455px] lg:grid-cols-[330px_1fr] lg:px-12 lg:pb-8 lg:pt-14">
        {/* کارت ورود (راست) */}
        <div className="order-2 lg:order-1">
          <div className="mx-auto max-w-sm overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl shadow-navy-950/40 animate-fade-up">
            <div className="flex items-center justify-center gap-2 bg-navy-900 px-6 py-4 text-white">
              <User className="size-6" fill="currentColor" />
              <h2 className="text-lg font-black">{user ? "خوش آمدید" : "ورود به سامانه"}</h2>
            </div>
            <div className="p-5">
              {user ? (
                <div className="grid gap-4 py-4 text-center">
                  <p className="text-lg font-bold text-navy-900">{user.name}</p>
                  <p className="text-sm leading-7 text-slate-500">برای ثبت‌نام در کلاس‌ها و شرکت در نظرسنجی‌ها وارد پنل شوید.</p>
                  <Link href={user.isAdmin ? "/admin" : "/panel"} className="btn w-full rounded-full bg-brand-yellow py-3 font-black text-navy-900 hover:bg-brand-yellow-dark">
                    <LayoutDashboard className="size-5" /> {user.isAdmin ? "پنل مدیریت" : "پنل کاربری"}
                  </Link>
                </div>
              ) : (
                <LoginForm />
              )}
            </div>
          </div>
        </div>

        {/* عنوان و لوگو */}
        <div className="order-1 flex flex-col-reverse items-center gap-6 text-center lg:order-2 lg:flex-row lg:justify-start lg:gap-10 lg:pl-[40%] xl:pl-[38%]">
          <div className="animate-fade-up">
            <p className="text-xl font-black drop-shadow sm:text-2xl">باشگاه فرهنگی ورزشی</p>
            <h1 className="mt-2 whitespace-nowrap text-4xl font-black text-brand-yellow drop-shadow-lg sm:text-5xl">جهاد نصر کرمان</h1>
            <p className="mt-5 flex items-center justify-center gap-3 text-lg font-bold sm:text-xl">
              <span className="h-[3px] w-8 rounded-full bg-brand-yellow" />
              ورزش، سلامتی، نشاط
              <span className="h-[3px] w-8 rounded-full bg-brand-yellow" />
            </p>
          </div>
          <Image
            src="/images/logo-shield.png"
            alt="نشان باشگاه فرهنگی ورزشی جهاد نصر"
            width={260}
            height={263}
            priority
            className="w-40 shrink-0 drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)] sm:w-52 xl:w-60"
          />
        </div>
      </div>
    </section>
  );
}
