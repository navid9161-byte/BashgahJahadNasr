"use client";

import { Upload } from "lucide-react";
import { uploadGalleryAction } from "@/app/actions/admin";
import { ActionForm, FormMessage, SubmitButton } from "@/components/ui";

export function GalleryUpload({ albums }: { albums: string[] }) {
  return (
    <ActionForm action={uploadGalleryAction} resetOnSuccess className="card grid gap-4 p-5 sm:grid-cols-[1fr_200px_1fr_auto] sm:items-end">
      <label><span className="label">تصاویر (چند انتخابی، حداکثر ۵ مگابایت)</span><input type="file" name="images" multiple required accept="image/*" className="input" /></label>
      <label>
        <span className="label">آلبوم</span>
        <input name="album" list="albums" placeholder="عمومی" className="input" />
        <datalist id="albums">{albums.map((a) => <option key={a} value={a} />)}</datalist>
      </label>
      <label><span className="label">عنوان / توضیح</span><input name="title" className="input" /></label>
      <SubmitButton pendingText="در حال بارگذاری..."><Upload className="size-4" /> بارگذاری</SubmitButton>
      <div className="sm:col-span-4"><FormMessage /></div>
    </ActionForm>
  );
}
