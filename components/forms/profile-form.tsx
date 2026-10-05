"use client";

import { KeyRound, Save } from "lucide-react";
import { changePasswordAction } from "@/app/actions/auth";
import { updateProfileAction } from "@/app/actions/member";
import { ActionForm, FormMessage, SubmitButton } from "@/components/ui";
import { Field, Fieldset, ProfileFields } from "./profile-fields";

type Profile = React.ComponentProps<typeof ProfileFields>["profile"];

export function ProfileForm({ profile, sports }: { profile: Profile; sports: { id: string; name: string }[] }) {
  return (
    <ActionForm action={updateProfileAction} className="grid gap-6">
      <ProfileFields profile={profile} sports={sports} />
      <div className="card grid gap-4 p-5">
        <label>
          <span className="label">تغییر عکس پرسنلی</span>
          <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" className="input max-w-md" />
        </label>
        <FormMessage />
        <SubmitButton className="btn-primary sm:justify-self-start sm:px-10"><Save className="size-4" /> ذخیره تغییرات</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function ChangePasswordForm() {
  return (
    <ActionForm action={changePasswordAction} resetOnSuccess className="grid gap-4">
      <Fieldset title="تغییر رمز عبور">
        <Field label="رمز عبور فعلی" name="current" type="password" required dir="ltr" />
        <Field label="رمز عبور جدید" name="password" type="password" required dir="ltr" />
        <Field label="تکرار رمز عبور جدید" name="password2" type="password" required dir="ltr" />
        <div className="grid gap-3 sm:col-span-2 lg:col-span-3">
          <FormMessage />
          <SubmitButton className="btn-outline sm:justify-self-start"><KeyRound className="size-4" /> تغییر رمز عبور</SubmitButton>
        </div>
      </Fieldset>
    </ActionForm>
  );
}
