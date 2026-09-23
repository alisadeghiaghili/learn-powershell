/**
 * Terminal UI with real-shell habits:
 * - ghost text shows only the current word suffix (never stacks on empty input)
 * - Tab completes word by word and cycles candidates
 * - ArrowUp / ArrowDown walk command history
 * - input keeps focus after every submit
 */

/** @typedef {"cmd" | "out" | "err" | "meta" | "ok"} LogKind */

const BASE_COMMANDS = [
  "Get-Location",
  "Set-Location",
  "Get-ChildItem",
  "Get-Content",
  "Get-Process",
  "Get-Service",
  "Get-Variable",
  "Set-Variable",
  "Get-Command",
  "Write-Output",
  "Select-Object",
  "Where-Object",
  "ForEach-Object",
  "Measure-Object",
  "Sort-Object",
  "Format-Table",
  "Format-List",
  "Out-String",
  "Select-String",
  "New-Item",
  "Set-Content",
  "Add-Content",
  "Remove-Item",
  "Test-Path",
  "Get-Date",
  "Get-Help",
  "gci",
  "cd",
  "pwd",
  "gc",
  "gps",
  "select",
  "where",
  "sort",
  "measure",
  "ft",
  "fl",
  "levels",
  "hint",
  "goal",
  "steps",
  "show goal",
  "undo",
  "reset",
  "sandbox",
  "clear",
  "help",
  "curriculum",
  "build level",
  "import level",
];

/**
 * @param {string} s
 * @returns {string}
 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param {string} value
 * @returns {{ head: string[], current: string, afterSpace: boolean }}
 */
function parseLine(value) {
  const endsWithSpace = /\s$/.test(value);
  const trimmed = value.replace(/\s+$/, "");
  if (!trimmed) return { head: [], current: "", afterSpace: endsWithSpace };
  const parts = trimmed.split(/\s+/);
  if (endsWithSpace) {
    return { head: parts, current: "", afterSpace: true };
  }
  return {
    head: parts.slice(0, -1),
    current: parts[parts.length - 1] || "",
    afterSpace: false,
  };
}

/**
 * @param {HTMLElement} root
 * @param {{ onCommand: (line: string) => void }} handlers
 */
export function createTerminal(root, handlers) {
  root.innerHTML = `
    <div class="term-scroll" data-scroll tabindex="0" role="log" aria-live="polite" aria-label="Terminal output"></div>
    <div class="term-hint" data-hint hidden></div>
    <form class="term-form" data-form autocomplete="off">
      <label class="term-prompt" for="term-input">
        <span class="ps-prompt">PS</span>
        <span class="ps-path" data-prompt-path>C:\\lab</span>
        <span class="ps-caret">&gt;</span>
      </label>
      <div class="term-input-wrap" data-input-wrap>
        <div class="term-ghost" data-ghost aria-hidden="true"></div>
        <input
          id="term-input"
          data-input
          class="term-input"
          type="text"
          spellcheck="false"
          autocapitalize="off"
          autocomplete="off"
          aria-label="PowerShell command"
        />
      </div>
    </form>
  `;

  const scroll = /** @type {HTMLElement} */ (root.querySelector("[data-scroll]"));
  const form = /** @type {HTMLFormElement} */ (root.querySelector("[data-form]"));
  const input = /** @type {HTMLInputElement} */ (root.querySelector("[data-input]"));
  const promptPath = /** @type {HTMLElement} */ (root.querySelector("[data-prompt-path]"));
  const ghost = /** @type {HTMLElement} */ (root.querySelector("[data-ghost]"));
  const wrap = /** @type {HTMLElement} */ (root.querySelector("[data-input-wrap]"));
  const hintEl = /** @type {HTMLElement} */ (root.querySelector("[data-hint]"));

  /** @type {string[]} */
  const history = [];
  let historyIdx = history.length;
  let draft = "";
  let hint = "";
  /** @type {string[]} */
  let extraCompletions = [];
  /** @type {string[]} */
  let wordCycle = [];
  let wordIdx = 0;
  let wordKey = "";
  /** @type {CanvasRenderingContext2D | null} */
  let measureCtx = null;

  /**
   * @param {string} text
   * @param {string} [kind]
   */
  function print(text, kind = "out") {
    for (const line of String(text).split("\n")) {
      const el = document.createElement("div");
      el.className = `term-line is-${kind}`;
      el.textContent = line || " ";
      scroll.appendChild(el);
    }
    scroll.scrollTop = scroll.scrollHeight;
  }

  /**
   * @param {string} line
   */
  function echoPrompt(line) {
    const el = document.createElement("div");
    el.className = "term-line is-cmd";
    el.innerHTML = `<span class="ps-prompt">PS</span> <span class="ps-path">${escapeHtml(promptPath.textContent || "")}</span> <span class="ps-caret">&gt;</span> ${escapeHtml(line)}`;
    scroll.appendChild(el);
    scroll.scrollTop = scroll.scrollHeight;
  }

  function clear() {
    scroll.innerHTML = "";
  }

  /**
   * @param {string} path
   */
  function setPath(path) {
    promptPath.textContent = path;
  }

  /**
   * @param {string | null} command
   */
  function setHint(command) {
    hint = command || "";
    input.placeholder = hint
      ? `Try: ${hint}`
      : "Type a command — help · levels · hint · steps";
    hintEl.hidden = !hint;
    if (hint) {
      hintEl.innerHTML = `Next: <code>${escapeHtml(hint)}</code> <span class="par-note">· Tab fills word by word</span>`;
    } else {
      hintEl.textContent = "";
    }
    syncGhost();
  }

  /**
   * @param {string[]} commands
   */
  function setExtraCompletions(commands) {
    extraCompletions = commands.filter(Boolean);
  }

  function allCompletions() {
    return [
      ...new Set([
        ...extraCompletions,
        ...BASE_COMMANDS,
        ...history.slice().reverse(),
      ]),
    ];
  }

  /**
   * @param {string[]} head
   * @param {string} current
   */
  function matchingCommands(head, current) {
    const cur = current.toLowerCase();
    return allCompletions().filter((cmd) => {
      const words = cmd.split(/\s+/);
      if (words.length <= head.length) {
        if (head.length && words.length === head.length) {
          return words.every((w, i) => w === head[i]);
        }
        return false;
      }
      for (let i = 0; i < head.length; i += 1) {
        if (words[i] !== head[i]) return false;
      }
      if (!cur) return true;
      return (words[head.length] || "").toLowerCase().startsWith(cur);
    });
  }

  /**
   * @param {string[]} head
   * @param {string} current
   */
  function nextWords(head, current) {
    const matches = matchingCommands(head, current);
    /** @type {string[]} */
    const words = [];
    const push = (w) => {
      if (w && !words.includes(w)) words.push(w);
    };
    if (hint) {
      const hw = hint.split(/\s+/);
      const okHead = head.every((h, i) => hw[i] === h);
      if (okHead) push(hw[head.length]);
    }
    for (const cmd of matches) {
      push(cmd.split(/\s+/)[head.length]);
    }
    return words.filter(
      (w) => !current || w.toLowerCase().startsWith(current.toLowerCase())
    );
  }

  /**
   * @param {string} text
   */
  function measureText(text) {
    if (!measureCtx) {
      measureCtx = document.createElement("canvas").getContext("2d");
    }
    const ctx = measureCtx;
    if (!ctx) return text.length * 7.2;
    const font = getComputedStyle(input).font;
    ctx.font = font || "13px Consolas, monospace";
    return ctx.measureText(text).width;
  }

  /**
   * Ghost shows only the rest of the current word (or next word after space).
   * Empty input uses placeholder alone so two texts never stack.
   */
  function syncGhost() {
    const value = input.value;
    ghost.dataset.visible = "0";
    ghost.textContent = "";
    wrap.classList.remove("has-ghost");

    if (!value) return;

    const { head, current, afterSpace } = parseLine(value);
    const words = nextWords(head, afterSpace ? "" : current);
    const first = words[0];
    if (!first) return;

    if (afterSpace) {
      ghost.textContent = first;
      ghost.style.left = `${measureText(value)}px`;
      ghost.dataset.visible = "1";
      wrap.classList.add("has-ghost");
      return;
    }

    if (
      !first.toLowerCase().startsWith(current.toLowerCase()) ||
      first.length <= current.length
    ) {
      return;
    }

    ghost.textContent = first.slice(current.length);
    ghost.style.left = `${measureText(value)}px`;
    ghost.dataset.visible = "1";
    wrap.classList.add("has-ghost");
  }

  /**
   * Complete the current word only; cycle on repeated Tab.
   * @param {KeyboardEvent} e
   */
  function applyTab(e) {
    e.preventDefault();
    const value = input.value;
    const { head, current, afterSpace } = parseLine(value);
    const cycleKey = `${head.join(" ")}|${afterSpace ? "" : current}`;

    if (!value && hint) {
      const firstWord = hint.split(/\s+/)[0] || "";
      input.value = firstWord;
      wordCycle = [firstWord];
      wordIdx = 0;
      wordKey = firstWord;
      focus();
      syncGhost();
      return;
    }

    const options = nextWords(head, afterSpace ? "" : current);
    if (!options.length) {
      syncGhost();
      return;
    }

    if (cycleKey !== wordKey || !wordCycle.length) {
      wordKey = cycleKey;
      wordCycle = options;
      wordIdx = 0;
    } else {
      wordIdx = (wordIdx + 1) % wordCycle.length;
    }

    const chosen = wordCycle[wordIdx] || options[0];
    const headText = head.length ? `${head.join(" ")} ` : "";
    input.value = `${headText}${chosen}`;
    focus();
    syncGhost();

    if (wordCycle.length > 1) {
      const preview = wordCycle.slice(0, 6).join(" · ");
      hintEl.hidden = false;
      hintEl.innerHTML = `Tab word <strong>${wordIdx + 1}/${wordCycle.length}</strong>: <code>${escapeHtml(preview)}</code>${
        wordCycle.length > 6 ? " …" : ""
      }`;
    } else if (hint) {
      hintEl.innerHTML = `Next: <code>${escapeHtml(hint)}</code> <span class="par-note">· Tab fills word by word</span>`;
    }
  }

  function focus() {
    if (document.querySelector(".modal-backdrop.is-open")) return;
    input.focus();
    const len = input.value.length;
    try {
      input.setSelectionRange(len, len);
    } catch {
      // ignore
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  function onKey(e) {
    if (e.key === "Tab") {
      applyTab(e);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      input.value = "";
      wordCycle = [];
      wordKey = "";
      syncGhost();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (document.querySelector(".modal-backdrop.is-open")) return;
      const value = input.value;
      input.value = "";
      const trimmed = value.trim();
      if (trimmed) {
        history.push(trimmed);
        historyIdx = history.length;
      }
      wordCycle = [];
      wordKey = "";
      echoPrompt(trimmed || "");
      handlers.onCommand(value);
      focus();
      syncGhost();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      if (historyIdx === history.length) draft = input.value;
      historyIdx = Math.max(0, historyIdx - 1);
      input.value = history[historyIdx] || "";
      wordCycle = [];
      focus();
      syncGhost();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!history.length) return;
      historyIdx = Math.min(history.length, historyIdx + 1);
      input.value =
        historyIdx >= history.length ? draft : history[historyIdx] || "";
      wordCycle = [];
      focus();
      syncGhost();
    }
  }

  input.addEventListener("keydown", onKey);
  input.addEventListener("input", () => {
    wordCycle = [];
    wordKey = "";
    syncGhost();
  });
  form.addEventListener("submit", (e) => e.preventDefault());
  root.addEventListener("mousedown", (e) => {
    if (window.getSelection()?.toString()) return;
    if (/** @type {HTMLElement} */ (e.target).closest("input, button, a")) return;
    // Keep focus in the command box — never lose the caret.
    e.preventDefault();
    focus();
  });

  return {
    print,
    echoPrompt,
    clear,
    setPath,
    setHint,
    setExtraCompletions,
    focus,
  };
}
