/**
 * Multi-Tier Cognitive Progression Engine for LearnPowerShell.
 * 
 * Provides 5 distinct cognitive depth tiers for every series and level:
 * - ELI5:   Pure physical metaphor (Lego, conveyor belts, envelopes, keycards, crash dummies)
 * - ELI10:  Practical mechanics, verbs, nouns, and shell rules
 * - ELI15:  Programming logic, data structures, streaming, parameters, typing
 * - ELI20:  Production DevOps, enterprise operations, performance, idempotency, security
 * - ELIPHD: Deep language internals, AST parsing, ETS type adaptation, DLR, CLR, DPAPI, AMSI
 */

export const DEPTH_TIERS = [
  { id: "eli5", icon: "🧸", label: "ELI5", titleEn: "Like I'm 5 (Pure Metaphor)", titleFa: "کودک ۵ ساله (تمثیل محض)", color: "#FF8C1A" },
  { id: "eli10", icon: "🎒", label: "ELI10", titleEn: "Like I'm 10 (Shell Rules)", titleFa: "نوجوان ۱۰ ساله (قوانین و مکانیک)", color: "#2DD4BF" },
  { id: "eli15", icon: "💻", label: "ELI15", titleEn: "Like I'm 15 (Code & Data)", titleFa: "دانش‌آموز ۱۵ ساله (کد و داده)", color: "#5B9DFF" },
  { id: "eli20", icon: "🚀", label: "ELI20", titleEn: "Like I'm 20 (Production Ops)", titleFa: "مهندس ۲۰ ساله (پروداکشن و دوآپس)", color: "#34D399" },
  { id: "eliphd", icon: "🔬", label: "ELIPHD", titleEn: "PhD (Compiler & Internals)", titleFa: "پژوهشگر دکترا (کامپایلر و کرنل)", color: "#F5C542" }
];

export const SERIES_DEPTHS = {
  intro: {
    eli5: {
      en: "The computer is a house with labeled rooms. You don't shout words into thin air; you send physical toy postcards that carry real information on the back.",
      fa: "کامپیوتر مثل یک خانه بزرگ با اتاق‌های برچسب‌دار است. شما کلمات را در هوا فریاد نمی‌زنید؛ بلکه کارت‌پستال‌های واقعی می‌فرستید که پشت آن‌ها اطلاعات فیزیکی ثبت شده است."
    },
    eli10: {
      en: "PowerShell speaks in Verb-Noun pairs (like Get-Location or Set-Location). Verbs are the action; nouns are the target. Aliases like 'dir' and 'cd' are just nicknames for these pairs.",
      fa: "پاورشل با دستورات دو کلمه‌ای «فعل-اسم» صحبت می‌کند (مثل Get-Location یا Set-Location). فعل یعنی چه کاری بکن و اسم یعنی روی چه چیزی. دستوراتی مثل dir و cd فقط نام‌های مستعار هستند."
    },
    eli15: {
      en: "The session maintains a PathInfo pointer in memory. Get-Content streams file rows as distinct System.String objects into the pipeline, ready for immediate downstream filtering.",
      fa: "سشن یک اشاره‌گر وضعیت PathInfo در حافظه نگه می‌دارد. دستور Get-Content سطرهای فایل را به شکل اشیاء رشته‌ای مجزا (System.String) درون خط لوله جاری می‌کند تا بلافاصله فیلتر شوند."
    },
    eli20: {
      en: "Hardcoded absolute paths break cross-platform automation. Production scripts resolve provider-qualified paths via $PSScriptRoot and verify item presence before mutating state.",
      fa: "مسیرهای ثابت و هاردکد شده در اتوماسیون‌های چندسکویی دچار شکست می‌شوند. اسکریپت‌های پروداکشن مسیرها را به کمک PSScriptRoot$ و کشف وضعیت آیتم‌ها مدیریت می‌کنند."
    },
    eliphd: {
      en: "SessionStateInternal coordinates the provider hierarchy. PathInfo encapsulates Drive, Provider, and ProviderPath with drive-qualified PSDrive resolution and path normalization.",
      fa: "سیستم SessionStateInternal ساختار سلسله‌مراتبی پرووایدرها را هدایت می‌کند. شیء PathInfo درایو، پرووایدر و مسیر واقعی را با اعتبارسنجی PSDrive کپسوله‌سازی می‌کند."
    }
  },
  objects: {
    eli5: {
      en: "Imagine a toy factory conveyor belt carrying LEGO cars. Each car has stickers showing its color, weight, and speed. You can pick off cars or read their stickers.",
      fa: "تصور کنید در کارخانه اسباب‌بازی یک تسمه‌نقاله در حال حرکت است که روی آن ماشین‌های لگویی قرار دارند. روی هر ماشین برچسب رنگ، وزن و سرعت چسبانده شده است."
    },
    eli10: {
      en: "PowerShell works with objects, not text lines. Where-Object is a bouncer checking criteria. Select-Object is a pair of scissors keeping only desired properties.",
      fa: "پاورشل با اشیاء هوشمند کار می‌کند نه با متن خام. دستور Where-Object مثل یک نگهبان بلیت‌ها را چک می‌کند و Select-Object مثل قیچی فقط ویژگی‌های دلخواه را نگه می‌دارد."
    },
    eli15: {
      en: "Commands emit typed .NET instances (e.g. System.Diagnostics.Process). Select-Object projects properties into new dynamic PSCustomObject instances without altering the underlying process.",
      fa: "دستورات نمونه‌های واقعی از کلاس‌های دات‌نت ساطع می‌کنند. Select-Object ویژگی‌ها را به اشیاء جدید و سبکتری از نوع PSCustomObject تبدیل می‌کند بدون اینکه پروسس اصلی تغییر کند."
    },
    eli20: {
      en: "Filter as early as possible. Using Where-Object early reduces working set memory. Sort-Object is an end-of-pipe blocking operation because it must buffer the full stream before sorting.",
      fa: "همیشه در نزدیک‌ترین نقطه به مبدا فیلتر کنید تا حافظه RAM مصرف نشود. دستور Sort-Object یک عملیات مسدودکننده است زیرا تا تمام اشیاء را در حافظه جمع نکند نمی‌تواند آن‌ها را مرتب کند."
    },
    eliphd: {
      en: "All pipeline elements are wrapped inside PSObject containers. The Extended Type System (ETS) dynamically exposes CLR properties, NoteProperties, and CodeProperties via cached reflection adapters.",
      fa: "تمام عناصر پایپ‌لاین درون کپسول‌های PSObject قرار می‌گیرند. سامانه Extended Type System ویژگی‌های CLR و NoteProperty را از طریق آداپتورهای کش‌شده بازتاب دات‌نت مدیریت می‌کند."
    }
  },
  pipeline: {
    eli5: {
      en: "An assembly line of workers: the first worker washes the apple, hands it to the second who slices it, and the third packs it. Nobody waits for a full bucket of apples before starting!",
      fa: "خط تولید یک کارگاه: اولین کارگر سیب را می‌شوید، بلافاصله به دومی می‌دهد تا خرد کند، و سومی آن را بسته‌بندی می‌کند. هیچ‌کس منتظر پر شدن کل سبد نمی‌ماند!"
    },
    eli10: {
      en: "The pipe character '|' connects commands together. The special variable '$_' (or $PSItem) means 'the specific item currently passing through my hands right now'.",
      fa: "علامت پایپ «|» دستورات را به هم وصل می‌کند. متغیر ویژه «_» (یا PSItem$) دقیقاً یعنی «همین آیتمی که همین الان از دست من رد می‌شود»."
    },
    eli15: {
      en: "Streaming pipeline semantics process items sequentially. ForEach-Object applies a script block to each item as it arrives without waiting for previous stages to finish enumerating.",
      fa: "مکانیسم استریمینگ پایپ‌لاین اشیاء را تک‌به‌تک پردازش می‌کند. ForEach-Object به محض رسیدن هر آیتم بلوک کد را اجرا می‌کند بدون اینکه نیاز به بارگذاری کل آرایه در رم باشد."
    },
    eli20: {
      en: "Balance pipeline streaming against array loops: 'foreach ($x in $list)' executes faster in-memory for small sets, but ForEach-Object prevents OutOfMemory exceptions on gigabyte-sized streams.",
      fa: "تعادل میان سرعت و حافظه: حلقه foreach برای داده‌های کم در رم سریع‌تر است، اما پایپ‌لاین ForEach-Object روی داده‌های چند گیگابایتی مانع از کرش رم (OOM) می‌شود."
    },
    eliphd: {
      en: "Pipeline execution is governed by PipelineProcessor. Each cmdlet implements BeginProcessing(), ProcessRecord(), and EndProcessing(), streaming via CommandProcessorBase channels without intermediate array buffers.",
      fa: "اجرای پایپ‌لاین توسط PipelineProcessor اداره می‌شود. هر دستور توابع BeginProcessing و ProcessRecord و EndProcessing را بدون تخصیص آرایه موقت پیاده‌سازی می‌کند."
    }
  },
  discovery: {
    eli5: {
      en: "You have a magic instruction book (Get-Help) and a magnifying glass (Get-Member). You never need to guess what a toy can do; you just look through the magnifying glass!",
      fa: "شما یک کتابچه جادویی راهنما (Get-Help) و یک ذره‌بین (Get-Member) دارید. هرگز نیازی به حدس زدن ندارید؛ فقط با ذره‌بین به اسباب‌بازی نگاه می‌کنید!"
    },
    eli10: {
      en: "Pipe any object to Get-Member (gm) to see all its properties and methods. Run Get-Help on any cmdlet to learn its parameters and see practical examples.",
      fa: "هر شیئی را به Get-Member وصل کنید تا تمام ویژگی‌ها و کارهای ممکن را ببینید. با Get-Help هم نمونه مثال‌ها و پارامترهای رسمی را مطالعه کنید."
    },
    eli15: {
      en: "Get-Command discovers cmdlets, functions, and aliases across modules. Get-Member inspects TypeNames and distinguishes between Properties (data) and Methods (actions).",
      fa: "دستور Get-Command ساختار تمام دستورات، توابع و نام‌های مستعار را استخراج می‌کند. Get-Member نیز تفکیک ویژگی‌ها (داده) از متدها (عملیات) را نمایش می‌دهد."
    },
    eli20: {
      en: "Use 'Get-Command -Syntax' for compact parameter set validation in scripts. Run 'Update-Help' in build pipelines to package offline help documentation for disconnected air-gapped environments.",
      fa: "از Get-Command -Syntax برای بررسی قراردادهای پارامتر در اسکریپت‌ها استفاده کنید. در محیط‌های ایزوله سازمانی نیز داکیومنت‌ها را با Update-Help آفلاین نگه دارید."
    },
    eliphd: {
      en: "CommandDiscovery resolves invocation targets using resolution precedence: Alias -> Function -> Filter -> Cmdlet -> Script -> Application. Get-Member reads metadata from DotNetAdapter and Extended Type System XML caches.",
      fa: "سیستم CommandDiscovery با اولویت‌بندی مستعار -> تابع -> فیلتر -> Cmdlet -> اسکریپت -> فایل باینری هدف را پیدا می‌کند. Get-Member نیز تعاریف را از DotNetAdapter و فایل‌های types.ps1xml می‌خواند."
    }
  },
  language: {
    eli5: {
      en: "A hashtable is a chest of drawers with name tags on each drawer. An array is a train of numbered wagons carrying items in a specific order.",
      fa: "یک هش‌تیبل مثل یک کمد با کشوهای دارای برچسب اسم است. یک آرایه مثل یک قطار با واگن‌های شماره‌گذاری‌شده است که وسایل را به ترتیب حمل می‌کند."
    },
    eli10: {
      en: "PowerShell uses text operators: -eq (equals), -ne (not equal), -gt (greater than), and -match (regex) because symbols like '>' and '<' were already used for file redirection.",
      fa: "پاورشل از عملگرهای حروفی استفاده می‌کند: eq- (برابر)، gt- (بزرگتر) و match- (تطابق الگو)؛ چون علامت‌های < و > برای ذخیره در فایل رزرو شده بودند."
    },
    eli15: {
      en: "PowerShell coerces operand types based on the left-hand operand. Arrays instantiated with @() are fixed-size; using '+=' dynamically creates an entirely new array in memory.",
      fa: "تبدیل نوع خودکار بر اساس سمت چپ عملگر رخ می‌دهد. آرایه‌های ساخته شده با ()@ اندازه ثابت دارند و استفاده از =+ یک آرایه کاملاً جدید در حافظه می‌سازد."
    },
    eli20: {
      en: "Avoid '+=' in high-iteration loops over 5,000 items (O(N^2) memory reallocation penalty). Use System.Collections.Generic.List[T] or ArrayList for fast dynamic appending.",
      fa: "در حلقه‌های پرتکرار بالای ۵۰۰۰ آیتم از =+ اجتناب کنید چون حافظه را به شدت هدر می‌دهد. به جای آن از List[T] دات‌نت یا جریان مستقیم پایپ‌لاین استفاده کنید."
    },
    eliphd: {
      en: "The Dynamic Language Runtime (DLR) invokes LanguagePrimitives.Compare() for relational evaluation. Regular expressions compile into cached System.Text.RegularExpressions.Regex instances populating $Matches.",
      fa: "ران‌تایم DLR از تابع LanguagePrimitives.Compare برای مقایسه‌ها استفاده می‌کند. عبارات منظم با انجین Regex دات‌نت کامپایل و گروه‌های کپچر در Matches$ ثبت می‌شوند."
    }
  },
  flow: {
    eli5: {
      en: "A train track switch: if the light is green, the train turns left; if red, it turns right. 'Switch' is a train station with multiple platform tracks.",
      fa: "یک سوزن ریل قطار: اگر چراغ سبز باشد قطار به چپ می‌رود؛ اگر قرمز باشد به راست. دستور Switch مثل یک ایستگاه با سکوهای مختلف است."
    },
    eli10: {
      en: "Use 'if' to test a condition. Use 'foreach' to loop over every item in a list. Use 'switch' when testing one value against many possible choices.",
      fa: "از if برای شرط‌ها استفاده کنید. از foreach برای تکرار روی تک‌تک اعضای یک لیست کمک بگیرید و از switch برای انتخاب بین چندین گزینه استفاده کنید."
    },
    eli15: {
      en: "PowerShell truthiness evaluates $null, 0, and empty strings as false; non-empty collections evaluate as true. The switch statement natively supports regex and wildcard pattern matching.",
      fa: "مقادیر null$ و ۰ و رشته خالی معادل نادرست (false) و مجموعه‌های پر معادل درست (true) هستند. دستور switch ذاتاً از وایلدکارت و الگوهای ریجکس پشتیبانی می‌کند."
    },
    eli20: {
      en: "Replace deep nested if/else ladders with guard clauses ('if (!cond) return'). Guard against infinite while loops in production services by implementing timeout guards.",
      fa: "به جای ساختارهای تودرتوی عمیق، از گارد کلاز (Guard Clause) برای خروج زودهنگام استفاده کنید. حلقه‌های while پروداکشن را همیشه به گارد سقف شمارش مجهز کنید."
    },
    eliphd: {
      en: "Control flow statements are represented as IfStatementAst and SwitchStatementAst nodes compiled into DLR expression trees or interpreted via the Abstract Syntax Tree evaluator.",
      fa: "جریان‌های کنترلی به شکل گره‌های IfStatementAst و SwitchStatementAst در درخت نحو کامپایل شده یا توسط مفسر DLR اجرا می‌شوند."
    }
  },
  functions: {
    eli5: {
      en: "Building your own custom super-tool! With '-WhatIf', you have a practice simulator that tells you what the tool would do without breaking anything in real life.",
      fa: "ساختن یک ابزار همه‌کاره‌ی اختصاصی! با کلید WhatIf- یک شبیه‌ساز آزمایشی دارید که می‌گوید دستور چه کار خواهد کرد بدون اینکه در دنیای واقعی به چیزی دست بزند."
    },
    eli10: {
      en: "A function is a named recipe. You declare its ingredients using 'param(...)'. Adding '[CmdletBinding()]' gives it professional switches like -Verbose and -WhatIf.",
      fa: "یک تابع مثل یک دستور پخت نام‌گذاری‌شده است. مواد اولیه را در (...)param مشخص می‌کنید و با CmdletBinding سوییچ‌های حرفه‌ای مثل Verbose- را دریافت می‌کنید."
    },
    eli15: {
      en: "Splatting (@params) passes parameter hashtables cleanly. SupportsShouldProcess enables $PSCmdlet.ShouldProcess(). ValidateScript asserts preconditions before function execution.",
      fa: "اسپلتینگ (params@) پارامترها را با هش‌تیبل پاس می‌دهد. ویژگی SupportsShouldProcess سوییچ ایمنی WhatIf- را فعال و ValidateScript ورودی را قبل از اجرا اعتبارسنجی می‌کند."
    },
    eli20: {
      en: "Production tools must always declare SupportsShouldProcess for state mutations. Restrict parameters with ValidateSet and ValidateScript to guard the function perimeter.",
      fa: "ابزارهای پروداکشن برای عملیات تخریبی یا تغییردهنده باید SupportsShouldProcess داشته باشند و ورودی‌ها را در لایه امضا با ValidateSet محدود کنند."
    },
    eliphd: {
      en: "CmdletParameterBinderController binds pipeline and positional arguments to CommandProcessor targets. SupportsShouldProcess implements the ICommandRuntime.ShouldProcess contract.",
      fa: "کنترلر CmdletParameterBinderController پارامترها را از ورودی پایپ‌لاین و آرگومان‌ها متصل می‌کند. ویژگی SupportsShouldProcess قرارداد ICommandRuntime را صدا می‌زند."
    }
  },
  errors: {
    eli5: {
      en: "A safety net and a clean-up crew: the safety net (catch) catches the falling cup before it smashes. And 'finally' washes your hands afterward, no matter what happened!",
      fa: "تور ایمنی و تیم نظافت: تور ایمنی (catch) فنجان در حال سقوط را قبل از شکستن روی زمین می‌گیرد. و finally فارغ از هر اتفاقی، در پایان همه چیز را تمیز می‌کند!"
    },
    eli10: {
      en: "By default, minor errors don't stop a script. Add '-ErrorAction Stop' to turn them into terminating errors that 'try/catch' can intercept.",
      fa: "به طور پیش‌فرض خطاهای کوچک اسکریپت را متوقف نمی‌کنند. با اضافه کردن ErrorAction Stop- آن‌ها را مهلک کنید تا بلوک try/catch بتواند آن‌ها را شکار کند."
    },
    eli15: {
      en: "PowerShell splits output into 6 streams (Success, Error, Warning, Verbose, Debug, Info). Inside catch, '$_' represents the ErrorRecord containing CategoryInfo and Exception.",
      fa: "پاورشل خروجی را به ۶ جریان مجزا تقسیم می‌کند. داخل بلوک catch متغیر «_» شیء کامل ErrorRecord است که شامل متن استثنا، کد خطا و تارگت است."
    },
    eli20: {
      en: "Never write empty catch {} blocks. Log FullyQualifiedErrorId and stack traces to telemetry. Always clean up unmanaged connections (sessions, file streams) in 'finally'.",
      fa: "هرگز بلوک خالی catch ننویسید. اطلاعات خطا و شناسه آن را در لاگ ثبت کنید و در بلوک finally تمام کانکشن‌ها و سشن‌های باز را حتماً ببندید."
    },
    eliphd: {
      en: "Errors are encapsulated as System.Management.Automation.ErrorRecord instances. The engine routes non-terminating errors to Stream 2 and bubbles terminating exceptions through ActionPreferenceHandler.",
      fa: "خطاها درون کلاس ErrorRecord قرار می‌گیرند. خطاهای غیرمهلک به جریان ۲ هدایت شده و خطاهای مهلک توسط هندلر ActionPreferenceHandler ردیابی می‌شوند."
    }
  },
  scope: {
    eli5: {
      en: "The bedroom vs the public playground: toys in your bedroom (local) cannot be seen by other kids outside. Toys put in the town square (global) belong to everyone.",
      fa: "اتاق خواب خصوصی در برابر پارک عمومی: اسباب‌بازی‌های داخل اتاق (local) برای بقیه نامرئی هستند، اما اسباب‌بازی‌های وسط میدان شهر (global) مال همه هستند."
    },
    eli10: {
      en: "Variables created inside a function disappear when the function finishes. Use '$script:name' if you want a variable to live across the whole script file.",
      fa: "متغیرهایی که داخل تابع تعریف می‌شوند، با پایان کار تابع محو می‌شوند. اگر می‌خواهید متغیر در کل فایل اسکریپت بماند، از پیشوند script: استفاده کنید."
    },
    eli15: {
      en: "PowerShell uses dynamic scoping: child scopes can read parent variables, but writing to a variable creates a local copy unless explicit scope modifiers ($script:, $global:) are used.",
      fa: "پاورشل اسکوپ پویا دارد: توابع فرزند می‌توانند متغیرهای والد را بخوانند، اما نوشتن مقدار جدید یک متغیر محلی جدید می‌سازد مگر اینکه اسکوپ مشخص شود."
    },
    eli20: {
      en: "Avoid polluting $global: in enterprise modules to prevent namespace collisions. Encapsulate shared state inside module scope using $script: modifiers.",
      fa: "در ماژول‌های سازمانی از دستکاری اسکوپ global خودداری کنید تا با بقیه ابزارها تداخل نکند. داده‌های مشترک را در محدوده همان اسکریپت ماژول ($script) ایزوله نگه دارید."
    },
    eliphd: {
      en: "The runtime maintains a linked SessionStateScope stack. Variable resolution traverses parent frames; write operations allocate local ScopedItem entries unless flagged with ScopedItemOptions.",
      fa: "ران‌تایم پشته‌ای از فریم‌های SessionStateScope نگه می‌دارد. جستجوی متغیر زنجیره والد را پیمایش می‌کند و عمل نوشتن متغیر را در فریم جاری مقید می‌سازد."
    }
  },
  data: {
    eli5: {
      en: "A universal translator: you can turn a spreadsheet into living LEGO blocks in memory, and then save them back into a clean CSV or JSON file whenever you want.",
      fa: "یک مترجم همه‌کاره: می‌توانید فایل اکسل یا متنی را به آجرهای زنده در حافظه تبدیل کنید و هر وقت خواستید دوباره آن را در یک فایل تر و تمیز CSV یا JSON ذخیره کنید."
    },
    eli10: {
      en: "Import-Csv turns text rows into objects with column names as properties. ConvertTo-Json serializes objects into text you can send over the web.",
      fa: "فرمان Import-Csv سطرهای متن را به اشیائی تبدیل می‌کند که نام ستون‌ها پراپرتی آن‌هاست. ConvertTo-Json نیز اشیاء را برای تبادل در وب آماده می‌کند."
    },
    eli15: {
      en: "CSV flattens objects to 2D tables of strings. JSON maintains hierarchical trees. Tee-Object splits the pipeline stream to both save to a file and continue streaming.",
      fa: "فایل CSV اشیاء را به جدول دو‌بعدی تخت تبدیل می‌کند. JSON ساختار درختی چندسطحی را نگه می‌دارد. Tee-Object خروجی را هم‌زمان هم در فایل می‌نویسد و هم عبور می‌دهد."
    },
    eli20: {
      en: "Always enforce UTF8 encoding without BOM ('-Encoding utf8NoBOM') for modern web cross-platform files. Set '-Depth' explicitly in ConvertTo-Json to prevent truncation of deep telemetry data.",
      fa: "در اسکریپت‌های چندسکویی همیشه انکودینگ UTF8 بدون BOM را مشخص کنید. در ConvertTo-Json حتماً عمق Depth- را مشخص کنید تا داده‌های تو‌در‌تو بریده نشوند."
    },
    eliphd: {
      en: "Export cmdlets invoke internal serializer pipelines. Objects are flattened into PSCustomObject note-property maps, stripping live CLR methods while serializing type identity.",
      fa: "دستورات Export پایپ‌لاین سریال‌سازی داخلی را صدا می‌زنند. اشیاء به نگاشت‌های NoteProperty تبدیل شده و متدهای اجرایی در طول فرآیند ذخیره حذف می‌شوند."
    }
  },
  providers: {
    eli5: {
      en: "Exploring completely different worlds using the exact same flashlight: you can use 'cd' and 'dir' on files, Windows settings (Registry), and certificates!",
      fa: "گشت‌و‌گذار در دنیاهای مختلف با همان چراغ‌قوه‌ی همیشگی: می‌توانید با دستورات آشنای cd و dir در فایل‌ها، تنظیمات رجیستری و گواهینامه‌ها جستجو کنید!"
    },
    eli10: {
      en: "Every system hierarchy looks like a drive letter: 'Env:' is for environment variables, 'HKLM:' is for the Registry, and 'Cert:' is for security certificates.",
      fa: "هر بخش ویندوز مثل یک درایو به نظر می‌رسد: درایو :Env برای متغیرهای سیستمی، درایو :HKLM برای رجیستری و درایو :Cert برای گواهینامه‌های امنیتی است."
    },
    eli15: {
      en: "Providers map non-filesystem hierarchical databases to the common item cmdlets (Get-Item, Set-Item). Push-Location and Pop-Location manage directory history on a stack.",
      fa: "پرووایدرها پایگاه‌های داده غیرفایلی را به دستورات استاندارد پاورشل متصل می‌کنند. Push-Location و Pop-Location نیز تاریخچه دایرکتوری‌ها را در یک پشته مدیریت می‌کنند."
    },
    eli20: {
      en: "Use provider paths instead of external legacy executables (e.g. reg.exe or certutil.exe) for structured, testable, and scriptable infrastructure configuration.",
      fa: "به جای استفاده از برنامه‌های قدیمی مثل reg.exe یا certutil.exe، از مسیرهای پرووایدر پاورشل استفاده کنید تا اسکریپت‌های شما ساختاریافته و تست‌پذیر باشند."
    },
    eliphd: {
      en: "Custom providers extend NavigationCmdletProvider and DriveCmdletProvider. The engine translates ItemCmdlet requests into provider-specific IContentCmdletProvider transaction interfaces.",
      fa: "پرووایدرهای سفارشی از NavigationCmdletProvider ارث‌بری می‌کنند. انجین درخواست‌ها را به اینترفیس‌های سیستمی IContentCmdletProvider ترجمه می‌کند."
    }
  },
  remoting: {
    eli5: {
      en: "A remote-control robot: you sit on your sofa and send a command to 10 computers across the country. They do the work over there and send back only the final answer!",
      fa: "ربات کنترل از راه دور: روی مبل می‌نشینید و به ۱۰ کامپیوتر در آن سر کشور فرمان می‌دهید. آن‌ها کار را همان‌جا انجام می‌دهند و فقط نتیجه نهایی را برمی‌گردانند!"
    },
    eli10: {
      en: "Invoke-Command -ComputerName runs scripts on other machines. Use '$using:variableName' to pass a value from your local machine into the remote script block.",
      fa: "دستور Invoke-Command کد را روی کامپیوترهای دیگر اجرا می‌کند. با نوشتن using:myVar$ می‌توانید مقدار متغیر کامپیوتر خودتان را به کامپیوتر مقصد بفرستید."
    },
    eli15: {
      en: "Remoting runs parallel connections over WinRM or SSH. Objects returned over the network are 'deserialized' snapshots: they keep their property values, but lose live methods.",
      fa: "ریموتینگ ارتباطات موازی را روی پروتکل‌های WinRM یا SSH باز می‌کند. اشیاء بازگشتی دیسریالایز شده هستند: پراپرتی‌ها حفظ می‌شوند اما متدهای زنده غیرفعالند."
    },
    eli20: {
      en: "Always push filtering and aggregation to the remote side ({ Get-Process | Measure-Object }) rather than pulling millions of raw objects across the enterprise network.",
      fa: "همیشه فیلتر و محاسبه را در سمت سرور مقصد انجام دهید و نتیجه کم‌حجم را بگیرید؛ هرگز میلیون‌ها شیء خام را در بستر شبکه شرکت جابجا نکنید."
    },
    eliphd: {
      en: "PowerShell Remoting Protocol (PSRP) packages CLIXML fragments over WS-Management (ports 5985/5986) or OpenSSH. Rehydrated objects arrive stamped with 'Deserialized.' type prefixes.",
      fa: "پروتکل PSRP قطعات CLIXML را روی پروتکل WS-Management یا OpenSSH ارسال می‌کند. اشیاء در مقصد با پیشوند Deserialized در تایپ‌نیم بازسازی می‌شوند."
    }
  },
  modules: {
    eli5: {
      en: "An official toy toolkit: the maker packs all the cool tools inside. They only let you touch the front tools, while keeping their secret wires and parts safely hidden inside.",
      fa: "جعبه‌ابزار رسمی: سازنده تمام ابزارها را درون آن بسته‌بندی کرده است. فقط ابزارهای بیرونی را به شما نشان می‌دهد و قطعات محرمانه را درون جعبه مخفی نگه می‌دارد."
    },
    eli10: {
      en: "A module (.psm1) groups reusable functions together. Export-ModuleMember controls which functions are public. A manifest (.psd1) describes the version and author.",
      fa: "یک ماژول (فایل psm1.) توابع کاربردی را یکجا جمع می‌کند. Export-ModuleMember توابع عمومی را مشخص کرده و مانیفست (psd1.) مشخصات سازنده و نسخه را نگه می‌دارد."
    },
    eli15: {
      en: "Module manifests (.psd1) declare required modules, versions, and exported cmdlets. Modules execute in their own isolated SessionState, preventing internal variable leaks.",
      fa: "مانیفست‌های ماژول پیش‌نیازها و نسخه‌ها را تعیین می‌کنند. ماژول‌ها در SessionState ایزوله خودشان اجرا می‌شوند تا متغیرهای داخلی‌شان به بیرون درز نکند."
    },
    eli20: {
      en: "Automate module CI/CD with Test-ModuleManifest, semantic versioning, and Pester tests. Use New-ModuleManifest to generate production-ready manifests for PowerShell Gallery publication.",
      fa: "چرخه انتشار ماژول را با Test-ModuleManifest، نسخه‌گذاری معنایی و تست‌های Pester خودکار کنید و فایل‌های استاندارد آماده انتشار در گالری بسازید."
    },
    eliphd: {
      en: "Import-Module instantiates a PSModuleInfo instance bound to an isolated SessionState. Exported command metadata merges into the parent caller's CommandDiscovery lookup table.",
      fa: "فرمان Import-Module شیء PSModuleInfo متصل به SessionState ایزوله را می‌سازد. متادیتای دستورات اکسپورت‌شده در جدول جستجوی CommandDiscovery ادغام می‌شوند."
    }
  },
  jobs: {
    eli5: {
      en: "Hiring an assistant in another room: you give them a big stack of papers to count, and you go back to playing. When they finish, you knock on their door and ask for the total.",
      fa: "استخدام دستیار در اتاق پشتی: یک دسته کاغذ به او می‌دهید تا بشمارد و خودتان به بازی ادامه می‌دهید. وقتی کارش تمام شد، در می‌زنید و نتیجه را تحویل می‌گیرید."
    },
    eli10: {
      en: "Start-Job runs a task in the background so your terminal doesn't freeze. Use Receive-Job to get the results, and Remove-Job to clean up finished jobs.",
      fa: "دستور Start-Job کار را در پس‌زمینه انجام می‌دهد تا ترمینال قفل نشود. با Receive-Job نتیجه را دریافت کنید و با Remove-Job جاب‌های تمام‌شده را پاک کنید."
    },
    eli15: {
      en: "Jobs run in independent child processes. They accumulate in the session job table until cleaned. Receive-Job with -Keep preserves data for multiple reads.",
      fa: "جاب‌ها در پروسس‌های جداگانه اجرا می‌شوند و تا زمانی که پاک نشوند در جدول سشن می‌مانند. سوییچ Keep- اجازه می‌دهد داده را چند بار دریافت کنید."
    },
    eli20: {
      en: "In modern PowerShell 7+, prefer 'ForEach-Object -Parallel' or runspaces for lightweight multi-threading instead of heavy background process jobs (which consume ~30MB per job).",
      fa: "در پاورشل مدرن، از ForEach-Object -Parallel یا Runspaces برای مالتی‌ترد سبک استفاده کنید، زیرا هر جاب سنتی یک پروسس سنگین با حدود ۳۰ مگابایت رم ایجاد می‌کند."
    },
    eliphd: {
      en: "The JobSourceAdapter tracks background job state machines (NotStarted -> Running -> Completed). Data serialization between child host processes and the parent session occurs via NamedPipes IPC.",
      fa: "سیستم JobSourceAdapter ماشین وضعیت جاب‌ها را مدیریت می‌کند. انتقال داده میان پروسس فرزند و سشن والد از طریق لوله‌های ارتباط بین‌پروسسی NamedPipes انجام می‌شود."
    }
  },
  security: {
    eli5: {
      en: "The stair safety rail and the royal wax stamp: execution policy is a handrail stopping you from accidentally falling. Digital signing is the wax seal proving the king wrote the letter.",
      fa: "نرده‌ی پله و مهر موم پادشاه: خط‌مشی اجرا مثل نرده پله است تا تصادفی سقوط نکنید. امضای دیجیتال هم مهر و مومی است که ثابت می‌کند نامه اصل است."
    },
    eli10: {
      en: "Execution policies (like RemoteSigned) stop accidental script runs from unknown internet downloads. You can set them per-process without administrator permissions.",
      fa: "خط‌مشی اجرا (مانند RemoteSigned) مانع از اجرای تصادفی اسکریپت‌های دانلودی اینترنت می‌شود. می‌توانید آن را بدون نیاز به دسترسی ادمین روی پروسس جاری تنظیم کنید."
    },
    eli15: {
      en: "Authenticode signatures verify script origin using X.509 certificates. Under AllSigned policy, any script without a valid trusted publisher signature is blocked from executing.",
      fa: "امضاهای Authenticode با گواهینامه X.509 اصالت اسکریپت را تایید می‌کنند. در خط‌مشی AllSigned هر اسکریپتی که امضای معتبر نداشته باشد مسدود می‌شود."
    },
    eli20: {
      en: "Execution policy is NOT a security boundary (it can be bypassed with -ExecutionPolicy Bypass). Real enterprise hardening requires AppLocker, WDAC, and ConstrainedLanguage mode.",
      fa: "خط‌مشی اجرا یک مرز امنیتی نفوذناپذیر نیست (با Bypass قابل دور زدن است). امنیت واقعی نیازمند AppLocker، خط‌مشی WDAC و حالت زبان مقید (ConstrainedLanguage) است."
    },
    eliphd: {
      en: "Signature validation invokes Win32 WinVerifyTrust through the Cryptographic Service Provider (CSP). The Authenticode signature block is stored as a detached PKCS#7 signed block at the EOF.",
      fa: "اعتبارسنجی امضا تابع Win32 WinVerifyTrust را صدا می‌زند. بلوک امضای دیجیتال به شکل امضای پیوست‌شده PKCS#7 در انتهای فایل ذخیره شده است."
    }
  },
  formatting: {
    eli5: {
      en: "Painting a picture at the very end: formatting is putting the finished photo in a glass frame. You only do it at the very last step, because once it's behind glass, you can't play with it anymore!",
      fa: "قاب کردن نقاشی در مرحله آخر: فرمت‌بندی یعنی عکس تمام‌شده را داخل قاب شیشه‌ای بگذارید. این کار فقط باید در آخرین مرحله انجام شود چون دیگر دسترسی به خود شیء ندارید!"
    },
    eli10: {
      en: "Format commands (Format-Table, Format-List) must ALWAYS go at the end of the pipeline. Never put Format-Table before Where-Object or Measure-Object!",
      fa: "دستورات قالب‌بندی (Format-Table و Format-List) همیشه باید در انتهای لوله باشند. هرگز قبل از Where-Object یا Measure-Object از فرمت استفاده نکنید!"
    },
    eli15: {
      en: "Format cmdlets emit formatting directives (FormatStartData, FormatEntryData), not text strings. Downstream cmdlets cannot extract real object properties from format records.",
      fa: "دستورات Format اشیاء را به دستورالعمل‌های نمایشی گرافیکی تبدیل می‌کنند نه به رشته‌های متنی عادی. دستورات بعدی لوله دیگر به ویژگی‌های اصلی شیء دسترسی ندارند."
    },
    eli20: {
      en: "Tools and functions must NEVER call Format-Table internally. Always return raw, rich objects and let the interactive user choose how they wish to display or export them.",
      fa: "ابزارها و توابع هرگز نباید درون خودشان Format-Table صدا بزنند. همیشه شیء غنی و خام تحویل دهید و انتخاب نحوه نمایش را به عهده کاربر یا خط لوله بگذارید."
    },
    eliphd: {
      en: "The Format and Out (F&O) subsystem processes types.ps1xml and format.ps1xml definitions. FormatObject streams are converted into character grids by Out-Default and ConsoleHost.",
      fa: "زیرسیستم Format & Out تعاریف فایل‌های format.ps1xml را ارزیابی می‌کند. جریان‌های FormatObject توسط Out-Default به ماتریس کاراکترهای کنسول تبدیل می‌شوند."
    }
  },
  remix: {
    eli5: {
      en: "The master builder: you don't just play with one toy anymore. You connect the tracks, the factory belt, the safety switches, and the translation boxes into a living city!",
      fa: "مهندس ارشد: شما دیگر فقط با یک اسباب‌بازی بازی نمی‌کنید. ریل‌های قطار، تسمه‌نقاله، کلیدهای ایمنی و جعبه‌های ترجمه را به یک شهر کامل و زنده تبدیل می‌کنید!"
    },
    eli10: {
      en: "PowerShell golf and clean pipelines: solving real administration tasks by composing 3-4 stages together without saving messy intermediate files.",
      fa: "ترکیب تمیز خط لوله: حل مسائل واقعی مدیریت سرور با زنجیره‌سازی ۳ تا ۴ مرحله بدون نیاز به ساخت فایل‌های واسط و شلوغ کردن محیط."
    },
    eli15: {
      en: "Source -> Filter -> Shape -> Measure -> Export. Thinking in declarative data transformations rather than imperative manual loops.",
      fa: "منبع -> فیلتر -> شکل‌دهی -> محاسبه -> ذخیره. فکر کردن به سبک تبدیل‌های جریان داده به جای نوشتن حلقه‌های دستی طولانی و تکراری."
    },
    eli20: {
      en: "Production-grade one-liners: balance brevity with readability, pipeline efficiency, and error recovery. Build reusable building blocks for production runbooks.",
      fa: "دستورات حرفه‌ای تک‌خطی: ایجاد تعادل میان فشردگی کد، خوانایی، بهره‌وری حافظه و مدیریت خطا در کتابچه‌های عملیاتی پروداکشن."
    },
    eliphd: {
      en: "End-to-end architectural synthesis: coordinating language parsing, dynamic type coercion, steppable pipelines, remoting boundary crossings, and error bubbling.",
      fa: "سنتز معماری همه‌جانبه: هماهنگی میان پارس کد، تبدیل دینامیک انواع، استریمینگ خط لوله، عبور از مرز شبکه و ثبت دقیق خطاها."
    }
  },
  apis: {
    eli5: {
      en: "Sending letters to a robot living in the clouds: you write a message, seal it with a secret wax stamp (Bearer), and the robot sends back a neat little box of answers!",
      fa: "فرستادن نامه به رباتی در ابرها: پیامی می‌نویسید، آن را با یک مهر موم محرمانه (Bearer) مهر می‌کنید، و ربات ابری یک جعبه‌ی مرتب پر از پاسخ برای شما پس می‌فرستد!"
    },
    eli10: {
      en: "Invoke-RestMethod (irm) calls web APIs and automatically turns the JSON answer into PowerShell objects. ConvertTo-SecureString locks passwords in a secret memory safe.",
      fa: "دستور Invoke-RestMethod با وب سرویس‌ها صحبت می‌کند و پاسخ JSON را خودکار به شیء تبدیل می‌کند. ConvertTo-SecureString نیز پسوردها را در گاوصندوق حافظه قفل می‌کند."
    },
    eli15: {
      en: "Headers hashtables pass Authorization Bearer tokens. Setting '-Method Post -Body $json' mutates remote state. PSCredential standardizes identity for cmdlets.",
      fa: "ارسال هش‌تیبل به Headers- توکن‌های احراز هویت را منتقل می‌کند. تنظیم متد Post و ارسال بادی JSON تغییرات ابری ایجاد می‌کند. شیء PSCredential نیز هویت امن استاندارد می‌سازد."
    },
    eli20: {
      en: "Automate interactions with cloud REST APIs (GitHub, Azure, AWS). Store encrypted secrets using DPAPI keys tied to service accounts; never store plaintext credentials in code.",
      fa: "اتوماسیون وب سرویس‌های مدرن ابری (GitHub، Azure، AWS). رمزها را با کلیدهای DPAPI اکانت سرویس رمزنگاری کنید و هرگز پسورد متنی ساده در کد نگذارید."
    },
    eliphd: {
      en: "Invoke-RestMethod wraps .NET HttpClient with automatic JSON/XML deserialization. SecureString leverages Windows DPAPI to encrypt memory pages in unmanaged process space.",
      fa: "دستور Invoke-RestMethod کلاس HttpClient دات‌نت را با دیسریالایز خودکار رپ می‌کند. شیء SecureString با DPAPI حافظه غیرمدیریت‌شده ویندوز را رمزنگاری می‌کند."
    }
  },
  pester: {
    eli5: {
      en: "The crash test dummy: before letting real people ride the car, you send a dummy with sensors to make sure the brakes work and the airbags deploy safely!",
      fa: "مانکن تست تصادف: قبل از اینکه افراد واقعی سوار ماشین شوند، یک مانکن پر از سنسور می‌فرستید تا مطمئن شوید ترمزها کار می‌کنند و ایربگ به موقع باز می‌شود!"
    },
    eli10: {
      en: "Pester tests your code automatically. 'Should -Be' checks if the answer matches. 'Mock' replaces dangerous commands with safe fake ones so nothing breaks while testing.",
      fa: "فریم‌ورک Pester کدهای شما را خودکار تست می‌کند. ادعای Should -Be بررسی می‌کند آیا جواب درست است یا خیر. دستور Mock هم دستورات خطرناک را با ماکت‌های امن عوض می‌کند."
    },
    eli15: {
      en: "Behavior-Driven Development (BDD): 'Describe' groups test suites, 'Context' isolates scenarios, 'It' specifies single behaviors. 'Should -Throw' asserts that bad inputs fail properly.",
      fa: "توسعه مبتنی بر رفتار (BDD): بلوک Describe سوئیت‌ها را نام‌گذاری می‌کند، Context شرایط را تفکیک می‌کند و It رفتار را می‌آزماید. با Should -Throw خطاهای عمدی را بسنجید."
    },
    eli20: {
      en: "Integrate Pester test gates into GitHub Actions / Azure DevOps CI/CD. Use Mocks to verify that destructive cmdlets are called with exact parameters without touching production servers.",
      fa: "تست‌های Pester را به گیت‌های ورود CI/CD اضافه کنید. با Mocking تایید کنید که دستورات حساس با پارامترهای درست صدا زده می‌شوند بدون اینکه به سرور پروداکشن آسیبی برسد."
    },
    eliphd: {
      en: "Pester v5 separates AST Discovery from the Execution Run Phase. Mocking works by injecting scoped mock cmdlets into dynamic child session states overriding command dispatch.",
      fa: "پستر ۵ فاز کشف AST را از فاز اجرای تست جدا می‌کند. سیستم Mocking یک Cmdlet ماکت موقت را در سشن چایلد تزریق می‌کند تا بر فراخوانی دستور اصلی اولویت پیدا کند."
    }
  },
  internals: {
    eli5: {
      en: "Looking inside the robot's brain: you take off the metal cover with a screwdriver. You see the wiring blueprint (AST), and you even plug in a tiny C# rocket engine right onto the board!",
      fa: "نگاه کردن به داخل مغز ربات: درپوش فلزی را با پیچ‌گوشتی باز می‌کنید. نقشه سیم‌کشی‌ها (AST) را می‌بینید و حتی یک موتور موشک سی‌شارپ (C#) را مستقیماً روی برد لحیم می‌کنید!"
    },
    eli10: {
      en: "[Language.Parser] reads code like a sentence tree without running it. Add-Type lets you compile and run super-fast C# inside PowerShell. Runspaces run multiple workers at once.",
      fa: "کلاس Language.Parser ساختار کد را مثل جمله تحلیل می‌کند بدون اینکه آن را اجرا کند. دستور Add-Type کدهای پرسرعت C# را اجرا می‌کند و Runspaces چندین کار را هم‌زمان پیش می‌برد."
    },
    eli15: {
      en: "The Abstract Syntax Tree (AST) represents statements as structured nodes. The Extended Type System (ETS via Update-TypeData) dynamically adds ScriptProperties to existing .NET classes.",
      fa: "درخت نحو انتزاعی (AST) کدها را به شکل گره‌های ساختاریافته نگه می‌دارد. سامانه ETS (با Update-TypeData) به کلاس‌های دات‌نت ویژگی‌های جدید و پویا اضافه می‌کند."
    },
    eli20: {
      en: "Leverage Roslyn inline compilation (Add-Type) for P/Invoke Win32 API calls and high-throughput math. Use Runspace pools for multi-threaded orchestration within a single process.",
      fa: "از کامپایل رزلین (Add-Type) برای فراخوانی Win32 API و محاسبات پرسرعت استفاده کنید. از استخر Runspace برای مالتی‌ترد در یک پروسس با کمترین مصرف منابع بهره ببرید."
    },
    eliphd: {
      en: "Parser.ParseInput() builds a ScriptBlockAst tree. Update-TypeData mutates the session TypeTable. Runspaces maintain isolated SessionStateInternal instances across CLR thread pool threads.",
      fa: "متد Parser.ParseInput درخت ScriptBlockAst را می‌سازد. دستور Update-TypeData متادیتای TypeTable را دستکاری می‌کند. ران‌اسپیس‌ها سشن‌های مجزا را روی ترد‌پول‌های CLR اجرا می‌کنند."
    }
  },
  hardening: {
    eli5: {
      en: "The security guard and the detective's notebook: the detective writes down every step in a notebook (Transcript). The guard checks the fingerprint on the box (FileHash) so nobody tampers with it.",
      fa: "نگهبان هوشیار و دفترچه یادداشت کارآگاه: کارآگاه تک‌تک حرکات را در دفترچه می‌نویسد (Transcript). نگهبان هم اثر انگشت فایل (FileHash) را چک می‌کند تا کسی دستکاری‌اش نکرده باشد."
    },
    eli10: {
      en: "Get-FileHash calculates SHA256 checksums to verify downloaded files. Start-Transcript records everything you type and see into a security log file.",
      fa: "دستور Get-FileHash اثر انگشت دیجیتال SHA256 فایل را حساب می‌کند. دستور Start-Transcript هم تمام اتفاقات ترمینال را در یک فایل بازرسی ذخیره می‌کند."
    },
    eli15: {
      en: "Just Enough Administration (JEA) creates restricted role configuration files (.psrc / .pssc). Script Block Logging (Event ID 4104) logs complete script execution blocks to the Windows Event Log.",
      fa: "فناوری JEA دسترسی ادمین را به حداقل ممکن در فایل‌های psrc و pssc محدود می‌کند. سیستم Script Block Logging رویداد 4104 را برای ثبت کامل اسکریپت‌ها در Event Log ویندوز فعال می‌کند."
    },
    eli20: {
      en: "Implement defense-in-depth: audit forensic session logs, enforce process-scoped execution policies in CI, and verify ConstrainedLanguage mode under AppLocker / WDAC policies.",
      fa: "پیاده‌سازی دفاع در عمق: بازرسی لاگ‌های سشن، اعمال خط‌مشی به پروسس جاری در خطوط CI/CD و اطمینان از فعال بودن ConstrainedLanguage در سیستم‌های امنیتی سازمانی."
    },
    eliphd: {
      en: "Event ID 4104 hooks ETW provider 'Microsoft-Windows-PowerShell/Operational'. ConstrainedLanguage mode restricts type resolution to safe CLR types, blocking arbitrary Win32 memory pointers and COM activation.",
      fa: "رویداد 4104 از طریق سنسور ETW وقایع را ارسال می‌کند. حالت ConstrainedLanguage دسترسی به انواع ناامن CLR را قفل کرده و اجرای کدهای دلخواه حافظه و COM را مسدود می‌سازد."
    }
  },
  advanced: {
    eli5: {
      en: "Designing brand-new toys: instead of just playing with toys others made, you draw the blueprint (class) and build completely new objects with their own custom powers!",
      fa: "طراحی اسباب‌بازی‌های نو: به جای اینکه فقط با وسایل دیگران بازی کنید، نقشه ساخت (class) می‌کشید و اشیائی با ویژگی‌ها و قدرت‌های کاملاً تازه خلق می‌کنید!"
    },
    eli10: {
      en: "Classes group data and custom methods together. The '??' operator picks the first value that isn't null. Set-PSBreakpoint pauses script execution so you can inspect variables.",
      fa: "کلاس‌ها داده‌ها و رفتارها را با هم بسته‌بندی می‌کنند. عملگر '??' اولین مقداری که پوچ نباشد را برمی‌دارد. با Set-PSBreakpoint اجرای اسکریپت را متوقف و اشکال‌زدایی می‌کنید."
    },
    eli15: {
      en: "PowerShell classes provide strict typing and constructors ([Class]::new()). Ternary operators ($cond ? $a : $b) provide concise branching. Dynamic breakpoints aid interactive debugging.",
      fa: "کلاس‌های پاورشل تایپینگ سفت‌وسخت و سازنده ([Class]::new) ارائه می‌دهند. عملگر سه‌گانه (ternary) شرط‌های کوتاه می‌سازد و بریک‌پوینت‌ها امکان عیب‌یابی خط‌به‌خط را می‌دهند."
    },
    eli20: {
      en: "Build SDK-quality modules with typed domain models. Use callstack inspection (Get-PSCallStack) and performance profiling (Measure-Command) to eliminate execution bottlenecks.",
      fa: "طراحی ماژول‌های سازمانی در سطح SDK با مدل‌های دامنه‌ای تایپ‌شده. با بازرسی استک (Get-PSCallStack) و بنچمارک (Measure-Command) گلوگاه‌های پرفورمنس را برطرف کنید."
    },
    eliphd: {
      en: "Classes compile into dynamic in-memory assemblies via TypeBuilder. Method dispatch integrates with Dynamic Language Runtime call sites and local ExecutionContext state.",
      fa: "کلاس‌های پاورشل از طریق TypeBuilder به اسمبلی‌های درون‌حافظه‌ای کامپایل می‌شوند. فراخوانی متدها با سایت‌های فراخوانی DLR و وضعیت ExecutionContext هماهنگ می‌شوند."
    }
  },
  mastery: {
    eli5: {
      en: "The toy doctor and master puzzle solver: you receive broken machines with backwards gears, diagnose why they stopped, fix them, and build machines that never fail!",
      fa: "پزشک اسباب‌بازی‌ها و حل‌کننده معماها: دستگاه‌های خرابی را تحویل می‌گیرید که چرخ‌دنده‌هایشان برعکس است؛ علت را پیدا می‌کنید، تعمیرشان می‌کنید و دستگاهی می‌سازید که هرگز خراب نشود!"
    },
    eli10: {
      en: "Spotting bugs: fixing '=' vs '-eq', preventing accidental text conversions, preserving arrays with '@()', and ensuring your custom functions return clean objects.",
      fa: "شکار باگ‌ها: اصلاح اشتباه = به جای eq-، جلوگیری از تبدیل ناخواسته به متن، حفظ آرایه‌ها با ()@ و اطمینان از اینکه توابع خروجی شیء تمیز تولید می‌کنند."
    },
    eli15: {
      en: "Advanced troubleshooting: resolving scope leakage ($script:shared), catching silent errors with -ErrorAction Stop, and composing robust 4-stage pipelines.",
      fa: "اشکال‌زدایی پیشرفته: رفع نشتی اسکوپ با متغیرهای script$، شکار خطاهای خاموش با ErrorAction Stop- و پیاده‌سازی پایپ‌لاین‌های ۴ مرحله‌ای بدون خطا."
    },
    eli20: {
      en: "Production resilience: tools that fail soft, maintain state safety, pass -WhatIf down the pipeline, and provide reliable automation for enterprise operations.",
      fa: "پایداری سطح پروداکشن: ساخت ابزارهایی که در خطاهای غیرمنتظره به نرمی رفتار می‌کنند، کلید WhatIf- را حفظ می‌کنند و اتوماسیونی قابل اتکا به تیم تحویل می‌دهند."
    },
    eliphd: {
      en: "Synthesizing deep language mastery: evaluating execution context state, pipeline object streams, error handling records, and operational design patterns across the entire engine.",
      fa: "تسلط جامع بر معماری زبان: ارزیابی تعامل میان وضعیت سشن، جریان اشیاء خط لوله، ثبت رکوردهای خطا و الگوهای طراحی پایدار در سرتاسر انجین."
    }
  }
};

/**
 * Get all 5 cognitive progression tiers for a given series and level.
 * @param {string} seriesId
 * @param {string} levelId
 * @param {'en' | 'fa' | 'de'} [locale='en']
 * @returns {Record<'eli5' | 'eli10' | 'eli15' | 'eli20' | 'eliphd', string>}
 */
export function getDepthContent(seriesId, levelId, locale = 'en') {
  const langKey = locale === 'fa' ? 'fa' : 'en';
  const series = SERIES_DEPTHS[seriesId] || SERIES_DEPTHS.intro;
  return {
    eli5: series.eli5[langKey] || series.eli5.en,
    eli10: series.eli10[langKey] || series.eli10.en,
    eli15: series.eli15[langKey] || series.eli15.en,
    eli20: series.eli20[langKey] || series.eli20.en,
    eliphd: series.eliphd[langKey] || series.eliphd.en,
  };
}
