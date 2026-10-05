import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Trash2 } from "lucide-react";
import { deleteMemberAction, setUserStatusAction } from "@/app/actions/admin";
import { Badge } from "@/components/badge";
import { PageTitle } from "@/components/dashboard-shell";
import { AdminMemberForm, ResetPasswordForm } from "@/components/forms/admin-member-forms";
import { ConfirmButton } from "@/components/ui";
import { db } from "@/lib/db";
import { profileValues } from "@/lib/profile";
import { fa, formatDate, labels, parseJsonArray } from "@/lib/utils";

export default async function MemberDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await db.user.findUnique({
    where: { id: (await params).id },
    include: { enrollments: { include: { program: true }, orderBy: { createdAt: "desc" } }, _count: { select: { responses: true } } },
  });
  if (!user || user.role !== "MEMBER") notFound();
  const sports = await db.sport.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } });
  const interestNames = sports.filter((s) => parseJsonArray(user.interests).includes(s.id)).map((s) => s.name);

  const info: [string, React.ReactNode][] = [
    ["کد ملی", fa(user.nationalCode)],
    ["کد پرسنلی", fa(user.personnelCode)],
    ["موبایل", <span key="m" dir="ltr">{fa(user.mobile)}</span>],
    ["تاریخ تولد", fa(user.birthDate)],
    ["جنسیت", user.gender ? labels.genderPerson[user.gender] : "-"],
    ["شرکت", user.company],
    ["واحد / سمت", [user.department, user.jobTitle].filter(Boolean).join(" — ") || "-"],
    ["شهر محل خدمت", user.city],
    ["گروه خونی", <span key="b" dir="ltr">{user.bloodType ?? "-"}</span>],
    ["علاقه‌مندی‌ها", interestNames.join("، ") || "-"],
    ["مشارکت در نظرسنجی", `${fa(user._count.responses)} مورد`],
    ["تاریخ ثبت‌نام", formatDate(user.createdAt, true)],
  ];

  return (
    <>
      <Link href="/admin/members" className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-navy-600"><ArrowRight className="size-4" /> بازگشت به فهرست</Link>
      <PageTitle title={`${user.firstName} ${user.lastName}`} subtitle={user.fatherName ? `فرزند ${user.fatherName}` : undefined} actions={<Badge tone={user.status} className="px-4 py-1.5 text-sm">{labels.userStatus[user.status]}</Badge>} />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="card p-5">
          <div className="flex flex-wrap gap-6">
            {user.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photo} alt="" className="size-32 rounded-2xl object-cover" />
            ) : (
              <span className="grid size-32 place-items-center rounded-2xl bg-navy-800 text-5xl font-black text-brand-yellow">{user.firstName[0]}</span>
            )}
            <dl className="grid flex-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {info.map(([k, v]) => (
                <div key={k}><dt className="text-xs text-slate-400">{k}</dt><dd className="font-bold text-slate-800">{v || "-"}</dd></div>
              ))}
            </dl>
          </div>
          {user.medicalNotes && <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm leading-7 text-rose-800"><b>سوابق پزشکی:</b> {user.medicalNotes}</p>}
        </div>

        <div className="grid h-fit gap-6">
          <section className="card p-5">
            <h2 className="mb-3 font-black text-navy-900">وضعیت عضویت</h2>
            <form action={setUserStatusAction} className="grid gap-3">
              <input type="hidden" name="id" value={user.id} />
              <select name="status" defaultValue={user.status} className="input">
                {Object.entries(labels.userStatus).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <textarea name="note" defaultValue={user.adminNote ?? ""} rows={2} placeholder="توضیح برای عضو (اختیاری)" className="input" />
              <button className="btn-primary">ثبت وضعیت</button>
            </form>
          </section>
          <section className="card p-5">
            <h2 className="mb-3 font-black text-navy-900">بازنشانی رمز عبور</h2>
            <ResetPasswordForm id={user.id} />
          </section>
        </div>
      </div>

      <section className="card mt-6 p-5">
        <h2 className="mb-3 font-black text-navy-900">ثبت‌نام در کلاس‌ها</h2>
        {user.enrollments.length ? (
          <ul className="divide-y divide-slate-100">
            {user.enrollments.map((e) => (
              <li key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                <Link href={`/admin/programs/${e.programId}`} className="font-bold hover:text-navy-600">{e.program.title}</Link>
                <span className="flex items-center gap-3 text-slate-500">{formatDate(e.createdAt)} <Badge tone={e.status}>{labels.enrollmentStatus[e.status]}</Badge></span>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-slate-500">ثبت‌نامی ندارد.</p>}
      </section>

      <h2 className="mb-4 mt-10 text-xl font-black text-navy-900">ویرایش اطلاعات</h2>
      <AdminMemberForm id={user.id} personnelCode={user.personnelCode} profile={profileValues(user)} sports={sports} />

      <form action={deleteMemberAction} className="mt-10 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-5">
        <input type="hidden" name="id" value={user.id} />
        <p className="text-sm text-rose-800">حذف کامل عضو همراه با ثبت‌نام‌ها و پاسخ‌های نظرسنجی. این عمل قابل بازگشت نیست.</p>
        <ConfirmButton message="این عضو به طور کامل حذف شود؟" className="btn-danger btn-sm"><Trash2 className="size-4" /> حذف عضو</ConfirmButton>
      </form>
    </>
  );
}
