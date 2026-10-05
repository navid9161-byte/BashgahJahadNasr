import Link from "next/link";
import { Download, Search } from "lucide-react";
import { setUserStatusAction } from "@/app/actions/admin";
import { Badge } from "@/components/badge";
import { PageTitle } from "@/components/dashboard-shell";
import { db } from "@/lib/db";
import { memberWhere, type MemberQuery } from "@/lib/member-filter";
import { cities } from "@/lib/site";
import { cn, fa, formatDate, formatNumber, labels } from "@/lib/utils";

export const metadata = { title: "پرسنل و اعضا" };
const PAGE = 30;

export default async function MembersPage({ searchParams }: { searchParams: Promise<MemberQuery> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const where = memberWhere(sp);
  const [members, total, counts, sports] = await Promise.all([
    db.user.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE }),
    db.user.count({ where }),
    db.user.groupBy({ by: ["status"], where: { role: "MEMBER" }, _count: true }),
    db.sport.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
  ]);
  const countOf = (s?: string) => (s ? counts.find((c) => c.status === s)?._count ?? 0 : counts.reduce((a, c) => a + c._count, 0));
  const qs = (patch: Partial<MemberQuery>) => {
    const params = new URLSearchParams(Object.entries({ ...sp, ...patch }).filter(([, v]) => v) as [string, string][]);
    return `?${params}`;
  };
  const exportQs = new URLSearchParams(Object.entries(sp).filter(([k, v]) => v && k !== "page") as [string, string][]);

  return (
    <>
      <PageTitle
        title="پرسنل و اعضا"
        subtitle={`${formatNumber(total)} نفر`}
        actions={<a href={`/api/admin/export/members?${exportQs}`} className="btn-outline"><Download className="size-4" /> خروجی اکسل</a>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {[undefined, "PENDING", "ACTIVE", "REJECTED", "SUSPENDED"].map((s) => (
          <Link key={s ?? "all"} href={qs({ status: s, page: undefined })} className={cn("rounded-full px-4 py-2 text-sm font-bold", sp.status === s ? "bg-navy-800 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200")}>
            {s ? labels.userStatus[s] : "همه"} <span className="opacity-60">({formatNumber(countOf(s))})</span>
          </Link>
        ))}
      </div>

      <form className="card mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_150px_150px_180px_auto]">
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        <label className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input name="q" defaultValue={sp.q} placeholder="جستجو: نام، کد ملی، کد پرسنلی، موبایل، شرکت..." className="input pr-9" />
        </label>
        <select name="city" defaultValue={sp.city ?? ""} className="input"><option value="">همه شهرها</option>{cities.map((c) => <option key={c}>{c}</option>)}</select>
        <select name="gender" defaultValue={sp.gender ?? ""} className="input"><option value="">همه</option><option value="MALE">مرد</option><option value="FEMALE">زن</option></select>
        <select name="sport" defaultValue={sp.sport ?? ""} className="input"><option value="">علاقه‌مندی: همه رشته‌ها</option>{sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        <button className="btn-primary">فیلتر</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="table-x">
          <thead>
            <tr><th>نام و نام خانوادگی</th><th>کد ملی</th><th>کد پرسنلی</th><th>موبایل</th><th>شرکت / واحد</th><th>شهر</th><th>تاریخ ثبت‌نام</th><th>وضعیت</th><th /></tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td><Link href={`/admin/members/${m.id}`} className="font-bold text-navy-800 hover:underline">{m.firstName} {m.lastName}</Link></td>
                <td>{fa(m.nationalCode)}</td>
                <td>{fa(m.personnelCode)}</td>
                <td dir="ltr" className="text-right">{fa(m.mobile)}</td>
                <td className="max-w-48">{m.company}{m.department && <span className="block text-xs text-slate-400">{m.department}</span>}</td>
                <td>{m.city}</td>
                <td className="whitespace-nowrap">{formatDate(m.createdAt)}</td>
                <td><Badge tone={m.status}>{labels.userStatus[m.status]}</Badge></td>
                <td>
                  <div className="flex gap-1">
                    {m.status !== "ACTIVE" && (
                      <form action={setUserStatusAction}><input type="hidden" name="id" value={m.id} /><input type="hidden" name="status" value="ACTIVE" /><button className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700">تأیید</button></form>
                    )}
                    <Link href={`/admin/members/${m.id}`} className="btn-outline btn-sm">جزئیات</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!members.length && <p className="p-8 text-center text-slate-500">موردی یافت نشد.</p>}
      </div>

      {total > PAGE && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {page > 1 && <Link href={qs({ page: String(page - 1) })} className="btn-outline btn-sm">قبلی</Link>}
          <span className="text-sm text-slate-500">صفحه {fa(page)} از {fa(Math.ceil(total / PAGE))}</span>
          {page * PAGE < total && <Link href={qs({ page: String(page + 1) })} className="btn-outline btn-sm">بعدی</Link>}
        </div>
      )}
    </>
  );
}
