"use client";

import Link from "next/link";
import { useActionState, startTransition } from "react";
import { CheckCircle2, Send, Star } from "lucide-react";
import { submitSurveyAction } from "@/app/actions/member";
import { FormMessage } from "@/components/ui";
import { fa } from "@/lib/utils";

type Q = { id: string; text: string; type: string; required: boolean; options: string[] };

export function SurveyForm({ surveyId, questions }: { surveyId: string; questions: Q[] }) {
  const [state, run, pending] = useActionState(submitSurveyAction, undefined);

  if (state?.ok) {
    return (
      <div className="card grid place-items-center gap-3 p-10 text-center">
        <CheckCircle2 className="size-14 text-emerald-500" />
        <p className="font-black text-navy-900">{state.message}</p>
        <Link href="/panel/surveys" className="btn-outline">بازگشت به نظرسنجی‌ها</Link>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => run(fd));
      }}
    >
      <input type="hidden" name="surveyId" value={surveyId} />
      {questions.map((q, i) => (
        <fieldset key={q.id} className="card p-5">
          <legend className="float-right mb-4 w-full font-bold leading-7 text-navy-900">
            <span className="ml-2 inline-grid size-7 place-items-center rounded-lg bg-navy-800 text-sm text-brand-yellow">{fa(i + 1)}</span>
            {q.text} {q.required && <span className="text-rose-500">*</span>}
          </legend>
          <div className="clear-both">
            {(q.type === "SINGLE" || q.type === "MULTI") && (
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((o) => (
                  <label key={o} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm transition has-[:checked]:border-navy-600 has-[:checked]:bg-navy-50">
                    <input type={q.type === "SINGLE" ? "radio" : "checkbox"} name={`q_${q.id}`} value={o} required={q.type === "SINGLE" && q.required} className="size-4 accent-navy-800" />
                    {o}
                  </label>
                ))}
              </div>
            )}
            {q.type === "RATING" && (
              <div className="flex flex-row-reverse justify-end gap-2" dir="ltr">
                {[5, 4, 3, 2, 1].map((n) => (
                  <label key={n} className="group cursor-pointer">
                    <input type="radio" name={`q_${q.id}`} value={n} required={q.required} className="peer sr-only" />
                    <span className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-500 peer-checked:border-brand-yellow-dark peer-checked:bg-yellow-50 peer-focus-visible:ring-4 peer-focus-visible:ring-navy-500/20">
                      <Star className="size-6 text-brand-yellow-dark" fill="currentColor" fillOpacity={n / 5} />
                      {fa(n)}
                    </span>
                  </label>
                ))}
              </div>
            )}
            {q.type === "TEXT" && <textarea name={`q_${q.id}`} rows={3} required={q.required} className="input" />}
          </div>
        </fieldset>
      ))}
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className="btn-primary py-3.5 text-base sm:justify-self-start sm:px-10">
        <Send className="size-5" /> {pending ? "در حال ثبت..." : "ثبت پاسخ‌ها"}
      </button>
    </form>
  );
}
