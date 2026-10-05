import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "گالری تصاویر" };

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ album?: string }> }) {
  const { album } = await searchParams;
  const images = await db.galleryImage.findMany({ orderBy: { createdAt: "desc" } });
  const albums = [...new Set(images.map((i) => i.album))];
  const shown = album ? images.filter((i) => i.album === album) : images;

  return (
    <>
      <PageHero kicker="گالری تصاویر" title="لحظه‌های ماندگار باشگاه" />
      <section className="container-x mt-10">
        {albums.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {[undefined, ...albums].map((a) => (
              <Link
                key={a ?? "all"}
                href={a ? `/gallery?album=${encodeURIComponent(a)}` : "/gallery"}
                className={cn("rounded-full px-5 py-2 text-sm font-bold", album === a ? "bg-navy-800 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200")}
              >
                {a ?? "همه"}
              </Link>
            ))}
          </div>
        )}
        {shown.length ? (
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
            {shown.map((img) => (
              <a key={img.id} href={img.src} target="_blank" rel="noreferrer" className="group mb-4 block break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.title} loading="lazy" className="w-full transition duration-500 group-hover:scale-105" />
                {img.title && <p className="p-3 text-sm font-medium text-slate-700">{img.title}</p>}
              </a>
            ))}
          </div>
        ) : (
          <div className="card grid place-items-center gap-3 p-16 text-slate-400">
            <ImageIcon className="size-12" />
            <p>هنوز تصویری در گالری قرار نگرفته است.</p>
          </div>
        )}
      </section>
    </>
  );
}
