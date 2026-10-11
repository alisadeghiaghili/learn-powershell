/**
 * Interactive UI guide and visual tour highlighting.
 *
 * Outlines live regions on demand so learners immediately connect
 * documentation concepts to on-screen controls. Mirrors the learn-cmd
 * guide, adapted to the LearnPowerShell layout and regions.
 */

import { getLocale, ui } from "./i18n/index.js";

/**
 * @typedef {Object} UiElementDoc
 * @property {string} id
 * @property {string} selector
 * @property {string} title
 * @property {string} what
 * @property {string} how
 */

/**
 * @param {'en' | 'fa' | 'de'} [lang]
 * @returns {UiElementDoc[]}
 */
export function uiElements(lang = getLocale()) {
  if (lang === "fa") {
    return [
      {
        id: "brand",
        selector: ".brand",
        title: "نشان و حالت",
        what: "نام LearnPowerShell و نشانگر چالش فعلی با تم پاورشل.",
        how: "با کلیک روی عنوان یا کلید Escape به حالت آزاد برمی‌گردید.",
      },
      {
        id: "toolbar",
        selector: ".toolbar-actions",
        title: "نوار ابزار",
        what: "منوی زبان، کشوی ناوبری سریع، و شمارنده بازدیدکنندگان همراه با پیوندهای گیت‌هاب و حمایت.",
        how: "کشو را باز کنید تا به Levels، Lesson، Guide، Hint، Solution، Undo، Reset و Sandbox دسترسی داشته باشید.",
      },
      {
        id: "board",
        selector: "#board-wrap",
        title: "برده پایپ‌لاین و سشن",
        what: "ویژوالایزر زنده پایپ‌لاین و وضعیت سشن: اشیاء از مراحل cmdlet عبور می‌کنند و cwd، متغیرها و سیستم فایل به‌صورت بلادرنگ به‌روز می‌شوند.",
        how: "دستور اجرا کنید و جریان اشیاء را ببینید؛ مثلاً `Get-Process | Where-Object CPU -gt 50` را امتحان کنید.",
      },
      {
        id: "terminal",
        selector: "#terminal",
        title: "ترمینال پاورشل",
        what: "پرامپت مجازی با تاریخچه (↑/↓)، تکمیل کلمه‌به‌کلمه با Tab و پیش‌نمایش Ghost-text.",
        how: "دستور را تایپ کنید و برای تکمیل Tab بزنید؛ `undo` و `reset` وضعیت را بازگردانی می‌کنند.",
      },
      {
        id: "dock",
        selector: "#dock",
        title: "داک راهنمای یادگیری",
        what: "پنل همواره‌باز سمت راست که آنچه یاد می‌گیرید، یادداشت‌های میدانی، نردبانی عمق و چک‌لیست راه‌حل را نشان می‌دهد.",
        how: "دکمه Guide را بزنید یا `goal` / `steps` را تایپ کنید تا این پنل تمرکز شود.",
      },
      {
        id: "links",
        selector: ".tb-stat, .tb-link",
        title: "شمارنده و پیوندها",
        what: "تعداد لحظه‌ای کاربران یکتا، مخزن باز گیت‌هاب و حمایت از ناشر.",
        how: "روی آیکون گیت‌هاب کلیک کنید تا سورس را ببینید یا پروژه را ستاره بزنید.",
      },
    ];
  }

  if (lang === "de") {
    return [
      {
        id: "brand",
        selector: ".brand",
        title: "Marke & Modus",
        what: "Der LearnPowerShell-Titel und das aktuelle Challenge-Badge im PowerShell-Design.",
        how: "Klicke auf den Titel oder drücke Escape, um zur freien Erkundung zurückzukehren.",
      },
      {
        id: "toolbar",
        selector: ".toolbar-actions",
        title: "Symbolleiste",
        what: "Sprachmenü, schneller Navigationsausklapp, Besucherzähler sowie GitHub- und Unterstützungs-Links.",
        how: "Öffne das Menü für Levels, Lesson, Guide, Hint, Solution, Undo, Reset und Sandbox.",
      },
      {
        id: "board",
        selector: "#board-wrap",
        title: "Pipeline- & Session-Bereich",
        what: "Live-Pipeline-Visualisierer und Session-Zustand: Objekte fließen durch Cmdlet-Stufen, während cwd, Variablen und Dateisystem in Echtzeit aktualisiert werden.",
        how: "Führe Befehle aus und beobachte die Objekte; versuche `Get-Process | Where-Object CPU -gt 50`.",
      },
      {
        id: "terminal",
        selector: "#terminal",
        title: "PowerShell-Terminal",
        what: "Virtuelle Eingabeaufforderung mit Verlauf (↑/↓), wortweiser Tab-Vervollständigung und Ghost-Text-Vorschlägen.",
        how: "Tippe Befehle ein und drücke Tab; `undo` und `reset` stellen den Zustand wieder her.",
      },
      {
        id: "dock",
        selector: "#dock",
        title: "Learning-Guide-Dock",
        what: "Immer sichtbares rechtes Panel mit Lerninhalten, Praxishinweisen, Tiefe-Leiter und Lösungs-Checkliste.",
        how: "Klicke Guide oder tippe `goal` / `steps`, um dieses Panel zu fokussieren.",
      },
      {
        id: "links",
        selector: ".tb-stat, .tb-link",
        title: "Besucherzähler & Links",
        what: "Live-eindeutige Lernerzahl, das offene GitHub-Repository und Autorenunterstützung.",
        how: "Klicke das GitHub-Symbol, um den Quellcode zu sehen oder das Projekt zu vermerken.",
      },
    ];
  }

  return [
    {
      id: "brand",
      selector: ".brand",
      title: "Brand & Mode",
      what: "The LearnPowerShell title and the current challenge badge, in the PowerShell theme.",
      how: "Clicking the title or pressing Escape returns you to free exploration.",
    },
    {
      id: "toolbar",
      selector: ".toolbar-actions",
      title: "Action Toolbar",
      what: "Language menu, quick navigation drawer, and the visitor counter with GitHub and support links.",
      how: "Open the drawer to browse Levels, Lesson, Guide, Hint, Solution, Undo, Reset, and Sandbox.",
    },
    {
      id: "board",
      selector: "#board-wrap",
      title: "Pipeline & Session Board",
      what: "Live pipeline visualizer and session state: objects stream through cmdlet stages while cwd, variables, and the filesystem update in real time.",
      how: "Run commands and watch objects flow; try `Get-Process | Where-Object CPU -gt 50`.",
    },
    {
      id: "terminal",
      selector: "#terminal",
      title: "PowerShell Terminal",
      what: "Virtual prompt with history navigation (↑/↓), word-by-word Tab completion, and ghost-text suggestions.",
      how: "Type commands and press Tab to complete; `undo` and `reset` restore state.",
    },
    {
      id: "dock",
      selector: "#dock",
      title: "Learning Guide Dock",
      what: "Always-on right panel showing what you are learning, field notes, the depth ladder, and the solution checklist.",
      how: "Click Guide or type `goal` / `steps` to focus this panel.",
    },
    {
      id: "links",
      selector: ".tb-stat, .tb-link",
      title: "Visitor Counter & Links",
      what: "Live deduplicated learner count, the open-source GitHub repository, and support the author.",
      how: "Click the GitHub icon to view the source code or star the project.",
    },
  ];
}

/**
 * Format plain-text help for terminal printing.
 *
 * @param {'en' | 'fa' | 'de'} [lang]
 * @returns {string}
 */
export function formatUiHelpText(lang = getLocale()) {
  const elements = uiElements(lang);
  const title = ui().uiGuideTitle;
  return [
    title,
    "=".repeat(Math.min(title.length, 60)),
    "",
    ...elements.map((e, i) => `${i + 1}. ${e.title}\n   ${e.what}\n   -> ${e.how}`),
    "",
    ui().uiGuideIntro,
  ].join("\n");
}

/**
 * HTML content for the UI Help modal dialog, with per-region Highlight buttons.
 *
 * @param {'en' | 'fa' | 'de'} [lang]
 * @returns {string}
 */
export function uiHelpModalHtml(lang = getLocale()) {
  const elements = uiElements(lang);
  const u = ui();
  const sections = elements
    .map(
      (e) => `
      <section class="ui-help-item" data-help-id="${e.id}">
        <div class="ui-help-head">
          <h3>${e.title}</h3>
          <button type="button" class="btn ghost ui-help-focus" data-focus-id="${e.id}">${u.uiGuideHighlight}</button>
        </div>
        <div class="ui-help-what"><p>${e.what}</p></div>
        <div class="ui-help-how"><p><strong>${u.uiGuideHowTo}</strong> ${e.how}</p></div>
      </section>
    `
    )
    .join("");

  return `<div class="ui-help"><p class="ui-help-intro">${u.uiGuideIntro}</p>${sections}</div>`;
}

/**
 * Outline live regions on the screen so learners see where each element is.
 *
 * @param {ParentNode} root
 * @param {string} [focusId]
 * @param {number} [durationMs=3500]
 * @returns {() => void}
 */
export function startUiTour(root, focusId, durationMs = 3500) {
  root.querySelectorAll(".ui-tour-on").forEach((el) => el.classList.remove("ui-tour-on"));
  const elements = uiElements().filter((e) => !focusId || e.id === focusId);
  const nodes = elements
    .map((e) => root.querySelectorAll(e.selector))
    .reduce((acc, list) => acc.concat([...list]), [])
    .filter(Boolean);

  nodes.forEach((n) => n.classList.add("ui-tour-on"));
  const stop = () => {
    nodes.forEach((n) => n.classList.remove("ui-tour-on"));
  };
  window.setTimeout(stop, durationMs);
  return stop;
}
