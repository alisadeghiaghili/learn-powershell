/**
 * Locale runtime: switch language, localize level copy, document dir.
 */

import { en } from "./en.js";
import { de } from "./de.js";
import { fa } from "./fa.js";

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
  const copy = getCatalog().levels?.[level.id];
  const seriesName = getCatalog().series?.[level.series] || level.series;
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
