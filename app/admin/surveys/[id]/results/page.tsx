import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download } from "lucide-react";
import { PageTitle } from "@/components/dashboard-shell";
import { db } from "@/lib/db";
import { fa, formatDate, formatNumber, labels, parseJsonArray } from "@/lib/utils";

function pct(n: number, total: number) {
  return total ? Math.round((n / total) * 100) : 0;
}

/** نمودار میله‌ای افقی تک‌سری: یک رنگ، برچسب و مقدار با رنگ متن */
function Bars({ rows, total }: { rows: { label: string; count: number }[]; total: number }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="grid gap-2.5" role="table" aria-label="توزیع پاسخ‌ها">
      {rows.map((r) => (
        <div key={r.label} role="row" className="group grid grid-cols-[minmax(120px,220px)_1fr_90px] items-center gap-3 text-sm" title={`${r.label}: ${formatNumber(r.count)} نفر (${fa(pct(r.count, total))}٪)`}>
          <span role="cell" className="truncate text-slate-700">{r.label}</span>
          <span role="cell" className="h-5 rounded-l bg-slate-100">
            <span
              className="block h-full rounded-l-[4px] bg-navy-700 transition-colors group-hover:bg-navy-500"
              style={{ width: `${(r.count / max) * 100}%`, minWidth: r.count ? 4 : 0 }}
            />
          </span>
          <span role="cell" className="text-left tabular-nums text-slate-600">
            <b className="text-slate-900">{formatNumber(r.count)}</b> ({fa(pct(r.count, total))}٪)
          </span>
        </div>
      ))}
    </div>
  );
}

export default async function SurveyResults({ params }: { params: Promise<{ id: string }> }) {
  const survey = await db.survey.findUnique({
    where: { id: (await params).id },
    include: { questions: { orderBy: { order: "asc" }, include: { answers: { include: { response: { select: { createdAt: true } } } } } }, _count: { select: { responses: true } } },
  });
  if (!survey) notFound();
  const total = survey._count.responses;

  return (
    <>
      <Link href="/admin/surveys" className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-navy-600"><ArrowRight className="size-4" /> بازگشت</Link>
      <PageTitle
        title={`نتایج: ${survey.title}`}
        subtitle={`${labels.surveyKind[survey.kind]} — ${formatNumber(total)} پاسخ‌دهنده`}
        actions={<a href={`/api/admin/export/survey/${survey.id}`} className="btn-outline"><Download className="size-4" /> خروجی اکسل پاسخ‌ها</a>}
      />
      {!total && <p className="card mb-6 p-8 text-center text-slate-500">هنوز پاسخی ثبت نشده است.</p>}
      <div className="grid gap-5">
        {survey.questions.map((q, i) => {
          const answered = q.answers.length;
          let body: React.ReactNode;
          if (q.type === "SINGLE" || q.type === "MULTI") {
            const counts = new Map(parseJsonArray(q.options).map((o) => [o, 0]));
            for (const a of q.answers) {
              const values = q.type === "MULTI" ? parseJsonArray(a.value) : [a.value];
              for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
            }
            const rows = [...counts].map(([label, count]) => ({ label, count }));
            if (q.type === "MULTI") rows.sort((a, b) => b.count - a.count);
            body = <Bars rows={rows} total={answered} />;
          } else if (q.type === "RATING") {
            const rows = [5, 4, 3, 2, 1].map((n) => ({ label: `${fa(n)} از ۵`, count: q.answers.filter((a) => a.value === String(n)).length }));
            const avg = answered ? q.answers.reduce((s, a) => s + Number(a.value), 0) / answered : 0;
            body = (
              <div className="grid items-center gap-6 sm:grid-cols-[140px_1fr]">
                <div className="text-center">
                  <p className="text-4xl font-black text-navy-900">{fa(avg.toFixed(1))}</p>
                  <p className="text-xs text-slate-500">میانگین امتیاز از ۵</p>
                </div>
                <Bars rows={rows} total={answered} />
              </div>
            );
          } else {
            body = (
              <ul className="grid max-h-80 gap-2 overflow-y-auto">
                {q.answers.map((a) => (
                  <li key={a.id} className="rounded-xl bg-slate-50 p-3 text-sm leading-7 text-slate-700">
                    {a.value}<span className="mr-2 text-xs text-slate-400">— {formatDate(a.response.createdAt)}</span>
                  </li>
                ))}
                {!answered && <li className="text-sm text-slate-400">پاسخی ثبت نشده</li>}
              </ul>
            );
          }
          return (
            <section key={q.id} className="card p-5">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-black text-navy-900">{fa(i + 1)}. {q.text}</h2>
                <span className="text-xs text-slate-500">{labels.questionType[q.type]} — {formatNumber(answered)} پاسخ</span>
              </div>
              {body}
            </section>
          );
        })}
      </div>
    </>
  );
}
