import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/badge";
import { PageHero } from "@/components/page-hero";
import { db } from "@/lib/db";
import { cn, formatDate, labels } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "اخبار و اطلاعیه‌ها" };

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const news = await db.news.findMany({
    where: { published: true, ...(type === "NEWS" || type === "NOTICE" ? { category: type } : {}) },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <PageHero kicker="اخبار و اطلاعیه‌ها" title="تازه‌ترین اخبار باشگاه" />
      <section className="container-x mt-10">
        <div className="mb-6 flex gap-2">
          {[["", "همه"], ["NEWS", "اخبار"], ["NOTICE", "اطلاعیه‌ها"]].map(([v, l]) => (
            <Link key={v} href={v ? `/news?type=${v}` : "/news"} className={cn("rounded-full px-5 py-2 text-sm font-bold", (type ?? "") === v ? "bg-navy-800 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200")}>
              {l}
            </Link>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <Link key={n.id} href={`/news/${n.slug}`} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative aspect-[16/9] overflow-hidden bg-navy-800">
                {n.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={n.cover} alt="" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="halftone grid size-full place-items-center"><Image src="/images/logo-shield.png" alt="" width={72} height={73} /></div>
                )}
                <Badge className="absolute right-3 top-3 !bg-brand-yellow !text-navy-900">{labels.newsCategory[n.category]}</Badge>
              </div>
              <div className="p-5">
                <p className="text-xs text-slate-400">{formatDate(n.createdAt)}</p>
                <h2 className="mt-2 line-clamp-2 font-black leading-7 text-navy-900">{n.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{n.summary}</p>
              </div>
            </Link>
          ))}
        </div>
        {!news.length && <p className="card p-8 text-center text-slate-500">خبری برای نمایش وجود ندارد.</p>}
      </section>
    </>
  );
}
