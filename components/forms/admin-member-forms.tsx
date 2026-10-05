"use client";

import { KeyRound, Save } from "lucide-react";
import { adminUpdateMemberAction, resetPasswordAction } from "@/app/actions/admin";
import { ActionForm, FormMessage, SubmitButton } from "@/components/ui";
import { Field, Fieldset, ProfileFields } from "./profile-fields";

type Profile = React.ComponentProps<typeof ProfileFields>["profile"];

export function AdminMemberForm({ id, personnelCode, profile, sports }: { id: string; personnelCode: string | null; profile: Profile; sports: { id: string; name: string }[] }) {
  return (
    <ActionForm action={adminUpdateMemberAction} className="grid gap-6">
      <input type="hidden" name="id" value={id} />
      <Fieldset title="کد پرسنلی">
        <Field label="کد پرسنلی" name="personnelCode" defaultValue={personnelCode} dir="ltr" />
      </Fieldset>
      <ProfileFields profile={profile} sports={sports} />
      <div className="grid gap-3">
        <FormMessage />
        <SubmitButton className="btn-primary sm:justify-self-start sm:px-10"><Save className="size-4" /> ذخیره اطلاعات</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function ResetPasswordForm({ id }: { id: string }) {
  return (
    <ActionForm action={resetPasswordAction} resetOnSuccess className="grid gap-3">
      <input type="hidden" name="id" value={id} />
      <label><span className="label">رمز عبور جدید</span><input name="password" required minLength={8} dir="ltr" className="input" /></label>
      <FormMessage />
      <SubmitButton className="btn-outline"><KeyRound className="size-4" /> تنظیم رمز جدید</SubmitButton>
    </ActionForm>
  );
}
