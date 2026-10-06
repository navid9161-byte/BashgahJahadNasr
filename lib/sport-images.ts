/** تصاویر پیش‌فرض رشته‌ها (اگر مدیر تصویری بارگذاری نکرده باشد) */
const images: Record<string, string> = {
  tennis: "/images/sports/tennis.jpg",
  fitness: "/images/sports/fitness.jpg",
  futsal: "/images/sports/football.jpg",
  football: "/images/sports/football.jpg",
  basketball: "/images/sports/basketball.jpg",
  volleyball: "/images/sports/volleyball.jpg",
  "table-tennis": "/images/sports/table-tennis.jpg",
  swimming: "/images/sports/swimming.jpg",
};

export function sportImage(sport: { slug: string; image: string | null }): string | null {
  return sport.image ?? images[sport.slug] ?? null;
}

/** ترتیب نمایش رشته‌ها در صفحه اصلی */
export const homeSportOrder = ["tennis", "fitness", "futsal", "football", "basketball", "volleyball", "table-tennis", "swimming"];
