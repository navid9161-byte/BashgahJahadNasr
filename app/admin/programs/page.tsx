import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/badge";
import { PageTitle } from "@/components/dashboard-shell";
import { db } from "@/lib/db";
import { fa, formatNumber, formatPrice, labels } from "@/lib/utils";

export const metadata = { title: "کلاس‌ها و برنامه‌ها" };

export default async function ProgramsAdmin() {
  const programs = await db.program.findMany({
    include: {
      sport: true,
      _count: { select: { enrollments: { where: { status: "APPROVED" } } } },
      enrollments: { where: { status: "PENDING" }, select: { id: true } },
    },
    orderBy: [{ isOpen: "desc" }, { createdAt: "desc" }],
  });
  return (
    <>
      <PageTitle title="کلاس‌ها و برنامه‌ها" actions={<Link href="/admin/programs/new" className="btn-primary"><Plus className="size-4" /> کلاس جدید</Link>} />
      <div className="card overflow-x-auto">
        <table className="table-x">
          <thead><tr><th>عنوان</th><th>رشته</th><th>زمان</th><th>مکان</th><th>ویژه</th><th>ظرفیت</th><th>شهریه</th><th>وضعیت</th><th /></tr></thead>
          <tbody>
            {programs.map((p) => (
              <tr key={p.id}>
                <td className="font-bold text-navy-900">{p.title}</td>
                <td>{p.sport.name}</td>
                <td>{p.days}<span className="block text-xs text-slate-400">{fa(p.startTime)} - {fa(p.endTime)}</span></td>
                <td>{p.location}<span className="block text-xs text-slate-400">{p.city}</span></td>
                <td>{labels.gender[p.gender]}</td>
                <td className="whitespace-nowrap">
                  {formatNumber(p._count.enrollments)} / {formatNumber(p.capacity)}
                  {p.enrollments.length > 0 && <Badge tone="PENDING" className="mr-1">{fa(p.enrollments.length)} جدید</Badge>}
                </td>
                <td className="whitespace-nowrap">{formatPrice(p.fee)}</td>
                <td>{p.isOpen ? <Badge tone="ACTIVE">باز</Badge> : <Badge tone="CANCELLED">بسته</Badge>}</td>
                <td><Link href={`/admin/programs/${p.id}`} className="btn-outline btn-sm">مدیریت</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!programs.length && <p className="p-8 text-center text-slate-500">کلاسی تعریف نشده است.</p>}
      </div>
    </>
  );
}
