import "server-only";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

// روی سرور (لیارا) با UPLOAD_DIR به دیسک ماندگار اشاره می‌کند
export const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "storage", "uploads"));
const MAX_SIZE = 5 * 1024 * 1024;
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** ذخیره تصویر آپلود شده و بازگرداندن آدرس عمومی آن؛ اگر فایلی ارسال نشده باشد null */
export async function saveImage(file: FormDataEntryValue | null, folder: string): Promise<string | null> {
  if (!file || typeof file === "string" || file.size === 0) return null;
  const ext = EXT[file.type];
  if (!ext) throw new Error("فقط تصاویر JPG، PNG، WEBP و GIF مجاز هستند");
  if (file.size > MAX_SIZE) throw new Error("حجم تصویر نباید بیشتر از ۵ مگابایت باشد");
  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/api/files/${folder}/${name}`;
}

export async function removeUpload(url: string | null | undefined) {
  if (!url?.startsWith("/api/files/")) return;
  const target = path.resolve(UPLOAD_ROOT, url.slice("/api/files/".length));
  if (!target.startsWith(UPLOAD_ROOT + path.sep)) return;
  await unlink(target).catch(() => {});
}
