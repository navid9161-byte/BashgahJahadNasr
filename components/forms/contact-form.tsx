"use client";

import { Send } from "lucide-react";
import { contactAction } from "@/app/actions/contact";
import { ActionForm, FormMessage, SubmitButton } from "@/components/ui";

export function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  return (
    <ActionForm action={contactAction} resetOnSuccess className="grid gap-4 sm:grid-cols-2">
      <label><span className="label">نام و نام خانوادگی</span><input name="name" required className="input" /></label>
      <label><span className="label">شماره تماس</span><input name="phone" required dir="ltr" inputMode="tel" className="input text-left" /></label>
      <label className="sm:col-span-2"><span className="label">موضوع</span><input name="subject" required defaultValue={defaultSubject} className="input" /></label>
      <label className="sm:col-span-2"><span className="label">متن پیام</span><textarea name="body" required rows={5} className="input" /></label>
      {defaultSubject && (
        <p className="text-sm leading-7 text-slate-500 sm:col-span-2">برای بازیابی رمز عبور، کد ملی و کد پرسنلی خود را در متن پیام بنویسید تا مدیر باشگاه رمز جدید را برایتان تنظیم کند.</p>
      )}
      <div className="grid gap-4 sm:col-span-2">
        <FormMessage />
        <SubmitButton className="btn-primary sm:justify-self-start sm:px-10"><Send className="size-4" /> ارسال پیام</SubmitButton>
      </div>
    </ActionForm>
  );
}
