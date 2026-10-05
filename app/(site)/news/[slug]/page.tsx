import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Badge } from "@/components/badge";
import { db } from "@/lib/db";
import { formatDate, labels } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function load(slug: string) {
  const n = await db.news.findUnique({ where: { slug: decodeURIComponent(slug) } });
  return n?.published ? n : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const n = await load((await params).slug);
  return { title: n?.title ?? "خبر", description: n?.summary };
}

export default async function NewsItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const n = await load((await params).slug);
  if (!n) notFound();
  const others = await db.news.findMany({ where: { published: true, NOT: { id: n.id } }, orderBy: { createdAt: "desc" }, take: 4 });

  return (
    <div className="container-x mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
      <article>
        <Link href="/news" className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-navy-600"><ArrowRight className="size-4" /> بازگشت به اخبار</Link>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Badge>{labels.newsCategory[n.category]}</Badge>
          <span className="flex items-center gap-1"><CalendarDays className="size-4" /> {formatDate(n.createdAt)}</span>
        </div>
        <h1 className="mt-4 text-3xl font-black leading-[1.6] text-navy-900">{n.title}</h1>
        {n.summary && <p className="mt-4 border-r-4 border-brand-yellow pr-4 text-lg leading-8 text-slate-600">{n.summary}</p>}
        {n.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={n.cover} alt="" className="mt-8 w-full rounded-3xl object-cover shadow-lg" />
        )}
        <div className="prose-fa mt-8 text-justify text-[1.05rem]">
          {n.body.split(/\n+/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </article>
      {others.length > 0 && (
        <aside className="h-fit lg:sticky lg:top-28">
          <h2 className="mb-4 font-black text-navy-900">سایر اخبار</h2>
          <div className="grid gap-3">
            {others.map((o) => (
              <Link key={o.id} href={`/news/${o.slug}`} className="card p-4 transition hover:border-navy-200">
                <p className="text-xs text-slate-400">{formatDate(o.createdAt)}</p>
                <p className="mt-1 line-clamp-2 text-sm font-bold leading-6 text-slate-800">{o.title}</p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
