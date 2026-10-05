/**
 * Persian translations for LearnPowerShell levels and series.
 * Commands and syntax remain English/LTR.
 */

export const faSeries = {
  intro: "شروع کار",
  objects: "اشیاء و ویژگی‌ها",
  pipeline: "خط لوله (پایپ‌لاین)",
  discovery: "کشف و راهنما",
  language: "زبان و ساختار داده",
  flow: "کنترل جریان",
  functions: "توابع و ابزارها",
  errors: "مدیریت خطا و جریان‌ها",
  scope: "حوزه و اسکوپ",
  data: "فایل‌ها و داده‌ها",
  providers: "فراهم‌کننده‌ها (Providers)",
  remoting: "مدیریت از راه دور (Remoting)",
  modules: "ماژول‌ها",
  jobs: "پردازش‌های پس‌زمینه و CIM",
  security: "امنیت و خط‌مشی‌ها",
  formatting: "قالب‌بندی و خروجی",
  remix: "ترکیب و چالش‌های گلف",
  advanced: "مباحث پیشرفته",
  mastery: "آزمایشگاه تسلط",
};

export const faLevels = {
  "intro-01": {
    seriesTitle: "شروع کار",
    name: "سلام به دنیای پاورشل",
    brief: 'رشته‌ی Hello, PowerShell را با Write-Output وارد خط لوله کنید.',
    learning: [
      "دستور زبان فعل-اسم (Verb-Noun)",
      "جریان موفقیت (Success Stream)",
      "Write-Output اشیاء تولید می‌کند"
    ],
    fieldNotes: [
      "حتی یک رشته ساده در پاورشل شیء System.String است.",
      "پایپ‌لاین یک نقاله متحرک از اشیاء است نه یک لوله متن خام."
    ],
  },
  "intro-02": {
    seriesTitle: "شروع کار",
    name: "من کجای سیستم هستم؟",
    brief: "موقعیت فعلی سشن را با Get-Location برگردانید.",
    learning: [
      "شیء PathInfo",
      "نام‌های مستعار (Aliases)",
      "موقعیت سشن"
    ],
    fieldNotes: [
      "Get-Location شیء PathInfo برمی‌گرداند نه صرفاً یک رشته متنی.",
      "pwd نام مستعار است، نه ابزاری متفاوت."
    ],
  },
  "intro-03": {
    seriesTitle: "شروع کار",
    name: "بررسی اطراف",
    brief: "محتویات دایرکتوری فعلی را با Get-ChildItem لیست کنید.",
    learning: [
      "اشیاء FileInfo و DirectoryInfo",
      "دستور Get-ChildItem",
      "پراپرتی‌های فایل"
    ],
    fieldNotes: [
      "Length، Mode و LastWriteTime ویژگی‌های شیء هستند.",
      "سیستم فایل یک فراهم‌کننده شیء (Object Provider) است."
    ],
  },
  "intro-04": {
    seriesTitle: "شروع کار",
    name: "خواندن یادداشت‌ها",
    brief: "محتوای فایل data\\notes.txt را با Get-Content بخوانید.",
    learning: [
      "دستور Get-Content",
      "جریان رشته‌ها در پایپ‌لاین",
      "خواندن بدون تغییر ساختار"
    ],
    fieldNotes: [
      "Get-Content به ازای هر سطر یک شیء String تولید می‌کند.",
      "متن روی دیسک به اشیاء درون حافظه تبدیل می‌شود."
    ],
  },
  "intro-05": {
    seriesTitle: "شروع کار",
    name: "تغییر دایرکتوری",
    brief: "با Set-Location وارد پوشه docs شوید و در همان‌جا بمانید.",
    learning: [
      "دستور Set-Location",
      "مسیرهای نسبی و مطلق",
      "تغییر وضعیت سشن"
    ],
    fieldNotes: [
      "Set-Location موقعیت فعال فراهم‌کننده را تغییر می‌دهد.",
      "cd نام مستعار Set-Location است."
    ],
  },
  "intro-06": {
    seriesTitle: "شروع کار",
    name: "فیلتر کردن فهرست",
    brief: "فقط فایل‌های *.txt دایرکتوری جاری را با پارامتر -Filter لیست کنید.",
    learning: [
      "پارامتر -Filter در مبدا",
      "کاراکترهای عمومی (Wildcards)",
      "بهینه‌سازی کارایی"
    ],
    fieldNotes: [
      "فیلتر کردن در مبدا (Provider-side) بسیار سریع‌تر از فیلتر بعد از کل فهرست است.",
      "همیشه فیلتر را تا حد امکان زودتر در خط لوله اعمال کنید."
    ],
  },
  "objects-01": {
    seriesTitle: "اشیاء و ویژگی‌ها",
    name: "پروسس‌ها شیء هستند",
    brief: "تنها ویژگی‌های Name و Id را برای تمام پروسس‌ها استخراج کنید.",
    learning: [
      "دستور Get-Process",
      "دستور Select-Object",
      "فرافکنی پراپرتی‌ها (Projection)"
    ],
    fieldNotes: [
      "Select-Object شیء را لاغرتر می‌کند تا مراحل بعدی سربار کمتری داشته باشند.",
      "پاورشل جدول متن نیست؛ گراف اشیاء دات‌نت است."
    ],
  },
  "objects-02": {
    seriesTitle: "اشیاء و ویژگی‌ها",
    name: "فیلتر با Where-Object",
    brief: "پروسس‌هایی با مصرف CPU بالای ۵۰ را استخراج کنید.",
    learning: [
      "دستور Where-Object",
      "عملگرهای مقایسه (-gt, -lt, -eq)",
      "حذف داده‌های نامطلوب"
    ],
    fieldNotes: [
      "Where-Object بر اساس شرط روی پراپرتی‌ها اشیاء را فیلتر می‌کند.",
      "اشیاء ناموفق از روی نقاله خط لوله کنار گذاشته می‌شوند."
    ],
  },
  "objects-03": {
    seriesTitle: "اشیاء و ویژگی‌ها",
    name: "مرتب‌سازی پرمصرف‌ها",
    brief: "پروسس‌ها را به صورت نزولی بر اساس CPU مرتب کنید.",
    learning: [
      "دستور Sort-Object",
      "پارامتر -Descending",
      "مرتب‌سازی تایپ‌شده"
    ],
    fieldNotes: [
      "Sort-Object مقادیر تایپ‌شده عددی و رشته‌ای را بر اساس هویت مرتب می‌کند.",
      "مرتب‌سازی قبل از برش امکان انتخاب Top-N واقعی را می‌دهد."
    ],
  },
  "objects-04": {
    seriesTitle: "اشیاء و ویژگی‌ها",
    name: "سنجش و تجمیع",
    brief: "تعداد پروسس‌های در حال اجرا را با Measure-Object بشمارید.",
    learning: [
      "دستور Measure-Object",
      "توابع تجمیعی و Count",
      "تولید شیء خلاصه آماری"
    ],
    fieldNotes: [
      "Measure-Object جریان اشیاء را به آماره‌های تجمیعی تبدیل می‌کند.",
      "حاصل آن یک شیء MeasureInfo جدید در خط لوله است."
    ],
  },
  "objects-05": {
    seriesTitle: "اشیاء و ویژگی‌ها",
    name: "انتخاب و برش",
    brief: "تنها ۳ پروسس اول را همراه با Name و CPU برگردانید.",
    learning: [
      "پارامتر -First در Select-Object",
      "شمارش اشیاء به جای خطوط متنی",
      "ترکیب Map و Take"
    ],
    fieldNotes: [
      "-First تعداد اشیاء را برمی‌دارد، نه خطوط متنی را.",
      "برش تمیز در انتهای پایپ‌لاین."
    ],
  },
  "objects-06": {
    seriesTitle: "اشیاء و ویژگی‌ها",
    name: "نام‌های یکتا",
    brief: "نام‌های یکتای پروسس‌ها را با -Unique استخراج کنید.",
    learning: [
      "پارامتر -Unique",
      "حذف تکرارها در خط لوله",
      "یکتاسازی بر اساس هویت پراپرتی"
    ],
    fieldNotes: [
      "یکتاسازی پس از انتخاب پراپرتی انجام می‌شود.",
      "حذف افزونگی در خط لوله شیءگرا."
    ],
  },
  "pipeline-01": {
    seriesTitle: "خط لوله (پایپ‌لاین)",
    name: "سه مرحله در خط لوله",
    brief: "یک خط لوله ۳ مرحله‌ای: پروسس‌ها → فیلتر CPU بالای ۴۰ → انتخاب Name.",
    learning: [
      "ترکیب چند مرحله‌ای پایپ‌لاین",
      "انتقال اشیاء از دستوری به دستور دیگر",
      "زنجیره‌سازی عملیات"
    ],
    fieldNotes: [
      "منبع → تبدیل → شکل‌دهی ساختار.",
      "پایپ‌لاین پاورشل اشیاء را جابجا می‌کند نه بایت‌ها را."
    ],
  },
  "pipeline-02": {
    seriesTitle: "خط لوله (پایپ‌لاین)",
    name: "تکرار روی نام‌ها",
    brief: "با ForEach-Object نام هر پروسس را ساطع کنید.",
    learning: [
      "دستور ForEach-Object",
      "متغیر ویژه $_ (شیء جاری)",
      "عملیات به ازای هر آیتم"
    ],
    fieldNotes: [
      "$_ نمایانگر شیء جاری در حال عبور از لوله است.",
      "ForEach معادل map در برنامه‌نویسی تابعی است."
    ],
  },
};
