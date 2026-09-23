/**
 * Pipeline and session visualizers.
 *
 * Renders object flow through cmdlet stages and the live session panel
 * (cwd, variables, files).
 */

/**
 * @param {HTMLElement} root
 */
export function createVisualizer(root) {
  root.innerHTML = `
    <div class="viz-grid">
      <section class="viz-panel viz-pipeline" aria-label="Pipeline visualizer">
        <header class="viz-header">
          <h2>Pipeline</h2>
          <p class="viz-meta" data-pipeline-meta>Run a command to see objects flow.</p>
        </header>
        <div class="pipeline-track" data-pipeline-track>
          <div class="pipeline-empty">Objects will stream through cmdlet stages here.</div>
        </div>
      </section>
      <section class="viz-panel viz-session" aria-label="Session state">
        <header class="viz-header">
          <h2>Session</h2>
          <p class="viz-meta" data-session-path></p>
        </header>
        <div class="session-body">
          <div class="session-block">
            <h3>Location</h3>
            <code data-cwd></code>
          </div>
          <div class="session-block">
            <h3>Variables</h3>
            <ul class="var-list" data-vars></ul>
          </div>
          <div class="session-block">
            <h3>Here</h3>
            <ul class="file-list" data-files></ul>
          </div>
        </div>
      </section>
    </div>
  `;

  const track = /** @type {HTMLElement} */ (root.querySelector("[data-pipeline-track]"));
  const meta = /** @type {HTMLElement} */ (root.querySelector("[data-pipeline-meta]"));
  const cwdEl = /** @type {HTMLElement} */ (root.querySelector("[data-cwd]"));
  const pathEl = /** @type {HTMLElement} */ (root.querySelector("[data-session-path]"));
  const varsEl = /** @type {HTMLElement} */ (root.querySelector("[data-vars]"));
  const filesEl = /** @type {HTMLElement} */ (root.querySelector("[data-files]"));

  /**
   * @param {import('./engine.js').Session} session
   */
  function renderSession(session) {
    cwdEl.textContent = session.cwd;
    pathEl.textContent = session.variables["env:USERNAME"]
      ? `${session.variables["env:USERNAME"]}@${session.variables["env:COMPUTERNAME"]}`
      : "session";

    varsEl.innerHTML = "";
    for (const [name, value] of Object.entries(session.variables)) {
      if (name.startsWith("env:")) continue;
      const li = document.createElement("li");
      const pretty =
        typeof value === "object" && value !== null
          ? Array.isArray(value)
            ? `object[${value.length}]`
            : "object"
          : String(value);
      li.innerHTML = `<span class="var-name">$${escapeHtml(name)}</span><span class="var-val">${escapeHtml(pretty)}</span>`;
      varsEl.appendChild(li);
    }

    filesEl.innerHTML = "";
    const node = listCwd(session);
    if (!node.length) {
      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = "(empty)";
      filesEl.appendChild(li);
    }
    for (const item of node) {
      const li = document.createElement("li");
      li.className = item.isDir ? "is-dir" : "is-file";
      li.innerHTML = `<span class="file-icon">${item.isDir ? "dir" : "file"}</span><span class="file-name">${escapeHtml(item.name)}</span>`;
      filesEl.appendChild(li);
    }
  }

  /**
   * @param {object | null} pipeline
   * @param {{ reduceMotion?: boolean }} [opts]
   */
  function renderPipeline(pipeline, opts = {}) {
    if (!pipeline || !pipeline.stages?.length) {
      meta.textContent = "Run a command to see objects flow.";
      track.innerHTML =
        '<div class="pipeline-empty">Objects will stream through cmdlet stages here.</div>';
      return;
    }

    const stages = pipeline.stages;
    meta.textContent = `${pipeline.count} object${pipeline.count === 1 ? "" : "s"} · ${stages.length} stage${stages.length === 1 ? "" : "s"}`;

    track.innerHTML = "";
    const row = document.createElement("div");
    row.className = "pipeline-row";

    stages.forEach((stage, index) => {
      if (index > 0) {
        const arrow = document.createElement("div");
        arrow.className = "pipe-connector";
        arrow.innerHTML = `<span class="pipe-line"></span><span class="pipe-chev">›</span>`;
        row.appendChild(arrow);
      }

      const node = document.createElement("div");
      node.className = "pipe-stage";
      node.innerHTML = `
        <div class="pipe-cmdlet">${escapeHtml(stage.name)}</div>
        <div class="pipe-count">${stage.inputCount} → ${stage.outputCount}</div>
        <div class="pipe-objects"></div>
      `;
      const box = /** @type {HTMLElement} */ (node.querySelector(".pipe-objects"));
      const samples = stage.sample || [];
      samples.forEach((sample, si) => {
        const card = document.createElement("div");
        card.className = "obj-card";
        card.style.setProperty("--i", String(si));
        card.innerHTML = `
          <div class="obj-type">${escapeHtml(shortType(sample.type))}</div>
          <div class="obj-title">${escapeHtml(sample.title)}</div>
          <div class="obj-fields">${Object.entries(sample.fields)
            .slice(0, 2)
            .map(
              ([k, v]) =>
                `<div><span>${escapeHtml(k)}</span><em>${escapeHtml(v)}</em></div>`
            )
            .join("")}</div>
        `;
        box.appendChild(card);
      });
      if (!samples.length) {
        const empty = document.createElement("div");
        empty.className = "obj-empty";
        empty.textContent = stage.error ? "error" : "∅";
        box.appendChild(empty);
      }
      row.appendChild(node);
    });

    track.appendChild(row);

    if (!opts.reduceMotion) {
      row.classList.add("is-flowing");
      window.setTimeout(() => row.classList.remove("is-flowing"), 700);
    }
  }

  return { renderSession, renderPipeline };
}

/**
 * @param {import('./engine.js').Session} session
 * @returns {{ name: string, isDir: boolean }[]}
 */
function listCwd(session) {
  const parts = session.cwd.split("\\").filter(Boolean);
  let node = session.fs;
  for (let i = 1; i < parts.length; i += 1) {
    if (!node.children) return [];
    const child = Object.values(node.children).find(
      (c) => String(c.name).toLowerCase() === parts[i].toLowerCase()
    );
    if (!child) return [];
    node = child;
  }
  return Object.values(node.children || {})
    .map((c) => ({
      name: String(c.name),
      isDir: c.type === "dir",
    }))
    .sort((a, b) => Number(b.isDir) - Number(a.isDir) || a.name.localeCompare(b.name));
}

/**
 * @param {string} typeName
 * @returns {string}
 */
function shortType(typeName) {
  const last = typeName.split(".").pop() || typeName;
  return last.replace(/^Selected\./, "sel·");
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

/**
 * Render the goal checklist into a container.
 * @param {HTMLElement} container
 * @param {{ checks: { id: string, label: string, passed: boolean, detail: string }[], solved: boolean }} result
 * @param {{ reduceMotion?: boolean }} [opts]
 */
export function renderGoals(container, result, opts = {}) {
  container.innerHTML = "";
  const list = document.createElement("ul");
  list.className = "goal-list";

  result.checks.forEach((check, i) => {
    const li = document.createElement("li");
    li.className = check.passed ? "is-pass" : "is-pending";
    if (!opts.reduceMotion) li.style.setProperty("--i", String(i));
    li.innerHTML = `
      <span class="goal-mark" aria-hidden="true">${check.passed ? "✓" : "○"}</span>
      <span class="goal-label">${escapeHtml(check.label)}</span>
      <span class="goal-detail">${escapeHtml(check.detail)}</span>
    `;
    list.appendChild(li);
  });

  container.appendChild(list);
}
