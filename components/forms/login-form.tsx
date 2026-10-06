"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Fingerprint, Lock, LogIn, PenLine, User } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { ActionForm, FormMessage, SubmitButton } from "@/components/ui";

export function LoginForm({ next }: { next?: string }) {
  const [show, setShow] = useState(false);

  return (
    <ActionForm action={loginAction} className="grid gap-3.5">
      {next && <input type="hidden" name="next" value={next} />}
      <FormMessage />
      <label className="relative block">
        <span className="sr-only">نام کاربری، کد ملی یا شماره موبایل</span>
        <User className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-navy-800" fill="currentColor" />
        <input name="username" required autoComplete="username" placeholder="نام کاربری / شماره موبایل" className="input bg-slate-50 py-3 pr-11 pl-10" />
        <Fingerprint className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-navy-500" />
      </label>
      <label className="relative block">
        <span className="sr-only">رمز عبور</span>
        <Lock className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-navy-800" />
        <input name="password" required type={show ? "text" : "password"} autoComplete="current-password" placeholder="رمز عبور" className="input bg-slate-50 py-3 pr-11 pl-11" />
        <button type="button" onClick={() => setShow((v) => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-600 hover:text-navy-900" aria-label={show ? "پنهان کردن رمز" : "نمایش رمز"}>
          {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
        <input type="checkbox" name="remember" defaultChecked className="size-4 accent-navy-800" /> مرا به خاطر بسپار
      </label>
      <SubmitButton className="btn w-full rounded-full bg-brand-yellow py-3 text-base font-black text-navy-900 shadow-md shadow-yellow-500/30 hover:bg-brand-yellow-dark" pendingText="در حال ورود...">
        ورود <LogIn className="size-5 -scale-x-100" />
      </SubmitButton>
      <div className="flex items-center gap-3 text-sm font-bold text-navy-900">
        <span className="h-px flex-1 bg-slate-200" /> یا <span className="h-px flex-1 bg-slate-200" />
      </div>
      <Link href="/register" className="btn w-full rounded-full border-2 border-navy-800 bg-white py-2.5 text-navy-900 hover:bg-navy-50">
        <PenLine className="size-4" /> ثبت‌نام در باشگاه
      </Link>
      <Link href="/contact?subject=forgot" className="mt-1 flex items-center justify-center gap-2 text-sm font-medium text-navy-900 hover:underline">
        <Lock className="size-4" /> رمز عبور را فراموش کرده‌اید؟
      </Link>
    </ActionForm>
  );
}
