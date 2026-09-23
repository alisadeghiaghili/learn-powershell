/**
 * Share targets for celebrate modal: LinkedIn, X, Facebook, clipboard.
 * Message includes what the learner has covered and a link to the app.
 */

export const SHARE_URL = "https://alisadeghiaghili.github.io/learn-powershell/";
export const REPO_URL = "https://github.com/alisadeghiaghili/learn-powershell";

/**
 * @param {{ name: string, seriesTitle: string }[]} items
 * @param {number} [limit]
 */
function bulletList(items, limit) {
  const list = limit ? items.slice(0, limit) : items;
  const lines = list.map((l) => `• ${l.seriesTitle}: ${l.name}`);
  if (limit && items.length > limit) {
    lines.push(`• …and ${items.length - limit} more`);
  }
  return lines;
}

/**
 * @param {{
 *   levelName: string,
 *   levelId: string,
 *   commands: number | null,
 *   par: number,
 *   curriculum: import('./progress.js').CurriculumSummary
 * }} ctx
 */
export function shareMessageLinkedIn(ctx) {
  const c = ctx.curriculum;
  const learned = c.learned.length ? bulletList(c.learned, 12) : [];
  const golf =
    ctx.commands !== null
      ? ctx.commands <= ctx.par
        ? ` Solved in ${ctx.commands} command(s) — on par (${ctx.par}).`
        : ` Solved in ${ctx.commands} command(s). Ideal is ${ctx.par}.`
      : "";
  const parts = [
    `I'm learning PowerShell with LearnPowerShell — an interactive pipeline lab.`,
    "",
    c.solvedCount > 0
      ? `Latest win: ${ctx.levelName} (${ctx.levelId}).${golf}`
      : `Starting the curriculum now.`,
    "",
    learned.length ? "What I've learned so far:" : "",
    ...learned,
    "",
    `Progress: ${c.solvedCount}/${c.total} levels (${c.percent}%).`,
    "",
    "Practice the object pipeline here:",
    SHARE_URL,
  ];
  return parts.filter(Boolean).join("\n").replace(/\n{3,}/g, "\n\n");
}

/**
 * @param {{
 *   curriculum: import('./progress.js').CurriculumSummary
 * }} ctx
 */
export function shareMessageX(ctx) {
  const c = ctx.curriculum;
  const head = `Learning PowerShell on LearnPowerShell — ${c.solvedCount}/${c.total} levels done.`;
  const first = c.learned[0] ? `• ${c.learned[0].name}` : "Objects, not text.";
  let text = `${head}\n${first}\n${SHARE_URL}`;
  if (text.length > 275) text = `${head}\n${SHARE_URL}`;
  return text;
}

/**
 * @param {Parameters<typeof shareMessageLinkedIn>[0]} ctx
 */
export function buildShareTargets(ctx) {
  const longText = shareMessageLinkedIn(ctx);
  const shortText = shareMessageX(ctx);
  const url = SHARE_URL;
  return {
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent("LearnPowerShell")}&summary=${encodeURIComponent(longText)}&source=LearnPowerShell`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shortText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(longText)}`,
    text: longText,
    shortText,
    url,
    learnedLines: bulletList(ctx.curriculum.learned),
  };
}

/**
 * @param {string} url
 */
export function openShareWindow(url) {
  window.open(url, "_blank", "noopener,noreferrer,width=720,height=640");
}

/**
 * @param {string} text
 */
export async function copySharePayload(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/**
 * @param {"linkedin" | "facebook" | "x" | "copy"} kind
 * @param {ReturnType<typeof buildShareTargets>} targets
 */
export async function shareWithClipboard(kind, targets) {
  if (kind === "copy") {
    return { opened: false, copied: await copySharePayload(targets.text) };
  }
  const copied = await copySharePayload(
    kind === "x" ? targets.shortText : targets.text
  );
  const href =
    kind === "linkedin"
      ? targets.linkedin
      : kind === "facebook"
        ? targets.facebook
        : targets.x;
  openShareWindow(href);
  return { opened: true, copied };
}
