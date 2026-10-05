const faDigits = "۰۱۲۳۴۵۶۷۸۹";

/** تبدیل ارقام لاتین به فارسی */
export function fa(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\d/g, (d) => faDigits[Number(d)]);
}

/** تبدیل ارقام فارسی و عربی به لاتین (برای ورودی‌ها) */
export function toEnDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(faDigits.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(n);
}

export function formatDate(date: Date, withTime = false): string {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Asia/Tehran",
  }).format(date);
}

export function formatPrice(toman: number): string {
  return toman > 0 ? `${formatNumber(toman)} تومان` : "رایگان";
}

/** اعتبارسنجی کد ملی ایران */
export function isValidNationalCode(code: string): boolean {
  if (!/^\d{10}$/.test(code)) return false;
  if (/^(\d)\1{9}$/.test(code)) return false;
  const check = Number(code[9]);
  const sum = code
    .slice(0, 9)
    .split("")
    .reduce((acc, d, i) => acc + Number(d) * (10 - i), 0);
  const r = sum % 11;
  return r < 2 ? check === r : check === 11 - r;
}

export function slugify(text: string): string {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || Date.now().toString(36)
  );
}

export function parseJsonArray(value: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const labels = {
  userStatus: {
    PENDING: "در انتظار تأیید",
    ACTIVE: "فعال",
    REJECTED: "رد شده",
    SUSPENDED: "تعلیق",
  } as Record<string, string>,
  enrollmentStatus: {
    PENDING: "در انتظار بررسی",
    APPROVED: "تأیید شده",
    REJECTED: "رد شده",
    CANCELLED: "لغو شده",
  } as Record<string, string>,
  gender: { MALE: "آقایان", FEMALE: "بانوان", ALL: "آقایان و بانوان" } as Record<string, string>,
  genderPerson: { MALE: "مرد", FEMALE: "زن" } as Record<string, string>,
  surveyKind: { POLL: "نظرسنجی", NEEDS: "نیازسنجی ورزشی" } as Record<string, string>,
  questionType: {
    SINGLE: "تک‌گزینه‌ای",
    MULTI: "چندگزینه‌ای",
    RATING: "امتیازدهی (۱ تا ۵)",
    TEXT: "پاسخ تشریحی",
  } as Record<string, string>,
  newsCategory: { NEWS: "خبر", NOTICE: "اطلاعیه" } as Record<string, string>,
};

export const statusTone: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  ACTIVE: "bg-emerald-100 text-emerald-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800",
  SUSPENDED: "bg-slate-200 text-slate-700",
  CANCELLED: "bg-slate-200 text-slate-700",
};
