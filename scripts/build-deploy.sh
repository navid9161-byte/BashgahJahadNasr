#!/usr/bin/env bash
# ساخت بسته آماده اجرا برای لیارا در پوشه dist (در GitHub Actions اجرا می‌شود)
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build

rm -rf dist
cp -r .next/standalone dist
mkdir -p dist/.next
cp -r .next/static dist/.next/static
cp -r public dist/public
mkdir -p dist/prisma
cp -r prisma/migrations prisma/migrate.mjs prisma/seed.mjs prisma/schema.prisma dist/prisma/
# کلاینت Prisma و موتورهای آن (شامل نسخه alpine/musl)
mkdir -p dist/node_modules/@prisma
rm -rf dist/node_modules/.prisma dist/node_modules/@prisma/client dist/node_modules/bcryptjs
cp -r node_modules/.prisma dist/node_modules/.prisma
cp -r node_modules/@prisma/client dist/node_modules/@prisma/client
cp -r node_modules/bcryptjs dist/node_modules/bcryptjs
# فقط runtime کتابخانه‌ای لازم است؛ نسخه‌های wasm/edge سایر پایگاه‌داده‌ها حذف می‌شوند
find dist/node_modules/@prisma/client/runtime -type f \( -name "*wasm*" -o -name "edge*" -o -name "react-native*" -o -name "*.map" \) -delete
rm -rf dist/node_modules/@prisma/client/generator-build
# فقط موتور مقصد را نگه دار (پیش‌فرض: alpine/musl روی لیارا)
if [ "${KEEP_NATIVE_ENGINE:-0}" != "1" ]; then
  find dist/node_modules/.prisma/client -name "libquery_engine-*.so.node" ! -name "*linux-musl*" -delete
fi
# حذف فایل‌های غیرضروری و حجیم
rm -rf dist/.env dist/prisma/*.db dist/storage dist/docs dist/node_modules/@img dist/node_modules/sharp dist/node_modules/typescript
find dist/node_modules -name "*.node" -path "*@next/swc*" -delete 2>/dev/null || true
cp deploy/liara/Dockerfile deploy/liara/docker-entrypoint.sh deploy/liara/liara.json dist/
echo "dist size: $(du -sh dist | cut -f1)"
