"use server";

import { db } from "@/lib/db";
import { toEnDigits } from "@/lib/utils";
import type { FormState } from "@/components/ui";

export async function contactAction(_: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = toEnDigits(String(formData.get("phone") ?? "")).trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (name.length < 2 || !/^0\d{9,10}$/.test(phone) || !subject || body.length < 5) {
    return { error: "لطفاً نام، شماره تماس معتبر، موضوع و متن پیام را کامل وارد کنید" };
  }
  if (body.length > 3000) return { error: "متن پیام بیش از حد طولانی است" };
  await db.contactMessage.create({ data: { name, phone, subject, body } });
  return { ok: true, message: "پیام شما با موفقیت ثبت شد. همکاران ما به زودی با شما تماس می‌گیرند." };
}
