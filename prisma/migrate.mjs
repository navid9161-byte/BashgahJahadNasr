// اعمال مهاجرت‌های پایگاه داده بدون نیاز به Prisma CLI (برای اجرا روی سرور)
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "migrations");
const db = new PrismaClient();

async function tableExists(name) {
  const rows = await db.$queryRawUnsafe(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, name);
  return rows.length > 0;
}

async function main() {
  await db.$executeRawUnsafe(
    `CREATE TABLE IF NOT EXISTS "_app_migrations" ("name" TEXT PRIMARY KEY, "appliedAt" DATETIME DEFAULT CURRENT_TIMESTAMP)`,
  );
  const applied = new Set((await db.$queryRawUnsafe(`SELECT name FROM "_app_migrations"`)).map((r) => r.name));
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

  // پایگاه داده‌ای که قبلاً با db push ساخته شده: مهاجرت اولیه را اعمال‌شده در نظر بگیر
  if (applied.size === 0 && files[0] && (await tableExists("User"))) {
    await db.$executeRawUnsafe(`INSERT INTO "_app_migrations" ("name") VALUES (?)`, files[0]);
    applied.add(files[0]);
    console.log(`• baseline: ${files[0]}`);
  }

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = await readFile(path.join(dir, file), "utf8");
    const statements = sql
      .split(/;\s*\n/)
      .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
      .filter(Boolean);
    await db.$transaction([
      ...statements.map((s) => db.$executeRawUnsafe(s)),
      db.$executeRawUnsafe(`INSERT INTO "_app_migrations" ("name") VALUES (?)`, file),
    ]);
    console.log(`✔ migration: ${file}`);
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
