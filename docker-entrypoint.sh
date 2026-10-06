#!/bin/sh
set -e
DATA_DIR="$(dirname "${DATABASE_URL#file:}")"
mkdir -p "$DATA_DIR" "$UPLOAD_DIR"

# اگر AUTH_SECRET در متغیرهای محیطی تعریف نشده باشد، یک کلید تصادفی ساخته و روی دیسک ماندگار نگه داشته می‌شود
if [ -z "$AUTH_SECRET" ]; then
  if [ ! -s "$DATA_DIR/.auth_secret" ]; then
    node -e "process.stdout.write(require('crypto').randomBytes(48).toString('hex'))" > "$DATA_DIR/.auth_secret"
  fi
  AUTH_SECRET="$(cat "$DATA_DIR/.auth_secret")"
  export AUTH_SECRET
fi

# ساخت/به‌روزرسانی جداول و داده‌های اولیه (بدون حذف داده‌های موجود)
npx prisma db push --skip-generate
npx tsx prisma/seed.ts
exec npx next start -p "${PORT:-3000}"
