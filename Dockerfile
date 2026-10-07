# ایمیج اجرایی سبک: برنامه از قبل در GitHub Actions ساخته شده و اینجا فقط کپی می‌شود
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_URL="file:/app/data/club.db" \
    UPLOAD_DIR=/app/data/uploads
COPY . .
EXPOSE 3000
CMD ["sh", "./docker-entrypoint.sh"]
