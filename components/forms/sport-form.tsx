"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { saveSportAction } from "@/app/actions/admin";
import { SportIcon, sportIcons } from "@/components/sport-icon";
import { ActionForm, FormMessage, SubmitButton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Field } from "./profile-fields";

type Sport = { id: string; name: string; slug: string; icon: string; summary: string; description: string; order: number; active: boolean; image: string | null };

export function SportForm({ sport }: { sport?: Sport }) {
  const [icon, setIcon] = useState(sport?.icon ?? "trophy");
  return (
    <ActionForm action={saveSportAction} className="card grid gap-4 p-5 sm:grid-cols-2">
      {sport && <input type="hidden" name="id" value={sport.id} />}
      <input type="hidden" name="icon" value={icon} />
      <Field label="نام رشته" name="name" required defaultValue={sport?.name} />
      <Field label="نامک (آدرس صفحه، انگلیسی)" name="slug" defaultValue={sport?.slug} dir="ltr" placeholder="volleyball" />
      <div className="sm:col-span-2">
        <span className="label">آیکون</span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(sportIcons).map(([key, { label }]) => (
            <button
              type="button" key={key} title={label} onClick={() => setIcon(key)}
              className={cn("grid size-12 place-items-center rounded-xl border transition", icon === key ? "border-navy-800 bg-navy-800 text-brand-yellow" : "border-slate-200 text-slate-500 hover:border-navy-300")}
            >
              <SportIcon name={key} className="size-6" />
            </button>
          ))}
        </div>
      </div>
      <label className="sm:col-span-2"><span className="label">خلاصه (یک خط)</span><input name="summary" defaultValue={sport?.summary} className="input" /></label>
      <label className="sm:col-span-2"><span className="label">توضیحات کامل</span><textarea name="description" rows={5} defaultValue={sport?.description} className="input" /></label>
      <label><span className="label">تصویر شاخص</span><input type="file" name="image" accept="image/*" className="input" /></label>
      <Field label="ترتیب نمایش" name="order" defaultValue={sport?.order ?? 0} inputMode="numeric" dir="ltr" />
      <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="active" defaultChecked={sport?.active ?? true} className="size-4 accent-navy-800" /> نمایش در سایت</label>
      <div className="grid gap-3 sm:col-span-2">
        <FormMessage />
        <SubmitButton className="btn-primary sm:justify-self-start sm:px-10"><Save className="size-4" /> ذخیره</SubmitButton>
      </div>
    </ActionForm>
  );
}
