import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { assertAdmin, csvResponse, faDate } from "@/lib/csv";
import { memberWhere } from "@/lib/member-filter";
import { labels, parseJsonArray } from "@/lib/utils";

export async function GET(req: NextRequest) {
  if (!(await assertAdmin())) return new Response("Forbidden", { status: 403 });
  const sp = Object.fromEntries(req.nextUrl.searchParams);
  const [users, sports] = await Promise.all([
    db.user.findMany({ where: memberWhere(sp), orderBy: { createdAt: "desc" } }),
    db.sport.findMany({ select: { id: true, name: true } }),
  ]);
  const sportName = new Map(sports.map((s) => [s.id, s.name]));
  return csvResponse(
    "members",
    ["نام", "نام خانوادگی", "نام پدر", "کد ملی", "کد پرسنلی", "موبایل", "تاریخ تولد", "جنسیت", "وضعیت تأهل", "شرکت", "واحد", "سمت", "نوع استخدام", "شهر", "تحصیلات", "گروه خونی", "قد", "وزن", "سوابق پزشکی", "سوابق ورزشی", "رشته‌های مورد علاقه", "تماس اضطراری", "تلفن اضطراری", "نشانی", "وضعیت عضویت", "تاریخ ثبت‌نام"],
    users.map((u) => [
      u.firstName, u.lastName, u.fatherName, u.nationalCode, u.personnelCode, u.mobile, u.birthDate,
      u.gender ? labels.genderPerson[u.gender] : "", u.maritalStatus === "MARRIED" ? "متأهل" : u.maritalStatus === "SINGLE" ? "مجرد" : "",
      u.company, u.department, u.jobTitle, u.employmentType, u.city, u.education, u.bloodType, u.height, u.weight,
      u.medicalNotes, u.sportHistory, parseJsonArray(u.interests).map((id) => sportName.get(id)).filter(Boolean).join("، "),
      u.emergencyName, u.emergencyPhone, u.address, labels.userStatus[u.status], faDate(u.createdAt),
    ]),
  );
}
