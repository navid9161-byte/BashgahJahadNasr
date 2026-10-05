import { z } from "zod";
import { toEnDigits } from "./utils";

const optional = z.string().trim().optional().transform((v) => v || null);
const optionalInt = z
  .string()
  .optional()
  .transform((v) => (v ? Number(toEnDigits(v)) : null))
  .refine((v) => v === null || (Number.isInteger(v) && v > 0 && v < 300), "مقدار عددی نامعتبر است");

export const profileSchema = z.object({
  firstName: z.string().trim().min(2, "نام را وارد کنید"),
  lastName: z.string().trim().min(2, "نام خانوادگی را وارد کنید"),
  fatherName: optional,
  mobile: z
    .string()
    .transform((v) => toEnDigits(v).trim())
    .refine((v) => /^09\d{9}$/.test(v), "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود"),
  birthDate: z
    .string()
    .transform((v) => toEnDigits(v).trim())
    .refine((v) => /^1[34]\d{2}\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])$/.test(v), "تاریخ تولد را به شکل ۱۳۷۰/۰۵/۱۲ وارد کنید"),
  gender: z.enum(["MALE", "FEMALE"], { message: "جنسیت را انتخاب کنید" }),
  maritalStatus: z.preprocess((v) => v || null, z.enum(["SINGLE", "MARRIED"]).nullable()),
  company: z.string().trim().min(2, "شرکت محل خدمت را وارد کنید"),
  department: optional,
  jobTitle: optional,
  employmentType: optional,
  city: z.string().trim().min(2, "محل خدمت را انتخاب کنید"),
  education: optional,
  bloodType: optional,
  height: optionalInt,
  weight: optionalInt,
  medicalNotes: optional,
  sportHistory: optional,
  emergencyName: optional,
  emergencyPhone: z.string().optional().transform((v) => (v ? toEnDigits(v).trim() : null)),
  address: optional,
});

export function readProfile(formData: FormData) {
  const raw = Object.fromEntries(
    Object.keys(profileSchema.shape).map((k) => [k, formData.get(k) ?? undefined]),
  );
  const parsed = profileSchema.safeParse(raw);
  const interests = formData.getAll("interests").map(String);
  return { parsed, interests };
}

/** فقط فیلدهای قابل ویرایش پروفایل (بدون رمز و اطلاعات حساس) برای ارسال به فرم سمت کاربر */
export function profileValues(user: Record<string, unknown>) {
  const out: Record<string, string | number | null> = {};
  for (const key of [...Object.keys(profileSchema.shape), "interests"]) {
    const v = user[key];
    out[key] = typeof v === "string" || typeof v === "number" ? v : null;
  }
  return out as Record<string, string | number | null> & { interests?: string };
}
