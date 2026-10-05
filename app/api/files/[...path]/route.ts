import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_ROOT } from "@/lib/upload";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path;
  const target = path.resolve(UPLOAD_ROOT, ...parts);
  const type = TYPES[path.extname(target).toLowerCase()];
  if (!target.startsWith(UPLOAD_ROOT + path.sep) || !type) {
    return new Response("Not found", { status: 404 });
  }
  // عکس پرسنل فقط برای مدیران و خود کاربر قابل مشاهده است
  if (parts[0] === "members") {
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();
    const url = `/api/files/${parts.join("/")}`;
    if (!user || (user.role !== "ADMIN" && user.photo !== url)) {
      return new Response("Forbidden", { status: 403 });
    }
  }
  try {
    const data = await readFile(target);
    return new Response(data, {
      headers: {
        "Content-Type": type,
        "Cache-Control": parts[0] === "members" ? "private, max-age=3600" : "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
