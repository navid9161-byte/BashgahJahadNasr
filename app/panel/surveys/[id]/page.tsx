import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PageTitle } from "@/components/dashboard-shell";
import { SurveyForm } from "@/components/forms/survey-form";
import { MembershipNotice } from "@/components/status-notice";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { labels, parseJsonArray } from "@/lib/utils";

export default async function TakeSurvey({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const survey = await db.survey.findUnique({
    where: { id: (await params).id },
    include: { questions: { orderBy: { order: "asc" } }, responses: { where: { userId: user.id }, select: { id: true } } },
  });
  if (!survey || !survey.isActive) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title={survey.title} subtitle={labels.surveyKind[survey.kind]} />
      {survey.description && <p className="card mb-6 p-5 leading-8 text-slate-600">{survey.description}</p>}
      {survey.responses.length ? (
        <div className="card grid place-items-center gap-3 p-10 text-center">
          <CheckCircle2 className="size-14 text-emerald-500" />
          <p className="font-black text-navy-900">پاسخ شما ثبت شده است — از مشارکت شما سپاسگزاریم!</p>
          <Link href="/panel/surveys" className="btn-outline">بازگشت به نظرسنجی‌ها</Link>
        </div>
      ) : user.status !== "ACTIVE" && user.role !== "ADMIN" ? (
        <MembershipNotice status={user.status} note={user.adminNote} />
      ) : (
        <SurveyForm
          surveyId={survey.id}
          questions={survey.questions.map((q) => ({ id: q.id, text: q.text, type: q.type, required: q.required, options: parseJsonArray(q.options) }))}
        />
      )}
    </div>
  );
}
