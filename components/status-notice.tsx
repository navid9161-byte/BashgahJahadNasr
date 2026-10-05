import { AlertTriangle, Clock, XCircle } from "lucide-react";

export function MembershipNotice({ status, note }: { status: string; note?: string | null }) {
  if (status === "ACTIVE") return null;
  const map = {
    PENDING: { icon: Clock, cls: "bg-amber-50 text-amber-900 ring-amber-200", title: "عضویت شما در انتظار تأیید است", text: "اطلاعات شما ثبت شد و پس از بررسی توسط مدیر باشگاه، امکان ثبت‌نام در کلاس‌ها و شرکت در نظرسنجی‌ها فعال می‌شود." },
    REJECTED: { icon: XCircle, cls: "bg-rose-50 text-rose-900 ring-rose-200", title: "درخواست عضویت شما تأیید نشد", text: "لطفاً اطلاعات خود را اصلاح کنید یا با باشگاه تماس بگیرید." },
    SUSPENDED: { icon: AlertTriangle, cls: "bg-slate-100 text-slate-800 ring-slate-200", title: "عضویت شما معلق است", text: "برای اطلاعات بیشتر با باشگاه تماس بگیرید." },
  }[status];
  if (!map) return null;
  const Icon = map.icon;
  return (
    <div className={`mb-6 flex gap-4 rounded-2xl p-5 ring-1 ${map.cls}`}>
      <Icon className="size-7 shrink-0" />
      <div>
        <p className="font-black">{map.title}</p>
        <p className="mt-1 text-sm leading-7 opacity-90">{map.text}</p>
        {note && <p className="mt-2 text-sm font-bold">توضیح مدیر: {note}</p>}
      </div>
    </div>
  );
}
