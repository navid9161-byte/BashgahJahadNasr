import Link from "next/link";
import { ArrowLeft, Building2, CalendarCheck, ClipboardList, HeartPulse, Trophy, Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/site";

export const metadata = { title: "خدمات" };

const online = [
  { icon: CalendarCheck, title: "ثبت‌نام آنلاین کلاس‌ها", text: "مشاهده برنامه کلاس‌ها و ثبت درخواست عضویت در کلاس‌های ورزشی از پنل کاربری.", href: "/schedule" },
  { icon: ClipboardList, title: "نظرسنجی و نیازسنجی ورزشی", text: "ثبت نظرات و نیازهای ورزشی پرسنل برای برنامه‌ریزی دقیق‌تر باشگاه.", href: "/panel/surveys" },
  { icon: Users, title: "عضویت پرسنل و خانواده‌ها", text: "ثبت‌نام آنلاین با اطلاعات پرسنلی و پیگیری وضعیت عضویت.", href: "/register" },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero kicker="خدمات باشگاه" title="خدمات ورزشی و فرهنگی" subtitle="آنچه باشگاه فرهنگی ورزشی جهاد نصر کرمان برای پرسنل و خانواده‌های آنان فراهم می‌کند." />

      <section className="container-x mt-12">
        <h2 className="section-title mb-6">خدمات آنلاین</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {online.map(({ icon: Icon, title, text, href }) => (
            <Link key={title} href={href} className="card group p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="grid size-14 place-items-center rounded-full bg-yellow-100 text-navy-800"><Icon className="size-7" /></span>
              <h3 className="mt-4 text-lg font-black text-navy-900">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
              <span className="mt-4 flex items-center gap-1 text-sm font-bold text-navy-600">ورود <ArrowLeft className="size-4 transition group-hover:-translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x mt-16">
        <h2 className="section-title mb-6">فعالیت‌ها و برنامه‌ها</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {site.activities.map((a, i) => (
            <div key={a} className="card flex items-start gap-4 p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy-800 text-brand-yellow">
                {i % 3 === 0 ? <Trophy className="size-5" /> : i % 3 === 1 ? <HeartPulse className="size-5" /> : <Users className="size-5" />}
              </span>
              <p className="pt-1.5 leading-7 text-slate-700">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x mt-16">
        <h2 className="section-title mb-6">اماکن ورزشی</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {site.facilities.map((f) => (
            <div key={f.title} className="card flex gap-4 p-5">
              <Building2 className="size-8 shrink-0 text-navy-700" />
              <div>
                <h3 className="font-black text-navy-900">{f.title}</h3>
                <p className="mt-1 text-sm leading-7 text-slate-600">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
