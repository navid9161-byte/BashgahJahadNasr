"use client";

import { Save } from "lucide-react";
import { saveProgramAction } from "@/app/actions/admin";
import { ActionForm, FormMessage, SubmitButton } from "@/components/ui";
import { cities } from "@/lib/site";
import { Field, SelectField } from "./profile-fields";

type Program = {
  id: string; title: string; sportId: string; coach: string | null; gender: string; days: string; startTime: string; endTime: string;
  location: string; city: string; capacity: number; fee: number; startDate: string | null; description: string | null; isOpen: boolean;
};

export function ProgramForm({ program, sports }: { program?: Program; sports: { id: string; name: string }[] }) {
  return (
    <ActionForm action={saveProgramAction} className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
      {program && <input type="hidden" name="id" value={program.id} />}
      <Field label="عنوان کلاس" name="title" required defaultValue={program?.title} placeholder="مثلاً والیبال آقایان - رده بزرگسالان" />
      <SelectField label="رشته ورزشی" name="sportId" required defaultValue={program?.sportId} options={sports.map((s) => [s.id, s.name] as [string, string])} />
      <Field label="مربی" name="coach" defaultValue={program?.coach} />
      <SelectField label="ویژه" name="gender" required defaultValue={program?.gender ?? "ALL"} options={[["ALL", "آقایان و بانوان"], ["MALE", "آقایان"], ["FEMALE", "بانوان"]]} placeholder="انتخاب" />
      <Field label="روزهای برگزاری" name="days" required defaultValue={program?.days} placeholder="شنبه و دوشنبه" />
      <div className="grid grid-cols-2 gap-3">
        <Field label="ساعت شروع" name="startTime" type="time" required defaultValue={program?.startTime} />
        <Field label="ساعت پایان" name="endTime" type="time" required defaultValue={program?.endTime} />
      </div>
      <Field label="مکان برگزاری" name="location" required defaultValue={program?.location} />
      <SelectField label="شهر" name="city" required defaultValue={program?.city} options={cities} />
      <Field label="تاریخ شروع دوره" name="startDate" defaultValue={program?.startDate} placeholder="۱۴۰۵/۰۸/۰۱" dir="ltr" />
      <Field label="ظرفیت (نفر)" name="capacity" required defaultValue={program?.capacity ?? 20} inputMode="numeric" dir="ltr" />
      <Field label="شهریه (تومان) — صفر یعنی رایگان" name="fee" defaultValue={program?.fee ?? 0} inputMode="numeric" dir="ltr" />
      <label className="flex items-center gap-2 self-end pb-3 text-sm font-bold">
        <input type="checkbox" name="isOpen" defaultChecked={program?.isOpen ?? true} className="size-4 accent-navy-800" /> ثبت‌نام باز است
      </label>
      <label className="sm:col-span-2 lg:col-span-3">
        <span className="label">توضیحات</span>
        <textarea name="description" rows={3} defaultValue={program?.description ?? ""} className="input" />
      </label>
      <div className="grid gap-3 sm:col-span-2 lg:col-span-3">
        <FormMessage />
        <SubmitButton className="btn-primary sm:justify-self-start sm:px-10"><Save className="size-4" /> ذخیره کلاس</SubmitButton>
      </div>
    </ActionForm>
  );
}
