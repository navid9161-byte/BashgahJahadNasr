import { PageTitle } from "@/components/dashboard-shell";
import { ChangePasswordForm, ProfileForm } from "@/components/forms/profile-form";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { profileValues } from "@/lib/profile";
import { fa } from "@/lib/utils";

export const metadata = { title: "اطلاعات من" };

export default async function ProfilePage() {
  const user = await requireUser();
  const sports = await db.sport.findMany({ where: { active: true }, orderBy: { order: "asc" }, select: { id: true, name: true } });
  return (
    <>
      <PageTitle title="اطلاعات من" subtitle="اطلاعات پرسنلی خود را به‌روز نگه دارید" />
      <div className="card mb-6 flex flex-wrap items-center gap-5 p-5">
        {user.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photo} alt="" className="size-20 rounded-2xl object-cover" />
        ) : (
          <span className="grid size-20 place-items-center rounded-2xl bg-navy-800 text-3xl font-black text-brand-yellow">{user.firstName[0]}</span>
        )}
        <div className="grid gap-1 text-sm">
          <p className="text-lg font-black text-navy-900">{user.firstName} {user.lastName}</p>
          {user.nationalCode && <p className="text-slate-500">کد ملی: {fa(user.nationalCode)}</p>}
          {user.personnelCode && <p className="text-slate-500">کد پرسنلی: {fa(user.personnelCode)}</p>}
        </div>
      </div>
      {user.role !== "ADMIN" && <ProfileForm profile={profileValues(user)} sports={sports} />}
      <div className="mt-6"><ChangePasswordForm /></div>
    </>
  );
}
