import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart3, Trash2 } from "lucide-react";
import { deleteQuestionAction, deleteSurveyAction } from "@/app/actions/admin";
import { Badge } from "@/components/badge";
import { PageTitle } from "@/components/dashboard-shell";
import { QuestionForm, SurveyMetaForm } from "@/components/forms/survey-admin-forms";
import { ConfirmButton } from "@/components/ui";
import { db } from "@/lib/db";
import { fa, labels, parseJsonArray } from "@/lib/utils";

export default async function EditSurvey({ params }: { params: Promise<{ id: string }> }) {
  const survey = await db.survey.findUnique({
    where: { id: (await params).id },
    include: { questions: { orderBy: { order: "asc" } }, _count: { select: { responses: true } } },
  });
  if (!survey) notFound();
  return (
    <>
      <PageTitle title={survey.title} subtitle={`${fa(survey._count.responses)} پاسخ ثبت شده`} actions={<Link href={`/admin/surveys/${survey.id}/results`} className="btn-primary"><BarChart3 className="size-4" /> مشاهده نتایج</Link>} />
      {survey._count.responses > 0 && (
        <p className="mb-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-200">این فرم پاسخ دارد. تغییر گزینه‌ها ممکن است تحلیل نتایج قبلی را مخدوش کند.</p>
      )}
      <SurveyMetaForm survey={survey} />

      <h2 className="mb-3 mt-8 text-lg font-black text-navy-900">سؤالات</h2>
      <div className="grid gap-4">
        {survey.questions.map((q, i) => (
          <details key={q.id} className="card group p-5">
            <summary className="flex cursor-pointer list-none items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-navy-800 text-sm font-bold text-brand-yellow">{fa(i + 1)}</span>
              <span className="flex-1 font-bold text-slate-800">{q.text}</span>
              <Badge>{labels.questionType[q.type]}</Badge>
              {!q.required && <Badge tone="CANCELLED">اختیاری</Badge>}
            </summary>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <QuestionForm surveyId={survey.id} question={{ ...q, options: parseJsonArray(q.options) }} />
              <form action={deleteQuestionAction} className="mt-3">
                <input type="hidden" name="id" value={q.id} />
                <ConfirmButton message="این سؤال و پاسخ‌هایش حذف شود؟" className="btn-ghost btn-sm text-rose-600"><Trash2 className="size-4" /> حذف سؤال</ConfirmButton>
              </form>
            </div>
          </details>
        ))}
      </div>

      <div className="card mt-4 border-2 border-dashed border-navy-200 p-5">
        <h3 className="mb-3 font-black text-navy-900">افزودن سؤال جدید</h3>
        <QuestionForm surveyId={survey.id} />
      </div>

      <form action={deleteSurveyAction} className="mt-10 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-5">
        <input type="hidden" name="id" value={survey.id} />
        <p className="text-sm text-rose-800">حذف کامل فرم همراه با همه پاسخ‌ها.</p>
        <ConfirmButton message="این فرم و همه پاسخ‌هایش حذف شود؟"><Trash2 className="size-4" /> حذف فرم</ConfirmButton>
      </form>
    </>
  );
}
