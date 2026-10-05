import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "./db";
import { SESSION_COOKIE, SESSION_DAYS, signSession, verifySession } from "./session";

export async function createSession(uid: string, role: string, remember: boolean) {
  const days = remember ? SESSION_DAYS : 1;
  const token = await signSession({ uid, role }, days);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.INSECURE_COOKIES !== "1",
    path: "/",
    ...(remember ? { maxAge: days * 24 * 60 * 60 } : {}),
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** کاربر فعلی (یا null) — در هر درخواست یک بار از پایگاه داده خوانده می‌شود */
export const getCurrentUser = cache(async () => {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  return db.user.findUnique({ where: { id: session.uid } });
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireActiveMember() {
  const user = await requireUser();
  if (user.role !== "ADMIN" && user.status !== "ACTIVE") redirect("/panel");
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/panel");
  return user;
}
