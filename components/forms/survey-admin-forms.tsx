"use client";

import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { saveQuestionAction, saveSurveyAction } from "@/app/actions/admin";
import { ActionForm, FormMessage, SubmitButton } from "@/components/ui";
import { labels } from "@/lib/utils";
import { Field, SelectField } from "./profile-fields";

type Survey = { id: string; title: string; description: string; kind: string; isActive: boolean };

export function SurveyMetaForm({ survey }: { survey?: Survey }) {
  return (
    <ActionForm action={saveSurveyAction} className="card grid gap-4 p-5 sm:grid-cols-2">
      {survey && <input type="hidden" name="id" value={survey.id} />}
      <Field label="عنوان" name="title" required defaultValue={survey?.title} />
      <SelectField label="نوع" name="kind" required defaultValue={survey?.kind ?? "POLL"} options={Object.entries(labels.surveyKind)} placeholder="انتخاب" />
      <label className="sm:col-span-2"><span className="label">توضیحات</span><textarea name="description" rows={2} defaultValue={survey?.description} className="input" /></label>
      <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="isActive" defaultChecked={survey?.isActive ?? true} className="size-4 accent-navy-800" /> فعال (نمایش به پرسنل)</label>
      <div className="grid gap-3 sm:col-span-2">
        <FormMessage />
        <SubmitButton className="btn-primary sm:justify-self-start sm:px-8"><Save className="size-4" /> {survey ? "ذخیره" : "ایجاد و افزودن سؤالات"}</SubmitButton>
      </div>
    </ActionForm>
  );
}

type Question = { id: string; text: string; type: string; options: string[]; required: boolean; order: number };

export function QuestionForm({ surveyId, question }: { surveyId: string; question?: Question }) {
  const [type, setType] = useState(question?.type ?? "SINGLE");
  const hasOptions = type === "SINGLE" || type === "MULTI";
  return (
    <ActionForm action={saveQuestionAction} resetOnSuccess={!question} className="grid gap-3 sm:grid-cols-[1fr_200px_90px]">
      <input type="hidden" name="surveyId" value={surveyId} />
      {question && <input type="hidden" name="id" value={question.id} />}
      <label><span className="label">متن سؤال</span><input name="text" required defaultValue={question?.text} className="input" /></label>
      <label>
        <span className="label">نوع پاسخ</span>
        <select name="type" value={type} onChange={(e) => setType(e.target.value)} className="input">
          {Object.entries(labels.questionType).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      <label><span className="label">ترتیب</span><input name="order" defaultValue={question?.order ?? ""} inputMode="numeric" dir="ltr" className="input" /></label>
      {hasOptions && (
        <label className="sm:col-span-3">
          <span className="label">گزینه‌ها (هر گزینه در یک خط)</span>
          <textarea name="options" rows={4} defaultValue={question?.options.join("\n")} className="input" />
        </label>
      )}
      <div className="flex flex-wrap items-center gap-4 sm:col-span-3">
        <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="required" defaultChecked={question?.required ?? true} className="size-4 accent-navy-800" /> پاسخ اجباری</label>
        <SubmitButton className="btn-primary btn-sm">{question ? <><Save className="size-4" /> ذخیره سؤال</> : <><Plus className="size-4" /> افزودن سؤال</>}</SubmitButton>
        <div className="flex-1"><FormMessage /></div>
      </div>
    </ActionForm>
  );
}
