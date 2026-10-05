import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { ProgramTable } from "@/components/program-table";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "جدول برنامه‌ها" };

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ city?: string }> }) {
  const { city } = await searchParams;
  const all = await db.program.findMany({
    where: { isOpen: true },
    include: { sport: true },
    orderBy: [{ sport: { order: "asc" } }, { startTime: "asc" }],
  });
  const cities = [...new Set(all.map((p) => p.city))];
  const programs = city ? all.filter((p) => p.city === city) : all;

  return (
    <>
      <PageHero kicker="جدول برنامه‌ها" title="برنامه کلاس‌ها و تمرینات" subtitle="روز، ساعت و محل برگزاری کلاس‌های ورزشی باشگاه. برای ثبت‌نام وارد پنل کاربری شوید." />
      <section className="container-x mt-10">
        {cities.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {[undefined, ...cities].map((c) => (
              <Link
                key={c ?? "all"}
                href={c ? `/schedule?city=${encodeURIComponent(c)}` : "/schedule"}
                className={cn("rounded-full px-5 py-2 text-sm font-bold", city === c ? "bg-navy-800 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-navy-300")}
              >
                {c ?? "همه شهرها"}
              </Link>
            ))}
          </div>
        )}
        {programs.length ? (
          <ProgramTable programs={programs} showSport />
        ) : (
          <p className="card p-8 text-center text-slate-500">برنامه‌ای برای نمایش وجود ندارد.</p>
        )}
      </section>
    </>
  );
}
