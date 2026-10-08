/**
 * App shell: engine + visualizer + terminal + levels + dock + celebrate/share + i18n.
 * Fully aligned with learn-dvc architecture while maintaining PowerShell palette.
 */

import { Session } from "./engine.js";
import {
  SERIES,
  LEVELS,
  getLevel,
  levelsInSeries,
  nextLevelId,
  evaluateGoal,
} from "./levels.js";
import { createVisualizer } from "./visuals.js";
import { createTerminal } from "./terminal.js";
import {
  loadProgress,
  saveProgress,
  summarizeCurriculum,
} from "./progress.js";
import { buildShareTargets, shareWithClipboard } from "./share.js";
import { launchConfetti, playFanfare } from "./confetti.js";
import { teachAfterCommand } from "./teach.js";
import { showModal, renderMarkdown, escapeHtml } from "./dialog.js";
import {
  initLocale,
  getLocale,
  setLocale,
  ui,
  localizeLevel,
  localizeSeriesTitle,
} from "./i18n/index.js";
import { getVisitorCount } from "./visitor-counter.js";
import { DEPTH_TIERS, getDepthContent } from "./depth.js";

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Initialize locale on boot (localStorage or navigator)
initLocale();

let currentDepth = "eli5";
try {
  const savedDepth = localStorage.getItem("learnpowershell-depth");
  if (savedDepth && DEPTH_TIERS.some((t) => t.id === savedDepth)) {
    currentDepth = savedDepth;
  }
} catch {}
let spectrumMode = false;

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

const boardWrapEl = /** @type {HTMLElement} */ (document.getElementById("board-wrap"));
const dockEl = /** @type {HTMLElement} */ (document.getElementById("dock"));
const terminalEl = /** @type {HTMLElement} */ (document.getElementById("terminal"));
const levelTitleEl = /** @type {HTMLElement} */ (document.getElementById("level-title"));
const langLabelEl = /** @type {HTMLElement} */ (document.querySelector("[data-lang-label]"));
const langDropdownEl = /** @type {HTMLElement} */ (document.getElementById("lang-dropdown"));
const navDrawerEl = /** @type {HTMLElement} */ (document.getElementById("nav-drawer"));

const viz = createVisualizer(boardWrapEl);
const term = createTerminal(terminalEl, { onCommand: handleCommand });

function curriculum() {
  return summarizeCurriculum(progressMap, LEVELS, localizeSeriesTitle);
}

function updateChrome() {
  const c = curriculum();
  if (langLabelEl) {
    langLabelEl.textContent = getLocale().toUpperCase();
  }
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.classList.toggle("on", btn.getAttribute("data-lang") === getLocale());
  });

  if (levelTitleEl) {
    if (mode === "level" && levelId) {
      const raw = getLevel(levelId);
      const l = raw ? localizeLevel(raw) : null;
      levelTitleEl.textContent = l
        ? ui().titleLine(l.id, l.name, l.par)
        : ui().sandboxTitle;
    } else {
      levelTitleEl.textContent = ui().sandboxTitle;
    }
  }
}

function focusGuide() {
  dockEl.classList.remove("dock-pulse");
  void dockEl.offsetWidth;
  dockEl.classList.add("dock-pulse");
  dockEl.scrollTop = 0;
}

function renderDock() {
  if (!dockEl) return;

  if (mode === "sandbox" || !levelId) {
    const depths = getDepthContent("objects", "objects-01", getLocale());
    const activeTierObj = DEPTH_TIERS.find((t) => t.id === currentDepth) || DEPTH_TIERS[0];
    const isFa = getLocale() === "fa";
    const depthBarLabel = isFa ? "مدل ذهنی خط لوله (عمق یادگیری)" : "PIPELINE MENTAL MODEL (DEPTH)";
    const toggleBtnText = spectrumMode
      ? (isFa ? "نمای انتخابی" : "Focused View")
      : (isFa ? "نردبان کامل ۵ سطحی" : "Full 5-Tier Ladder");

    const pillsHtml = DEPTH_TIERS.map((tier) => {
      const isActive = tier.id === currentDepth;
      const tTitle = isFa ? tier.titleFa : tier.titleEn;
      return `
        <button type="button" class="depth-pill ${isActive ? "active" : ""}" data-depth="${tier.id}" title="${escapeHtml(tTitle)}">
          <span>${tier.icon}</span> <span>${tier.label}</span>
        </button>
      `;
    }).join("");

    const depthCardsHtml = spectrumMode
      ? `<div class="depth-spectrum">
          ${DEPTH_TIERS.map((tier) => {
            const tTitle = isFa ? tier.titleFa : tier.titleEn;
            const content = depths[tier.id];
            return `
              <div class="depth-card" style="border-inline-start: 3px solid ${tier.color};">
                <div class="depth-card-header">
                  <span class="depth-badge" style="color: ${tier.color};">${tier.icon} ${tier.label}</span>
                  <span class="depth-tier-title">${escapeHtml(tTitle)}</span>
                </div>
                <p class="depth-card-body">${escapeHtml(content)}</p>
              </div>
            `;
          }).join("")}
        </div>`
      : `<div class="depth-card" style="border-inline-start: 3px solid ${activeTierObj.color};">
          <div class="depth-card-header">
            <span class="depth-badge" style="color: ${activeTierObj.color};">${activeTierObj.icon} ${activeTierObj.label}</span>
            <span class="depth-tier-title">${escapeHtml(isFa ? activeTierObj.titleFa : activeTierObj.titleEn)}</span>
          </div>
          <p class="depth-card-body">${escapeHtml(depths[currentDepth] || depths.eli5)}</p>
        </div>`;

    dockEl.innerHTML = `
      <h2>${escapeHtml(ui().learningGuide)}</h2>
      <p class="objective">${escapeHtml(ui().guideAlwaysOn)}</p>
      <div class="depth-section">
        <div class="depth-header-row">
          <span class="depth-bar-label">${escapeHtml(depthBarLabel)}</span>
          <button type="button" class="depth-mode-btn" id="depthModeToggle">${escapeHtml(toggleBtnText)}</button>
        </div>
        <div class="depth-pills">${pillsHtml}</div>
        ${depthCardsHtml}
      </div>
      <div class="learning-box">
        <div class="next-title">${escapeHtml(ui().startHere)}</div>
        <ul>
          ${ui().startHereItems.map((item) => `<li>${renderMarkdown(item)}</li>`).join("")}
        </ul>
      </div>
      <div class="learning-box">
        <div class="next-title">${escapeHtml(ui().sandboxTip)}</div>
        <ul>
          ${ui().sandboxTipItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
      <ul class="goal-list">
        <li class="met">
          <div class="g-label">${escapeHtml(ui().noActiveLevel)}</div>
          <div class="g-detail">${escapeHtml(ui().noActiveLevelDetail)}</div>
        </li>
      </ul>
      <div class="par-note">${ui().guideFlashNote}</div>
    `;

    dockEl.querySelectorAll(".depth-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        const d = btn.getAttribute("data-depth");
        if (d) {
          currentDepth = d;
          try { localStorage.setItem("learnpowershell-depth", d); } catch {}
          renderDock();
        }
      });
    });
    const modeToggle = dockEl.querySelector("#depthModeToggle");
    if (modeToggle) {
      modeToggle.addEventListener("click", () => {
        spectrumMode = !spectrumMode;
        renderDock();
      });
    }
    return;
  }

  const rawLevel = getLevel(levelId);
  if (!rawLevel) return;
  const level = localizeLevel(rawLevel);

  const result = evaluateGoal(level.goal, session, {
    output: lastRun.output,
    usedCmdlets: [...session.usedCmdlets],
    pipeline: lastRun.pipeline,
    commandCount: session.commandCount,
  });

  const solved = result.solved;
  const prog = progressMap[level.id];
  const golfNote =
    prog?.bestCommands !== undefined
      ? ui().bestSoFar(prog.bestCommands, level.par)
      : ui().idealSolution(level.par);

  const checks = result.checks || [];
  const currentCheckIdx = checks.findIndex((c) => !c.passed);

  const items = checks.map((c, i) => {
    const isCurrent = !solved && i === currentCheckIdx;
    return `
      <li class="${c.passed ? "met" : ""}${isCurrent ? " current" : ""}">
        <div class="g-label" dir="ltr">
          ${c.passed ? "✓" : isCurrent ? "▶" : "○"}
          <code>${escapeHtml(c.label)}</code>
          ${isCurrent ? `<span class="chip current-chip">${escapeHtml(ui().nowChip)}</span>` : ""}
        </div>
        <div class="g-detail" dir="ltr">${escapeHtml(c.detail || "")}</div>
      </li>
    `;
  });

  const nextBlock = solved
    ? `<div class="next-box met">${escapeHtml(ui().allSolutionMet)}</div>`
    : `<div class="next-box">
        <div class="next-title">${escapeHtml(ui().typeNextTitle)}</div>
        <div class="next-row">
          <span class="g-label">${escapeHtml(ui().remainingLabel)}</span>
          <code class="g-cmd" dir="ltr">${escapeHtml(level.hint || "")}</code>
        </div>
        <div class="par-note">${escapeHtml(ui().wrongCommandNote)}</div>
      </div>`;

  const depths = getDepthContent(level.series, level.id, getLocale());
  const activeTierObj = DEPTH_TIERS.find((t) => t.id === currentDepth) || DEPTH_TIERS[0];
  const isFa = getLocale() === "fa";
  const depthBarLabel = isFa ? "عمق یادگیری" : "COGNITIVE DEPTH";
  const toggleBtnText = spectrumMode
    ? (isFa ? "نمای انتخابی" : "Focused View")
    : (isFa ? "نردبان کامل ۵ سطحی" : "Full 5-Tier Ladder");

  const pillsHtml = DEPTH_TIERS.map((tier) => {
    const isActive = tier.id === currentDepth;
    const tTitle = isFa ? tier.titleFa : tier.titleEn;
    return `
      <button type="button" class="depth-pill ${isActive ? "active" : ""}" data-depth="${tier.id}" title="${escapeHtml(tTitle)}">
        <span>${tier.icon}</span> <span>${tier.label}</span>
      </button>
    `;
  }).join("");

  const depthCardsHtml = spectrumMode
    ? `<div class="depth-spectrum">
        ${DEPTH_TIERS.map((tier) => {
          const tTitle = isFa ? tier.titleFa : tier.titleEn;
          const content = depths[tier.id];
          return `
            <div class="depth-card" style="border-inline-start: 3px solid ${tier.color};">
              <div class="depth-card-header">
                <span class="depth-badge" style="color: ${tier.color};">${tier.icon} ${tier.label}</span>
                <span class="depth-tier-title">${escapeHtml(tTitle)}</span>
              </div>
              <p class="depth-card-body">${escapeHtml(content)}</p>
            </div>
          `;
        }).join("")}
      </div>`
    : `<div class="depth-card" style="border-inline-start: 3px solid ${activeTierObj.color};">
        <div class="depth-card-header">
          <span class="depth-badge" style="color: ${activeTierObj.color};">${activeTierObj.icon} ${activeTierObj.label}</span>
          <span class="depth-tier-title">${escapeHtml(isFa ? activeTierObj.titleFa : activeTierObj.titleEn)}</span>
        </div>
        <p class="depth-card-body">${escapeHtml(depths[currentDepth] || depths.eli5)}</p>
      </div>`;

  const depthSectionHtml = `
    <div class="depth-section">
      <div class="depth-header-row">
        <span class="depth-bar-label">${escapeHtml(depthBarLabel)}</span>
        <button type="button" class="depth-mode-btn" id="depthModeToggle">${escapeHtml(toggleBtnText)}</button>
      </div>
      <div class="depth-pills">${pillsHtml}</div>
      ${depthCardsHtml}
    </div>
  `;

  dockEl.innerHTML = `
    <h2>${escapeHtml(level.name)}</h2>
    <p class="objective">${escapeHtml(level.brief)}</p>
    ${depthSectionHtml}
    ${
      level.learning?.length
        ? `<div class="learning-box">
            <div class="next-title">${escapeHtml(ui().youAreLearning)}</div>
            <ul>${level.learning.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>
          </div>`
        : ""
    }
    ${
      level.fieldNotes?.length
        ? `<div class="field-box">
            <div class="next-title">${escapeHtml(ui().fieldNotesTitle)}</div>
            <ul>${level.fieldNotes.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
          </div>`
        : ""
    }
    <div class="par-note">${escapeHtml(golfNote)}</div>
    ${solved ? `<div class="solved-banner">${escapeHtml(ui().solvedBanner(session.commandCount - levelCommandStart || null))}</div>` : ""}
    ${nextBlock}
    <ul class="goal-list">${items.join("")}</ul>
    ${result.checks?.some((c) => !c.passed) ? `<div class="par-note">${escapeHtml(ui().stateNotes)} <code>${escapeHtml(level.id)}</code></div>` : ""}
  `;

  dockEl.querySelectorAll(".depth-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      const d = btn.getAttribute("data-depth");
      if (d) {
        currentDepth = d;
        try { localStorage.setItem("learnpowershell-depth", d); } catch {}
        renderDock();
      }
    });
  });
  const modeToggle = dockEl.querySelector("#depthModeToggle");
  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      spectrumMode = !spectrumMode;
      renderDock();
    });
  }
}

function refreshVisuals() {
  viz.renderSession(session);
  term.setPath(session.cwd);
  renderDock();

  if (mode === "level" && levelId) {
    const rawLevel = getLevel(levelId);
    if (rawLevel) {
      const result = evaluateGoal(rawLevel.goal, session, {
        output: lastRun.output,
        usedCmdlets: [...session.usedCmdlets],
        pipeline: lastRun.pipeline,
        commandCount: session.commandCount,
      });

      term.setHint(result.solved ? null : rawLevel.hint);

      if (
        result.solved &&
        session.commandCount > levelCommandStart &&
        !celebrateOffered
      ) {
        onLevelSolved(rawLevel, result);
      }
    }
  } else {
    term.setHint(null);
  }
}

/**
 * Trigger celebration modal with full confetti burst and fanfare.
 * @param {import('./levels.js').Level} rawLevel
 * @param {{ checks: any[] }} result
 */
function onLevelSolved(rawLevel, result) {
  celebrateOffered = true;
  const level = localizeLevel(rawLevel);
  const used = session.commandCount - levelCommandStart;
  const prev = progressMap[level.id];
  progressMap[level.id] = {
    solved: true,
    bestCommands: prev?.bestCommands ? Math.min(prev.bestCommands, used) : used,
  };
  saveProgress(progressMap);
  updateChrome();

  const c = curriculum();
  const next = levelId ? nextLevelId(levelId) : null;
  const nextLevel = next ? localizeLevel(getLevel(next)) : null;
  const total = LEVELS.length;
  const solvedCount = c.solvedCount;
  const underPar = used <= level.par;
  const golfLine = underPar
    ? `**${used}** command${used === 1 ? "" : "s"} · on par (${level.par})`
    : `**${used}** command${used === 1 ? "" : "s"}. Ideal is ${level.par}. Still counts.`;

  const cheers = ui().cheers;
  const cheer = cheers[Math.floor(Math.random() * cheers.length)] || "Clean solve.";

  const learnedPreview = c.learned
    .map((l) => `<li>${escapeHtml(localizeSeriesTitle(l.seriesTitle))}: ${escapeHtml(l.name)}</li>`)
    .join("");

  const share = buildShareTargets({
    levelName: level.name,
    levelId: level.id,
    commands: used,
    par: level.par,
    curriculum: c,
  });

  const bodyHtml = `
    <div class="celebrate" aria-live="polite">
      <div class="celebrate-visual" aria-hidden="true">
        <div class="celebrate-ring"></div>
        <div class="celebrate-star">★</div>
      </div>
      <div class="celebrate-badge">${escapeHtml(ui().levelCleared)}</div>
      <h3 class="celebrate-title">${escapeHtml(level.name)}</h3>
      <p class="celebrate-sub">${escapeHtml(level.seriesTitle)} · <code dir="ltr">${escapeHtml(level.id)}</code></p>
      <p class="celebrate-cheer">${escapeHtml(cheer)}</p>
      <div class="celebrate-stats">${renderMarkdown(golfLine)}</div>
      <div class="celebrate-progress">
        <div class="prog-track"><div class="prog-fill" style="width:${c.percent}%"></div></div>
        <div class="par-note">${solvedCount} / ${total} levels solved · progress saved in this browser</div>
      </div>
      <div class="share-block">
        <div class="next-title">${escapeHtml(ui().shareTitle)}</div>
        <div class="learned-preview">
          <div class="par-note">${escapeHtml(ui().styleList)}</div>
          <ul>${learnedPreview || `<li>${escapeHtml(ui().solveMoreLevels)}</li>`}</ul>
        </div>
        <div class="share-row" role="group" aria-label="${escapeHtml(ui().shareGroupLabel)}">
          <button type="button" class="share-btn linkedin" data-share="linkedin">${escapeHtml(ui().linkedin)}</button>
          <button type="button" class="share-btn x" data-share="x">${escapeHtml(ui().xTwitter)}</button>
          <button type="button" class="share-btn facebook" data-share="facebook">${escapeHtml(ui().facebook)}</button>
          <button type="button" class="share-btn copy" data-share="copy">${escapeHtml(ui().copyPost)}</button>
        </div>
        <div class="share-status" data-share-status hidden></div>
      </div>
      ${
        nextLevel
          ? `<div class="celebrate-next">Next: <code dir="ltr">${escapeHtml(nextLevel.id)}</code> — ${escapeHtml(nextLevel.name)}</div>`
          : `<div class="celebrate-next">Curriculum complete. Stay in sandbox and keep experimenting.</div>`
      }
    </div>
  `;

  const actions = [
    {
      label: ui().baskInIt,
      className: "ghost",
      onClick: () => {
        celebrateOffered = false;
        term.focus();
      },
    },
  ];

  if (nextLevel) {
    actions.push({
      label: ui().celebrateOn(nextLevel.id),
      className: "primary",
      onClick: () => {
        celebrateOffered = false;
        startLevel(nextLevel.id);
      },
    });
  } else {
    actions.push({
      label: ui().browseLevels,
      className: "primary",
      onClick: () => {
        celebrateOffered = false;
        showLevels();
      },
    });
  }

  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  const confetti = launchConfetti(4800);
  playFanfare();

  const modal = showModal({
    title: ui().levelComplete,
    bodyHtml,
    variant: "celebrate",
    actions: actions.map((a) => ({
      ...a,
      onClick: () => {
        confetti?.stop();
        modal.close();
        a.onClick();
      },
    })),
    onClose: () => {
      confetti?.stop();
      celebrateOffered = false;
      term.focus();
    },
  });

  modal.el.querySelectorAll("[data-share]").forEach((btn) => {
    btn.addEventListener("click", async (ev) => {
      ev.preventDefault();
      const kind = btn.getAttribute("data-share") || "copy";
      const status = modal.el.querySelector("[data-share-status]");
      const result = await shareWithClipboard(kind, share);
      if (!status) return;
      status.hidden = false;
      status.textContent =
        kind === "copy"
          ? result.copied
            ? ui().copied
            : ui().copyFailed
          : "Share window opened.";
    });
  });
}

function showLevels() {
  const seriesHtml = SERIES.map((s) => {
    const levels = levelsInSeries(s.id);
    const seriesTitleStr = localizeSeriesTitle(s.id) || s.name;
    const items = levels
      .map((l) => {
        const locL = localizeLevel(l);
        const done = Boolean(progressMap[l.id]?.solved);
        const best = progressMap[l.id]?.bestCommands;
        return `
          <li>
            <button type="button" class="level-row ${done ? "is-done" : ""}" data-level="${l.id}">
              <span class="level-name">${escapeHtml(locL.name)}</span>
              <span class="level-meta">par ${l.par}${done ? ` · ${ui().solvedLabel}${best ? ` (${best})` : ""}` : ""}</span>
            </button>
          </li>`;
      })
      .join("");
    return `
      <section class="series-block">
        <header>
          <h3>${escapeHtml(seriesTitleStr)}</h3>
          <p>${escapeHtml(s.description)}</p>
        </header>
        <ol class="level-list">${items}</ol>
      </section>`;
  }).join("");

  const modal = showModal({
    title: ui().levelsTitle,
    bodyHtml: `<p>${escapeHtml(ui().pickChallenge)}</p>${seriesHtml}`,
    actions: [{ label: ui().close, className: "ghost", onClick: () => term.focus() }],
    onClose: () => term.focus(),
  });

  modal.el.querySelectorAll("[data-level]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-level");
      if (id) {
        modal.close();
        startLevel(id);
      }
    });
  });
}

function showSolution() {
  if (mode !== "level" || !levelId) {
    term.print("Start a level first (Levels).", "meta");
    return;
  }
  const level = getLevel(levelId);
  if (!level) return;
  const cmds = [level.hint];
  const modal = showModal({
    title: ui().solutionTitle(level.id),
    bodyHtml: renderMarkdown(
      [
        ui().solutionCommands,
        "",
        "```powershell",
        cmds.join("\n"),
        "```",
        "",
        ui().solutionWarn,
      ].join("\n")
    ),
    actions: [
      { label: ui().cancel, className: "ghost", onClick: () => modal.close() },
      {
        label: ui().runSolution,
        className: "primary",
        onClick: () => {
          modal.close();
          resetLevel();
          for (const c of cmds) {
            handleCommand(c);
          }
          term.focus();
        },
      },
    ],
    onClose: () => term.focus(),
  });
}

function replayLesson() {
  if (mode === "level" && levelId) {
    const rawLevel = getLevel(levelId);
    if (!rawLevel) return;
    const level = localizeLevel(rawLevel);
    const lines = [];
    if (level.brief) lines.push(`**Objective:** ${level.brief}`);
    if (level.learning?.length) {
      lines.push("", `### ${ui().youAreLearning}`, ...level.learning.map((l) => `- ${l}`));
    }
    if (level.fieldNotes?.length) {
      lines.push("", `### ${ui().fieldNotesTitle}`, ...level.fieldNotes.map((f) => `- ${f}`));
    }
    showModal({
      title: `${ui().lesson}: ${level.name}`,
      bodyHtml: renderMarkdown(lines.join("\n")),
      actions: [{ label: ui().close, className: "primary", onClick: () => term.focus() }],
      onClose: () => term.focus(),
    });
  } else {
    showModal({
      title: ui().aboutTitle,
      bodyHtml: renderMarkdown(
        [
          ui().welcomeIntro,
          "",
          "- Pipeline passes objects, not text lines",
          "- 19 series covering core to advanced concepts",
          "- Double validation: in-browser simulator and real pwsh",
        ].join("\n")
      ),
      actions: [{ label: ui().close, className: "primary", onClick: () => term.focus() }],
      onClose: () => term.focus(),
    });
  }
}

function openUiHelp() {
  showModal({
    title: ui().uiGuideTitle,
    bodyHtml: renderMarkdown(
      [
        "### Top Toolbar",
        "- **Levels**: Browse all 19 series and 160 levels.",
        "- **Lesson**: View concepts and field notes for the current challenge.",
        "- **Guide**: Highlights the always-on Learning Guide panel on the right.",
        "- **Hint / Solution**: Get guidance or inspect and run the official solution.",
        "- **Undo / Reset**: Step back or restore session state without penalty.",
        "",
        "### Pipeline & Session (Left / Center)",
        "- **Pipeline Visualizer**: Watches objects flow through cmdlet stages.",
        "- **Session Panel**: Live `cwd`, `$variables`, and filesystem inspector.",
        "",
        "### Terminal (Bottom)",
        "- Realistic shell habits: word-by-word Tab completion, command history (↑/↓), and auto-focus.",
        "",
        "### Learning Guide (Right)",
        "- Always-on companion with what you are learning, field notes, and goal checklist.",
      ].join("\n")
    ),
    actions: [{ label: ui().close, className: "primary", onClick: () => term.focus() }],
    onClose: () => term.focus(),
  });
}

function startLevel(id) {
  const level = getLevel(id);
  if (!level) return;
  mode = "level";
  levelId = id;
  celebrateOffered = false;
  session = new Session();
  lastRun = emptyRun();
  levelCommandStart = 0;
  updateChrome();
  viz.renderPipeline(null);

  const locL = localizeLevel(level);
  term.print(`— Level: ${locL.name} —`, "meta");
  term.print(locL.brief, "meta");
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

function resetLevel() {
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
    focusGuide();
  }
  if (result.output.includes("steps") && result.output.length === 1) {
    focusGuide();
  }
  if (result.output.includes("curriculum") && result.output.length === 1) {
    showLevels();
  }

  for (const lineOut of result.output) {
    if (
      lineOut === "clear-screen" ||
      lineOut === "Opening level browser…" ||
      lineOut === "hint" ||
      lineOut === "goal" ||
      lineOut === "steps" ||
      lineOut === "curriculum"
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
  if (!document.querySelector(".overlay")) {
    term.focus();
  }
}

// Nav drawer & Language Menu
function toggleLang() {
  if (!langDropdownEl) return;
  const isHidden = langDropdownEl.hidden;
  langDropdownEl.hidden = !isHidden;
  document.querySelector("[data-action=lang-toggle]")?.setAttribute("aria-expanded", String(isHidden));
}

function closeLang() {
  if (!langDropdownEl) return;
  langDropdownEl.hidden = true;
  document.querySelector("[data-action=lang-toggle]")?.setAttribute("aria-expanded", "false");
}

function toggleNav() {
  if (!navDrawerEl) return;
  const open = navDrawerEl.classList.toggle("is-open");
  navDrawerEl.hidden = !open;
  document.querySelector("[data-action=nav-toggle]")?.setAttribute("aria-expanded", String(open));
}

function closeNav() {
  if (!navDrawerEl) return;
  navDrawerEl.classList.remove("is-open");
  navDrawerEl.hidden = true;
  document.querySelector("[data-action=nav-toggle]")?.setAttribute("aria-expanded", "false");
}

function remountAfterLocale() {
  updateChrome();
  refreshVisuals();
}

// Event Listeners for Toolbar Actions
document.querySelectorAll("[data-action]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.getAttribute("data-action");
    if (action === "lang-toggle") {
      toggleLang();
      return;
    }
    if (action === "nav-toggle") {
      toggleNav();
      return;
    }
    closeLang();
    closeNav();

    if (action === "levels") showLevels();
    if (action === "lesson") replayLesson();
    if (action === "guide") focusGuide();
    if (action === "hint") {
      if (mode === "level" && levelId) term.print(getLevel(levelId)?.hint || "", "meta");
      else term.print("No active level.", "meta");
      term.focus();
    }
    if (action === "solution") showSolution();
    if (action === "undo") {
      session.undo();
      lastRun = emptyRun();
      viz.renderPipeline(null);
      refreshVisuals();
      term.focus();
    }
    if (action === "reset") resetLevel();
    if (action === "sandbox") startSandbox();
    if (action === "help") openUiHelp();
  });
});

document.querySelectorAll("[data-lang]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const loc = btn.getAttribute("data-lang");
    if (!loc || loc === getLocale()) {
      closeLang();
      return;
    }
    setLocale(loc);
    closeLang();
    remountAfterLocale();
  });
});

// Close menus when clicking outside
document.addEventListener("click", (e) => {
  const target = /** @type {HTMLElement} */ (e.target);
  if (!target.closest(".lang-menu")) closeLang();
  if (!target.closest(".nav-toggle") && !target.closest(".nav-drawer")) closeNav();
});

// Visitor Counter
getVisitorCount().then((count) => {
  if (count !== null) {
    const statEl = document.getElementById("visitor-stat");
    const countEl = document.getElementById("visitor-count");
    if (statEl && countEl) {
      countEl.textContent = String(count);
      statEl.hidden = false;
    }
  }
});

// URL permalinks & initial modal
const params = new URLSearchParams(location.search);
const bootCommands = params.get("command");
const startLevelParam = params.get("level");

if (params.get("NODEMO") == null && !bootCommands && !startLevelParam) {
  showModal({
    title: "Welcome to Learn PowerShell",
    titleHtml: 'Welcome to Learn <span class="brand-ps">PowerShell</span>',
    bodyHtml: `
      <p class="modal-lead">An interactive PowerShell pipeline lab and object sandbox.</p>
      <p>Objects flow through cmdlets. Levels teach the language so you leave with a mental model — not just typed lines.</p>
    `,
    actions: [
      { label: "Start levels", className: "primary", onClick: () => showLevels() },
      { label: "Sandbox", className: "ghost", onClick: () => startSandbox() },
    ],
    onClose: () => term.focus(),
  });
}

if (startLevelParam) {
  startLevel(startLevelParam);
} else if (bootCommands) {
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
    term.print("Welcome to Learn PowerShell. Type help or levels to begin.", "meta");
  }
  term.focus();
}
