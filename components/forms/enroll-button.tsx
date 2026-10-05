"use client";

import { enrollAction } from "@/app/actions/member";
import { ActionForm, FormMessage, SubmitButton } from "@/components/ui";

export function EnrollButton({ programId }: { programId: string }) {
  return (
    <ActionForm action={enrollAction} className="grid gap-2">
      <input type="hidden" name="programId" value={programId} />
      <SubmitButton className="btn-yellow w-full" pendingText="در حال ثبت...">درخواست ثبت‌نام</SubmitButton>
      <FormMessage />
    </ActionForm>
  );
}
