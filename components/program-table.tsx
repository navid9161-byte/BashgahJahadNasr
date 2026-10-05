import Link from "next/link";
import { Badge } from "./badge";
import { SportIcon } from "./sport-icon";
import { fa, formatPrice, labels } from "@/lib/utils";

type Row = {
  id: string; title: string; days: string; startTime: string; endTime: string; location: string; city: string;
  gender: string; fee: number; coach: string | null; sport: { name: string; icon: string };
};

export function ProgramTable({ programs, showSport = false }: { programs: Row[]; showSport?: boolean }) {
  return (
    <div className="card overflow-x-auto">
      <table className="table-x">
        <thead>
          <tr>
            <th>کلاس</th>
            {showSport && <th>رشته</th>}
            <th>روزها</th>
            <th>ساعت</th>
            <th>مکان</th>
            <th>ویژه</th>
            <th>شهریه</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {programs.map((p) => (
            <tr key={p.id}>
              <td>
                <p className="font-bold text-navy-900">{p.title}</p>
                {p.coach && <p className="text-xs text-slate-500">مربی: {p.coach}</p>}
              </td>
              {showSport && (
                <td><span className="flex items-center gap-2 whitespace-nowrap"><SportIcon name={p.sport.icon} className="size-4 text-navy-600" /> {p.sport.name}</span></td>
              )}
              <td>{p.days}</td>
              <td className="whitespace-nowrap">{fa(p.startTime)} - {fa(p.endTime)}</td>
              <td>{p.location}<span className="block text-xs text-slate-400">{p.city}</span></td>
              <td><Badge>{labels.gender[p.gender]}</Badge></td>
              <td className="whitespace-nowrap">{formatPrice(p.fee)}</td>
              <td><Link href={`/panel/programs#${p.id}`} className="btn-yellow btn-sm">ثبت‌نام</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
