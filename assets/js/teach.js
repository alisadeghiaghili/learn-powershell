/**
 * Short "why this command matters" blocks after simulator output.
 * Goal: leave with mental models, not only muscle memory.
 */

/** @type {Record<string, { title: string, lines: string[] }>} */
const TEACH = {
  "write-output": {
    title: "Write-Output emits objects",
    lines: [
      "PowerShell does not print text for its own sake — it writes objects to the success stream.",
      "A bare string becomes a System.String object. Downstream cmdlets can still bind to it.",
    ],
  },
  "get-location": {
    title: "Location is a PathInfo object",
    lines: [
      "Get-Location returns a PathInfo — drive, provider, and path — not just a string.",
      "That object still flows through the pipeline if you pipe it somewhere.",
    ],
  },
  "set-location": {
    title: "cd changes session state",
    lines: [
      "Set-Location mutates the session's current provider location.",
      "Relative paths (., .., docs\\notes.txt) resolve against that location.",
    ],
  },
  "get-childitem": {
    title: "Providers expose a filesystem of objects",
    lines: [
      "Get-ChildItem returns FileInfo / DirectoryInfo objects with Length, Mode, LastWriteTime…",
      "-Filter is provider-side and cheap; Where-Object filters whatever already entered the pipe.",
    ],
  },
  "get-content": {
    title: "Reading files yields strings — still objects",
    lines: [
      "Each line becomes a System.String in the pipeline.",
      "From here, Select-String / Where-Object can filter without re-reading the disk.",
    ],
  },
  "get-process": {
    title: "Processes are rich .NET objects",
    lines: [
      "Name, Id, CPU, WS are note properties you can select, sort, and measure.",
      "Stop thinking 'text columns' — think object graphs with typed properties.",
    ],
  },
  "get-service": {
    title: "ServiceController objects",
    lines: [
      "Status is a real enum-like value, so -eq Running works without parsing columns.",
    ],
  },
  "select-object": {
    title: "Select-Object reshapes the stream",
    lines: [
      "Projection drops properties you do not need — later stages see a leaner object.",
      "-First / -Last take a slice of the stream, not of the text table.",
    ],
  },
  "where-object": {
    title: "Filter with predicates on properties",
    lines: [
      "Where-Object compares a property: CPU -gt 50 means every object's CPU field.",
      "Prefer filtering early in the pipe so later stages do less work.",
    ],
  },
  "foreach-object": {
    title: "Per-object transform",
    lines: [
      "$_ is the current object. Property access is $_.Name.",
      "Arithmetic on $_.CPU produces new values — the pipeline carries the results.",
    ],
  },
  "sort-object": {
    title: "Sort is stable on the object stream",
    lines: [
      "-Descending flips numeric and string order. Sort by a property, not by a column offset.",
    ],
  },
  "measure-object": {
    title: "Measure-Object aggregates",
    lines: [
      "Count is always there. -Property CPU adds Sum, Average, Minimum, Maximum.",
      "The result is one measure object — another pipeline citizen.",
    ],
  },
  "select-string": {
    title: "Search without dropping to regex-on-text tools",
    lines: [
      "Select-String returns MatchInfo objects (Line, LineNumber, Path).",
      "You can pipe matches into Select-Object just like any other object.",
    ],
  },
  "new-item": {
    title: "Filesystem verbs are consistent",
    lines: [
      "New-Item creates files or directories. Same noun, different -ItemType.",
    ],
  },
  "set-content": {
    title: "Content writes replace the file body",
    lines: [
      "Set-Content overwrites. Add-Content appends. Both treat the path as a provider item.",
    ],
  },
  "add-content": {
    title: "Append, do not rewrite",
    lines: [
      "Add-Content is the cheap way to grow a log without loading the whole file into memory.",
    ],
  },
  "remove-item": {
    title: "Destructive verbs need a path",
    lines: [
      "Remove-Item deletes provider items. -Recurse is required for non-empty directories.",
    ],
  },
  "test-path": {
    title: "Existence checks return booleans",
    lines: [
      "Test-Path emits True/False — still objects you can use in if statements later.",
    ],
  },
  "write-variable": {
    title: "Assignment stores pipeline results",
    lines: [
      "$x = Get-Process captures the object array in a variable.",
      "Later: $x | Where-Object … — the objects are still objects, not a printed table.",
    ],
  },
  "pipeline": {
    title: "The pipe passes objects left to right",
    lines: [
      "Each stage receives the previous stage's success-stream objects.",
      "Format-* is a view at the end of a pipe — never put it in the middle of a chain.",
    ],
  },
};

/**
 * @param {string} key
 */
function teachFromKey(key) {
  const entry = TEACH[key];
  if (!entry) return null;
  return ["", `── Why: ${entry.title} ──`, ...entry.lines.map((l) => `  ${l}`)].join(
    "\n"
  );
}

/**
 * @param {string} raw
 * @returns {string | null}
 */
export function teachAfterCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return null;
  if (cmd.startsWith("$") && cmd.includes("=")) return teachFromKey("write-variable");
  if (/write-output|^echo\b|^write\b/.test(cmd)) return teachFromKey("write-output");
  if (/get-location|^pwd\b/.test(cmd)) return teachFromKey("get-location");
  if (/set-location|^cd\b|^sl\b/.test(cmd)) return teachFromKey("set-location");
  if (/get-childitem|^gci\b|^dir\b|^ls\b/.test(cmd)) return teachFromKey("get-childitem");
  if (/get-content|^gc\b|^cat\b|^type\b/.test(cmd)) return teachFromKey("get-content");
  if (/get-process|^gps\b|^ps\b/.test(cmd)) return teachFromKey("get-process");
  if (/get-service|^gsv\b/.test(cmd)) return teachFromKey("get-service");
  if (/select-object|^select\b/.test(cmd)) return teachFromKey("select-object");
  if (/where-object|^where\b|\?\s/.test(cmd)) return teachFromKey("where-object");
  if (/foreach-object|^foreach\b|^%\s/.test(cmd)) return teachFromKey("foreach-object");
  if (/sort-object|^sort\b/.test(cmd)) return teachFromKey("sort-object");
  if (/measure-object|^measure\b/.test(cmd)) return teachFromKey("measure-object");
  if (/select-string|^sls\b/.test(cmd)) return teachFromKey("select-string");
  if (/new-item|^ni\b/.test(cmd)) return teachFromKey("new-item");
  if (/add-content|^ac\b/.test(cmd)) return teachFromKey("add-content");
  if (/set-content|^sc\b/.test(cmd)) return teachFromKey("set-content");
  if (/remove-item|^ri\b|^rm\b|^del\b/.test(cmd)) return teachFromKey("remove-item");
  if (/test-path/.test(cmd)) return teachFromKey("test-path");
  if (cmd.includes("|")) return teachFromKey("pipeline");
  return null;
}

/**
 * Level-level teaching panel HTML pieces.
 * @param {import('./levels.js').Level} level
 */
export function levelTeachHtml(level) {
  const teach = level.teach;
  if (!teach) return "";
  const why = (teach.why || [])
    .map((l) => `<li>${escapeHtml(l)}</li>`)
    .join("");
  const learn = (level.learning || [])
    .map((l) => `<li>${escapeHtml(l)}</li>`)
    .join("");
  return `
    <div class="learning-box">
      <h3>What is happening</h3>
      <p>${escapeHtml(teach.what || "")}</p>
    </div>
    <div class="learning-box">
      <h3>Why it matters</h3>
      <ul>${why}</ul>
    </div>
    ${
      teach.model
        ? `<div class="learning-box"><h3>Mental model</h3><p>${escapeHtml(teach.model)}</p></div>`
        : ""
    }
    ${
      learn
        ? `<div class="learning-box"><h3>You are learning</h3><ul>${learn}</ul></div>`
        : ""
    }
  `;
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
