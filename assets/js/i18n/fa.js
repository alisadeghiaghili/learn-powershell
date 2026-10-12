/**
 * Persian catalog for LearnPowerShell.
 * Commands and syntax remain English/LTR. UI text is RTL.
 */

import { faLevels, faSeries } from "./fa-levels.js";

export const fa = {
  locale: "fa",
  dir: "rtl",
  series: faSeries,
  levels: faLevels,
  ui: {
    welcomeTitle: "Welcome to Learn PowerShell",
    welcomeTitleHtml: 'Welcome to Learn <span class="brand-ps">PowerShell</span>',
    welcomeIntro: "آموزش تعاملی **PowerShell Object Pipeline** — سندباکس + مراحل هدایت‌شده.",
    welcomeBoard:
      "بورد تعاملی جریان **Cmdlet → Pipeline → Objects → Session State** را نشان می‌دهد. این همان حرکت زنده اشیای دات‌نت است که پاورشل مدیریت می‌کند.",
    welcomeTracks:
      "- **مبانی**: `Verb-Noun`، درایوها و پرووایدرها، اشیاء و پایپ‌لاین\n- **اسکریپت‌نویسی**: متغیرها، هش‌تیبل‌ها، حلقه‌ها، توابع پیشرفته\n- **مدیریت سیستم**: استریم خطاها، ریموت‌زدن (WinRM/SSH)، ماژول‌ها و جاب‌ها\n- **پروداکشن و دوآپس**: کار با REST APIها، آزمون Pester، امنیت و معماری (AST/ETS)",
    welcomeMeta:
      "دستورات متا: `levels` · `why` · `curriculum` · `concepts` · `lesson` · `hint` · `steps` · `show solution` · `undo` · `reset`.",
    welcomeLevelsCount: (n) =>
      `**${n}** مرحله گنجانده شده. برای شروع مرحله‌ها را باز کنید، یا در سندباکس بمانید.`,
    welcomeWhat: "**LearnPowerShell چیست؟**",
    welcomeWhatBody:
      "یک آزمایشگاه مرورگری برای پاورشل مدرن: فرمان‌های واقعی‌شکل cmdlet را تایپ می‌کنید و جریان اشیای زنده، فیلترهای خط لوله، متغیرها و وضعیت سشن را بلادرنگ می‌بینید. برای هسته آموزش هیچ نیازی به نصب محلی نیست.",
    welcomePublisher: "**ناشر**",
    welcomePublisherBody:
      "انتشار و نگهداری توسط **Ali Sadeghi Aghili** — برنامه‌نویس، مهندس/دانشمند داده، مهندس ML. [linktr.ee/aliaghili](https://linktr.ee/aliaghili)",
    welcomeGithub: "- [GitHub — سورس و ایشو](https://github.com/alisadeghiaghili/learn-powershell)",
    welcomeCoffee: "Buy Me a Coffee (از ناشر حمایت می‌کند):",
    openLevels: "باز کردن مرحله‌ها",
    whyPowerShellBtn: "چرا پاورشل؟",
    appWelcome:
      "Welcome to Learn PowerShell — سندباکس تعاملی و ویژوالایزر خط لوله شیءگرای پاورشل.",
    sandboxSeeded:
      "محیط شبیه‌ساز با سیستم فایل مجازی و جدول پروسس‌ها آماده است. `Get-Process` را امتحان کنید.",
    progressSaved:
      "پیشرفت شما در همین مرورگر ذخیره می‌شود (localStorage + cookie).",
    language: "زبان",
    levels: "مرحله‌ها",
    lesson: "درس",
    lessonTitle: "تکرار اسلایدهای آموزشی این مرحله",
    guide: "راهنما",
    hint: "سرنخ",
    solution: "راه‌حل",
    undo: "مرحله قبل",
    reset: "بازنشانی",
    sandboxBtn: "سندباکس",
    help: "راهنما",
    titleLine: (id, name, par) => `${id} · ${name} · انتظار ${par} فرمان`,
    sandboxTitle: "حالت آزاد (سندباکس)",
    learningGuide: "راهنمای یادگیری",
    guideAlwaysOn:
      "پنل همیشه‌باز. در هر مرحله مفاهیم، یادداشت‌های میدانی و چک‌لیست راه‌حل را نشان می‌دهد.",
    startHere: "از اینجا شروع کنید",
    startHereItems: [
      "**چرا پاورشل؟** برای درک چرایی و کاربردهای واقعی `why` تایپ کنید یا دکمه‌ی آن را بزنید",
      "دکمه‌ی **مرحله‌ها** را بزنید و از Getting Started شروع کنید",
      "برای راهنمای دستورات `help` تایپ کنید",
      "برای سرفصل‌ها و نقشه راه `curriculum` تایپ کنید",
    ],
    sandboxTip: "نکته‌ی سندباکس",
    sandboxTipItems: [
      "پایپ‌لاین اشیاء را جابجا می‌کند، نه متن‌های خام",
      "ترمینال: Tab کلمه‌به‌کلمه کامل می‌کند؛ ↑/↓ تاریخچه",
      "پیشرفت در این مرورگر ذخیره می‌ماند",
    ],
    noActiveLevel: "مرحله‌ی فعالی نیست",
    noActiveLevelDetail: "Levels → یک چالش انتخاب کنید تا چک‌لیست اینجا ظاهر شود",
    guideFlashNote:
      "دکمه‌ی **راهنما** در نوار ابزار این پنل را چشمک می‌زند. در تمام ارتفاع صفحه باز می‌ماند.",
    youAreLearning: "در حال یادگیری",
    fieldNotesTitle: "در تولید (یادداشت میدانی)",
    typeNextTitle: "بعدی را تایپ کن — با هایلایت نارنجی",
    remainingLabel: "○ باقی‌مانده",
    wrongCommandNote:
      "فرمان اشتباه؟ همین‌جا می‌مانید — پیشرفت حفظ می‌شود. تاریخچه: ↑ / ↓",
    allSolutionMet: "همه‌ی گام‌های راه‌حل انجام شد.",
    nowChip: "اکنون",
    optionalChip: "اختیاری",
    stateNotes: "یادداشت وضعیت:",
    bestSoFar: (commands, par) =>
      `بهترین تاکنون: ${commands} فرمان · ایده‌آل: ${par}`,
    idealSolution: (par) =>
      `راه‌حل ایده‌آل: ${par} فرمان (کمتر یا مساوی عالی است)`,
    solvedBanner: (n) => `مرحله حل شد${n !== null ? ` با ${n} فرمان` : ""}.`,
    levelCleared: "مرحله انجام شد",
    levelComplete: "مرحله پاکسازی شد",
    baskInIt: "لذت بردن",
    celebrateOn: (id) => `ادامه به مرحله ${id}`,
    browseLevels: "مرور مرحله‌ها",
    shareTitle: "اشتراک‌گذاری پیشرفت شما",
    styleList: "آنچه تا الان یاد گرفته‌اید",
    solveMoreLevels: "چند مرحله را حل کنید تا لیست شما شکل بگیرد.",
    shareGroupLabel: "اشتراک‌گذاری",
    linkedin: "LinkedIn",
    xTwitter: "X / Twitter",
    facebook: "Facebook",
    copyPost: "کپی متن پست",
    copied: "در کلیپ‌بورد کپی شد.",
    copyFailed: "کپی نشد — متن را دستی انتخاب کنید.",
    solutionTitle: (id) => `راه‌حل مرحله: ${id}`,
    solutionCommands: "این دستورات را به ترتیب وارد کنید تا مرحله حل شود:",
    solutionWarn: "اجرای خودکار راه‌حل، مرحله را برای اطمینان از سلامت وضعیت بازنشانی می‌کند.",
    runSolution: "اجرای راه‌حل",
    cancel: "انصراف",
    close: "بستن",
    levelsTitle: "مرحله‌های آموزشی",
    pickChallenge: "یک چالش انتخاب کنید. مراحل حل‌شده در همین مرورگر ذخیره می‌مانند.",
    howToRead: "راهنمای علائم مرحله‌ها",
    difficultyLegend:
      "**سختی** — ۱ تا ۵ نقطه؛ پرتر = مفاهیم بیشتر. همیشه ۵ جایگاه.",
    idealLegend:
      "**تعداد فرمان ایده‌آل** — هدف گلف، نه سقف سخت.",
    solvedLegend: "**حل شد** — رد کردید؛ عدد بهترین تعداد فرمان شماست.",
    solvedLabel: "حل شد",
    githubTitle: "مخزن گیت‌هاب",
    supportTitle: "از ناشر حمایت کنید",
    visitorsTitle: "تعداد افراد یکتایی که در این سامانه پاورشل را تمرین کرده‌اند",
    uiGuideTitle: "راهنمای محیط برنامه — هر بخش چه نقشی دارد",
    uiGuideIntro:
      "برای چشمک‌دادن هر بخش روی صفحه، روی دکمه‌ی **هایلایت** آن بزنید، یا برای روشن‌کردن همه در یکجا `tour` را اجرا کنید.",
    uiGuideHighlight: "هایلایت",
    uiGuideHowTo: "نحوه استفاده:",
    quizHeader: (num, total) => `سوال ${num} از ${total}`,
    quizAnswerUsage: "پاسخ با دستور: quiz A یا quiz B یا quiz C",
    quizFinished: "آزمون به پایان رسید! تمامی سوالات را پاسخ دادید.",
    quizCorrect: "درست است.",
    quizIncorrect: (letter, answer) => `اشتباه. بهترین پاسخ: ${letter} — ${answer}`,
    quiz: [
      {
        q: "کدام عملگر برای مقایسه‌ی دو مقدار با برابری در فیلتر Where-Object استفاده می‌شود؟",
        a: ["==", "-eq", "-match"],
        correct: 1,
      },
      {
        q: "عملگر پایپ | بین cmdletها چه چیزی را منتقل می‌کند؟",
        a: ["متن خالص و خط‌به‌خط", "اشیای تایپ‌شده", "هیچ‌چیز"],
        correct: 1,
      },
      {
        q: "کدام نماد به شیء فعلی داخل ForEach-Object { } اشاره می‌کند؟",
        a: ["$_", "$this", "%item%"],
        correct: 0,
      },
      {
        q: "کدام cmdlet اشیای پایپ‌لاین را بر اساس یک خاصیت مرتب می‌کند؟",
        a: ["Group-Object", "Sort-Object", "Select-Object"],
        correct: 1,
      },
      {
        q: "کدام سوییچ باعث می‌شود Get-ChildItem موارد پنهان را هم نشان دهد؟",
        a: ["-All", "-Force", "-Verbose"],
        correct: 1,
      },
    ],
    aboutTitle: "درباره LearnPowerShell",
    cheers: [
      "حل تمیز و بی‌نقص.",
      "پایپ‌لاین قفل شد.",
      "این یعنی تفکر واقعی پاورشل.",
      "اشیاء حرکت کردند و شما هم با آن‌ها همراه شدید.",
    ],
  },
};
