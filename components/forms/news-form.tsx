"use client";

import { Save } from "lucide-react";
import { saveNewsAction } from "@/app/actions/admin";
import { ActionForm, FormMessage, SubmitButton } from "@/components/ui";
import { Field, SelectField } from "./profile-fields";

type News = { id: string; title: string; slug: string; summary: string; body: string; category: string; published: boolean; cover: string | null };

export function NewsForm({ news }: { news?: News }) {
  return (
    <ActionForm action={saveNewsAction} className="card grid gap-4 p-5 sm:grid-cols-2">
      {news && <input type="hidden" name="id" value={news.id} />}
      <Field label="عنوان" name="title" required defaultValue={news?.title} className="sm:col-span-2" />
      <SelectField label="نوع" name="category" required defaultValue={news?.category ?? "NEWS"} options={[["NEWS", "خبر"], ["NOTICE", "اطلاعیه"]]} placeholder="انتخاب" />
      <Field label="نامک (آدرس صفحه، اختیاری)" name="slug" defaultValue={news?.slug} dir="ltr" />
      <label className="sm:col-span-2"><span className="label">خلاصه / لید خبر</span><textarea name="summary" rows={2} defaultValue={news?.summary} className="input" /></label>
      <label className="sm:col-span-2"><span className="label">متن کامل (هر پاراگراف در یک خط)</span><textarea name="body" rows={12} defaultValue={news?.body} className="input leading-8" /></label>
      <label>
        <span className="label">تصویر شاخص</span>
        <input type="file" name="cover" accept="image/*" className="input" />
        {news?.cover && <span className="mt-1 block text-xs text-slate-500">برای تغییر تصویر فعلی، فایل جدید انتخاب کنید.</span>}
      </label>
      <label className="flex items-center gap-2 self-end pb-3 text-sm font-bold"><input type="checkbox" name="published" defaultChecked={news?.published ?? true} className="size-4 accent-navy-800" /> منتشر شود</label>
      <div className="grid gap-3 sm:col-span-2">
        <FormMessage />
        <SubmitButton className="btn-primary sm:justify-self-start sm:px-10"><Save className="size-4" /> ذخیره</SubmitButton>
      </div>
    </ActionForm>
  );
}
