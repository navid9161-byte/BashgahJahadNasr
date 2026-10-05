import { messageAction } from "@/app/actions/admin";
import { Badge } from "@/components/badge";
import { PageTitle } from "@/components/dashboard-shell";
import { ConfirmButton } from "@/components/ui";
import { db } from "@/lib/db";
import { fa, formatDate } from "@/lib/utils";

export const metadata = { title: "پیام‌های تماس" };

export default async function MessagesAdmin() {
  const messages = await db.contactMessage.findMany({ orderBy: [{ read: "asc" }, { createdAt: "desc" }] });
  return (
    <>
      <PageTitle title="پیام‌های تماس با ما" />
      <div className="grid gap-4">
        {messages.map((m) => (
          <div key={m.id} className={`card p-5 ${m.read ? "opacity-75" : "border-r-4 border-r-brand-yellow"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-black text-navy-900">{m.subject} {!m.read && <Badge tone="PENDING">جدید</Badge>}</p>
                <p className="mt-1 text-sm text-slate-500">{m.name} — <a href={`tel:${m.phone}`} dir="ltr" className="text-navy-600">{fa(m.phone)}</a> — {formatDate(m.createdAt, true)}</p>
              </div>
              <div className="flex gap-1">
                <form action={messageAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="op" value={m.read ? "unread" : "read"} />
                  <button className="btn-outline btn-sm">{m.read ? "علامت نخوانده" : "خوانده شد"}</button>
                </form>
                <form action={messageAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="op" value="delete" />
                  <ConfirmButton message="این پیام حذف شود؟" className="btn-ghost btn-sm text-rose-600">حذف</ConfirmButton>
                </form>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{m.body}</p>
          </div>
        ))}
        {!messages.length && <p className="card p-8 text-center text-slate-500">پیامی وجود ندارد.</p>}
      </div>
    </>
  );
}
