import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SportIcon } from "@/components/sport-icon";
import { db } from "@/lib/db";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "رشته‌های ورزشی" };

export default async function SportsPage() {
  const sports = await db.sport.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: { _count: { select: { programs: { where: { isOpen: true } } } } },
  });
  return (
    <>
      <PageHero kicker="رشته‌های ورزشی" title="رشته مورد علاقه‌ات را پیدا کن" subtitle="باشگاه جهاد نصر در رشته‌های متنوع ورزشی برای پرسنل و خانواده‌ها برنامه منظم دارد." />
      <section className="container-x mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sports.map((s) => (
          <Link key={s.id} href={`/sports/${s.slug}`} className="card group flex gap-5 p-6 transition hover:-translate-y-1 hover:border-navy-200 hover:shadow-lg">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-navy-800 text-brand-yellow transition group-hover:bg-brand-yellow group-hover:text-navy-900">
              <SportIcon name={s.icon} className="size-8" />
            </span>
            <div className="flex-1">
              <h2 className="text-lg font-black text-navy-900">{s.name}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">{s.summary}</p>
              <p className="mt-3 flex items-center gap-1 text-sm font-bold text-navy-600">
                {s._count.programs ? `${formatNumber(s._count.programs)} کلاس فعال` : "مشاهده جزئیات"} <ArrowLeft className="size-4" />
              </p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
