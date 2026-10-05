import { CalendarDays, Clock, MapPin, User } from "lucide-react";
import { cancelEnrollmentAction } from "@/app/actions/member";
import { Badge } from "@/components/badge";
import { PageTitle } from "@/components/dashboard-shell";
import { EnrollButton } from "@/components/forms/enroll-button";
import { SportIcon } from "@/components/sport-icon";
import { MembershipNotice } from "@/components/status-notice";
import { ConfirmButton } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fa, formatNumber, formatPrice, labels } from "@/lib/utils";

export const metadata = { title: "ثبت‌نام در کلاس‌ها" };

export default async function PanelPrograms() {
  const user = await requireUser();
  const canEnroll = user.status === "ACTIVE" || user.role === "ADMIN";
  const programs = await db.program.findMany({
    where: { isOpen: true },
    include: {
      sport: true,
      enrollments: { where: { userId: user.id } },
      _count: { select: { enrollments: { where: { status: { in: ["PENDING", "APPROVED"] } } } } },
    },
    orderBy: [{ sport: { order: "asc" } }, { createdAt: "desc" }],
  });

  return (
    <>
      <PageTitle title="ثبت‌نام در کلاس‌ها" subtitle="کلاس مورد نظر را انتخاب و درخواست ثبت‌نام دهید. نتیجه بررسی در همین صفحه نمایش داده می‌شود." />
      <MembershipNotice status={user.status} note={user.adminNote} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((p) => {
          const mine = p.enrollments[0];
          const active = mine && mine.status !== "CANCELLED";
          const left = Math.max(0, p.capacity - p._count.enrollments);
          const genderMismatch = p.gender !== "ALL" && user.gender && p.gender !== user.gender;
          return (
            <div key={p.id} id={p.id} className="card flex scroll-mt-24 flex-col p-5 target:ring-4 target:ring-brand-yellow">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-navy-800 text-brand-yellow"><SportIcon name={p.sport.icon} className="size-6" /></span>
                <Badge>{labels.gender[p.gender]}</Badge>
              </div>
              <h2 className="mt-4 text-lg font-black text-navy-900">{p.title}</h2>
              <p className="text-sm text-slate-500">{p.sport.name}</p>
              <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                <li className="flex gap-2"><CalendarDays className="size-4 text-navy-500" /> {p.days}</li>
                <li className="flex gap-2"><Clock className="size-4 text-navy-500" /> {fa(p.startTime)} تا {fa(p.endTime)}</li>
                <li className="flex gap-2"><MapPin className="size-4 text-navy-500" /> {p.location} — {p.city}</li>
                {p.coach && <li className="flex gap-2"><User className="size-4 text-navy-500" /> مربی: {p.coach}</li>}
              </ul>
              {p.description && <p className="mt-3 text-sm leading-6 text-slate-500">{p.description}</p>}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                <span className="font-bold text-navy-800">{formatPrice(p.fee)}</span>
                <span className={left ? "text-emerald-600" : "text-rose-600"}>{left ? `${formatNumber(left)} ظرفیت خالی` : "تکمیل ظرفیت"}</span>
              </div>
              <div className="mt-4">
                {active ? (
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={mine.status}>{labels.enrollmentStatus[mine.status]}</Badge>
                    {mine.status === "PENDING" && (
                      <form action={cancelEnrollmentAction}>
                        <input type="hidden" name="id" value={mine.id} />
                        <ConfirmButton className="btn-ghost btn-sm text-rose-600" message="درخواست ثبت‌نام لغو شود؟">لغو درخواست</ConfirmButton>
                      </form>
                    )}
                  </div>
                ) : !canEnroll ? (
                  <p className="text-center text-sm text-slate-500">پس از تأیید عضویت فعال می‌شود</p>
                ) : genderMismatch ? (
                  <p className="text-center text-sm text-slate-500">ویژه {labels.gender[p.gender]}</p>
                ) : left === 0 ? (
                  <p className="text-center text-sm font-bold text-rose-600">ظرفیت تکمیل است</p>
                ) : (
                  <EnrollButton programId={p.id} />
                )}
                {mine?.note && <p className="mt-2 text-xs text-slate-500">توضیح: {mine.note}</p>}
              </div>
            </div>
          );
        })}
      </div>
      {!programs.length && <p className="card p-8 text-center text-slate-500">در حال حاضر کلاسی برای ثبت‌نام وجود ندارد.</p>}
    </>
  );
}
