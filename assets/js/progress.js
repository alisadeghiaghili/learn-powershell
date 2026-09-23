/**
 * Progress persistence: localStorage + cookie so a week later the learner resumes.
 */

export const STORAGE_KEY = "learn-powershell-progress-v1";
export const COOKIE_KEY = "learn_powershell_progress";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 400;

/**
 * @typedef {{ solved: boolean, bestCommands?: number }} LevelProgress
 * @typedef {{ progress: Record<string, LevelProgress>, savedAt?: string }} PersistBlob
 * @typedef {{ id: string, name: string, seriesTitle: string, learning: string[], bestCommands?: number }} CurriculumItem
 * @typedef {{
 *   solvedCount: number,
 *   total: number,
 *   learned: CurriculumItem[],
 *   remaining: CurriculumItem[],
 *   next: CurriculumItem | null,
 *   percent: number
 * }} CurriculumSummary
 */

/**
 * @returns {string | null}
 */
function readCookie() {
  if (typeof document === "undefined") return null;
  for (const part of document.cookie.split(";")) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (rawKey !== COOKIE_KEY) continue;
    try {
      return decodeURIComponent(rest.join("="));
    } catch {
      return rest.join("=");
    }
  }
  return null;
}

/**
 * @param {string} payload
 */
function writeCookie(payload) {
  if (typeof document === "undefined") return;
  const encoded = encodeURIComponent(payload);
  document.cookie = `${COOKIE_KEY}=${encoded}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

/**
 * @param {string | null} raw
 * @returns {Record<string, LevelProgress> | null}
 */
function parseBlob(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "progress" in parsed) {
      return parsed.progress || {};
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * @returns {Record<string, LevelProgress>}
 */
export function loadProgress() {
  /** @type {Record<string, LevelProgress> | null} */
  let fromLocal = null;
  /** @type {Record<string, LevelProgress> | null} */
  let fromCookie = null;
  try {
    fromLocal = parseBlob(localStorage.getItem(STORAGE_KEY));
  } catch {
    fromLocal = null;
  }
  try {
    fromCookie = parseBlob(readCookie());
  } catch {
    fromCookie = null;
  }

  /** @type {Record<string, LevelProgress>} */
  const merged = {};
  for (const src of [fromCookie || {}, fromLocal || {}]) {
    for (const [id, prog] of Object.entries(src)) {
      if (!prog) continue;
      const prev = merged[id];
      merged[id] = {
        solved: Boolean(prog.solved || prev?.solved),
        bestCommands:
          prev?.bestCommands === undefined
            ? prog.bestCommands
            : prog.bestCommands === undefined
              ? prev.bestCommands
              : Math.min(prev.bestCommands, prog.bestCommands),
      };
    }
  }
  return merged;
}

/**
 * @param {Record<string, LevelProgress>} progress
 */
export function saveProgress(progress) {
  const blob = { progress, savedAt: new Date().toISOString() };
  const payload = JSON.stringify(blob);
  try {
    localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    // private mode / quota — cookie still helps
  }
  writeCookie(payload);
}

/**
 * @param {Record<string, LevelProgress>} progress
 * @param {import('./levels.js').Level[]} levels
 * @param {string | undefined} seriesTitleFor
 * @returns {CurriculumSummary}
 */
export function summarizeCurriculum(progress, levels, seriesTitleFor) {
  /** @type {CurriculumItem[]} */
  const learned = [];
  /** @type {CurriculumItem[]} */
  const remaining = [];
  /** @type {CurriculumItem | null} */
  let next = null;

  for (const level of levels) {
    const item = {
      id: level.id,
      name: level.name,
      seriesTitle: seriesTitleFor ? seriesTitleFor(level.series) : level.series,
      learning: level.learning || [],
      bestCommands: progress[level.id]?.bestCommands,
    };
    if (progress[level.id]?.solved) learned.push(item);
    else {
      remaining.push(item);
      if (!next) next = item;
    }
  }

  return {
    solvedCount: learned.length,
    total: levels.length,
    learned,
    remaining,
    next,
    percent: levels.length
      ? Math.round((learned.length / levels.length) * 100)
      : 0,
  };
}
