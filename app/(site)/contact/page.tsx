import { MapPin, Phone, User } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { site } from "@/lib/site";

export const metadata = { title: "تماس با ما" };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const { subject } = await searchParams;
  return (
    <>
      <PageHero kicker="تماس با ما" title="در ارتباط باشیم" subtitle="سؤال، پیشنهاد یا انتقادی دارید؟ از طریق فرم زیر یا راه‌های ارتباطی با ما در تماس باشید." />
      <section className="container-x mt-12 grid gap-8 lg:grid-cols-[360px_1fr]">
        <div className="grid h-fit gap-4">
          {[
            { icon: MapPin, title: "نشانی", body: site.address },
            { icon: Phone, title: "تلفن باشگاه", body: <a href={`tel:${site.phoneRaw}`} dir="ltr">{site.phone}</a> },
            { icon: User, title: site.director.title, body: <>{site.director.name}<br /><a href={`tel:${site.director.phoneRaw}`} dir="ltr">{site.director.phone}</a></> },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="card flex gap-4 p-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy-800 text-brand-yellow"><Icon className="size-6" /></span>
              <div><p className="text-sm text-slate-500">{title}</p><p className="mt-1 font-bold leading-7 text-navy-900">{body}</p></div>
            </div>
          ))}
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(site.address)}`}
            target="_blank" rel="noreferrer" className="btn-outline"
          >
            <MapPin className="size-4" /> مشاهده روی نقشه
          </a>
        </div>
        <div className="card p-6 sm:p-8">
          <h2 className="mb-6 text-xl font-black text-navy-900">ارسال پیام</h2>
          <ContactForm defaultSubject={subject === "forgot" ? "فراموشی رمز عبور" : ""} />
        </div>
      </section>
    </>
  );
}
