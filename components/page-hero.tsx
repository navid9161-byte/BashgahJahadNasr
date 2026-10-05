export function PageHero({ title, subtitle, kicker }: { title: string; subtitle?: string; kicker?: string }) {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="halftone absolute inset-0 opacity-40" />
      <div className="absolute -left-20 top-0 h-full w-72 -skew-x-12 bg-brand-yellow/90" />
      <div className="absolute left-60 top-0 h-full w-6 -skew-x-12 bg-brand-yellow/60" />
      <div className="container-x relative py-14 sm:py-20">
        {kicker && <p className="mb-2 text-sm font-bold text-brand-yellow">{kicker}</p>}
        <h1 className="text-3xl font-black sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl leading-8 text-white/80">{subtitle}</p>}
      </div>
    </section>
  );
}
