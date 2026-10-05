import { CalendarCheck, ClipboardList, LayoutDashboard, ShieldCheck, UserCog } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/auth";
import { labels } from "@/lib/utils";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <DashboardShell
      title="پنل کاربری"
      user={{ name: `${user.firstName} ${user.lastName}`, subtitle: user.role === "ADMIN" ? "مدیر سامانه" : `عضویت: ${labels.userStatus[user.status]}` }}
      nav={[
        { href: "/panel", label: "پیشخوان", icon: <LayoutDashboard className="size-5" /> },
        { href: "/panel/programs", label: "ثبت‌نام در کلاس‌ها", icon: <CalendarCheck className="size-5" /> },
        { href: "/panel/surveys", label: "نظرسنجی و نیازسنجی", icon: <ClipboardList className="size-5" /> },
        { href: "/panel/profile", label: "اطلاعات من", icon: <UserCog className="size-5" /> },
        ...(user.role === "ADMIN" ? [{ href: "/admin", label: "پنل مدیریت", icon: <ShieldCheck className="size-5" /> }] : []),
      ]}
    >
      {children}
    </DashboardShell>
  );
}
