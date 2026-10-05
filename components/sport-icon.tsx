import {
  Activity, Bike, Crown, Dribbble, Dumbbell, Footprints, Goal, Medal, Mountain,
  Swords, Target, Trophy, Volleyball, Waves, type LucideIcon,
} from "lucide-react";

export const sportIcons: Record<string, { icon: LucideIcon; label: string }> = {
  running: { icon: Footprints, label: "دو و میدانی" },
  swimming: { icon: Waves, label: "شنا" },
  volleyball: { icon: Volleyball, label: "والیبال" },
  basketball: { icon: Dribbble, label: "بسکتبال" },
  martial: { icon: Swords, label: "هنرهای رزمی" },
  football: { icon: Goal, label: "فوتبال / فوتسال" },
  fitness: { icon: Dumbbell, label: "بدنسازی" },
  cycling: { icon: Bike, label: "دوچرخه‌سواری" },
  mountain: { icon: Mountain, label: "کوهنوردی" },
  chess: { icon: Crown, label: "شطرنج" },
  target: { icon: Target, label: "تیراندازی / دارت" },
  medal: { icon: Medal, label: "مدال" },
  activity: { icon: Activity, label: "ورزش همگانی" },
  trophy: { icon: Trophy, label: "عمومی" },
};

export function SportIcon({ name, className }: { name: string; className?: string }) {
  const Icon = sportIcons[name]?.icon ?? Trophy;
  return <Icon className={className} aria-hidden />;
}
