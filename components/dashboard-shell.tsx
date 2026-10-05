"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { House, LogOut, Menu } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string; icon: React.ReactNode; badge?: number };

export function DashboardShell({
  nav, title, user, children,
}: { nav: NavItem[]; title: string; user: { name: string; subtitle: string }; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = nav[0]?.href;
  const active = (href: string) => (href === root ? pathname === href : pathname.startsWith(href));

  const sidebar = (
    <div className="flex h-full flex-col bg-navy-950 text-white">
      <Link href="/" className="flex items-center gap-3 border-b border-white/10 p-5">
        <Image src="/images/logo-shield.png" alt="" width={48} height={49} />
        <div className="leading-tight">
          <p className="text-xs text-white/60">باشگاه فرهنگی ورزشی</p>
          <p className="font-black">جهاد نصر کرمان</p>
        </div>
      </Link>
      <p className="px-5 pb-2 pt-5 text-xs font-bold text-white/40">{title}</p>
      <nav className="grid gap-1 px-3">
        {nav.map((item) => {
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition",
                active(item.href) ? "bg-brand-yellow text-navy-950" : "text-white/75 hover:bg-white/10 hover:text-white",
              )}
            >
              {item.icon} <span className="flex-1">{item.label}</span>
              {!!item.badge && (
                <span className="rounded-full bg-rose-500 px-2 text-xs text-white">{new Intl.NumberFormat("fa-IR").format(item.badge)}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-white/10 p-4">
        <p className="truncate text-sm font-bold">{user.name}</p>
        <p className="truncate text-xs text-white/50">{user.subtitle}</p>
        <div className="mt-3 flex gap-2">
          <Link href="/" className="btn btn-sm flex-1 bg-white/10 text-white hover:bg-white/20"><House className="size-4" /> سایت</Link>
          <form action={logoutAction} className="flex-1">
            <button className="btn btn-sm w-full bg-white/10 text-white hover:bg-rose-600"><LogOut className="size-4" /> خروج</button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-label="بستن منو" />
          <aside className="absolute inset-y-0 right-0 w-72">{sidebar}</aside>
        </div>
      )}
      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-slate-100" aria-label="منو"><Menu className="size-6" /></button>
          <p className="font-black text-navy-900">{title}</p>
        </header>
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-navy-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
