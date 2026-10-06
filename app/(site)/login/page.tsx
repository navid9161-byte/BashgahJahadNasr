import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "ورود به سامانه" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/panel");
  return (
    <section className="relative overflow-hidden bg-navy-900 py-16">
      <div className="halftone absolute inset-0 opacity-30" />
      <div className="absolute -left-10 top-0 h-full w-48 -skew-x-12 bg-brand-yellow" />
      <div className="container-x relative">
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="flex items-center justify-center gap-3 bg-navy-800 px-6 py-5 text-white">
            <User className="size-7" /><h1 className="text-xl font-black">ورود به سامانه</h1>
          </div>
          <div className="p-6 sm:p-8">
            <LoginForm next={next} />
            <p className="mt-5 text-center text-xs leading-6 text-slate-500">نام کاربری پرسنل، کد ملی، کد پرسنلی یا شماره موبایل است.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
