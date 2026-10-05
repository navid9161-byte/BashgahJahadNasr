import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [sports, user] = await Promise.all([
    db.sport.findMany({ where: { active: true }, orderBy: { order: "asc" }, select: { slug: true, name: true }, take: 10 }),
    getCurrentUser(),
  ]);
  return (
    <>
      <SiteHeader
        sports={sports}
        user={user ? { name: `${user.firstName} ${user.lastName}`, isAdmin: user.role === "ADMIN" } : null}
      />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
