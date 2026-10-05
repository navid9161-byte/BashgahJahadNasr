import type { Prisma } from "@prisma/client";
import { toEnDigits } from "./utils";

export type MemberQuery = { status?: string; q?: string; city?: string; gender?: string; sport?: string; page?: string };

export function memberWhere(p: MemberQuery): Prisma.UserWhereInput {
  const q = p.q ? toEnDigits(p.q.trim()) : "";
  return {
    role: "MEMBER",
    ...(p.status ? { status: p.status } : {}),
    ...(p.city ? { city: p.city } : {}),
    ...(p.gender ? { gender: p.gender } : {}),
    ...(p.sport ? { interests: { contains: `"${p.sport}"` } } : {}),
    ...(q
      ? {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { nationalCode: { contains: q } },
            { personnelCode: { contains: q } },
            { mobile: { contains: q } },
            { company: { contains: q } },
            { department: { contains: q } },
          ],
        }
      : {}),
  };
}
