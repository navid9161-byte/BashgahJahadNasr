import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteNewsAction } from "@/app/actions/admin";
import { PageTitle } from "@/components/dashboard-shell";
import { NewsForm } from "@/components/forms/news-form";
import { ConfirmButton } from "@/components/ui";
import { db } from "@/lib/db";

export default async function EditNews({ params }: { params: Promise<{ id: string }> }) {
  const news = await db.news.findUnique({ where: { id: (await params).id } });
  if (!news) notFound();
  return (
    <>
      <PageTitle title="ویرایش خبر" />
      {news.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={news.cover} alt="" className="mb-4 h-40 rounded-2xl object-cover" />
      )}
      <NewsForm news={news} />
      <form action={deleteNewsAction} className="mt-8 flex justify-end">
        <input type="hidden" name="id" value={news.id} />
        <ConfirmButton message="این خبر حذف شود؟"><Trash2 className="size-4" /> حذف خبر</ConfirmButton>
      </form>
    </>
  );
}
