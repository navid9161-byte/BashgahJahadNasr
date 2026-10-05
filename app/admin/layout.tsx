import {
  CalendarDays, ClipboardList, Images, Inbox, LayoutDashboard, ListChecks, Newspaper, Trophy, UserCircle, Users,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const [pendingMembers, pendingEnrollments, unread] = await Promise.all([
    db.user.count({ where: { role: "MEMBER", status: "PENDING" } }),
    db.enrollment.count({ where: { status: "PENDING" } }),
    db.contactMessage.count({ where: { read: false } }),
  ]);
  const i = "size-5";
  return (
    <DashboardShell
      title="پنل مدیریت"
      user={{ name: `${admin.firstName} ${admin.lastName}`, subtitle: `نام کاربری: ${admin.username}` }}
      nav={[
        { href: "/admin", label: "پیشخوان", icon: <LayoutDashboard className={i} /> },
        { href: "/admin/members", label: "پرسنل و اعضا", icon: <Users className={i} />, badge: pendingMembers },
        { href: "/admin/enrollments", label: "درخواست‌های ثبت‌نام", icon: <ListChecks className={i} />, badge: pendingEnrollments },
        { href: "/admin/programs", label: "کلاس‌ها و برنامه‌ها", icon: <CalendarDays className={i} /> },
        { href: "/admin/sports", label: "رشته‌های ورزشی", icon: <Trophy className={i} /> },
        { href: "/admin/surveys", label: "نظرسنجی و نیازسنجی", icon: <ClipboardList className={i} /> },
        { href: "/admin/news", label: "اخبار و اطلاعیه‌ها", icon: <Newspaper className={i} /> },
        { href: "/admin/gallery", label: "گالری تصاویر", icon: <Images className={i} /> },
        { href: "/admin/messages", label: "پیام‌های تماس", icon: <Inbox className={i} />, badge: unread },
        { href: "/panel/profile", label: "حساب کاربری من", icon: <UserCircle className={i} /> },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
