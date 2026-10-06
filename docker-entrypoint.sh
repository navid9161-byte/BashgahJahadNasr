#!/bin/sh
set -e
mkdir -p "$(dirname "${DATABASE_URL#file:}")" "$UPLOAD_DIR"
# ساخت/به‌روزرسانی جداول و داده‌های اولیه (بدون حذف داده‌های موجود)
npx prisma db push --skip-generate
npx tsx prisma/seed.ts
exec npx next start -p "${PORT:-3000}"
