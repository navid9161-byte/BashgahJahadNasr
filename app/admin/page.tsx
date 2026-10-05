import Link from "next/link";
import { ArrowLeft, CalendarDays, ClipboardList, Clock, Users } from "lucide-react";
import { setEnrollmentStatusAction, setUserStatusAction } from "@/app/actions/admin";
import { PageTitle } from "@/components/dashboard-shell";
import { db } from "@/lib/db";
import { fa, formatDate, formatNumber } from "@/lib/utils";

export const metadata = { title: "پیشخوان مدیریت" };

export default async function AdminHome() {
  const [members, pending, programs, responses, pendingUsers, pendingEnrollments, byCity] = await Promise.all([
    db.user.count({ where: { role: "MEMBER", status: "ACTIVE" } }),
    db.user.count({ where: { role: "MEMBER", status: "PENDING" } }),
    db.program.count({ where: { isOpen: true } }),
    db.surveyResponse.count(),
    db.user.findMany({ where: { role: "MEMBER", status: "PENDING" }, orderBy: { createdAt: "desc" }, take: 6 }),
    db.enrollment.findMany({ where: { status: "PENDING" }, include: { user: true, program: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    db.user.groupBy({ by: ["city"], where: { role: "MEMBER", status: "ACTIVE" }, _count: true }),
  ]);

  const stats = [
    { label: "اعضای فعال", value: members, icon: Users, href: "/admin/members?status=ACTIVE" },
    { label: "در انتظار تأیید", value: pending, icon: Clock, href: "/admin/members?status=PENDING" },
    { label: "کلاس‌های باز", value: programs, icon: CalendarDays, href: "/admin/programs" },
    { label: "پاسخ‌های نظرسنجی", value: responses, icon: ClipboardList, href: "/admin/surveys" },
  ];

  return (
    <>
      <PageTitle title="پیشخوان مدیریت" subtitle={formatDate(new Date())} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="card flex items-center gap-4 p-5 transition hover:shadow-md">
            <span className="grid size-12 place-items-center rounded-xl bg-navy-800 text-brand-yellow"><Icon className="size-6" /></span>
            <div><p className="text-2xl font-black text-navy-900">{formatNumber(value)}</p><p className="text-xs text-slate-500">{label}</p></div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-black text-navy-900">عضویت‌های در انتظار تأیید</h2>
            <Link href="/admin/members?status=PENDING" className="flex items-center gap-1 text-sm font-bold text-navy-600">همه <ArrowLeft className="size-4" /></Link>
          </div>
          {pendingUsers.length ? (
            <ul className="divide-y divide-slate-100">
              {pendingUsers.map((u) => (
                <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <Link href={`/admin/members/${u.id}`} className="hover:text-navy-600">
                    <p className="font-bold">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-slate-500">کد پرسنلی {fa(u.personnelCode)} — {u.company} — {formatDate(u.createdAt)}</p>
                  </Link>
                  <div className="flex gap-2">
                    <form action={setUserStatusAction}><input type="hidden" name="id" value={u.id} /><input type="hidden" name="status" value="ACTIVE" /><button className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700">تأیید</button></form>
                    <Link href={`/admin/members/${u.id}`} className="btn-outline btn-sm">بررسی</Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-500">درخواستی در انتظار نیست.</p>}
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-black text-navy-900">درخواست‌های ثبت‌نام کلاس</h2>
            <Link href="/admin/enrollments" className="flex items-center gap-1 text-sm font-bold text-navy-600">همه <ArrowLeft className="size-4" /></Link>
          </div>
          {pendingEnrollments.length ? (
            <ul className="divide-y divide-slate-100">
              {pendingEnrollments.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-bold">{e.user.firstName} {e.user.lastName}</p>
                    <p className="text-xs text-slate-500">{e.program.title} — {formatDate(e.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <form action={setEnrollmentStatusAction}><input type="hidden" name="id" value={e.id} /><input type="hidden" name="status" value="APPROVED" /><button className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700">تأیید</button></form>
                    <form action={setEnrollmentStatusAction}><input type="hidden" name="id" value={e.id} /><input type="hidden" name="status" value="REJECTED" /><button className="btn-outline btn-sm text-rose-600">رد</button></form>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-500">درخواستی در انتظار نیست.</p>}
        </section>
      </div>

      {byCity.length > 0 && (
        <section className="card mt-6 p-5">
          <h2 className="mb-4 font-black text-navy-900">اعضای فعال به تفکیک محل خدمت</h2>
          <div className="grid gap-3">
            {byCity.map((c) => (
              <div key={c.city ?? "-"} className="grid grid-cols-[100px_1fr_50px] items-center gap-3 text-sm">
                <span className="font-bold text-slate-700">{c.city ?? "نامشخص"}</span>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-navy-700" style={{ width: `${(c._count / Math.max(1, members)) * 100}%` }} />
                </div>
                <span className="text-left font-bold text-navy-800">{formatNumber(c._count)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
