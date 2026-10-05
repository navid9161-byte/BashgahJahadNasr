import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label={site.name}>
      <Image src="/images/logo-shield.png" alt="" width={64} height={65} className={compact ? "size-11" : "size-14 sm:size-16"} priority />
      <span className="whitespace-nowrap leading-tight">
        <span className={`block text-xs font-bold sm:text-sm ${light ? "text-white/80" : "text-navy-900"}`}>باشگاه فرهنگی ورزشی</span>
        <span className={`block font-black ${compact ? "text-base" : "text-lg sm:text-2xl"} ${light ? "text-white" : "text-navy-900"}`}>
          جهاد نصر کرمان
        </span>
      </span>
    </Link>
  );
}
