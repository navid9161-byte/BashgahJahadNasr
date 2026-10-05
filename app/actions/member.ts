"use server";

import { revalidatePath } from "next/cache";
import { requireActiveMember, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { readProfile } from "@/lib/profile";
import { removeUpload, saveImage } from "@/lib/upload";
import { parseJsonArray } from "@/lib/utils";
import type { FormState } from "@/components/ui";

export async function updateProfileAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const { parsed, interests } = readProfile(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" };
  let photo: string | null = null;
  try {
    photo = await saveImage(formData.get("photo"), "members");
  } catch (e) {
    return { error: (e as Error).message };
  }
  if (photo) await removeUpload(user.photo);
  await db.user.update({
    where: { id: user.id },
    data: { ...parsed.data, interests: JSON.stringify(interests), ...(photo ? { photo } : {}) },
  });
  revalidatePath("/panel", "layout");
  return { ok: true, message: "اطلاعات شما با موفقیت به‌روزرسانی شد" };
}

export async function enrollAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireActiveMember();
  const programId = String(formData.get("programId"));
  const program = await db.program.findUnique({
    where: { id: programId },
    include: { _count: { select: { enrollments: { where: { status: { in: ["PENDING", "APPROVED"] } } } } } },
  });
  if (!program || !program.isOpen) return { error: "ثبت‌نام این کلاس بسته است" };
  if (program.gender !== "ALL" && user.gender && program.gender !== user.gender) {
    return { error: "این کلاس ویژه " + (program.gender === "MALE" ? "آقایان" : "بانوان") + " است" };
  }
  const existing = await db.enrollment.findUnique({ where: { userId_programId: { userId: user.id, programId } } });
  if (existing && existing.status !== "CANCELLED" && existing.status !== "REJECTED") {
    return { error: "شما قبلاً در این کلاس ثبت‌نام کرده‌اید" };
  }
  if (program._count.enrollments >= program.capacity) return { error: "ظرفیت این کلاس تکمیل شده است" };

  await db.enrollment.upsert({
    where: { userId_programId: { userId: user.id, programId } },
    update: { status: "PENDING", note: null, createdAt: new Date() },
    create: { userId: user.id, programId },
  });
  revalidatePath("/panel");
  revalidatePath("/panel/programs");
  return { ok: true, message: "درخواست ثبت‌نام شما ثبت شد و پس از بررسی تأیید می‌شود" };
}

export async function cancelEnrollmentAction(formData: FormData) {
  const user = await requireUser();
  await db.enrollment.updateMany({
    where: { id: String(formData.get("id")), userId: user.id, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/panel/programs");
  revalidatePath("/panel");
}

export async function submitSurveyAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireActiveMember();
  const surveyId = String(formData.get("surveyId"));
  const survey = await db.survey.findUnique({ where: { id: surveyId }, include: { questions: true } });
  if (!survey || !survey.isActive) return { error: "این نظرسنجی فعال نیست" };
  if (await db.surveyResponse.findUnique({ where: { surveyId_userId: { surveyId, userId: user.id } } })) {
    return { error: "شما قبلاً در این نظرسنجی شرکت کرده‌اید" };
  }

  const answers: { questionId: string; value: string }[] = [];
  for (const q of survey.questions) {
    const key = `q_${q.id}`;
    const options = parseJsonArray(q.options);
    let value: string | null = null;
    if (q.type === "MULTI") {
      const picked = formData.getAll(key).map(String).filter((v) => options.includes(v));
      if (picked.length) value = JSON.stringify(picked);
    } else {
      const v = String(formData.get(key) ?? "").trim();
      if (q.type === "SINGLE" && v && !options.includes(v)) return { error: "پاسخ نامعتبر" };
      if (q.type === "RATING" && v && !["1", "2", "3", "4", "5"].includes(v)) return { error: "پاسخ نامعتبر" };
      if (v) value = v.slice(0, 2000);
    }
    if (!value && q.required) return { error: `لطفاً به سؤال «${q.text}» پاسخ دهید` };
    if (value) answers.push({ questionId: q.id, value });
  }

  await db.surveyResponse.create({ data: { surveyId, userId: user.id, answers: { create: answers } } });
  revalidatePath("/panel/surveys");
  return { ok: true, message: "پاسخ‌های شما با موفقیت ثبت شد. از مشارکت شما سپاسگزاریم!" };
}
