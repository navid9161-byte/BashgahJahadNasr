import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const sports = [
  { slug: "running", name: "دو و میدانی", icon: "running", summary: "دوهای سرعت، استقامت و همایش‌های پیاده‌روی و دوی همگانی" },
  { slug: "swimming", name: "شنا", icon: "swimming", summary: "آموزش و تمرین شنا در مجموعه استخر شهدای غواص سیرجان" },
  { slug: "volleyball", name: "والیبال", icon: "volleyball", summary: "تمرینات منظم و تیم‌های والیبال آقایان و بانوان" },
  { slug: "basketball", name: "بسکتبال", icon: "basketball", summary: "تمرین و مسابقات بسکتبال در سالن چندمنظوره شهید عسکری" },
  { slug: "martial-arts", name: "هنرهای رزمی", icon: "martial", summary: "کاراته، تکواندو و سایر رشته‌های رزمی" },
  { slug: "futsal", name: "فوتسال", icon: "football", summary: "لیگ داخلی فوتسال پرسنل و تیم منتخب باشگاه" },
  { slug: "fitness", name: "بدنسازی", icon: "fitness", summary: "باشگاه بدنسازی و پرورش اندام ویژه پرسنل در کرمان و سیرجان" },
  { slug: "mountaineering", name: "کوهنوردی", icon: "mountain", summary: "برنامه‌های کوهپیمایی و طبیعت‌گردی خانوادگی" },
  { slug: "chess", name: "شطرنج", icon: "chess", summary: "مسابقات و آموزش شطرنج برای پرسنل و خانواده‌ها" },
  { slug: "table-tennis", name: "تنیس روی میز", icon: "target", summary: "تمرینات و مسابقات داخلی تنیس روی میز" },
  { slug: "tennis", name: "تنیس", icon: "activity", summary: "آموزش و تمرین تنیس برای پرسنل و خانواده‌ها" },
];

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "Admin@1234";
  await db.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      passwordHash: await bcrypt.hash(password, 10),
      role: "ADMIN",
      status: "ACTIVE",
      firstName: "مدیر",
      lastName: "سامانه",
    },
  });
  console.log(`✔ مدیر سامانه: ${username}`);

  for (const [i, s] of sports.entries()) {
    await db.sport.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, order: i, description: s.summary },
    });
  }
  console.log(`✔ ${sports.length} رشته ورزشی`);

  if ((await db.program.count()) === 0) {
    const bySlug = Object.fromEntries((await db.sport.findMany()).map((s) => [s.slug, s.id]));
    await db.program.createMany({
      data: [
        { title: "والیبال آقایان", sportId: bySlug.volleyball, gender: "MALE", days: "شنبه و دوشنبه", startTime: "17:00", endTime: "18:30", location: "سالن شهید محمد عسکری", city: "کرمان", capacity: 24 },
        { title: "شنای بانوان", sportId: bySlug.swimming, gender: "FEMALE", days: "یکشنبه و سه‌شنبه", startTime: "10:00", endTime: "11:30", location: "استخر شهدای غواص", city: "سیرجان", capacity: 30 },
        { title: "بدنسازی عمومی", sportId: bySlug.fitness, gender: "ALL", days: "همه روزه به جز جمعه", startTime: "16:00", endTime: "21:00", location: "باشگاه بدنسازی پرسنل", city: "کرمان", capacity: 60 },
      ],
    });
    console.log("✔ برنامه‌های نمونه (از پنل مدیریت ویرایش کنید)");
  }

  if ((await db.news.count()) === 0) {
    await db.news.create({
      data: {
        slug: "launch",
        title: "راه‌اندازی سامانه جامع باشگاه فرهنگی ورزشی جهاد نصر کرمان",
        summary: "از این پس ثبت‌نام در کلاس‌ها، شرکت در نظرسنجی‌ها و اطلاع از برنامه‌های باشگاه به صورت آنلاین انجام می‌شود.",
        body:
          "سامانه جامع باشگاه فرهنگی ورزشی جهاد نصر کرمان با هدف تسهیل دسترسی پرسنل و خانواده‌های محترم به خدمات باشگاه راه‌اندازی شد.\n\nپرسنل محترم می‌توانند با ثبت‌نام در سامانه و تکمیل اطلاعات پرسنلی، پس از تأیید مدیر باشگاه در کلاس‌های ورزشی ثبت‌نام کرده و در نظرسنجی‌ها و فرم نیازسنجی ورزشی شرکت کنند.",
        category: "NOTICE",
      },
    });
  }

  if ((await db.survey.count()) === 0) {
    const sportNames = sports.map((s) => s.name);
    await db.survey.create({
      data: {
        title: "فرم نیازسنجی ورزشی پرسنل",
        description: "لطفاً با پاسخ به سؤالات زیر ما را در برنامه‌ریزی کلاس‌ها و رویدادهای ورزشی سال جاری یاری کنید.",
        kind: "NEEDS",
        questions: {
          create: [
            { order: 1, text: "در حال حاضر چند روز در هفته ورزش می‌کنید؟", type: "SINGLE", options: JSON.stringify(["اصلاً", "۱ روز", "۲ تا ۳ روز", "۴ روز یا بیشتر"]) },
            { order: 2, text: "به کدام رشته‌ها علاقه‌مند هستید؟", type: "MULTI", options: JSON.stringify(sportNames) },
            { order: 3, text: "مناسب‌ترین زمان برای شرکت در کلاس‌ها", type: "SINGLE", options: JSON.stringify(["صبح", "بعدازظهر (بلافاصله پس از ساعت کاری)", "عصر", "شب", "روزهای تعطیل"]) },
            { order: 4, text: "مهم‌ترین هدف شما از ورزش چیست؟", type: "SINGLE", options: JSON.stringify(["سلامتی و تندرستی", "کاهش وزن و تناسب اندام", "رفع استرس و نشاط", "رقابت و قهرمانی", "تفریح با خانواده"]) },
            { order: 5, text: "تمایل دارید خانواده شما هم در برنامه‌ها شرکت کنند؟", type: "SINGLE", options: JSON.stringify(["بله", "خیر", "فقط در برنامه‌های خانوادگی"]) },
            { order: 6, text: "میزان رضایت شما از امکانات ورزشی فعلی باشگاه", type: "RATING" },
            { order: 7, text: "پیشنهاد شما برای رشته یا برنامه جدید چیست؟", type: "TEXT", required: false },
          ],
        },
      },
    });
    console.log("✔ فرم نیازسنجی ورزشی");
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
