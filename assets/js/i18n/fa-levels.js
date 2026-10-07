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
  apis: "وب سرویس‌ها و اتوماسیون REST",
  pester: "تست واحد و Pester",
  internals: "موتور درونی، AST و ETS",
  hardening: "امنیت پیشرفته و سخت‌سازی",
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
  "functions-09": {
    seriesTitle: "توابع و ابزارها",
    name: "کلید ایمنی WhatIf",
    brief: "تعریف تابع با [CmdletBinding(SupportsShouldProcess)] و فراخوانی آن با -WhatIf.",
    learning: [
      "ویژگی SupportsShouldProcess",
      "بررسی $PSCmdlet.ShouldProcess",
      "سوئیچ ایمنی -WhatIf"
    ],
    fieldNotes: [
      "SupportsShouldProcess توابع سفارشی را به سوییچ ایمنی اجرای آزمایشی مجهز می‌کند.",
      "پیش از اجرای عملیات تخریبی روی سرور، ادمین باید بتواند اثر دستور را شبیه‌سازی کند."
    ],
  },
  "functions-10": {
    seriesTitle: "توابع و ابزارها",
    name: "اعتبارسنجی پیش‌شرط‌ها با ValidateScript",
    brief: "محدود کردن مقادیر ورودی تابع با ویژگی [ValidateScript({$_ -gt 0})].",
    learning: [
      "ویژگی اعتبارسنجی [ValidateScript]",
      "بررسی شروط ورودی در لایه بایندینگ",
      "جلوگیری از خطاهای زمان اجرا"
    ],
    fieldNotes: [
      "پیش‌شرط‌های تابع باید در امضای ورودی اعتبارسنجی شوند نه در بدنه کد.",
      "ورودی‌های نامعتبر قبل از شروع کار تابع متوقف می‌شوند."
    ],
  },
  "modules-06": {
    seriesTitle: "ماژول‌ها",
    name: "ساخت مانیفست ماژول",
    brief: "ایجاد فایل مانیفست .psd1 با New-ModuleManifest برای ماژول.",
    learning: [
      "فرمان New-ModuleManifest",
      "ساختار فراداده‌ای .psd1",
      "نسخه‌گذاری ماژول"
    ],
    fieldNotes: [
      "مانیفست ماژول هویت، نیازمندی‌ها و نگارش ابزارها را به صورت رسمی تعریف می‌کند.",
      "ماژول‌های تجاری و گالری پاورشل همیشه به فایل مانیفست معتبر نیاز دارند."
    ],
  },
  "modules-07": {
    seriesTitle: "ماژول‌ها",
    name: "اعتبارسنجی مانیفست",
    brief: "بررسی درستی مانیفست ماژول با Test-ModuleManifest.",
    learning: [
      "فرمان Test-ModuleManifest",
      "تایید درستی نگارش و مسیرها",
      "بررسی سلامت پکیج"
    ],
    fieldNotes: [
      "Test-ModuleManifest پیش از انتشار یا بارگذاری، از صحت فایل .psd1 اطمینان حاصل می‌کند.",
      "تضمین کیفیت خط لوله انتشار ماژول."
    ],
  },
  "apis-01": {
    seriesTitle: "وب سرویس‌ها و اتوماسیون REST",
    name: "درخواست وب سرویس REST",
    brief: "فراخوانی API گیت‌هاب با دستور Invoke-RestMethod (یا irm).",
    learning: [
      "فرمان Invoke-RestMethod (irm)",
      "تبدیل خودکار JSON به شیء",
      "ارتباط با سرویس‌های ابری"
    ],
    fieldNotes: [
      "Invoke-RestMethod پاسخ‌های JSON را بدون نیاز به پارس دستی به اشیاء PSCustomObject تبدیل می‌کند.",
      "نقاط پایانی وب دقیقاً مانند دستورات محلی پاورشل رفتار می‌کنند."
    ],
  },
  "apis-02": {
    seriesTitle: "وب سرویس‌ها و اتوماسیون REST",
    name: "استخراج پراپرتی‌های API",
    brief: "ذخیره پاسخ API در متغیر و دسترسی مستقیم به پراپرتی stars.",
    learning: [
      "دسترسی به ویژگی‌های شیء REST",
      "حرکت در ساختار سلسله‌مراتبی داده",
      "پردازش پاسخ وب"
    ],
    fieldNotes: [
      "پراپرتی‌های وب سرویس به شکل خواص بومی اشیاء پاورشل در دسترس هستند.",
      "داده‌های ابری در پایپ‌لاین جاری می‌شوند."
    ],
  },
  "apis-03": {
    seriesTitle: "وب سرویس‌ها و اتوماسیون REST",
    name: "احراز هویت با هدر Bearer",
    brief: "ارسال هدر احراز هویت Authorization Bearer با استفاده از هش‌تیبل.",
    learning: [
      "تنظیم پارامتر -Headers",
      "هش‌تیبل برای هدرهای HTTP",
      "احراز هویت با توکن Bearer"
    ],
    fieldNotes: [
      "هش‌تیبل‌ها به صورت مستقیم به هدرهای پروتکل HTTP نگاشت می‌شوند.",
      "رویکرد استاندارد اتصال به APIهای امن سازمانی."
    ],
  },
  "apis-04": {
    seriesTitle: "وب سرویس‌ها و اتوماسیون REST",
    name: "ارسال جهش با متد POST",
    brief: "ارسال بدنه JSON با متد HTTP POST و ContentType مناسب.",
    learning: [
      "متد -Method Post",
      "سریال‌سازی با ConvertTo-Json",
      "تنظیم application/json"
    ],
    fieldNotes: [
      "عملیات ایجاد و به‌روزرسانی در REST به متدهای POST/PUT و فرمت داده نیاز دارند.",
      "اتوماسیون کامل چرخه CRUD روی سرویس‌های ابری."
    ],
  },
  "apis-05": {
    seriesTitle: "وب سرویس‌ها و اتوماسیون REST",
    name: "بررسی لایه خام HTTP",
    brief: "استفاده از Invoke-WebRequest و بررسی کد وضعیت StatusCode.",
    learning: [
      "فرمان Invoke-WebRequest (iwr)",
      "بررسی StatusCode پروتکل HTTP",
      "دریافت هدرها و محتوای خام"
    ],
    fieldNotes: [
      "Invoke-WebRequest پاکت خام HTTP را به همراه هدرها و کدهای وضعیت برمی‌گرداند.",
      "برای تست سلامت شبکه و سایت‌ها ایده‌آل است."
    ],
  },
  "apis-06": {
    seriesTitle: "وب سرویس‌ها و اتوماسیون REST",
    name: "رمزنگاری رمزها با SecureString",
    brief: "تبدیل متن ساده به شیء رمزنگاری شده SecureString در حافظه.",
    learning: [
      "فرمان ConvertTo-SecureString",
      "رمزنگاری حافظه با DPAPI",
      "حفاظت از اطلاعات حساس"
    ],
    fieldNotes: [
      "SecureString اطلاعات حساس را در حافظه رمزنگاری می‌کند تا از افشای تصادفی جلوگیری شود.",
      "پسوردها نباید در متغیرهای متنی ساده ذخیره شوند."
    ],
  },
  "apis-07": {
    seriesTitle: "وب سرویس‌ها و اتوماسیون REST",
    name: "خروجی توکن رمزنگاری‌شده",
    brief: "تبدیل SecureString به رشته رمزنگاری‌شده استاندارد.",
    learning: [
      "فرمان ConvertFrom-SecureString",
      "کلیدهای رمزنگاری مختص کاربر",
      "ذخیره امن توکن‌ها روی دیسک"
    ],
    fieldNotes: [
      "ConvertFrom-SecureString توکن رمز شده با DPAPI و کلید کاربر ویندوز تولید می‌کند.",
      "مناسب برای ذخیره توکن‌ها جهت اسکریپت‌های اتوماتیک."
    ],
  },
  "apis-08": {
    seriesTitle: "وب سرویس‌ها و اتوماسیون REST",
    name: "مدیریت هویت با PSCredential",
    brief: "ایجاد شیء استاندارد PSCredential با نام کاربری و پسورد امن.",
    learning: [
      "شیء PSCredential",
      "فرمان Get-Credential",
      "هویت استاندارد در دستورات پاورشل"
    ],
    fieldNotes: [
      "PSCredential بستر مشترک انتقال هویت میان تمام دستورات ویندوز و ابری است.",
      "تفکیک امن نام کاربری از کلمه عبور."
    ],
  },
  "pester-01": {
    seriesTitle: "تست واحد و Pester",
    name: "نخستین ادعای تستی (Assertion)",
    brief: "پایپ کردن مقدار به Should -Be برای بررسی برابری مقدار.",
    learning: [
      "ادعای Should -Be",
      "فریم‌ورک Pester v5",
      "تست مستقیم در پایپ‌لاین"
    ],
    fieldNotes: [
      "Pester چارچوب استاندارد تست خودکار در اکوسیستم پاورشل است.",
      "Should به عنوان مرحله‌ای از خط لوله اعتبارسنجی را انجام می‌دهد."
    ],
  },
  "pester-02": {
    seriesTitle: "تست واحد و Pester",
    name: "ادعای نفی و نامساوی",
    brief: "بررسی نابرابری مقادیر با Should -Not -Be.",
    learning: [
      "ادعای Should -Not -Be",
      "تعریف مرزهای ایمنی و عدم تطابق",
      "پایش حالت‌های نامعتبر"
    ],
    fieldNotes: [
      "تست منفی بررسی می‌کند که سیستم وارد حالت‌های خطرساز یا اشتباه نشود.",
      "پایداری رفتار اسکریپت."
    ],
  },
  "pester-03": {
    seriesTitle: "تست واحد و Pester",
    name: "تست مقایسه‌ای آستانه‌ها",
    brief: "بررسی بزرگتر بودن عدد از آستانه با Should -BeGreaterThan.",
    learning: [
      "ادعای Should -BeGreaterThan",
      "تست آستانه‌های عددی",
      "پایش مصرف منابع و محدودیت‌ها"
    ],
    fieldNotes: [
      "تست ظرفیت دیسک، رم و پارامترهای عددی در محیط پروداکشن.",
      "اطمینان از ماندن شاخص‌ها بالای خط مجاز."
    ],
  },
  "pester-04": {
    seriesTitle: "تست واحد و Pester",
    name: "تست پرتاب استثنا",
    brief: "بررسی وقوع خطای مهلک با Should -Throw.",
    learning: [
      "ادعای Should -Throw",
      "تست سناریوهای شکست و خطا",
      "اعتبارسنجی مدیریت استثناها"
    ],
    fieldNotes: [
      "تست صحیح مسیرهای خطا به اندازه تست مسیرهای موفقیت حیاتی است.",
      "تضمین پرتاب استثنا در ورودی‌های غیرمجاز."
    ],
  },
  "pester-05": {
    seriesTitle: "تست واحد و Pester",
    name: "سوئیت‌های تستی (Describe و It)",
    brief: "ساماندهی تست‌ها با بلوک‌های Describe و It بر پایه BDD.",
    learning: [
      "بلوک Describe برای گروه‌بندی",
      "بلوک It برای هر سناریو",
      "ساختار BDD در تست‌نویسی"
    ],
    fieldNotes: [
      "Describe واحد عملکردی را نام‌گذاری می‌کند و It رفتار مشخص را می‌آزماید.",
      "خروجی گزارش تمیز و قابل خواندن برای گزارش‌های CI/CD."
    ],
  },
  "pester-06": {
    seriesTitle: "تست واحد و Pester",
    name: "تفکیک سناریوها با Context",
    brief: "دسته‌بندی شرایط خاص با بلوک‌های Describe، Context و It.",
    learning: [
      "بلوک Context",
      "تفکیک سناریوها بر پایه وضعیت",
      "ساختار سلسله‌مراتبی سوئیت‌ها"
    ],
    fieldNotes: [
      "Context پیش‌شرط‌ها و شرایط محیطی مختلف تست را جداسازی می‌کند.",
      "ساختار منظم برای پروژه‌های بزرگ سازمانی."
    ],
  },
  "pester-07": {
    seriesTitle: "تست واحد و Pester",
    name: "تست توابع سفارشی",
    brief: "تعریف تابع و سنجش عملکرد آن با تست‌های واحد Pester.",
    learning: [
      "تست توابع سفارشی",
      "جلوگیری از پسرفت کد (Regressions)",
      "ریفکتورینگ مطمئن"
    ],
    fieldNotes: [
      "تست واحد ضامن توسعه امن ابزارهای سفارشی پاورشل است.",
      "پیش از دیپلوی، عملکرد دقیق تابع را تضمین کنید."
    ],
  },
  "pester-08": {
    seriesTitle: "تست واحد و Pester",
    name: "ایزوله‌سازی با Mocking",
    brief: "شبیه‌سازی دستورات حساس با Mock برای تست بدون اثرات جانبی.",
    learning: [
      "دستور Mock",
      "جایگزینی دستورات مخرب یا بیرونی",
      "ایزولاسیون کامل تست"
    ],
    fieldNotes: [
      "Mocking اجازه می‌دهد بدون ریستارت سرور یا دستکاری دیسک، سناریو را بسنجید.",
      "تزریق وابستگی در سطح دستورات پوسته."
    ],
  },
  "internals-01": {
    seriesTitle: "موتور درونی، AST و ETS",
    name: "پارس کد با AST",
    brief: "تحلیل ساختار انتزاعی کد با [Language.Parser]::ParseInput.",
    learning: [
      "درخت نحو انتزاعی (AST)",
      "کلاس Language.Parser",
      "تحلیل ایستا (Static Analysis)"
    ],
    fieldNotes: [
      "پاورشل کدها را به صورت درخت نحوی تحلیل می‌کند نه رشته‌های متنی ساده.",
      "اساس کار ابزارهایی چون PSScriptAnalyzer بر پایه AST است."
    ],
  },
  "internals-02": {
    seriesTitle: "موتور درونی، AST و ETS",
    name: "پیمایش بلوک‌های AST",
    brief: "دسترسی به بلوک انتهایی کد با پراپرتی EndBlock در شیء AST.",
    learning: [
      "پراپرتی EndBlock",
      "پیمایش ساختار دستورات",
      "بازرسی امن بدون اجرا"
    ],
    fieldNotes: [
      "گره‌های AST ساختار ParamBlock، BeginBlock و EndBlock را نمایش می‌دهند.",
      "بازرسی امنیت و اعتبارسنجی ساختار بدون اجرای اسکریپت."
    ],
  },
  "internals-03": {
    seriesTitle: "موتور درونی، AST و ETS",
    name: "سامانه بسط نوع (ETS)",
    brief: "افزودن پراپرتی دینامیک ScriptProperty با Update-TypeData.",
    learning: [
      "سامانه Extended Type System",
      "فرمان Update-TypeData",
      "پراپرتی اسکریپتی ScriptProperty"
    ],
    fieldNotes: [
      "ETS به اشیاء دات‌نت موجود ویژگی‌ها و متدهای جدید الصاق می‌کند.",
      "سازگار کردن انواع خارجی با نیازمندی‌های پایپ‌لاین بدون تغییر کدهای کامپایل‌شده."
    ],
  },
  "internals-04": {
    seriesTitle: "موتور درونی، AST و ETS",
    name: "استعلام فراداده انواع (TypeData)",
    brief: "مشاهده اکستنشن‌های ثبت‌شده برای انواع با Get-TypeData.",
    learning: [
      "فرمان Get-TypeData",
      "بازرسی متادیتای ETS",
      "بررسی اعضای افزوده شده"
    ],
    fieldNotes: [
      "Get-TypeData تعاریف تطبیق‌یافته در سشن جاری را استخراج می‌کند.",
      "آشنایی با قلب توسعه شیءگرای پاورشل."
    ],
  },
  "internals-05": {
    seriesTitle: "موتور درونی، AST و ETS",
    name: "کامپایل درجا با Roslyn C#",
    brief: "کامپایل کلاس C# به حافظه با Add-Type -TypeDefinition.",
    learning: [
      "دستور Add-Type",
      "کامپایل دینامیک C# با رزلین",
      "پلی بین اسکریپت و دات‌نت"
    ],
    fieldNotes: [
      "Add-Type کدهای پرسرعت و Win32 API را مستقیماً وارد سشن پاورشل می‌کند.",
      "سرعت ماکزیمم دات‌نت همراه با انعطاف پوسته."
    ],
  },
  "internals-06": {
    seriesTitle: "موتور درونی، AST و ETS",
    name: "فراخوانی متدهای استاتیک C#",
    brief: "فراخوانی متد کلاسی که کامپایل کرده‌اید با ساختار [Class]::Method.",
    learning: [
      "نحو فراخوانی استاتیک [Class]::Method",
      "اجرای کدهای کامپایل‌شده",
      "همکاری اسکریپت و کد نیتیو"
    ],
    fieldNotes: [
      "دسترسی مستقیم و بدون واسطه به متدهای دات‌نت و کلاس‌های بومی.",
      "نهایت سرعت در عملیات محاسباتی سنگین."
    ],
  },
  "internals-07": {
    seriesTitle: "موتور درونی، AST و ETS",
    name: "شتاب‌دهنده‌های نوع (Type Accelerators)",
    brief: "تبدیل رشته‌ها به اشیاء معنایی با [version] و [ipaddress].",
    learning: [
      "شتاب‌دهنده [version]",
      "شتاب‌دهنده [ipaddress]",
      "اعتبارسنجی معنایی انواع"
    ],
    fieldNotes: [
      "Type Accelerators میانبرهای داخلی برای کلاس‌های اصلی فریم‌ورک دات‌نت هستند.",
      "مقایسه ورژن‌ها و آدرس‌های شبکه به صورت معنایی و ایمن."
    ],
  },
  "internals-08": {
    seriesTitle: "موتور درونی، AST و ETS",
    name: "تخصیص فضاهای اجرای Runspace",
    brief: "ایجاد و باز کردن ترد فوق‌سریع با [runspacefactory]::CreateRunspace.",
    learning: [
      "کلاس runspacefactory",
      "معماری Runspaces",
      "چندریسمانی (Multi-threading) سبک"
    ],
    fieldNotes: [
      "Runspaces امکان اجرای چندریسمانی فوق‌سریع را درون یک پروسس فراهم می‌سازند.",
      "بسیار سریع‌تر و کم‌مصرف‌تر از جاب‌های سنگین مبتنی بر پروسس."
    ],
  },
  "hardening-01": {
    seriesTitle: "امنیت پیشرفته و سخت‌سازی",
    name: "اعتبارسنجی هش کریپتوگرافیک",
    brief: "محاسبه هش SHA256 فایل با استفاده از Get-FileHash.",
    learning: [
      "فرمان Get-FileHash",
      "الگوریتم‌های SHA256 و SHA512",
      "تایید یکپارچگی فایل‌ها"
    ],
    fieldNotes: [
      "Get-FileHash اثر انگشت دیجیتالی فایل را برای مقابله با بدافزارها و دستکاری محاسبه می‌کند.",
      "سنگ بنای اعتبارسنجی بسته‌های دانلودی و سورس‌کدها."
    ],
  },
  "hardening-02": {
    seriesTitle: "امنیت پیشرفته و سخت‌سازی",
    name: "ثبت وقایع سشن (Transcription)",
    brief: "شروع ضبط رویدادها و دستورات سشن با Start-Transcript.",
    learning: [
      "فرمان Start-Transcript",
      "ثبت کامل جریان‌های ورودی و خروجی",
      "لاگ‌برداری برای ممیزی قانونی"
    ],
    fieldNotes: [
      "Transcription هر فرمانی که اجرا شود و خروجی آن را برای بازرسی‌های امنیتی در فایل ثبت می‌کند.",
      "الزام ممیزی و استاندارد انطباق در مراکز حساس داده."
    ],
  },
  "hardening-03": {
    seriesTitle: "امنیت پیشرفته و سخت‌سازی",
    name: "پایان رونویسی سشن",
    brief: "توقف رسمی ضبط سشن با Stop-Transcript.",
    learning: [
      "فرمان Stop-Transcript",
      "بستن فایل رونویسی و مهر زمانی",
      "مدیریت چرخه لاگ‌برداری"
    ],
    fieldNotes: [
      "بستن تمیز سشن‌های بازرسی شده و ذخیره متادیتا و زمان پایان.",
      "تضمین یکپارچگی فایل‌های لاگ تولیدی."
    ],
  },
  "hardening-04": {
    seriesTitle: "امنیت پیشرفته و سخت‌سازی",
    name: "تعریف قابلیت نقش JEA (.psrc)",
    brief: "ساخت فایل Role Capability (.psrc) برای مدیریت با حداقل اختیارات.",
    learning: [
      "فرمان New-PSRoleCapabilityFile",
      "فایل‌های .psrc در JEA",
      "محدودسازی به کمترین دسترسی (PoLP)"
    ],
    fieldNotes: [
      "JEA (Just Enough Administration) اجازه می‌دهد ادمین بدون داشتن دسترسی root کارهای مشخصی را انجام دهد.",
      "فقط دستورات و پارامترهای مجاز برای کاربر نمایان می‌شوند."
    ],
  },
  "hardening-05": {
    seriesTitle: "امنیت پیشرفته و سخت‌سازی",
    name: "پیکربندی سشن JEA (.pssc)",
    brief: "ساخت فایل کانفیگ سشن RestrictedRemoteServer با New-PSSessionConfigurationFile.",
    learning: [
      "فرمان New-PSSessionConfigurationFile",
      "فایل‌های .pssc",
      "حالت RestrictedRemoteServer"
    ],
    fieldNotes: [
      "تعیین نقاط پایانی مدیریت امن که در آن زبان پاورشل به حالت مقید تبدیل می‌شود.",
      "سخت‌سازی زیرساخت‌های سروری سازمانی."
    ],
  },
  "hardening-06": {
    seriesTitle: "امنیت پیشرفته و سخت‌سازی",
    name: "ثبت عمیق بلوک‌های اسکریپت (Logging)",
    brief: "مطالعه مستندات لاگ‌برداری عمیق امنیتی درباره رویداد 4104.",
    learning: [
      "مبحث about_Logging",
      "ثبت Script Block Logging",
      "شناسه رویداد Event ID 4104"
    ],
    fieldNotes: [
      "Event ID 4104 حتی کدهای مبهم و درهم‌ریخته (Obfuscated) را پس از دیکود در رویدادنگار ویندوز ذخیره می‌کند.",
      "قوی‌ترین خط دفاعی شناسایی بدافزارها در پاورشل."
    ],
  },
  "hardening-07": {
    seriesTitle: "امنیت پیشرفته و سخت‌سازی",
    name: "محدودسازی خط‌مشی به پروسس جاری",
    brief: "تنظیم RemoteSigned فقط برای پروسس جاری با -Scope Process.",
    learning: [
      "تنظیم -Scope Process",
      "تغییر موقت Execution Policy",
      "عدم دستکاری تنظیمات کلی سیستم"
    ],
    fieldNotes: [
      "اعمال خط‌مشی به محدوده Process بدون نیاز به دسترسی ادمین و بدون تغییر رجیستری کلی سیستم انجام می‌شود.",
      "ایزولاسیون کامل در محیط‌های خط لوله CI/CD."
    ],
  },
  "hardening-08": {
    seriesTitle: "امنیت پیشرفته و سخت‌سازی",
    name: "حالت زبان مقید (ConstrainedLanguage)",
    brief: "بازرسی وضعیت حالت زبان با $ExecutionContext.SessionState.LanguageMode.",
    learning: [
      "متغیر $ExecutionContext",
      "حالت ConstrainedLanguage",
      "یکپارچگی با AppLocker و WDAC"
    ],
    fieldNotes: [
      "Constrained Language فراخوانی متدهای دلخواه دات‌نت و دستکاری‌های حافظه را قفل می‌کند.",
      "استاندارد طلایی مایکروسافت در ماشین‌های ایمن‌سازی شده با دفاع لایه‌ای."
    ],
  },
};
