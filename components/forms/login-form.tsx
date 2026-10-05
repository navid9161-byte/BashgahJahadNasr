"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, User, UserPlus } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { ActionForm, FormMessage, SubmitButton } from "@/components/ui";

export function LoginForm({ next, compact = false }: { next?: string; compact?: boolean }) {
  const [show, setShow] = useState(false);

  return (
    <ActionForm action={loginAction} className="grid gap-4">
      {next && <input type="hidden" name="next" value={next} />}
      <FormMessage />
      <label className="relative block">
        <span className="sr-only">نام کاربری یا کد ملی</span>
        <User className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-navy-700" />
        <input name="username" required autoComplete="username" inputMode="text" placeholder="نام کاربری یا کد ملی" className="input py-3 pr-11" />
      </label>
      <label className="relative block">
        <span className="sr-only">رمز عبور</span>
        <Lock className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-navy-700" />
        <input name="password" required type={show ? "text" : "password"} autoComplete="current-password" placeholder="رمز عبور" className="input py-3 pr-11 pl-11" />
        <button type="button" onClick={() => setShow((v) => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-700" aria-label={show ? "پنهان کردن رمز" : "نمایش رمز"}>
          {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </label>
      <div className="flex items-center justify-between text-sm">
        <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700">
          <input type="checkbox" name="remember" defaultChecked className="size-4 rounded accent-navy-800" /> مرا به خاطر بسپار
        </label>
        <Link href="/contact?subject=forgot" className="font-medium text-navy-600 hover:underline">فراموشی رمز عبور؟</Link>
      </div>
      <SubmitButton className={`btn-primary w-full ${compact ? "py-3" : "py-3.5"} text-base`} pendingText="در حال ورود...">
        ورود <ArrowLeft className="size-5" />
      </SubmitButton>
      <Link href="/register" className="btn w-full border-2 border-brand-yellow bg-yellow-50 py-3 text-base text-navy-900 hover:bg-brand-yellow">
        <UserPlus className="size-5" /> ثبت‌نام در باشگاه
      </Link>
    </ActionForm>
  );
}
