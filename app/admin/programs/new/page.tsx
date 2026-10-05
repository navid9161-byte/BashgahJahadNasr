import { PageTitle } from "@/components/dashboard-shell";
import { ProgramForm } from "@/components/forms/program-form";
import { db } from "@/lib/db";

export default async function NewProgram() {
  const sports = await db.sport.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } });
  return (
    <>
      <PageTitle title="تعریف کلاس جدید" />
      <ProgramForm sports={sports} />
    </>
  );
}
