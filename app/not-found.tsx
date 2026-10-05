import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-navy-900 p-6 text-center text-white">
      <div>
        <p className="text-8xl font-black text-brand-yellow">۴۰۴</p>
        <h1 className="mt-4 text-2xl font-black">صفحه مورد نظر پیدا نشد</h1>
        <Link href="/" className="btn-yellow mt-8">بازگشت به صفحه اصلی</Link>
      </div>
    </div>
  );
}
