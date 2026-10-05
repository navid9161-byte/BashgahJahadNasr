"use client";

import { UserPlus } from "lucide-react";
import { registerAction } from "@/app/actions/auth";
import { ActionForm, FormMessage, SubmitButton } from "@/components/ui";
import { Field, Fieldset, ProfileFields } from "./profile-fields";

export function RegisterForm({ sports }: { sports: { id: string; name: string }[] }) {
  return (
    <ActionForm action={registerAction} className="grid gap-6">
      <Fieldset title="اطلاعات حساب کاربری">
        <Field label="کد ملی (نام کاربری)" name="nationalCode" required dir="ltr" inputMode="numeric" placeholder="۱۰ رقم" />
        <Field label="کد پرسنلی" name="personnelCode" required dir="ltr" inputMode="numeric" />
        <label>
          <span className="label">عکس پرسنلی</span>
          <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" className="input file:ml-3 file:rounded-lg file:border-0 file:bg-navy-50 file:px-3 file:py-1 file:text-navy-800" />
        </label>
        <Field label="رمز عبور" name="password" type="password" required placeholder="حداقل ۸ کاراکتر" dir="ltr" />
        <Field label="تکرار رمز عبور" name="password2" type="password" required dir="ltr" />
      </Fieldset>

      <ProfileFields sports={sports} />

      <div className="card grid gap-4 p-5 sm:p-6">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-7 text-slate-700">
          <input type="checkbox" name="agree" className="mt-1.5 size-4 accent-navy-800" required />
          صحت اطلاعات وارد شده را تأیید می‌کنم و آیین‌نامه و مقررات باشگاه را می‌پذیرم. می‌دانم عضویت من پس از بررسی و تأیید مدیر باشگاه فعال می‌شود.
        </label>
        <FormMessage />
        <SubmitButton className="btn-primary w-full py-3.5 text-base sm:w-auto sm:justify-self-start sm:px-10" pendingText="در حال ثبت...">
          <UserPlus className="size-5" /> ثبت‌نام در باشگاه
        </SubmitButton>
      </div>
    </ActionForm>
  );
}
