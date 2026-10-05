import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download, Trash2 } from "lucide-react";
import { deleteProgramAction } from "@/app/actions/admin";
import { PageTitle } from "@/components/dashboard-shell";
import { EnrollmentTable } from "@/components/enrollment-table";
import { ProgramForm } from "@/components/forms/program-form";
import { ConfirmButton } from "@/components/ui";
import { db } from "@/lib/db";

export default async function EditProgram({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const [program, sports] = await Promise.all([
    db.program.findUnique({ where: { id }, include: { enrollments: { include: { user: true, program: true }, orderBy: { createdAt: "desc" } } } }),
    db.sport.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!program) notFound();
  const { enrollments, ...rest } = program;
  return (
    <>
      <Link href="/admin/programs" className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-navy-600"><ArrowRight className="size-4" /> بازگشت</Link>
      <PageTitle title={program.title} actions={<a href={`/api/admin/export/enrollments?programId=${program.id}`} className="btn-outline"><Download className="size-4" /> خروجی اکسل ثبت‌نام‌ها</a>} />
      <h2 className="mb-3 font-black text-navy-900">ثبت‌نام‌شدگان</h2>
      <EnrollmentTable rows={enrollments} showProgram={false} />
      <h2 className="mb-3 mt-8 font-black text-navy-900">ویرایش کلاس</h2>
      <ProgramForm program={rest} sports={sports} />
      <form action={deleteProgramAction} className="mt-8 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-5">
        <input type="hidden" name="id" value={program.id} />
        <p className="text-sm text-rose-800">حذف کلاس همراه با همه ثبت‌نام‌های آن. برای توقف ثبت‌نام، کافی است تیک «ثبت‌نام باز است» را بردارید.</p>
        <ConfirmButton message="این کلاس و همه ثبت‌نام‌هایش حذف شود؟"><Trash2 className="size-4" /> حذف</ConfirmButton>
      </form>
    </>
  );
}
