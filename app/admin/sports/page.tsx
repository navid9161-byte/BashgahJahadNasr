import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/badge";
import { PageTitle } from "@/components/dashboard-shell";
import { SportIcon } from "@/components/sport-icon";
import { db } from "@/lib/db";
import { fa } from "@/lib/utils";

export const metadata = { title: "رشته‌های ورزشی" };

export default async function SportsAdmin() {
  const sports = await db.sport.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { programs: true } } } });
  return (
    <>
      <PageTitle title="رشته‌های ورزشی" actions={<Link href="/admin/sports/new" className="btn-primary"><Plus className="size-4" /> رشته جدید</Link>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sports.map((s) => (
          <Link key={s.id} href={`/admin/sports/${s.id}`} className="card flex items-center gap-4 p-4 transition hover:shadow-md">
            <span className="grid size-12 place-items-center rounded-xl bg-navy-800 text-brand-yellow"><SportIcon name={s.icon} className="size-6" /></span>
            <div className="flex-1">
              <p className="font-black text-navy-900">{s.name}</p>
              <p className="text-xs text-slate-500">{fa(s._count.programs)} کلاس — ترتیب {fa(s.order)}</p>
            </div>
            {!s.active && <Badge tone="CANCELLED">مخفی</Badge>}
          </Link>
        ))}
      </div>
    </>
  );
}
