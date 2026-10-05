import { db } from "@/lib/db";
import { assertAdmin, csvResponse, faDate } from "@/lib/csv";
import { parseJsonArray } from "@/lib/utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await assertAdmin())) return new Response("Forbidden", { status: 403 });
  const survey = await db.survey.findUnique({
    where: { id: (await params).id },
    include: {
      questions: { orderBy: { order: "asc" } },
      responses: { include: { user: true, answers: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!survey) return new Response("Not found", { status: 404 });
  return csvResponse(
    "survey-results",
    ["نام", "نام خانوادگی", "کد پرسنلی", "شرکت", "شهر", "تاریخ پاسخ", ...survey.questions.map((q) => q.text)],
    survey.responses.map((r) => {
      const byQ = new Map(r.answers.map((a) => [a.questionId, a.value]));
      return [
        r.user.firstName, r.user.lastName, r.user.personnelCode, r.user.company, r.user.city, faDate(r.createdAt),
        ...survey.questions.map((q) => {
          const v = byQ.get(q.id) ?? "";
          return q.type === "MULTI" ? parseJsonArray(v).join("، ") : v;
        }),
      ];
    }),
  );
}
