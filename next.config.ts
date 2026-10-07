import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // خروجی مستقل و سبک برای اجرا روی سرور بدون نصب پکیج‌ها
  output: "standalone",
  images: { unoptimized: true },
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
