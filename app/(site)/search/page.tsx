import Link from "next/link";
import { CalendarDays, Newspaper, Search, Trophy } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { db } from "@/lib/db";
import { fa, formatDate } from "@/lib/utils";

export const metadata = { title: "جستجو" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 80);
  const [sports, programs, news] = q
    ? await Promise.all([
        db.sport.findMany({ where: { active: true, OR: [{ name: { contains: q } }, { summary: { contains: q } }] }, take: 10 }),
        db.program.findMany({ where: { isOpen: true, OR: [{ title: { contains: q } }, { location: { contains: q } }, { coach: { contains: q } }] }, take: 10 }),
        db.news.findMany({ where: { published: true, OR: [{ title: { contains: q } }, { summary: { contains: q } }, { body: { contains: q } }] }, orderBy: { createdAt: "desc" }, take: 10 }),
      ])
    : [[], [], []];
  const total = sports.length + programs.length + news.length;

  return (
    <>
      <PageHero kicker="جستجو" title="جستجو در سایت" />
      <section className="container-x mt-10 max-w-3xl">
        <form className="relative">
          <Search className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input name="q" defaultValue={q} autoFocus placeholder="نام رشته، کلاس یا عنوان خبر..." className="input py-3.5 pr-12 text-base" />
        </form>
        {q && <p className="mt-4 text-sm text-slate-500">{total ? `${fa(total)} نتیجه برای «${q}»` : `نتیجه‌ای برای «${q}» پیدا نشد.`}</p>}
        <div className="mt-6 grid gap-3">
          {sports.map((s) => (
            <Link key={s.id} href={`/sports/${s.slug}`} className="card flex items-center gap-3 p-4 hover:border-navy-200">
              <Trophy className="size-5 text-navy-600" /><span className="font-bold">{s.name}</span><span className="text-xs text-slate-400">رشته ورزشی</span>
            </Link>
          ))}
          {programs.map((p) => (
            <Link key={p.id} href={`/panel/programs#${p.id}`} className="card flex items-center gap-3 p-4 hover:border-navy-200">
              <CalendarDays className="size-5 text-navy-600" /><span className="font-bold">{p.title}</span><span className="text-xs text-slate-400">کلاس — {p.days}</span>
            </Link>
          ))}
          {news.map((n) => (
            <Link key={n.id} href={`/news/${n.slug}`} className="card flex items-center gap-3 p-4 hover:border-navy-200">
              <Newspaper className="size-5 text-navy-600" /><span className="font-bold">{n.title}</span><span className="text-xs text-slate-400">{formatDate(n.createdAt)}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
