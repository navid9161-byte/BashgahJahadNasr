import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/forms/register-form";
import { PageHero } from "@/components/page-hero";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "ثبت‌نام پرسنل" };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/panel");
  const sports = await db.sport.findMany({ where: { active: true }, orderBy: { order: "asc" }, select: { id: true, name: true } });
  return (
    <>
      <PageHero kicker="عضویت در باشگاه" title="ثبت‌نام پرسنل" subtitle="اطلاعات خود را با دقت وارد کنید. پس از بررسی و تأیید مدیر باشگاه، امکان ثبت‌نام در کلاس‌ها و شرکت در نظرسنجی‌ها برای شما فعال می‌شود." />
      <section className="container-x mt-10 max-w-5xl">
        <p className="mb-6 text-sm text-slate-600">قبلاً ثبت‌نام کرده‌اید؟ <Link href="/login" className="font-bold text-navy-700 underline">وارد شوید</Link></p>
        <RegisterForm sports={sports} />
      </section>
    </>
  );
}
