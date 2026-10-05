"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, destroySession, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveImage } from "@/lib/upload";
import { isValidNationalCode, toEnDigits } from "@/lib/utils";
import { readProfile } from "@/lib/profile";
import type { FormState } from "@/components/ui";

// محدودیت ساده تلاش ورود (در حافظه)
const attempts = new Map<string, { count: number; until: number }>();
function tooMany(key: string) {
  const rec = attempts.get(key);
  return !!rec && rec.count >= 8 && rec.until > Date.now();
}
function fail(key: string) {
  const rec = attempts.get(key);
  const fresh = !rec || rec.until < Date.now();
  attempts.set(key, { count: fresh ? 1 : rec.count + 1, until: Date.now() + 15 * 60 * 1000 });
}

function safeNext(next: FormDataEntryValue | null, fallback: string) {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/") && !n.startsWith("//") ? n : fallback;
}

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const identifier = toEnDigits(String(formData.get("username") ?? "")).trim();
  const password = String(formData.get("password") ?? "");
  if (!identifier || !password) return { error: "نام کاربری و رمز عبور را وارد کنید" };

  const key = identifier.toLowerCase();
  if (tooMany(key)) return { error: "تعداد تلاش‌های ناموفق زیاد است. ۱۵ دقیقه دیگر دوباره تلاش کنید." };

  const user = await db.user.findFirst({
    where: { OR: [{ username: identifier }, { personnelCode: identifier }] },
  });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    fail(key);
    return { error: "نام کاربری یا رمز عبور اشتباه است" };
  }
  if (user.status === "SUSPENDED") return { error: "حساب کاربری شما غیرفعال شده است. با باشگاه تماس بگیرید." };

  attempts.delete(key);
  await createSession(user.id, user.role, formData.get("remember") === "on");
  redirect(safeNext(formData.get("next"), user.role === "ADMIN" ? "/admin" : "/panel"));
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function registerAction(_: FormState, formData: FormData): Promise<FormState> {
  const nationalCode = toEnDigits(String(formData.get("nationalCode") ?? "")).trim();
  const personnelCode = toEnDigits(String(formData.get("personnelCode") ?? "")).trim();
  const password = String(formData.get("password") ?? "");
  const password2 = String(formData.get("password2") ?? "");

  if (!isValidNationalCode(nationalCode)) return { error: "کد ملی وارد شده معتبر نیست" };
  if (!/^\d{3,12}$/.test(personnelCode)) return { error: "کد پرسنلی را به صورت عددی وارد کنید" };
  if (password.length < 8) return { error: "رمز عبور باید حداقل ۸ کاراکتر باشد" };
  if (password !== password2) return { error: "رمز عبور و تکرار آن یکسان نیستند" };
  if (formData.get("agree") !== "on") return { error: "لطفاً صحت اطلاعات و قوانین باشگاه را تأیید کنید" };

  const { parsed, interests } = readProfile(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "اطلاعات فرم نامعتبر است" };

  const exists = await db.user.findFirst({
    where: { OR: [{ username: nationalCode }, { nationalCode }, { personnelCode }] },
    select: { nationalCode: true },
  });
  if (exists) {
    return {
      error: exists.nationalCode === nationalCode
        ? "با این کد ملی قبلاً ثبت‌نام شده است. از بخش ورود وارد شوید."
        : "این کد پرسنلی قبلاً ثبت شده است.",
    };
  }

  let photo: string | null = null;
  try {
    photo = await saveImage(formData.get("photo"), "members");
  } catch (e) {
    return { error: (e as Error).message };
  }

  const user = await db.user.create({
    data: {
      ...parsed.data,
      username: nationalCode,
      nationalCode,
      personnelCode,
      interests: JSON.stringify(interests),
      photo,
      passwordHash: await bcrypt.hash(password, 10),
      role: "MEMBER",
      status: "PENDING",
    },
  });

  await createSession(user.id, user.role, true);
  redirect("/panel?welcome=1");
}

export async function changePasswordAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("password") ?? "");
  if (!(await bcrypt.compare(current, user.passwordHash))) return { error: "رمز عبور فعلی اشتباه است" };
  if (next.length < 8) return { error: "رمز عبور جدید باید حداقل ۸ کاراکتر باشد" };
  if (next !== formData.get("password2")) return { error: "رمز عبور جدید و تکرار آن یکسان نیستند" };
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  return { ok: true, message: "رمز عبور با موفقیت تغییر کرد" };
}
