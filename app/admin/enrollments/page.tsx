import Link from "next/link";
import { Download } from "lucide-react";
import { PageTitle } from "@/components/dashboard-shell";
import { EnrollmentTable } from "@/components/enrollment-table";
import { db } from "@/lib/db";
import { cn, labels } from "@/lib/utils";

export const metadata = { title: "درخواست‌های ثبت‌نام" };

export default async function EnrollmentsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "PENDING" } = await searchParams;
  const rows = await db.enrollment.findMany({
    where: status === "ALL" ? {} : { status },
    include: { user: true, program: true },
    orderBy: { createdAt: "desc" },
    take: 300,
  });
  return (
    <>
      <PageTitle title="درخواست‌های ثبت‌نام کلاس" actions={<a href="/api/admin/export/enrollments" className="btn-outline"><Download className="size-4" /> خروجی اکسل</a>} />
      <div className="mb-4 flex flex-wrap gap-2">
        {["PENDING", "APPROVED", "REJECTED", "CANCELLED", "ALL"].map((s) => (
          <Link key={s} href={`?status=${s}`} className={cn("rounded-full px-4 py-2 text-sm font-bold", status === s ? "bg-navy-800 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200")}>
            {s === "ALL" ? "همه" : labels.enrollmentStatus[s]}
          </Link>
        ))}
      </div>
      <EnrollmentTable rows={rows} />
    </>
  );
}
