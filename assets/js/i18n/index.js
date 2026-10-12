/**
 * Locale runtime: switch language, localize level copy, document dir.
 */

import { en } from "./en.js";
import { de } from "./de.js";
import { fa } from "./fa.js";
import { SERIES_DEPTHS } from "../depth.js";

export const LOCALES = ["en", "fa", "de"];
const STORAGE_KEY = "learnpowershell-locale";

const catalogs = { en, de, fa };

let current = "en";

function isLocale(v) {
  return Boolean(v && LOCALES.includes(v));
}

export function detectLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {}
  const nav = typeof navigator !== "undefined" ? navigator.language : "";
  if (nav.toLowerCase().startsWith("fa") || nav.toLowerCase().startsWith("pe")) return "fa";
  if (nav.toLowerCase().startsWith("de")) return "de";
  return "en";
}

export function getLocale() {
  return current;
}

export function setLocale(locale) {
  current = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {}
  applyDocumentLocale();
}

export function getCatalog() {
  return catalogs[current] || catalogs.en;
}

export function ui() {
  return getCatalog().ui;
}

export function getDir() {
  return getCatalog().dir || "ltr";
}

export function applyDocumentLocale() {
  if (typeof document === "undefined") return;
  document.documentElement.lang = current;
  document.documentElement.dir = getDir();
}

export function initLocale() {
  current = detectLocale();
  applyDocumentLocale();
  return current;
}

/**
 * Overlay localized teaching copy onto a level.
 * Commands (hint, goal, etc.) remain English/structural.
 * @param {import('../levels.js').Level} level
 */
export function localizeLevel(level) {
  if (!level) return level;
  const seriesName = getCatalog().series?.[level.series] || level.series;

  if (level.id.endsWith("-00")) {
    const seriesData = SERIES_DEPTHS[level.series];
    const isIntro = level.id === "intro-00";
    if (current === "fa" && seriesData) {
      return {
        ...level,
        seriesTitle: seriesName,
        name: isIntro ? "مایندست: چرا پاورشل و به چه دردی می‌خورد؟" : `مایندست: ${seriesName}`,
        brief: seriesData.eli5.fa,
        learning: isIntro
          ? ["چرا اصلاً پاورشل؟", "حل جهنم پردازش متن (Text Parsing Tax)", "کاربردهای حیاتی در دوآپس و مدیریت سیستم"]
          : ["مدل ذهنی و شهودی", "قوانین و رفتار پایپ‌لاین", "پایه‌های مفهومی"],
        fieldNotes: [seriesData.eli10.fa, seriesData.eli15.fa, seriesData.eli20.fa],
      };
    }
    if (seriesData) {
      return {
        ...level,
        seriesTitle: seriesName,
        name: isIntro ? "Mindset: Why PowerShell? (Purpose & Powers)" : `Mindset: ${seriesName}`,
        brief: seriesData.eli5.en,
        learning: isIntro
          ? ["Why PowerShell Exists", "Solving Text Parsing Hell", "Real-World SysAdmin & DevOps Roles"]
          : ["Mental Model & Intuition", "Pipeline Architecture", "Core Concepts"],
        fieldNotes: [seriesData.eli10.en, seriesData.eli15.en, seriesData.eli20.en],
      };
    }
  }

  const copy = getCatalog().levels?.[level.id];
  if (!copy || current === "en") {
    return {
      ...level,
      seriesTitle: seriesName,
      learning: level.learning || [],
      fieldNotes: level.teach ? [level.teach.what, ...(level.teach.why || [])] : [],
    };
  }
  return {
    ...level,
    seriesTitle: copy.seriesTitle || seriesName,
    name: copy.name || level.name,
    brief: copy.brief || level.brief,
    learning: copy.learning || level.learning || [],
    fieldNotes: copy.fieldNotes || (level.teach ? [level.teach.what, ...(level.teach.why || [])] : []),
  };
}

export function localizeSeriesTitle(seriesId) {
  return getCatalog().series?.[seriesId] || seriesId;
}
