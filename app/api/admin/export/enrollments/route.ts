import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { assertAdmin, csvResponse, faDate } from "@/lib/csv";
import { labels } from "@/lib/utils";

export async function GET(req: NextRequest) {
  if (!(await assertAdmin())) return new Response("Forbidden", { status: 403 });
  const programId = req.nextUrl.searchParams.get("programId");
  const rows = await db.enrollment.findMany({
    where: programId ? { programId } : {},
    include: { user: true, program: { include: { sport: true } } },
    orderBy: [{ programId: "asc" }, { createdAt: "asc" }],
  });
  return csvResponse(
    "enrollments",
    ["کلاس", "رشته", "نام", "نام خانوادگی", "کد ملی", "کد پرسنلی", "موبایل", "شرکت", "شهر", "وضعیت", "تاریخ درخواست"],
    rows.map((e) => [
      e.program.title, e.program.sport.name, e.user.firstName, e.user.lastName, e.user.nationalCode, e.user.personnelCode,
      e.user.mobile, e.user.company, e.user.city, labels.enrollmentStatus[e.status], faDate(e.createdAt),
    ]),
  );
}
