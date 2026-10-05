import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/badge";
import { PageTitle } from "@/components/dashboard-shell";
import { db } from "@/lib/db";
import { formatDate, labels } from "@/lib/utils";

export const metadata = { title: "اخبار و اطلاعیه‌ها" };

export default async function NewsAdmin() {
  const news = await db.news.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageTitle title="اخبار و اطلاعیه‌ها" actions={<Link href="/admin/news/new" className="btn-primary"><Plus className="size-4" /> خبر جدید</Link>} />
      <div className="card overflow-x-auto">
        <table className="table-x">
          <thead><tr><th>عنوان</th><th>نوع</th><th>تاریخ</th><th>وضعیت</th><th /></tr></thead>
          <tbody>
            {news.map((n) => (
              <tr key={n.id}>
                <td className="font-bold text-navy-900">{n.title}</td>
                <td>{labels.newsCategory[n.category]}</td>
                <td className="whitespace-nowrap">{formatDate(n.createdAt)}</td>
                <td>{n.published ? <Badge tone="ACTIVE">منتشر شده</Badge> : <Badge tone="CANCELLED">پیش‌نویس</Badge>}</td>
                <td><div className="flex gap-1"><Link href={`/admin/news/${n.id}`} className="btn-outline btn-sm">ویرایش</Link>{n.published && <Link href={`/news/${n.slug}`} target="_blank" className="btn-ghost btn-sm">مشاهده</Link>}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!news.length && <p className="p-8 text-center text-slate-500">خبری ثبت نشده است.</p>}
      </div>
    </>
  );
}
