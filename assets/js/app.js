/**
 * App shell: wires engine, visualizer, terminal, and levels together.
 */

import { Session, resolvePath, getNode, PSObject, previewObject } from "./engine.js";
import {
  SERIES,
  LEVELS,
  getLevel,
  levelsInSeries,
  nextLevelId,
  evaluateGoal,
} from "./levels.js";
import { createVisualizer, renderGoals } from "./visuals.js";
import { createTerminal } from "./terminal.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** @type {Session} */
let session = new Session();
let mode = /** @type {"sandbox" | "level"} */ ("sandbox");
let levelId = /** @type {string | null} */ (null);
let lastRun = emptyRun();
let solvedIds = loadSolved();
let levelCommandStart = 0;

function emptyRun() {
  return {
    output: /** @type {string[]} */ ([]),
    usedCmdlets: /** @type {string[]} */ ([]),
    pipeline: /** @type {any} */ (null),
    commandCount: 0,
  };
}

function loadSolved() {
  try {
    return new Set(JSON.parse(localStorage.getItem("lps-solved") || "[]"));
  } catch {
    return new Set();
  }
}

function saveSolved() {
  localStorage.setItem("lps-solved", JSON.stringify([...solvedIds]));
}

// DOM
const el = {
  goalBody: /** @type {HTMLElement} */ (document.querySelector("[data-goal-body]")),
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
  btnReset: /** @type {HTMLButtonElement} */ (document.querySelector("[data-action=reset]")),
  btnUndo: /** @type {HTMLButtonElement} */ (document.querySelector("[data-action=undo]")),
  modalClose: /** @type {HTMLButtonElement} */ (document.querySelector("[data-modal-close]")),
};

const viz = createVisualizer(el.vizRoot);
const term = createTerminal(el.termRoot, { onCommand: handleCommand });

function updateChrome() {
  const total = LEVELS.length;
  const done = solvedIds.size;
  el.progress.textContent = `${done}/${total} solved`;
  el.modeLabel.textContent = mode === "level" ? `level · ${levelId}` : "sandbox";
  el.cmdCount.textContent = `${session.commandCount} cmd`;
  if (mode === "level" && levelId) {
    const level = getLevel(levelId);
    if (level) {
      el.levelTitle.textContent = level.name;
      el.levelBrief.textContent = level.brief;
      el.levelHint.textContent = level.hint;
      el.levelPar.textContent = `par ${level.par}`;
    }
  } else {
    el.levelTitle.textContent = "Sandbox";
    el.levelBrief.textContent =
      "Free practice. Type help for commands, levels to train.";
    el.levelHint.textContent = "help · levels · undo · reset";
    el.levelPar.textContent = "";
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
      if (result.solved && lastRun.output != null && session.commandCount > levelCommandStart) {
        onLevelSolved(level, result);
      }
    }
  }
}

/**
 * @param {import('./levels.js').Level} level
 * @param {{ checks: any[] }} result
 */
function onLevelSolved(level, result) {
  if (solvedIds.has(level.id) && level._justSolved) return;
  level._justSolved = true;
  solvedIds.add(level.id);
  saveSolved();
  updateChrome();

  const used = session.commandCount - levelCommandStart;
  const underPar = used <= level.par;
  openModal(
    "Level solved",
    `
      <p class="modal-lead">${escapeHtml(level.name)}</p>
      <p>${used} command${used === 1 ? "" : "s"} · par ${level.par}${underPar ? " · on par" : " · over par"}</p>
      <ul class="goal-list compact">
        ${result.checks
          .map(
            (c) =>
              `<li class="${c.passed ? "is-pass" : "is-pending"}"><span class="goal-mark">${c.passed ? "✓" : "○"}</span><span>${escapeHtml(c.label)}</span></li>`
          )
          .join("")}
      </ul>
      <div class="modal-actions">
        <button type="button" class="btn primary" data-action="next-level">Next level</button>
        <button type="button" class="btn" data-action="levels">All levels</button>
      </div>
    `
  );
}

/**
 * @param {string} title
 * @param {string} html
 */
function openModal(title, html) {
  el.modalTitle.textContent = title;
  el.modalBody.innerHTML = html;
  el.modal.hidden = false;
  el.modal.classList.add("is-open");
}

function closeModal() {
  el.modal.classList.remove("is-open");
  el.modal.hidden = true;
}

function showLevels() {
  const seriesHtml = SERIES.map((s) => {
    const levels = levelsInSeries(s.id);
    const items = levels
      .map((l) => {
        const done = solvedIds.has(l.id);
        return `
          <li>
            <button type="button" class="level-row ${done ? "is-done" : ""}" data-level="${l.id}">
              <span class="level-name">${escapeHtml(l.name)}</span>
              <span class="level-meta">par ${l.par}${done ? " · solved" : ""}</span>
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
  level._justSolved = false;
  session = new Session();
  lastRun = emptyRun();
  levelCommandStart = session.commandCount;
  closeModal();
  updateChrome();
  viz.renderPipeline(null);
  term.print(`— Level: ${level.name} —`, "meta");
  term.print(level.brief, "meta");
  term.print(`Hint: ${level.hint}`, "meta");
  term.print(`Par: ${level.par}`, "meta");
  refreshVisuals();
  term.focus();
}

function startSandbox() {
  mode = "sandbox";
  levelId = null;
  session = new Session();
  lastRun = emptyRun();
  levelCommandStart = 0;
  closeModal();
  updateChrome();
  viz.renderPipeline(null);
  term.print("Sandbox mode. Type help for commands.", "meta");
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
  if (result.output.includes("Opening level browser…")) {
    showLevels();
  }
  if (result.output.includes("hint") && result.output.length === 1) {
    if (mode === "level" && levelId) {
      term.print(getLevel(levelId)?.hint || "", "meta");
    } else {
      term.print("No active level. Type levels to pick one.", "meta");
    }
  }
  if (result.output.includes("goal") && result.output.length === 1) {
    if (mode === "level" && levelId) {
      const level = getLevel(levelId);
      if (level) {
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
    }
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
      lineOut === "build-level" ||
      lineOut === "import-level"
    ) {
      continue;
    }
    term.print(lineOut, "out");
  }
  if (result.error) term.print(result.error, "err");

  lastRun = {
    output: result.output,
    usedCmdlets: result.usedCmdlets,
    pipeline: result.pipeline,
    commandCount: session.commandCount,
  };
  viz.renderPipeline(result.pipeline, { reduceMotion });
  refreshVisuals();
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
      start: { cwd: "C:\\lab" },
    },
    null,
    2
  );
}

// Chrome events
el.btnLevels.addEventListener("click", () => showLevels());
el.btnSandbox.addEventListener("click", () => startSandbox());
el.btnHint.addEventListener("click", () => {
  if (mode === "level" && levelId) {
    term.print(getLevel(levelId)?.hint || "", "meta");
  } else {
    term.print("No active level.", "meta");
  }
});
el.btnReset.addEventListener("click", () => {
  session.run("reset");
  lastRun = emptyRun();
  levelCommandStart = session.commandCount;
  if (mode === "level" && levelId) {
    const level = getLevel(levelId);
    level && (level._justSolved = false);
    session = new Session();
    levelCommandStart = 0;
    lastRun = emptyRun();
  }
  term.print("Reset.", "meta");
  viz.renderPipeline(null);
  refreshVisuals();
});
el.btnUndo.addEventListener("click", () => {
  session.undo();
  lastRun = emptyRun();
  viz.renderPipeline(null);
  refreshVisuals();
});
el.modalClose.addEventListener("click", () => closeModal());

el.modalBody.addEventListener("click", (e) => {
  const t = /** @type {HTMLElement} */ (e.target);
  const levelBtn = t.closest("[data-level]");
  if (levelBtn) {
    startLevel(levelBtn.getAttribute("data-level") || "");
    return;
  }
  const action = t.closest("[data-action]")?.getAttribute("data-action");
  if (action === "next-level") {
    const next = levelId ? nextLevelId(levelId) : null;
    if (next) startLevel(next);
    else {
      closeModal();
      term.print("All levels complete. Sandbox unlocked.", "meta");
    }
  }
  if (action === "levels") showLevels();
  if (action === "sandbox") {
    closeModal();
    startSandbox();
  }
  if (action === "import-go") {
    const area = /** @type {HTMLTextAreaElement} */ (el.modalBody.querySelector("[data-import]"));
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

// URL params
const params = new URLSearchParams(location.search);
const bootCommands = params.get("command");
const startLevelParam = params.get("level");
if (params.get("NODEMO") == null && !bootCommands && !startLevelParam) {
  openModal(
    "LearnPowerShell",
    `<p class="modal-lead">An interactive PowerShell pipeline visualizer and tutorial.</p>
     <p>Objects flow through cmdlets. Levels teach the pipeline the way learnGitBranching teaches branches.</p>
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
  term.print("LearnPowerShell ready. Type help or levels.", "meta");
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
