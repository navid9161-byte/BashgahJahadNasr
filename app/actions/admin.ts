"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { readProfile } from "@/lib/profile";
import { removeUpload, saveImage } from "@/lib/upload";
import { slugify, toEnDigits } from "@/lib/utils";
import type { FormState } from "@/components/ui";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const int = (fd: FormData, key: string, fallback = 0) => {
  const n = parseInt(toEnDigits(str(fd, key)).replace(/[,٬]/g, ""), 10);
  return Number.isFinite(n) ? n : fallback;
};

/* ───────────── پرسنل ───────────── */

const USER_STATUSES = ["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"];

export async function setUserStatusAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status");
  if (!USER_STATUSES.includes(status)) return;
  const note = formData.has("note") ? str(formData, "note") || null : undefined;
  await db.user.update({ where: { id, role: "MEMBER" }, data: { status, ...(note !== undefined ? { adminNote: note } : {}) } });
  revalidatePath("/admin", "layout");
}

export async function adminUpdateMemberAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const { parsed, interests } = readProfile(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" };
  const personnelCode = toEnDigits(str(formData, "personnelCode")) || null;
  if (personnelCode && (await db.user.findFirst({ where: { personnelCode, NOT: { id } } }))) {
    return { error: "این کد پرسنلی برای فرد دیگری ثبت شده است" };
  }
  await db.user.update({ where: { id }, data: { ...parsed.data, personnelCode, interests: JSON.stringify(interests) } });
  revalidatePath(`/admin/members/${id}`);
  return { ok: true, message: "اطلاعات عضو ذخیره شد" };
}

export async function resetPasswordAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const password = str(formData, "password");
  if (password.length < 8) return { error: "رمز عبور باید حداقل ۸ کاراکتر باشد" };
  await db.user.update({ where: { id: str(formData, "id") }, data: { passwordHash: await bcrypt.hash(password, 10) } });
  return { ok: true, message: "رمز عبور جدید تنظیم شد. آن را به عضو اطلاع دهید." };
}

export async function deleteMemberAction(formData: FormData) {
  await requireAdmin();
  const user = await db.user.delete({ where: { id: str(formData, "id"), role: "MEMBER" } });
  await removeUpload(user.photo);
  revalidatePath("/admin/members");
  redirect("/admin/members");
}

/* ───────────── ثبت‌نام کلاس‌ها ───────────── */

export async function setEnrollmentStatusAction(formData: FormData) {
  await requireAdmin();
  const status = str(formData, "status");
  if (!["PENDING", "APPROVED", "REJECTED", "CANCELLED"].includes(status)) return;
  const ids = formData.getAll("id").map(String);
  await db.enrollment.updateMany({
    where: { id: { in: ids } },
    data: { status, ...(formData.has("note") ? { note: str(formData, "note") || null } : {}) },
  });
  revalidatePath("/admin", "layout");
}

/* ───────────── رشته‌ها ───────────── */

export async function saveSportAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const name = str(formData, "name");
  if (!name) return { error: "نام رشته را وارد کنید" };
  const slug = slugify(str(formData, "slug") || name);
  if (await db.sport.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) } })) {
    return { error: "این نامک (آدرس) قبلاً استفاده شده است" };
  }
  let image: string | null = null;
  try {
    image = await saveImage(formData.get("image"), "sports");
  } catch (e) {
    return { error: (e as Error).message };
  }
  const data = {
    name, slug,
    icon: str(formData, "icon") || "trophy",
    summary: str(formData, "summary"),
    description: str(formData, "description"),
    order: int(formData, "order"),
    active: formData.get("active") === "on",
    ...(image ? { image } : {}),
  };
  if (id) {
    const old = await db.sport.findUnique({ where: { id } });
    if (image) await removeUpload(old?.image);
    await db.sport.update({ where: { id }, data });
  } else {
    await db.sport.create({ data });
  }
  revalidatePath("/", "layout");
  redirect("/admin/sports");
}

export async function deleteSportAction(formData: FormData) {
  await requireAdmin();
  const sport = await db.sport.delete({ where: { id: str(formData, "id") } });
  await removeUpload(sport.image);
  revalidatePath("/", "layout");
  redirect("/admin/sports");
}

/* ───────────── کلاس‌ها ───────────── */

export async function saveProgramAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const data = {
    title: str(formData, "title"),
    sportId: str(formData, "sportId"),
    coach: str(formData, "coach") || null,
    gender: ["MALE", "FEMALE", "ALL"].includes(str(formData, "gender")) ? str(formData, "gender") : "ALL",
    days: str(formData, "days"),
    startTime: toEnDigits(str(formData, "startTime")),
    endTime: toEnDigits(str(formData, "endTime")),
    location: str(formData, "location"),
    city: str(formData, "city") || "کرمان",
    capacity: int(formData, "capacity", 20),
    fee: int(formData, "fee"),
    startDate: toEnDigits(str(formData, "startDate")) || null,
    description: str(formData, "description") || null,
    isOpen: formData.get("isOpen") === "on",
  };
  if (!data.title || !data.sportId || !data.days || !data.startTime || !data.endTime || !data.location) {
    return { error: "عنوان، رشته، روزها، ساعت و مکان برگزاری الزامی است" };
  }
  if (id) await db.program.update({ where: { id }, data });
  else await db.program.create({ data });
  revalidatePath("/", "layout");
  redirect("/admin/programs");
}

export async function deleteProgramAction(formData: FormData) {
  await requireAdmin();
  await db.program.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/", "layout");
  redirect("/admin/programs");
}

/* ───────────── اخبار ───────────── */

export async function saveNewsAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const title = str(formData, "title");
  if (!title) return { error: "عنوان خبر را وارد کنید" };
  let slug = slugify(str(formData, "slug") || title);
  if (await db.news.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) } })) slug = `${slug}-${Date.now().toString(36)}`;
  let cover: string | null = null;
  try {
    cover = await saveImage(formData.get("cover"), "news");
  } catch (e) {
    return { error: (e as Error).message };
  }
  const data = {
    title, slug,
    summary: str(formData, "summary"),
    body: str(formData, "body"),
    category: str(formData, "category") === "NOTICE" ? "NOTICE" : "NEWS",
    published: formData.get("published") === "on",
    ...(cover ? { cover } : {}),
  };
  if (id) {
    const old = await db.news.findUnique({ where: { id } });
    if (cover) await removeUpload(old?.cover);
    await db.news.update({ where: { id }, data });
  } else {
    await db.news.create({ data });
  }
  revalidatePath("/", "layout");
  redirect("/admin/news");
}

export async function deleteNewsAction(formData: FormData) {
  await requireAdmin();
  const n = await db.news.delete({ where: { id: str(formData, "id") } });
  await removeUpload(n.cover);
  revalidatePath("/", "layout");
  redirect("/admin/news");
}

/* ───────────── گالری ───────────── */

export async function uploadGalleryAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const files = formData.getAll("images").filter((f) => typeof f !== "string" && f.size > 0);
  if (!files.length) return { error: "حداقل یک تصویر انتخاب کنید" };
  const album = str(formData, "album") || "عمومی";
  const title = str(formData, "title");
  try {
    for (const f of files) {
      const src = await saveImage(f, "gallery");
      if (src) await db.galleryImage.create({ data: { src, album, title } });
    }
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/", "layout");
  return { ok: true, message: `${new Intl.NumberFormat("fa-IR").format(files.length)} تصویر بارگذاری شد` };
}

export async function deleteGalleryAction(formData: FormData) {
  await requireAdmin();
  const img = await db.galleryImage.delete({ where: { id: str(formData, "id") } });
  await removeUpload(img.src);
  revalidatePath("/", "layout");
}

/* ───────────── نظرسنجی ───────────── */

export async function saveSurveyAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const title = str(formData, "title");
  if (!title) return { error: "عنوان را وارد کنید" };
  const data = {
    title,
    description: str(formData, "description"),
    kind: str(formData, "kind") === "NEEDS" ? "NEEDS" : "POLL",
    isActive: formData.get("isActive") === "on",
  };
  if (id) {
    await db.survey.update({ where: { id }, data });
    revalidatePath(`/admin/surveys/${id}`);
    return { ok: true, message: "تغییرات ذخیره شد" };
  }
  const survey = await db.survey.create({ data });
  redirect(`/admin/surveys/${survey.id}`);
}

export async function deleteSurveyAction(formData: FormData) {
  await requireAdmin();
  await db.survey.delete({ where: { id: str(formData, "id") } });
  redirect("/admin/surveys");
}

function readOptions(formData: FormData) {
  return str(formData, "options")
    .split("\n")
    .map((o) => o.trim())
    .filter(Boolean);
}

export async function saveQuestionAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const surveyId = str(formData, "surveyId");
  const type = ["SINGLE", "MULTI", "TEXT", "RATING"].includes(str(formData, "type")) ? str(formData, "type") : "SINGLE";
  const options = readOptions(formData);
  const text = str(formData, "text");
  if (!text) return { error: "متن سؤال را وارد کنید" };
  if ((type === "SINGLE" || type === "MULTI") && options.length < 2) return { error: "حداقل دو گزینه (هر گزینه در یک خط) وارد کنید" };
  const data = {
    text, type,
    options: JSON.stringify(type === "SINGLE" || type === "MULTI" ? options : []),
    required: formData.get("required") === "on",
    order: int(formData, "order"),
  };
  if (id) {
    await db.question.update({ where: { id }, data });
  } else {
    const last = await db.question.findFirst({ where: { surveyId }, orderBy: { order: "desc" } });
    await db.question.create({ data: { ...data, surveyId, order: data.order || (last?.order ?? 0) + 1 } });
  }
  revalidatePath(`/admin/surveys/${surveyId}`);
  return { ok: true, message: id ? "سؤال ذخیره شد" : "سؤال اضافه شد" };
}

export async function deleteQuestionAction(formData: FormData) {
  await requireAdmin();
  const q = await db.question.delete({ where: { id: str(formData, "id") } });
  revalidatePath(`/admin/surveys/${q.surveyId}`);
}

/* ───────────── پیام‌ها ───────────── */

export async function messageAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  if (str(formData, "op") === "delete") await db.contactMessage.delete({ where: { id } });
  else await db.contactMessage.update({ where: { id }, data: { read: str(formData, "op") === "read" } });
  revalidatePath("/admin", "layout");
}
