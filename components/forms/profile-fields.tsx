import { cities, companies } from "@/lib/site";
import { parseJsonArray } from "@/lib/utils";

type Profile = Partial<Record<string, string | number | null>> & { interests?: string };
type SportOption = { id: string; name: string };

export function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="card p-5 sm:p-6">
      <legend className="float-right mb-5 flex w-full items-center gap-2 text-lg font-black text-navy-900">
        <span className="h-6 w-1.5 rounded-full bg-brand-yellow" /> {title}
      </legend>
      <div className="clear-both grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </fieldset>
  );
}

export function Field({
  label, name, required, defaultValue, type = "text", placeholder, dir, inputMode, className,
}: {
  label: string; name: string; required?: boolean; defaultValue?: string | number | null; type?: string;
  placeholder?: string; dir?: "ltr" | "rtl"; inputMode?: "numeric" | "tel" | "text"; className?: string;
}) {
  return (
    <label className={className}>
      <span className="label">{label} {required && <span className="text-rose-500">*</span>}</span>
      <input
        name={name} type={type} required={required} defaultValue={defaultValue ?? ""} placeholder={placeholder}
        dir={dir} inputMode={inputMode} className={`input ${dir === "ltr" ? "text-left" : ""}`}
      />
    </label>
  );
}

export function SelectField({
  label, name, options, required, defaultValue, placeholder = "انتخاب کنید",
}: {
  label: string; name: string; options: (string | [string, string])[]; required?: boolean; defaultValue?: string | null; placeholder?: string;
}) {
  return (
    <label>
      <span className="label">{label} {required && <span className="text-rose-500">*</span>}</span>
      <select name={name} required={required} defaultValue={defaultValue ?? ""} className="input">
        <option value="">{placeholder}</option>
        {options.map((o) => {
          const [value, text] = Array.isArray(o) ? o : [o, o];
          return <option key={value} value={value}>{text}</option>;
        })}
      </select>
    </label>
  );
}

/** فیلدهای مشترک اطلاعات پرسنل — در ثبت‌نام، ویرایش پروفایل و پنل مدیریت */
export function ProfileFields({ profile = {}, sports }: { profile?: Profile; sports: SportOption[] }) {
  const interests = parseJsonArray(profile.interests);
  return (
    <>
      <Fieldset title="اطلاعات فردی">
        <Field label="نام" name="firstName" required defaultValue={profile.firstName} />
        <Field label="نام خانوادگی" name="lastName" required defaultValue={profile.lastName} />
        <Field label="نام پدر" name="fatherName" defaultValue={profile.fatherName} />
        <Field label="تاریخ تولد" name="birthDate" required defaultValue={profile.birthDate} placeholder="۱۳۷۰/۰۵/۱۲" dir="ltr" />
        <SelectField label="جنسیت" name="gender" required defaultValue={profile.gender as string} options={[["MALE", "مرد"], ["FEMALE", "زن"]]} />
        <SelectField label="وضعیت تأهل" name="maritalStatus" defaultValue={profile.maritalStatus as string} options={[["SINGLE", "مجرد"], ["MARRIED", "متأهل"]]} />
        <Field label="تلفن همراه" name="mobile" required defaultValue={profile.mobile} placeholder="۰۹۱۲۳۴۵۶۷۸۹" dir="ltr" inputMode="tel" />
        <SelectField label="تحصیلات" name="education" defaultValue={profile.education as string} options={["زیر دیپلم", "دیپلم", "کاردانی", "کارشناسی", "کارشناسی ارشد", "دکتری"]} />
        <Field label="نشانی محل سکونت" name="address" defaultValue={profile.address} />
      </Fieldset>

      <Fieldset title="اطلاعات سازمانی">
        <label>
          <span className="label">شرکت محل خدمت <span className="text-rose-500">*</span></span>
          <input name="company" list="companies" required defaultValue={profile.company ?? ""} className="input" placeholder="مثلاً شرکت جهاد نصر کرمان" />
          <datalist id="companies">{companies.map((c) => <option key={c} value={c} />)}</datalist>
        </label>
        <Field label="واحد سازمانی" name="department" defaultValue={profile.department} />
        <Field label="سمت" name="jobTitle" defaultValue={profile.jobTitle} />
        <SelectField label="نوع استخدام" name="employmentType" defaultValue={profile.employmentType as string} options={["رسمی", "قراردادی", "پیمانی", "پیمانکاری", "بازنشسته"]} />
        <SelectField label="شهر محل خدمت" name="city" required defaultValue={profile.city as string} options={cities} />
      </Fieldset>

      <Fieldset title="اطلاعات سلامت و ورزشی">
        <SelectField label="گروه خونی" name="bloodType" defaultValue={profile.bloodType as string} options={["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]} />
        <Field label="قد (سانتی‌متر)" name="height" defaultValue={profile.height} inputMode="numeric" dir="ltr" />
        <Field label="وزن (کیلوگرم)" name="weight" defaultValue={profile.weight} inputMode="numeric" dir="ltr" />
        <label className="sm:col-span-2 lg:col-span-3">
          <span className="label">سابقه بیماری، آسیب‌دیدگی یا محدودیت پزشکی</span>
          <textarea name="medicalNotes" rows={2} defaultValue={profile.medicalNotes ?? ""} className="input" placeholder="در صورت نداشتن، خالی بگذارید" />
        </label>
        <label className="sm:col-span-2 lg:col-span-3">
          <span className="label">سوابق و افتخارات ورزشی</span>
          <textarea name="sportHistory" rows={2} defaultValue={profile.sportHistory ?? ""} className="input" />
        </label>
        <div className="sm:col-span-2 lg:col-span-3">
          <span className="label">رشته‌های مورد علاقه</span>
          <div className="flex flex-wrap gap-2">
            {sports.map((s) => (
              <label key={s.id} className="cursor-pointer">
                <input type="checkbox" name="interests" value={s.id} defaultChecked={interests.includes(s.id)} className="peer sr-only" />
                <span className="inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 transition peer-checked:border-navy-700 peer-checked:bg-navy-800 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-navy-500/20">
                  {s.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </Fieldset>

      <Fieldset title="تماس اضطراری">
        <Field label="نام و نسبت" name="emergencyName" defaultValue={profile.emergencyName} placeholder="مثلاً علی رضایی (برادر)" />
        <Field label="شماره تماس اضطراری" name="emergencyPhone" defaultValue={profile.emergencyPhone} dir="ltr" inputMode="tel" />
      </Fieldset>
    </>
  );
}
