import { Trash2 } from "lucide-react";
import { deleteGalleryAction } from "@/app/actions/admin";
import { PageTitle } from "@/components/dashboard-shell";
import { GalleryUpload } from "@/components/forms/gallery-upload";
import { ConfirmButton } from "@/components/ui";
import { db } from "@/lib/db";

export const metadata = { title: "گالری تصاویر" };

export default async function GalleryAdmin() {
  const images = await db.galleryImage.findMany({ orderBy: { createdAt: "desc" } });
  const albums = [...new Set(images.map((i) => i.album))];
  return (
    <>
      <PageTitle title="گالری تصاویر" />
      <GalleryUpload albums={albums} />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.title} className="aspect-square w-full object-cover" />
            <div className="flex items-center justify-between gap-2 p-3 text-xs">
              <span className="truncate text-slate-600">{img.album}{img.title && ` — ${img.title}`}</span>
              <form action={deleteGalleryAction}>
                <input type="hidden" name="id" value={img.id} />
                <ConfirmButton message="این تصویر حذف شود؟" className="btn-ghost btn-sm text-rose-600"><Trash2 className="size-4" /></ConfirmButton>
              </form>
            </div>
          </div>
        ))}
      </div>
      {!images.length && <p className="card mt-6 p-8 text-center text-slate-500">هنوز تصویری بارگذاری نشده است.</p>}
    </>
  );
}
