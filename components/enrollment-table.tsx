import Link from "next/link";
import { setEnrollmentStatusAction } from "@/app/actions/admin";
import { Badge } from "./badge";
import { fa, formatDate, labels } from "@/lib/utils";

type Row = {
  id: string; status: string; createdAt: Date; note: string | null;
  user: { id: string; firstName: string; lastName: string; personnelCode: string | null; mobile: string | null; company: string | null };
  program: { id: string; title: string };
};

export function EnrollmentTable({ rows, showProgram = true }: { rows: Row[]; showProgram?: boolean }) {
  if (!rows.length) return <p className="card p-8 text-center text-slate-500">موردی وجود ندارد.</p>;
  return (
    <div className="card overflow-x-auto">
      <table className="table-x">
        <thead>
          <tr><th>متقاضی</th><th>کد پرسنلی</th><th>موبایل</th>{showProgram && <th>کلاس</th>}<th>تاریخ درخواست</th><th>وضعیت</th><th /></tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id}>
              <td><Link href={`/admin/members/${e.user.id}`} className="font-bold text-navy-800 hover:underline">{e.user.firstName} {e.user.lastName}</Link><span className="block text-xs text-slate-400">{e.user.company}</span></td>
              <td>{fa(e.user.personnelCode)}</td>
              <td dir="ltr" className="text-right">{fa(e.user.mobile)}</td>
              {showProgram && <td><Link href={`/admin/programs/${e.program.id}`} className="hover:underline">{e.program.title}</Link></td>}
              <td className="whitespace-nowrap">{formatDate(e.createdAt)}</td>
              <td><Badge tone={e.status}>{labels.enrollmentStatus[e.status]}</Badge></td>
              <td>
                <div className="flex gap-1">
                  {e.status !== "APPROVED" && (
                    <form action={setEnrollmentStatusAction}><input type="hidden" name="id" value={e.id} /><input type="hidden" name="status" value="APPROVED" /><button className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700">تأیید</button></form>
                  )}
                  {e.status !== "REJECTED" && (
                    <form action={setEnrollmentStatusAction}><input type="hidden" name="id" value={e.id} /><input type="hidden" name="status" value="REJECTED" /><button className="btn-outline btn-sm text-rose-600">رد</button></form>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
