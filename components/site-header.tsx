"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, ChevronDown, LayoutDashboard, Menu, Search, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavSport = { slug: string; name: string };
type NavUser = { name: string; isAdmin: boolean } | null;
type NavLink = { href: string; label: string; children?: { href: string; label: string }[] };

const aboutLinks = [
  { href: "/about", label: "درباره باشگاه" },
  { href: "/about#activities", label: "محورهای فعالیت" },
  { href: "/about#facilities", label: "اماکن و امکانات" },
  { href: "/about#vision", label: "چشم‌انداز" },
];

export function SiteHeader({ sports, user }: { sports: NavSport[]; user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const links: NavLink[] = [
    { href: "/", label: "صفحه اصلی" },
    { href: "/about", label: "درباره ما", children: aboutLinks },
    { href: "/services", label: "خدمات" },
    {
      href: "/sports",
      label: "رشته‌های ورزشی",
      children: [...sports.map((s) => ({ href: `/sports/${s.slug}`, label: s.name })), { href: "/sports", label: "همه رشته‌ها" }],
    },
    { href: "/news", label: "اخبار و رویدادها" },
    { href: "/gallery", label: "گالری" },
    { href: "/contact", label: "تماس با ما" },
  ];
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const accountHref = user ? (user.isAdmin ? "/admin" : "/panel") : "/login";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm shadow-navy-950/5">
      <div className="relative mx-auto flex h-16 w-full max-w-[1536px] items-center gap-4 px-4 lg:h-[72px] lg:pr-[190px] lg:pl-8">
        {/* زبانه لوگو (دسکتاپ) */}
        <Link href="/" aria-label="باشگاه فرهنگی ورزشی جهاد نصر کرمان — صفحه اصلی" className="absolute right-0 top-0 z-10 hidden h-[128px] w-[180px] lg:block">
          <span className="absolute inset-0 bg-navy-700 [clip-path:polygon(0_0,100%_0,100%_100%,30%_100%)]" />
          <span className="absolute inset-0 -translate-x-2 bg-brand-yellow [clip-path:polygon(0_0,100%_0,100%_92%,26%_92%)]" />
          <span className="absolute inset-0 -translate-x-3.5 bg-white [clip-path:polygon(0_0,100%_0,100%_88%,24%_88%)]" />
          <Image src="/images/logo-shield.png" alt="" width={120} height={121} priority className="absolute left-1/2 top-2 w-[112px] -translate-x-[40%] drop-shadow-md" />
        </Link>
        {/* لوگو (موبایل) */}
        <Link href="/" className="flex items-center gap-2 lg:hidden" aria-label="صفحه اصلی">
          <Image src="/images/logo-shield.png" alt="" width={44} height={45} priority />
          <span className="whitespace-nowrap text-sm font-black leading-tight text-navy-900">باشگاه فرهنگی ورزشی<br />جهاد نصر کرمان</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 whitespace-nowrap lg:flex" aria-label="منوی اصلی">
          {links.map((l) =>
            l.children ? (
              <div key={l.href} className="group relative">
                <Link href={l.href} className={navCls(isActive(l.href))}>
                  {l.label}
                  <ChevronDown className="size-3.5 opacity-60 transition group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute right-0 top-full z-20 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-navy-950/10">
                    {l.children.map((c) => (
                      <Link key={c.href} href={c.href} className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-navy-50 hover:text-navy-800">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={l.href} href={l.href} className={navCls(isActive(l.href))}>
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <div className="mr-auto flex items-center gap-1 lg:mr-0">
          <Link href="/schedule" className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-navy-50 px-5 py-2.5 text-sm font-bold text-navy-800 ring-1 ring-navy-100 transition hover:bg-navy-100 sm:flex">
            <CalendarDays className="size-4" /> برنامه کلاس‌ها
          </Link>
          <Link href="/search" className="rounded-full p-2.5 text-navy-900 hover:bg-navy-50" aria-label="جستجو">
            <Search className="size-5" />
          </Link>
          <Link href={accountHref} className="rounded-full p-2.5 text-navy-900 hover:bg-navy-50" aria-label={user ? "پنل کاربری" : "ورود"} title={user ? user.name : "ورود به سامانه"}>
            {user ? <LayoutDashboard className="size-5" /> : <User className="size-5" />}
          </Link>
          <button
            type="button"
            className="rounded-full p-2.5 text-navy-900 hover:bg-navy-50 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-100 bg-white lg:hidden">
          <nav className="container-x grid gap-1 py-4" aria-label="منوی موبایل">
            {links.map((l) =>
              l.children ? (
                <details key={l.href} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-navy-50">
                    {l.label}
                    <ChevronDown className="size-4 transition group-open:rotate-180" />
                  </summary>
                  <div className="mr-4 grid border-r-2 border-brand-yellow pr-2">
                    {l.children.map((c) => (
                      <Link key={c.href} href={c.href} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-navy-50">{c.label}</Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link key={l.href} href={l.href} className={cn("rounded-xl px-4 py-3 font-bold", isActive(l.href) ? "bg-navy-800 text-white" : "text-slate-700 hover:bg-navy-50")}>
                  {l.label}
                </Link>
              ),
            )}
            <Link href="/schedule" className="btn-outline mt-2"><CalendarDays className="size-4" /> برنامه کلاس‌ها</Link>
            <Link href={accountHref} className="btn-yellow">{user ? (user.isAdmin ? "پنل مدیریت" : "پنل کاربری") : "ورود / ثبت‌نام"}</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function navCls(active: boolean) {
  return cn(
    "relative flex items-center gap-1 px-3 py-6 text-sm font-bold transition xl:px-4",
    "after:absolute after:inset-x-3 after:bottom-4 after:h-[3px] after:rounded-full after:bg-brand-yellow after:transition after:content-['']",
    active ? "text-navy-900 after:scale-x-100" : "text-slate-700 after:scale-x-0 hover:text-navy-700 hover:after:scale-x-100",
  );
}
