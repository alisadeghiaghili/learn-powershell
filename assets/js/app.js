/**
 * App shell: engine + visualizer + terminal + levels + celebrate/share + progress.
 */

import { Session } from "./engine.js";
import {
  SERIES,
  LEVELS,
  getLevel,
  levelsInSeries,
  nextLevelId,
  evaluateGoal,
  seriesTitle,
} from "./levels.js";
import { createVisualizer, renderGoals } from "./visuals.js";
import { createTerminal } from "./terminal.js";
import {
  loadProgress,
  saveProgress,
  summarizeCurriculum,
} from "./progress.js";
import { buildShareTargets, shareWithClipboard, SHARE_URL } from "./share.js";
import { launchConfetti, playFanfare } from "./confetti.js";
import { teachAfterCommand, levelTeachHtml } from "./teach.js";

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/** @type {Session} */
let session = new Session();
let mode = /** @type {"sandbox" | "level"} */ ("sandbox");
let levelId = /** @type {string | null} */ (null);
let lastRun = emptyRun();
let levelCommandStart = 0;
/** @type {Record<string, { solved: boolean, bestCommands?: number }>} */
let progressMap = loadProgress();
let celebrateOffered = false;

function emptyRun() {
  return {
    output: /** @type {string[]} */ ([]),
    usedCmdlets: /** @type {string[]} */ ([]),
    pipeline: /** @type {any} */ (null),
    commandCount: 0,
  };
}

const el = {
  goalBody: /** @type {HTMLElement} */ (document.querySelector("[data-goal-body]")),
  teachBody: /** @type {HTMLElement} */ (document.querySelector("[data-teach-body]")),
  levelTitle: /** @type {HTMLElement} */ (document.querySelector("[data-level-title]")),
  levelBrief: /** @type {HTMLElement} */ (document.querySelector("[data-level-brief]")),
  levelHint: /** @type {HTMLElement} */ (document.querySelector("[data-level-hint]")),
  levelPar: /** @type {HTMLElement} */ (document.querySelector("[data-level-par]")),
  cmdCount: /** @type {HTMLElement} */ (document.querySelector("[data-cmd-count]")),
  modeLabel: /** @type {HTMLElement} */ (document.querySelector("[data-mode-label]")),
  progress: /** @type {HTMLElement} */ (document.querySelector("[data-progress]")),
  modal: /** @type {HTMLElement} */ (document.querySelector("[data-modal]")),
  modalBody: /** @type {HTMLElement} */ (document.querySelector("[data-modal-body]")),
  modalTitle: /** @type {HTMLElement} */ (document.querySelector("[data-modal-title]")),
  vizRoot: /** @type {HTMLElement} */ (document.querySelector("[data-viz]")),
  termRoot: /** @type {HTMLElement} */ (document.querySelector("[data-term]")),
  btnLevels: /** @type {HTMLButtonElement} */ (document.querySelector("[data-action=levels]")),
  btnSandbox: /** @type {HTMLButtonElement} */ (document.querySelector("[data-action=sandbox]")),
  btnHint: /** @type {HTMLButtonElement} */ (document.querySelector("[data-action=hint]")),
  btnSteps: /** @type {HTMLButtonElement} */ (document.querySelector("[data-action=steps]")),
  btnReset: /** @type {HTMLButtonElement} */ (document.querySelector("[data-action=reset]")),
  btnUndo: /** @type {HTMLButtonElement} */ (document.querySelector("[data-action=undo]")),
  modalClose: /** @type {HTMLButtonElement} */ (document.querySelector("[data-modal-close]")),
};

const viz = createVisualizer(el.vizRoot);
const term = createTerminal(el.termRoot, { onCommand: handleCommand });

function curriculum() {
  return summarizeCurriculum(progressMap, LEVELS, seriesTitle);
}

function updateChrome() {
  const c = curriculum();
  el.progress.textContent = `${c.solvedCount}/${c.total} solved`;
  el.modeLabel.textContent =
    mode === "level" ? `level · ${levelId}` : "sandbox";
  el.cmdCount.textContent = `${session.commandCount} cmd`;
  if (mode === "level" && levelId) {
    const level = getLevel(levelId);
    if (level) {
      el.levelTitle.textContent = level.name;
      el.levelBrief.textContent = level.brief;
      el.levelHint.textContent = level.hint;
      el.levelPar.textContent = `par ${level.par}`;
      el.teachBody.innerHTML = levelTeachHtml(level);
    }
  } else {
    el.levelTitle.textContent = "Sandbox";
    el.levelBrief.textContent =
      "Free practice. Type help for commands, levels to train.";
    el.levelHint.textContent = "help · levels · undo · reset";
    el.levelPar.textContent = "";
    el.teachBody.innerHTML = "";
    renderGoals(el.goalBody, { checks: [], solved: false }, { reduceMotion });
  }
}

function refreshVisuals() {
  viz.renderSession(session);
  term.setPath(session.cwd);
  el.cmdCount.textContent = `${session.commandCount} cmd`;
  if (mode === "level" && levelId) {
    const level = getLevel(levelId);
    if (level) {
      const result = evaluateGoal(level.goal, session, {
        output: lastRun.output,
        usedCmdlets: [...session.usedCmdlets],
        pipeline: lastRun.pipeline,
        commandCount: session.commandCount,
      });
      renderGoals(el.goalBody, result, { reduceMotion });
      term.setHint(result.solved ? null : level.hint);
      if (
        result.solved &&
        session.commandCount > levelCommandStart &&
        !celebrateOffered
      ) {
        onLevelSolved(level, result);
      }
    }
  } else {
    term.setHint(null);
  }
}

/**
 * @param {import('./levels.js').Level} level
 * @param {{ checks: any[] }} result
 */
function onLevelSolved(level, result) {
  celebrateOffered = true;
  const used = session.commandCount - levelCommandStart;
  const prev = progressMap[level.id];
  progressMap[level.id] = {
    solved: true,
    bestCommands: prev?.bestCommands
      ? Math.min(prev.bestCommands, used)
      : used,
  };
  saveProgress(progressMap);
  updateChrome();

  const c = curriculum();
  const underPar = used <= level.par;
  const golfLine = underPar
    ? `**${used}** command${used === 1 ? "" : "s"} · on par (${level.par})`
    : `**${used}** command${used === 1 ? "" : "s"}. Ideal is ${level.par}. Still counts.`;
  const cheers = [
    "Clean solve.",
    "Pipeline locked in.",
    "That is PowerShell thinking.",
    "Objects moved. You moved with them.",
  ];
  const cheer = cheers[Math.floor(Math.random() * cheers.length)];
  const learnedPreview = c.learned
    .map((l) => `<li>${escapeHtml(l.seriesTitle)}: ${escapeHtml(l.name)}</li>`)
    .join("");
  const next = levelId ? nextLevelId(levelId) : null;
  const nextLevel = next ? getLevel(next) : null;

  const share = buildShareTargets({
    levelName: level.name,
    levelId: level.id,
    commands: used,
    par: level.par,
    curriculum: c,
  });

  openModal(
    "Level cleared",
    `
      <div class="celebrate" aria-live="polite">
        <div class="celebrate-visual" aria-hidden="true">
          <div class="celebrate-ring"></div>
          <div class="celebrate-star">★</div>
        </div>
        <div class="celebrate-badge">LEVEL CLEARED</div>
        <h3 class="celebrate-title">${escapeHtml(level.name)}</h3>
        <p class="celebrate-sub">${escapeHtml(seriesTitle(level.series))} · <code>${escapeHtml(level.id)}</code></p>
        <p class="celebrate-cheer">${escapeHtml(cheer)}</p>
        <div class="celebrate-stats"><p>${golfLine}</p></div>
        <div class="celebrate-progress">
          <div class="prog-track"><div class="prog-fill" style="width:${c.percent}%"></div></div>
          <div class="par-note">${c.solvedCount} / ${c.total} levels · progress saved in this browser</div>
        </div>
        <div class="share-block">
          <div class="next-title">Share your progress</div>
          <div class="learned-preview">
            <div class="par-note">What you have learned so far</div>
            <ul>${learnedPreview || "<li>Solve a few levels to build your list.</li>"}</ul>
          </div>
          <div class="share-row" role="group" aria-label="Share">
            <button type="button" class="share-btn linkedin" data-share="linkedin">LinkedIn</button>
            <button type="button" class="share-btn x" data-share="x">X / Twitter</button>
            <button type="button" class="share-btn facebook" data-share="facebook">Facebook</button>
            <button type="button" class="share-btn copy" data-share="copy">Copy post</button>
          </div>
          <div class="share-status" data-share-status hidden></div>
        </div>
        ${
          nextLevel
            ? `<div class="celebrate-next">Next: <code>${escapeHtml(nextLevel.id)}</code> — ${escapeHtml(nextLevel.name)}</div>`
            : `<div class="celebrate-next">Curriculum complete. Stay in sandbox and keep experimenting.</div>`
        }
        <div class="modal-actions">
          <button type="button" class="btn ghost" data-action="celebrate-close">Bask in it</button>
          ${
            nextLevel
              ? `<button type="button" class="btn primary" data-action="celebrate-next">Celebrate on: ${escapeHtml(nextLevel.id)}</button>`
              : `<button type="button" class="btn primary" data-action="levels">Browse levels</button>`
          }
        </div>
      </div>
    `,
    { variant: "celebrate" }
  );

  el.modal.querySelectorAll("[data-share]").forEach((btn) => {
    btn.addEventListener("click", async (ev) => {
      ev.preventDefault();
      const kind = /** @type {any} */ (btn.getAttribute("data-share")) || "copy";
      const status = el.modal.querySelector("[data-share-status]");
      const result = await shareWithClipboard(kind, share);
      if (!status) return;
      status.hidden = false;
      status.textContent =
        kind === "copy"
          ? result.copied
            ? "Copied to clipboard."
            : "Copy failed — select the text manually."
          : result.copied
            ? "Share window opened. Message also copied."
            : "Share window opened.";
    });
  });
}

/**
 * @param {string} title
 * @param {string} html
 * @param {{ variant?: "default" | "celebrate" }} [opts]
 */
function openModal(title, html, opts = {}) {
  el.modalTitle.textContent = title;
  el.modalBody.innerHTML = html;
  el.modal.hidden = false;
  el.modal.classList.add("is-open");
  el.modal.classList.toggle("is-celebrate", opts.variant === "celebrate");
}

function closeModal() {
  el.modal.classList.remove("is-open", "is-celebrate");
  el.modal.hidden = true;
  celebrateOffered = false;
  term.focus();
}

function showLevels() {
  const seriesHtml = SERIES.map((s) => {
    const levels = levelsInSeries(s.id);
    const items = levels
      .map((l) => {
        const done = Boolean(progressMap[l.id]?.solved);
        const best = progressMap[l.id]?.bestCommands;
        return `
          <li>
            <button type="button" class="level-row ${done ? "is-done" : ""}" data-level="${l.id}">
              <span class="level-name">${escapeHtml(l.name)}</span>
              <span class="level-meta">par ${l.par}${done ? ` · solved${best ? ` · best ${best}` : ""}` : ""}</span>
            </button>
          </li>`;
      })
      .join("");
    return `
      <section class="series-block">
        <header>
          <h3>${escapeHtml(s.name)}</h3>
          <p>${escapeHtml(s.description)}</p>
        </header>
        <ol class="level-list">${items}</ol>
      </section>`;
  }).join("");

  openModal("Levels", seriesHtml);
}

/**
 * @param {string} id
 */
function startLevel(id) {
  const level = getLevel(id);
  if (!level) return;
  mode = "level";
  levelId = id;
  celebrateOffered = false;
  session = new Session();
  lastRun = emptyRun();
  levelCommandStart = 0;
  closeModal();
  updateChrome();
  viz.renderPipeline(null);
  term.print(`— Level: ${level.name} —`, "meta");
  term.print(level.brief, "meta");
  if (level.teach?.what) {
    term.print(`What: ${level.teach.what}`, "meta");
    for (const w of level.teach.why || []) term.print(`Why: ${w}`, "meta");
    if (level.teach.model) term.print(`Model: ${level.teach.model}`, "meta");
  }
  term.print(`Hint: ${level.hint}`, "meta");
  term.print(`Par: ${level.par}`, "meta");
  term.setHint(level.hint);
  refreshVisuals();
  term.focus();
}

function startSandbox() {
  mode = "sandbox";
  levelId = null;
  celebrateOffered = false;
  session = new Session();
  lastRun = emptyRun();
  levelCommandStart = 0;
  closeModal();
  updateChrome();
  viz.renderPipeline(null);
  term.print("Sandbox mode. Type help for commands.", "meta");
  const c = curriculum();
  if (c.solvedCount) {
    term.print(
      `Welcome back — progress saved: ${c.solvedCount}/${c.total} levels (${c.percent}%).`,
      "meta"
    );
    if (c.next) {
      term.print(
        `Next up: ${c.next.name} (${c.next.id}). Open Levels or type levels.`,
        "meta"
      );
    }
  }
  term.setHint(null);
  refreshVisuals();
  term.focus();
}

/**
 * @param {string} line
 */
function handleCommand(line) {
  const result = session.run(line);

  if (result.output.includes("clear-screen")) {
    term.clear();
    lastRun = emptyRun();
    refreshVisuals();
    return;
  }
  if (result.output.includes("Opening level browser…")) showLevels();
  if (result.output.includes("hint") && result.output.length === 1) {
    if (mode === "level" && levelId) {
      term.print(getLevel(levelId)?.hint || "", "meta");
    } else {
      term.print("No active level. Type levels to pick one.", "meta");
    }
  }
  if (result.output.includes("goal") && result.output.length === 1) {
    printGoalSummary();
  }
  if (result.output.includes("steps") && result.output.length === 1) {
    printSteps();
  }
  if (result.output.includes("curriculum") && result.output.length === 1) {
    printCurriculum();
  }
  if (result.output.includes("build-level")) {
    openModal(
      "Build level",
      `<p>Export the current sandbox as a level JSON. Paste it into a gist or issue.</p>
       <pre class="code-block">${escapeHtml(exportLevelJson())}</pre>`
    );
  }
  if (result.output.includes("import-level")) {
    openModal(
      "Import level",
      `<p>Paste a level JSON below.</p>
       <textarea class="import-area" data-import rows="8" placeholder='{"id":"custom-1",...}'></textarea>
       <div class="modal-actions"><button type="button" class="btn primary" data-action="import-go">Import</button></div>`
    );
  }

  for (const lineOut of result.output) {
    if (
      lineOut === "clear-screen" ||
      lineOut === "Opening level browser…" ||
      lineOut === "hint" ||
      lineOut === "goal" ||
      lineOut === "steps" ||
      lineOut === "curriculum" ||
      lineOut === "build-level" ||
      lineOut === "import-level"
    ) {
      continue;
    }
    term.print(lineOut, "out");
  }
  if (result.error) term.print(result.error, "err");

  const teach = teachAfterCommand(line);
  if (teach) term.print(teach, "meta");

  lastRun = {
    output: result.output,
    usedCmdlets: result.usedCmdlets,
    pipeline: result.pipeline,
    commandCount: session.commandCount,
  };
  viz.renderPipeline(result.pipeline, { reduceMotion });
  refreshVisuals();
  term.focus();
}

function printGoalSummary() {
  if (mode !== "level" || !levelId) {
    term.print("No active level.", "meta");
    return;
  }
  const level = getLevel(levelId);
  if (!level) return;
  const g = level.goal;
  const lines = [];
  if (g.commandsMax != null) lines.push(`commands ≤ ${g.commandsMax}`);
  if (g.usedCmdlets) lines.push(`use ${g.usedCmdlets.join(", ")}`);
  if (g.pathIs) lines.push(`cd to ${g.pathIs}`);
  if (g.outputIncludes) lines.push(`output includes ${g.outputIncludes}`);
  if (g.outputCount != null) lines.push(`emit ${g.outputCount} objects`);
  if (g.pipelineCmdlets) lines.push(`pipeline: ${g.pipelineCmdlets.join(" | ")}`);
  if (g.fileExists) lines.push(`create ${g.fileExists}`);
  if (g.fileMissing) lines.push(`delete ${g.fileMissing}`);
  if (g.fileContains) lines.push(`write ${g.fileContains}`);
  if (g.variableIs) lines.push(`set $${g.variableIs.split("=")[0]}`);
  term.print(lines.join("\n"), "meta");
}

function printCurriculum() {
  const c = curriculum();
  term.print(
    `Progress: ${c.solvedCount}/${c.total} levels (${c.percent}%)`,
    "meta"
  );
  if (c.learned.length) {
    term.print("Learned:", "meta");
    for (const l of c.learned) {
      term.print(`  • ${l.seriesTitle}: ${l.name}`, "meta");
    }
  }
  if (c.remaining.length) {
    term.print("Remaining:", "meta");
    for (const l of c.remaining.slice(0, 8)) {
      term.print(`  • ${l.seriesTitle}: ${l.name}`, "meta");
    }
    if (c.remaining.length > 8) {
      term.print(`  …and ${c.remaining.length - 8} more`, "meta");
    }
  }
  if (c.next) term.print(`Next: ${c.next.name} (${c.next.id})`, "meta");
}

function printSteps() {
  if (mode !== "level" || !levelId) {
    term.print("No active level. Start one with levels.", "meta");
    return;
  }
  const level = getLevel(levelId);
  if (!level?.teach) return;
  term.print(`── Guide: ${level.name} ──`, "meta");
  term.print(`What: ${level.teach.what}`, "meta");
  for (const w of level.teach.why) term.print(`Why: ${w}`, "meta");
  if (level.teach.model) term.print(`Model: ${level.teach.model}`, "meta");
  if (level.learning?.length) {
    term.print(`You are learning: ${level.learning.join(" · ")}`, "meta");
  }
}

function exportLevelJson() {
  return JSON.stringify(
    {
      id: `custom-${Date.now()}`,
      series: "remix",
      name: "Custom level",
      brief: "Describe the goal.",
      hint: "Describe the approach.",
      par: session.commandCount || 1,
      goal: {
        usedCmdlets: [...session.usedCmdlets],
        pathIs: session.cwd,
      },
      teach: {
        what: "Describe what happens when the learner runs the solution.",
        why: ["Why this matters in real PowerShell work."],
        model: "One-sentence mental model.",
      },
      learning: ["Concept A", "Concept B"],
    },
    null,
    2
  );
}

function helpText() {
  return [
    "LearnPowerShell guide",
    "  Levels   level browser",
    "  Lesson   what / why / mental model for this level",
    "  Hint     suggested command",
    "  Solution official command (golf still counts)",
    "  Undo     revert last command",
    "  Reset    reset session",
    "  Sandbox  free practice",
    "  ?        this help",
    "",
    "Pipelines pass objects: Get-Process | Where-Object CPU -gt 50",
    "Assign objects: $procs = Get-Process",
  ].join("\n");
}

el.btnLevels.addEventListener("click", () => showLevels());
el.btnSandbox.addEventListener("click", () => startSandbox());
el.btnHint.addEventListener("click", () => {
  if (mode === "level" && levelId) term.print(getLevel(levelId)?.hint || "", "meta");
  else term.print("No active level.", "meta");
  term.focus();
});
el.btnSteps.addEventListener("click", () => {
  printSteps();
  term.focus();
});
document.querySelector("[data-action=guide]")?.addEventListener("click", () => {
  term.print(helpText(), "meta");
  term.focus();
});
document.querySelector("[data-action=help]")?.addEventListener("click", () => {
  term.print(helpText(), "meta");
  term.focus();
});
document.querySelector("[data-action=solution]")?.addEventListener("click", () => {
  if (mode !== "level" || !levelId) {
    term.print("Start a level first (Levels).", "meta");
  } else {
    term.print(`Solution: ${getLevel(levelId)?.hint || ""}`, "meta");
    term.print("(par " + (getLevel(levelId)?.par || 1) + " — golf the solution yourself)", "meta");
  }
  term.focus();
});
document.querySelector("[data-action=lang]")?.addEventListener("click", () => {
  term.print("Language packs: EN active. FA/DE can be added.", "meta");
  term.focus();
});
el.btnReset.addEventListener("click", () => {
  if (mode === "level" && levelId) {
    session = new Session();
    levelCommandStart = 0;
    lastRun = emptyRun();
    celebrateOffered = false;
  } else {
    session.run("reset");
    lastRun = emptyRun();
    levelCommandStart = session.commandCount;
  }
  term.print("Reset.", "meta");
  viz.renderPipeline(null);
  refreshVisuals();
  term.focus();
});
el.btnUndo.addEventListener("click", () => {
  session.undo();
  lastRun = emptyRun();
  viz.renderPipeline(null);
  refreshVisuals();
  term.focus();
});
el.modalClose.addEventListener("click", () => closeModal());

el.modal.addEventListener("click", (e) => {
  if (e.target === el.modal) closeModal();
});

el.modalBody.addEventListener("click", (e) => {
  const t = /** @type {HTMLElement} */ (e.target);
  const levelBtn = t.closest("[data-level]");
  if (levelBtn) {
    startLevel(levelBtn.getAttribute("data-level") || "");
    return;
  }
  const action = t.closest("[data-action]")?.getAttribute("data-action");
  if (action === "next-level" || action === "celebrate-next") {
    const next = levelId ? nextLevelId(levelId) : null;
    if (next) startLevel(next);
    else {
      closeModal();
      term.print("All levels complete. Sandbox unlocked.", "meta");
    }
  }
  if (action === "celebrate-close") {
    closeModal();
  }
  if (action === "levels") showLevels();
  if (action === "sandbox") {
    closeModal();
    startSandbox();
  }
  if (action === "import-go") {
    const area = /** @type {HTMLTextAreaElement} */ (
      el.modalBody.querySelector("[data-import]")
    );
    try {
      const data = JSON.parse(area.value);
      LEVELS.push(data);
      closeModal();
      startLevel(data.id);
    } catch {
      term.print("Import failed: invalid JSON.", "err");
    }
  }
});

const params = new URLSearchParams(location.search);
const bootCommands = params.get("command");
const startLevelParam = params.get("level");
if (params.get("NODEMO") == null && !bootCommands && !startLevelParam) {
  openModal(
    "LearnPowerShell",
    `<p class="modal-lead">An interactive PowerShell pipeline lab.</p>
     <p>Objects flow through cmdlets. Levels teach the language so you leave with a mental model — not just typed lines.</p>
     <div class="modal-actions">
       <button type="button" class="btn primary" data-action="levels">Start levels</button>
       <button type="button" class="btn" data-action="sandbox">Sandbox</button>
     </div>`
  );
}

if (startLevelParam) startLevel(startLevelParam);
else if (bootCommands) {
  closeModal();
  startSandbox();
  for (const cmd of bootCommands.split(";")) {
    if (cmd.trim()) handleCommand(cmd.trim());
  }
} else {
  updateChrome();
  refreshVisuals();
  const c = curriculum();
  if (c.solvedCount) {
    term.print(
      `Welcome back — progress saved: ${c.solvedCount}/${c.total} levels (${c.percent}%).`,
      "meta"
    );
    const learnedTitles = c.learned.map((l) => l.name).join(" · ");
    term.print(`Learned so far: ${learnedTitles}`, "meta");
    if (c.next) {
      term.print(`Next up: ${c.next.name} (${c.next.id}).`, "meta");
    }
  } else {
    term.print("LearnPowerShell ready. Type help or levels.", "meta");
  }
  term.focus();
}

/**
 * @param {string} s
 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
