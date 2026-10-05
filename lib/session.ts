import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "jn_session";
export const SESSION_DAYS = 14;

export type SessionPayload = { uid: string; role: string };

function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET باید در فایل .env تنظیم شود (حداقل ۱۶ کاراکتر)");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload, days = SESSION_DAYS) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${days}d`)
    .sign(key());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    if (typeof payload.uid !== "string" || typeof payload.role !== "string") return null;
    return { uid: payload.uid, role: payload.role };
  } catch {
    return null;
  }
}
