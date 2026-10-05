import Link from "next/link";
import { ArrowLeft, CalendarCheck, ClipboardList, PartyPopper, UserCog } from "lucide-react";
import { Badge } from "@/components/badge";
import { PageTitle } from "@/components/dashboard-shell";
import { MembershipNotice } from "@/components/status-notice";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fa, formatDate, labels } from "@/lib/utils";

export const metadata = { title: "پنل کاربری" };

export default async function PanelHome({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const { welcome } = await searchParams;
  const user = await requireUser();
  const [enrollments, surveys] = await Promise.all([
    db.enrollment.findMany({ where: { userId: user.id }, include: { program: { include: { sport: true } } }, orderBy: { createdAt: "desc" } }),
    db.survey.findMany({ where: { isActive: true, responses: { none: { userId: user.id } } }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <>
      <PageTitle title={`سلام ${user.firstName} عزیز 👋`} subtitle="به پنل کاربری باشگاه فرهنگی ورزشی جهاد نصر کرمان خوش آمدید" />
      {welcome && (
        <div className="mb-6 flex gap-4 rounded-2xl bg-emerald-50 p-5 text-emerald-900 ring-1 ring-emerald-200">
          <PartyPopper className="size-7 shrink-0" />
          <p className="leading-7">ثبت‌نام شما با موفقیت انجام شد. نام کاربری شما <b>کد ملی</b> است.</p>
        </div>
      )}
      <MembershipNotice status={user.status} note={user.adminNote} />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { href: "/panel/programs", icon: CalendarCheck, title: "ثبت‌نام در کلاس‌ها", value: `${fa(enrollments.filter((e) => e.status === "APPROVED").length)} کلاس فعال` },
          { href: "/panel/surveys", icon: ClipboardList, title: "نظرسنجی‌ها", value: surveys.length ? `${fa(surveys.length)} نظرسنجی جدید` : "همه را پاسخ داده‌اید" },
          { href: "/panel/profile", icon: UserCog, title: "اطلاعات من", value: "مشاهده و ویرایش" },
        ].map(({ href, icon: Icon, title, value }) => (
          <Link key={href} href={href} className="card group flex items-center gap-4 p-5 transition hover:border-navy-200 hover:shadow-md">
            <span className="grid size-12 place-items-center rounded-xl bg-navy-800 text-brand-yellow"><Icon className="size-6" /></span>
            <div className="flex-1"><p className="font-black text-navy-900">{title}</p><p className="text-sm text-slate-500">{value}</p></div>
            <ArrowLeft className="size-5 text-slate-300 transition group-hover:text-navy-600" />
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-4 font-black text-navy-900">ثبت‌نام‌های من</h2>
          {enrollments.length ? (
            <ul className="divide-y divide-slate-100">
              {enrollments.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-bold text-slate-800">{e.program.title}</p>
                    <p className="text-xs text-slate-500">{e.program.days} — {fa(e.program.startTime)} — {formatDate(e.createdAt)}</p>
                  </div>
                  <Badge tone={e.status}>{labels.enrollmentStatus[e.status]}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">هنوز در کلاسی ثبت‌نام نکرده‌اید.</p>
          )}
        </section>
        <section className="card p-5">
          <h2 className="mb-4 font-black text-navy-900">نظرسنجی‌های در انتظار پاسخ</h2>
          {surveys.length ? (
            <ul className="grid gap-2">
              {surveys.map((s) => (
                <li key={s.id}>
                  <Link href={`/panel/surveys/${s.id}`} className="flex items-center justify-between rounded-xl bg-navy-50 px-4 py-3 font-bold text-navy-800 hover:bg-navy-100">
                    {s.title} <Badge className="!bg-brand-yellow !text-navy-900">{labels.surveyKind[s.kind]}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">نظرسنجی جدیدی وجود ندارد.</p>
          )}
        </section>
      </div>
    </>
  );
}
