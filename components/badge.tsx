import { cn, statusTone } from "@/lib/utils";

export function Badge({ tone, children, className }: { tone?: string; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold",
        (tone && statusTone[tone]) || "bg-navy-50 text-navy-700",
        className,
      )}
    >
      {children}
    </span>
  );
}
