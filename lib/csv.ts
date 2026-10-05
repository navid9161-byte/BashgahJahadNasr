import "server-only";
import { getCurrentUser } from "./auth";

function cell(v: unknown): string {
  let s = v === null || v === undefined ? "" : v instanceof Date ? v.toISOString() : String(v);
  // جلوگیری از اجرای فرمول در اکسل (CSV injection)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** فایل CSV با BOM تا اکسل حروف فارسی را درست نمایش دهد */
export function csvResponse(filename: string, header: string[], rows: unknown[][]) {
  const body = "﻿" + [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.csv"; filename*=UTF-8''${encodeURIComponent(filename)}.csv`,
    },
  });
}

export async function assertAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

export const faDate = (d: Date) =>
  new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", { dateStyle: "short", timeZone: "Asia/Tehran" }).format(d);
