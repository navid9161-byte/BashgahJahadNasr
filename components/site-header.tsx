"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays, ChevronDown, House, Images, Info, LayoutDashboard, LogIn, Menu, Newspaper, Phone, Trophy, X,
} from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

type NavSport = { slug: string; name: string };
type NavUser = { name: string; isAdmin: boolean } | null;

const aboutLinks = [
  { href: "/about", label: "درباره باشگاه" },
  { href: "/about#activities", label: "محورهای فعالیت" },
  { href: "/about#facilities", label: "اماکن و امکانات" },
  { href: "/about#vision", label: "چشم‌انداز" },
];

export function SiteHeader({ sports, user }: { sports: NavSport[]; user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sportLinks = [...sports.map((s) => ({ href: `/sports/${s.slug}`, label: s.name })), { href: "/sports", label: "همه رشته‌ها" }];
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const simple = [
    { href: "/schedule", label: "جدول برنامه‌ها", icon: CalendarDays },
    { href: "/gallery", label: "گالری تصاویر", icon: Images },
    { href: "/news", label: "اخبار و اطلاعیه‌ها", icon: Newspaper },
    { href: "/contact", label: "تماس با ما", icon: Phone },
  ];

  const accountHref = user ? (user.isAdmin ? "/admin" : "/panel") : "/login";

  return (
    <header className={cn("sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow", scrolled && "shadow-lg shadow-navy-950/5")}>
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-0.5 whitespace-nowrap xl:flex" aria-label="منوی اصلی">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition",
              isActive("/") ? "bg-navy-800 text-white shadow-md shadow-navy-900/20" : "text-slate-700 hover:bg-navy-50 hover:text-navy-800",
            )}
          >
            <House className="size-4" /> خانه
          </Link>
          <Dropdown label="معرفی باشگاه" icon={Info} links={aboutLinks} active={isActive("/about")} />
          <Dropdown label="رشته‌های ورزشی" icon={Trophy} links={sportLinks} active={isActive("/sports")} />
          {simple.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition",
                isActive(href) ? "bg-navy-800 text-white" : "text-slate-700 hover:bg-navy-50 hover:text-navy-800",
              )}
            >
              <Icon className="hidden size-4 2xl:block" /> {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href={accountHref} className="btn-yellow hidden whitespace-nowrap sm:inline-flex">
            {user ? <LayoutDashboard className="size-4" /> : <LogIn className="size-4" />}
            {user ? (user.isAdmin ? "پنل مدیریت" : "پنل کاربری") : "ورود / ثبت‌نام"}
          </Link>
          <button
            type="button"
            className="rounded-xl p-2.5 text-navy-900 hover:bg-navy-50 xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-slate-100 bg-white xl:hidden">
          <nav className="container-x grid gap-1 py-4" aria-label="منوی موبایل">
            <MobileLink href="/" label="خانه" active={isActive("/")} />
            <MobileGroup label="معرفی باشگاه" links={aboutLinks} />
            <MobileGroup label="رشته‌های ورزشی" links={sportLinks} />
            {simple.map((l) => (
              <MobileLink key={l.href} href={l.href} label={l.label} active={isActive(l.href)} />
            ))}
            <Link href={accountHref} className="btn-yellow mt-3">
              {user ? (user.isAdmin ? "پنل مدیریت" : "پنل کاربری") : "ورود / ثبت‌نام"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Dropdown({
  label, icon: Icon, links, active,
}: { label: string; icon: typeof Info; links: { href: string; label: string }[]; active: boolean }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition",
          active ? "bg-navy-800 text-white" : "text-slate-700 hover:bg-navy-50 hover:text-navy-800",
        )}
      >
        <Icon className="hidden size-4 2xl:block" /> {label}
        <ChevronDown className="size-4 transition group-hover:rotate-180" />
      </button>
      <div className="invisible absolute right-0 top-full z-10 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-navy-950/10">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-navy-50 hover:text-navy-800">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link href={href} className={cn("rounded-xl px-4 py-3 font-bold", active ? "bg-navy-800 text-white" : "text-slate-700 hover:bg-navy-50")}>
      {label}
    </Link>
  );
}

function MobileGroup({ label, links }: { label: string; links: { href: string; label: string }[] }) {
  return (
    <details className="group rounded-xl">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-navy-50">
        {label}
        <ChevronDown className="size-4 transition group-open:rotate-180" />
      </summary>
      <div className="mr-4 grid border-r-2 border-brand-yellow pr-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-navy-50">
            {l.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
