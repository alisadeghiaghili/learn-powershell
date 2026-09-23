/**
 * Terminal UI: scrollback, prompt input, history navigation.
 */

/**
 * @param {HTMLElement} root
 * @param {{ onCommand: (line: string) => void }} handlers
 */
export function createTerminal(root, handlers) {
  root.innerHTML = `
    <div class="term-scroll" data-scroll tabindex="0" role="log" aria-label="Terminal output"></div>
    <form class="term-form" data-form autocomplete="off">
      <label class="term-prompt" for="term-input">
        <span class="ps-prompt">PS</span>
        <span class="ps-path" data-prompt-path>C:\\lab</span>
        <span class="ps-caret">&gt;</span>
      </label>
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
    </form>
  `;

  const scroll = /** @type {HTMLElement} */ (root.querySelector("[data-scroll]"));
  const form = /** @type {HTMLFormElement} */ (root.querySelector("[data-form]"));
  const input = /** @type {HTMLInputElement} */ (root.querySelector("[data-input]"));
  const promptPath = /** @type {HTMLElement} */ (root.querySelector("[data-prompt-path]"));

  /** @type {string[]} */
  const history = [];
  let historyIndex = -1;
  let draft = "";

  /**
   * @param {string} text
   * @param {string} [kind]
   */
  function print(text, kind = "out") {
    const lines = String(text).split("\n");
    for (const line of lines) {
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

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const line = input.value;
    input.value = "";
    historyIndex = -1;
    draft = "";
    if (!line.trim()) return;
    history.push(line);
    echoPrompt(line);
    handlers.onCommand(line);
    input.focus();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      if (historyIndex === -1) {
        draft = input.value;
        historyIndex = history.length - 1;
      } else if (historyIndex > 0) {
        historyIndex -= 1;
      }
      input.value = history[historyIndex];
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex < history.length - 1) {
        historyIndex += 1;
        input.value = history[historyIndex];
      } else {
        historyIndex = -1;
        input.value = draft;
      }
    }
  });

  root.addEventListener("click", (e) => {
    if (window.getSelection()?.toString()) return;
    if (/** @type {HTMLElement} */ (e.target).closest("input")) return;
    input.focus();
  });

  return {
    print,
    echoPrompt,
    clear,
    setPath,
    focus: () => input.focus(),
  };
}

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
