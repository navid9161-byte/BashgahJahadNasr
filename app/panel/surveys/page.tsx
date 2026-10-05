import Link from "next/link";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { Badge } from "@/components/badge";
import { PageTitle } from "@/components/dashboard-shell";
import { MembershipNotice } from "@/components/status-notice";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fa, labels } from "@/lib/utils";

export const metadata = { title: "نظرسنجی و نیازسنجی" };

export default async function PanelSurveys() {
  const user = await requireUser();
  const surveys = await db.survey.findMany({
    where: { isActive: true },
    include: { _count: { select: { questions: true } }, responses: { where: { userId: user.id }, select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <PageTitle title="نظرسنجی و نیازسنجی" subtitle="نظرات شما مبنای برنامه‌ریزی کلاس‌ها و رویدادهای باشگاه است" />
      <MembershipNotice status={user.status} note={user.adminNote} />
      <div className="grid gap-4 md:grid-cols-2">
        {surveys.map((s) => {
          const done = s.responses.length > 0;
          return (
            <div key={s.id} className="card flex flex-col p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-navy-800 text-brand-yellow"><ClipboardList className="size-5" /></span>
                <div className="flex-1">
                  <h2 className="font-black text-navy-900">{s.title}</h2>
                  <p className="text-xs text-slate-500">{fa(s._count.questions)} سؤال</p>
                </div>
                <Badge>{labels.surveyKind[s.kind]}</Badge>
              </div>
              {s.description && <p className="mt-3 text-sm leading-7 text-slate-600">{s.description}</p>}
              <div className="mt-auto pt-4">
                {done ? (
                  <p className="flex items-center gap-2 font-bold text-emerald-600"><CheckCircle2 className="size-5" /> پاسخ شما ثبت شده است</p>
                ) : (
                  <Link href={`/panel/surveys/${s.id}`} className="btn-primary">شرکت در {labels.surveyKind[s.kind]}</Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!surveys.length && <p className="card p-8 text-center text-slate-500">در حال حاضر نظرسنجی فعالی وجود ندارد.</p>}
    </>
  );
}
