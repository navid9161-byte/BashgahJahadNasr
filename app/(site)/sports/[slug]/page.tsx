import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ProgramTable } from "@/components/program-table";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const sport = await db.sport.findUnique({ where: { slug: decodeURIComponent((await params).slug) } });
  return { title: sport?.name ?? "رشته ورزشی" };
}

export default async function SportPage({ params }: { params: Promise<{ slug: string }> }) {
  const sport = await db.sport.findUnique({
    where: { slug: decodeURIComponent((await params).slug) },
    include: { programs: { where: { isOpen: true }, include: { sport: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!sport || !sport.active) notFound();

  return (
    <>
      <PageHero kicker="رشته‌های ورزشی" title={sport.name} subtitle={sport.summary} />
      <section className="container-x mt-12 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          {sport.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sport.image} alt={sport.name} className="mb-8 aspect-video w-full rounded-3xl object-cover shadow-lg" />
          )}
          <div className="prose-fa">
            {sport.description.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <h2 className="mb-5 mt-10 text-xl font-black text-navy-900">کلاس‌ها و برنامه‌های {sport.name}</h2>
          {sport.programs.length ? (
            <ProgramTable programs={sport.programs} />
          ) : (
            <p className="card p-6 text-slate-500">در حال حاضر کلاس فعالی برای این رشته ثبت نشده است.</p>
          )}
        </div>
        <aside className="card h-fit p-6">
          <h3 className="font-black text-navy-900">ثبت‌نام در کلاس‌ها</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">ثبت‌نام در کلاس‌ها ویژه پرسنل عضو باشگاه است. ابتدا در سامانه عضو شوید و پس از تأیید، از پنل کاربری ثبت‌نام کنید.</p>
          <Link href="/panel/programs" className="btn-primary mt-4 w-full">ثبت‌نام آنلاین</Link>
          <Link href="/register" className="btn-outline mt-2 w-full">عضویت در باشگاه</Link>
        </aside>
      </section>
    </>
  );
}
