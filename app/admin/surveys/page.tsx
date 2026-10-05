import Link from "next/link";
import { BarChart3, Plus } from "lucide-react";
import { Badge } from "@/components/badge";
import { PageTitle } from "@/components/dashboard-shell";
import { db } from "@/lib/db";
import { fa, formatDate, labels } from "@/lib/utils";

export const metadata = { title: "نظرسنجی و نیازسنجی" };

export default async function SurveysAdmin() {
  const surveys = await db.survey.findMany({ include: { _count: { select: { questions: true, responses: true } } }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageTitle title="نظرسنجی و نیازسنجی" subtitle="فرم‌های دلخواه بسازید و نتایج را به صورت نمودار و فایل اکسل ببینید" actions={<Link href="/admin/surveys/new" className="btn-primary"><Plus className="size-4" /> فرم جدید</Link>} />
      <div className="grid gap-4 md:grid-cols-2">
        {surveys.map((s) => (
          <div key={s.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-black text-navy-900">{s.title}</h2>
                <p className="mt-1 text-xs text-slate-500">{formatDate(s.createdAt)} — {fa(s._count.questions)} سؤال — <b>{fa(s._count.responses)} پاسخ</b></p>
              </div>
              <div className="flex gap-1">
                <Badge>{labels.surveyKind[s.kind]}</Badge>
                {s.isActive ? <Badge tone="ACTIVE">فعال</Badge> : <Badge tone="CANCELLED">غیرفعال</Badge>}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href={`/admin/surveys/${s.id}/results`} className="btn-primary btn-sm"><BarChart3 className="size-4" /> نتایج</Link>
              <Link href={`/admin/surveys/${s.id}`} className="btn-outline btn-sm">ویرایش سؤالات</Link>
            </div>
          </div>
        ))}
      </div>
      {!surveys.length && <p className="card p-8 text-center text-slate-500">فرمی ساخته نشده است.</p>}
    </>
  );
}
