import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteSportAction } from "@/app/actions/admin";
import { PageTitle } from "@/components/dashboard-shell";
import { SportForm } from "@/components/forms/sport-form";
import { ConfirmButton } from "@/components/ui";
import { db } from "@/lib/db";

export default async function EditSport({ params }: { params: Promise<{ id: string }> }) {
  const sport = await db.sport.findUnique({ where: { id: (await params).id } });
  if (!sport) notFound();
  return (
    <>
      <PageTitle title={`ویرایش ${sport.name}`} />
      <SportForm sport={sport} />
      <form action={deleteSportAction} className="mt-8 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-5">
        <input type="hidden" name="id" value={sport.id} />
        <p className="text-sm text-rose-800">با حذف رشته، همه کلاس‌ها و ثبت‌نام‌های آن نیز حذف می‌شوند. برای پنهان‌کردن، تیک «نمایش در سایت» را بردارید.</p>
        <ConfirmButton message="این رشته و همه کلاس‌هایش حذف شود؟"><Trash2 className="size-4" /> حذف</ConfirmButton>
      </form>
    </>
  );
}
