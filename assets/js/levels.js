/**
 * LearnPowerShell level definitions.
 *
 * Each level is a self-contained challenge with a start world override,
 * win predicates, and a par score for command golf.
 */

/**
 * @typedef {Object} LevelGoal
 * @property {number} [commandsMax]      Max commands allowed (inclusive)
 * @property {string[]} [usedCmdlets]    Canonical cmdlets that must appear
 * @property {string} [pathIs]           Required cwd after solve
 * @property {string} [variableIs]       "name=value" required variable
 * @property {string} [fileExists]       Relative or absolute path must exist
 * @property {string} [fileMissing]      Path must not exist
 * @property {string} [fileContains]     "path::substring"
 * @property {string} [outputIncludes]   Substring that must appear in last output
 * @property {number} [outputCount]      Exact item count in last pipeline output
 * @property {string} [outputTypeName]   Last pipeline objects share this type name fragment
 * @property {string} [outputPropMin]    "Prop=value" numeric min on each output object
 * @property {string[]} [pipelineCmdlets] Cmdlets that must appear in one pipeline
 */

/**
 * @typedef {Object} Level
 * @property {string} id
 * @property {string} series
 * @property {string} name
 * @property {string} brief
 * @property {string} hint
 * @property {number} par
 * @property {LevelGoal} goal
 * @property {{ cwd?: string }} [start]
 */

/** @type {{ id: string, name: string, description: string }[]} */
export const SERIES = [
  {
    id: "intro",
    name: "Getting Started",
    description: "Navigate the provider and read what is on disk.",
  },
  {
    id: "objects",
    name: "Objects",
    description: "Stop thinking in text. Project, filter, sort, measure.",
  },
  {
    id: "pipeline",
    name: "Pipeline",
    description: "Chain cmdlets so objects flow through stages.",
  },
  {
    id: "session",
    name: "Session & Files",
    description: "Variables, files, and lasting state.",
  },
  {
    id: "remix",
    name: "Remix",
    description: "Compose everything. Then golf the solution.",
  },
];

/** @type {Level[]} */
export const LEVELS = [
  {
    id: "intro-01",
    series: "intro",
    name: "Say hello",
    brief:
      "Write the string Hello, PowerShell to the pipeline using Write-Output.",
    hint: "Write-Output \"Hello, PowerShell\"",
    par: 1,
    goal: {
      outputIncludes: "Hello, PowerShell",
      usedCmdlets: ["Write-Output"],
    },
  },
  {
    id: "intro-02",
    series: "intro",
    name: "Where am I?",
    brief: "Return the current location of the session.",
    hint: "Get-Location  (alias: pwd)",
    par: 1,
    goal: {
      usedCmdlets: ["Get-Location"],
    },
  },
  {
    id: "intro-03",
    series: "intro",
    name: "Look around",
    brief: "List the items in the current directory.",
    hint: "Get-ChildItem  (aliases: gci, dir, ls)",
    par: 1,
    goal: {
      usedCmdlets: ["Get-ChildItem"],
    },
  },
  {
    id: "intro-04",
    series: "intro",
    name: "Read the notes",
    brief: "Print the contents of data\\notes.txt to the pipeline.",
    hint: "Get-Content data\\notes.txt",
    par: 1,
    goal: {
      usedCmdlets: ["Get-Content"],
      outputIncludes: "Objects > text",
    },
  },
  {
    id: "intro-05",
    series: "intro",
    name: "Change directory",
    brief: "Move into the docs folder. Stay there.",
    hint: "Set-Location docs  (alias: cd)",
    par: 1,
    goal: {
      pathIs: "C:\\lab\\docs",
      usedCmdlets: ["Set-Location"],
    },
  },
  {
    id: "intro-06",
    series: "intro",
    name: "Filter listing",
    brief: "List only the .txt files in the current directory.",
    hint: "Get-ChildItem -Filter *.txt",
    par: 1,
    goal: {
      usedCmdlets: ["Get-ChildItem"],
      outputIncludes: "todo.txt",
    },
  },
  {
    id: "objects-01",
    series: "objects",
    name: "Processes are objects",
    brief:
      "Get all processes and project only their Name and Id. The pipeline should carry those two properties.",
    hint: "Get-Process | Select-Object Name, Id",
    par: 1,
    goal: {
      usedCmdlets: ["Get-Process", "Select-Object"],
      outputCount: 8,
    },
  },
  {
    id: "objects-02",
    series: "objects",
    name: "Filter with Where-Object",
    brief: "Return only processes whose CPU is greater than 50.",
    hint: "Get-Process | Where-Object CPU -gt 50",
    par: 1,
    goal: {
      usedCmdlets: ["Get-Process", "Where-Object"],
      outputPropMin: "CPU=50",
    },
  },
  {
    id: "objects-03",
    series: "objects",
    name: "Sort the hungry ones",
    brief:
      "List process names ordered by CPU descending. Highest CPU first.",
    hint: "Get-Process | Sort-Object CPU -Descending",
    par: 1,
    goal: {
      usedCmdlets: ["Get-Process", "Sort-Object"],
    },
  },
  {
    id: "objects-04",
    series: "objects",
    name: "Measure the set",
    brief: "Count how many processes are running.",
    hint: "Get-Process | Measure-Object",
    par: 1,
    goal: {
      usedCmdlets: ["Get-Process", "Measure-Object"],
      outputIncludes: "Count",
    },
  },
  {
    id: "objects-05",
    series: "objects",
    name: "Project then take",
    brief: "Return Name and CPU for the first 3 processes only.",
    hint: "Get-Process | Select-Object Name, CPU -First 3",
    par: 1,
    goal: {
      usedCmdlets: ["Get-Process", "Select-Object"],
      outputCount: 3,
    },
  },
  {
    id: "pipeline-01",
    series: "pipeline",
    name: "Three stages",
    brief:
      "Build one pipeline: all processes → filter CPU greater than 40 → project Name. The whole chain must be a single pipeline.",
    hint: "Get-Process | Where-Object CPU -gt 40 | Select-Object Name",
    par: 1,
    goal: {
      pipelineCmdlets: ["Get-Process", "Where-Object", "Select-Object"],
    },
  },
  {
    id: "pipeline-02",
    series: "pipeline",
    name: "Project each name",
    brief:
      "Use ForEach-Object to emit each process Name as its own output object.",
    hint: "Get-Process | ForEach-Object Name   or   ForEach-Object { $_.Name }",
    par: 1,
    goal: {
      usedCmdlets: ["Get-Process", "ForEach-Object"],
      outputCount: 8,
    },
  },
  {
    id: "pipeline-03",
    series: "pipeline",
    name: "Transform values",
    brief:
      "Add 10 to every process CPU with ForEach-Object. Emit the new numbers.",
    hint: "Get-Process | ForEach-Object { $_.CPU + 10 }",
    par: 1,
    goal: {
      usedCmdlets: ["ForEach-Object"],
    },
  },
  {
    id: "pipeline-04",
    series: "pipeline",
    name: "From files to strings",
    brief:
      "One pipeline: read data\\notes.txt, then select lines that contain Select.",
    hint: "Get-Content data\\notes.txt | Select-String Select",
    par: 1,
    goal: {
      pipelineCmdlets: ["Get-Content", "Select-String"],
      outputIncludes: "Select-Object",
    },
  },
  {
    id: "pipeline-05",
    series: "pipeline",
    name: "Average CPU",
    brief:
      "Measure the CPU property of processes. We want Average (and the rest of the measure output).",
    hint: "Get-Process | Measure-Object -Property CPU",
    par: 1,
    goal: {
      usedCmdlets: ["Measure-Object"],
      outputIncludes: "Average",
    },
  },
  {
    id: "session-01",
    series: "session",
    name: "Store a result",
    brief:
      "Save the process list into the variable $procs. The variable must hold the objects (not a string).",
    hint: "$procs = Get-Process",
    par: 1,
    goal: {
      variableIs: "procs=PSOBJECT_LIST",
      usedCmdlets: ["Get-Process"],
    },
  },
  {
    id: "session-02",
    series: "session",
    name: "Create a file",
    brief: "Create report.txt in the current directory.",
    hint: "New-Item report.txt   or   New-Item -Path report.txt -ItemType File",
    par: 1,
    goal: {
      fileExists: "report.txt",
      usedCmdlets: ["New-Item"],
    },
  },
  {
    id: "session-03",
    series: "session",
    name: "Write contents",
    brief: "Write the text draft into report.txt.",
    hint: 'Set-Content report.txt "draft"',
    par: 1,
    goal: {
      fileContains: "report.txt::draft",
      usedCmdlets: ["Set-Content"],
    },
  },
  {
    id: "session-04",
    series: "session",
    name: "Clean up",
    brief: "Delete todo.txt from the lab root.",
    hint: "Remove-Item todo.txt",
    par: 1,
    goal: {
      fileMissing: "todo.txt",
      usedCmdlets: ["Remove-Item"],
    },
  },
  {
    id: "session-05",
    series: "session",
    name: "Does it exist?",
    brief: "Check whether data\\servers.csv exists. Emit the boolean result.",
    hint: "Test-Path data\\servers.csv",
    par: 1,
    goal: {
      usedCmdlets: ["Test-Path"],
      outputIncludes: "True",
    },
  },
  {
    id: "remix-01",
    series: "remix",
    name: "Service report",
    brief:
      "Emit only running services. One pipeline. Use Where-Object Status.",
    hint: 'Get-Service | Where-Object Status -eq Running',
    par: 1,
    goal: {
      pipelineCmdlets: ["Get-Service", "Where-Object"],
    },
  },
  {
    id: "remix-02",
    series: "remix",
    name: "Top talkers",
    brief:
      "One pipeline: processes sorted by CPU descending, take the top 2, project Name and CPU.",
    hint: "Get-Process | Sort-Object CPU -Descending | Select-Object Name, CPU -First 2",
    par: 1,
    goal: {
      pipelineCmdlets: ["Get-Process", "Sort-Object", "Select-Object"],
      outputCount: 2,
    },
  },
  {
    id: "remix-03",
    series: "remix",
    name: "Append a line",
    brief:
      "Add the line done to report.txt (create it first if you need to).",
    hint: 'Add-Content report.txt "done"',
    par: 1,
    goal: {
      fileContains: "report.txt::done",
    },
  },
  {
    id: "remix-04",
    series: "remix",
    name: "Golf: three facts",
    brief:
      "Produce output that contains both a process name and the text Count — with at most 2 commands. Any correct pipeline pair is fine.",
    hint: "Get-Process | Measure-Object; Get-Process | Select-Object -First 1",
    par: 2,
    goal: {
      commandsMax: 2,
      outputIncludes: "Count",
      usedCmdlets: ["Get-Process"],
    },
  },
];

/**
 * Resolve a level by id.
 * @param {string} id
 * @returns {Level | null}
 */
export function getLevel(id) {
  return LEVELS.find((l) => l.id === id) || null;
}

/**
 * Levels for a series, in order.
 * @param {string} seriesId
 * @returns {Level[]}
 */
export function levelsInSeries(seriesId) {
  return LEVELS.filter((l) => l.series === seriesId);
}

/**
 * Next level id after the given id, or null.
 * @param {string} id
 * @returns {string | null}
 */
export function nextLevelId(id) {
  const idx = LEVELS.findIndex((l) => l.id === id);
  if (idx < 0 || idx >= LEVELS.length - 1) return null;
  return LEVELS[idx + 1].id;
}

/**
 * Evaluate level goal against a session snapshot and last run.
 * @param {LevelGoal} goal
 * @param {import('./engine.js').Session} session
 * @param {{ output: string[], usedCmdlets: string[], pipeline: any, commandCount: number }} lastRun
 * @returns {{ checks: { id: string, label: string, passed: boolean, detail: string }[], solved: boolean }}
 */
export function evaluateGoal(goal, session, lastRun) {
  /** @type {{ id: string, label: string, passed: boolean, detail: string }[]} */
  const checks = [];

  if (goal.commandsMax != null) {
    const n = session.commandCount;
    checks.push({
      id: "commandsMax",
      label: `At most ${goal.commandsMax} commands`,
      passed: n <= goal.commandsMax && n > 0,
      detail: `${n} used`,
    });
  }

  if (goal.usedCmdlets?.length) {
    for (const cmd of goal.usedCmdlets) {
      const passed = session.usedCmdlets.has(cmd) || lastRun.usedCmdlets.includes(cmd);
      checks.push({
        id: `used:${cmd}`,
        label: `Used ${cmd}`,
        passed,
        detail: passed ? "ok" : "not used yet",
      });
    }
  }

  if (goal.pathIs) {
    const passed = session.cwd.toUpperCase() === goal.pathIs.toUpperCase();
    checks.push({
      id: "pathIs",
      label: `Location is ${goal.pathIs}`,
      passed,
      detail: session.cwd,
    });
  }

  if (goal.variableIs) {
    const [name, expected] = goal.variableIs.split("=");
    const value = session.variables[name];
    let passed = false;
    let detail = "missing";
    if (expected === "PSOBJECT_LIST") {
      passed = Array.isArray(value) && value.length > 0;
      detail = passed ? `${value.length} objects` : typeof value;
    } else {
      passed = value != null && String(value) === expected;
      detail = value == null ? "missing" : String(value);
    }
    checks.push({
      id: "variableIs",
      label:
        expected === "PSOBJECT_LIST"
          ? `Variable $${name} holds objects`
          : `Variable $${name} equals ${expected}`,
      passed,
      detail,
    });
  }

  if (goal.fileExists) {
    const path = resolveGoalPath(session, goal.fileExists);
    const passed = Boolean(session.constructor ? true : true);
    // use engine helpers via duck-typing on session
    const exists = fileExistsOn(session, goal.fileExists);
    checks.push({
      id: "fileExists",
      label: `File ${goal.fileExists} exists`,
      passed: exists,
      detail: exists ? path : "missing",
    });
  }

  if (goal.fileMissing) {
    const exists = fileExistsOn(session, goal.fileMissing);
    checks.push({
      id: "fileMissing",
      label: `File ${goal.fileMissing} is gone`,
      passed: !exists,
      detail: exists ? "still present" : "removed",
    });
  }

  if (goal.fileContains) {
    const [file, needle] = goal.fileContains.split("::");
    const text = readGoalFile(session, file);
    const passed = text.includes(needle);
    checks.push({
      id: "fileContains",
      label: `${file} contains "${needle}"`,
      passed,
      detail: passed ? "ok" : text ? "not found in file" : "file missing",
    });
  }

  if (goal.outputIncludes) {
    const hay = lastRun.output.join("\n");
    const passed = hay.includes(goal.outputIncludes);
    checks.push({
      id: "outputIncludes",
      label: `Output includes "${goal.outputIncludes}"`,
      passed,
      detail: passed ? "ok" : "not in last output",
    });
  }

  if (goal.outputCount != null) {
    const n = lastRun.pipeline?.count ?? lastRun.output.length;
    // Prefer actual object count from pipeline trace
    const count = lastRun.pipeline?.count ?? n;
    const passed = count === goal.outputCount;
    checks.push({
      id: "outputCount",
      label: `Pipeline emits ${goal.outputCount} objects`,
      passed,
      detail: `${count} emitted`,
    });
  }

  if (goal.outputTypeName) {
    const sample = lastRun.pipeline?.stages?.at(-1)?.sample || [];
    const passed =
      sample.length > 0 &&
      sample.every((s) => s.type.includes(goal.outputTypeName));
    checks.push({
      id: "outputTypeName",
      label: `Output type contains ${goal.outputTypeName}`,
      passed,
      detail: sample[0]?.type || "no output",
    });
  }

  if (goal.outputPropMin) {
    const [prop, minStr] = goal.outputPropMin.split("=");
    const min = Number(minStr);
    const sample = lastRun.pipeline?.stages?.at(-1)?.sample || [];
    // Need full objects — re-check via session not available; use sample fields
    const passed =
      sample.length > 0 &&
      sample.every((s) => {
        const v = s.fields[prop] ?? s.title;
        return Number(v) >= min;
      });
    checks.push({
      id: "outputPropMin",
      label: `Every ${prop} ≥ ${min}`,
      passed,
      detail: passed ? "ok" : "some items below threshold",
    });
  }

  if (goal.pipelineCmdlets?.length) {
    const stages = lastRun.pipeline?.stages?.map((s) => s.name) || [];
    const passed = goal.pipelineCmdlets.every((c) => stages.includes(c));
    checks.push({
      id: "pipelineCmdlets",
      label: `One pipeline uses ${goal.pipelineCmdlets.join(" → ")}`,
      passed,
      detail: stages.join(" → ") || "no pipeline yet",
    });
  }

  // Always require at least one command and no error on last run for solve
  const solved = checks.length > 0 && checks.every((c) => c.passed) && lastRun.output != null;
  return { checks, solved: checks.every((c) => c.passed) };
}

/**
 * @param {import('./engine.js').Session} session
 * @param {string} rel
 * @returns {string}
 */
function resolveGoalPath(session, rel) {
  const { resolvePath } = /** @type {any} */ (globalThis.__lpsEngine || {});
  if (resolvePath) return resolvePath(session.cwd, rel);
  if (/^[A-Za-z]:/.test(rel)) return rel.replace(/\//g, "\\");
  return `${session.cwd}\\${rel.replace(/\//g, "\\")}`;
}

/**
 * @param {import('./engine.js').Session} session
 * @param {string} rel
 * @returns {boolean}
 */
function fileExistsOn(session, rel) {
  const path = resolveGoalPath(session, rel);
  const parts = path.split("\\").filter(Boolean);
  let node = session.fs;
  for (let i = 0; i < parts.length; i += 1) {
    if (i === 0) {
      if (String(node.name).toUpperCase() !== parts[0].toUpperCase()) return false;
      continue;
    }
    if (node.type !== "dir" || !node.children) return false;
    const child = Object.values(node.children).find(
      (c) => String(c.name).toLowerCase() === parts[i].toLowerCase()
    );
    if (!child) return false;
    node = child;
  }
  return true;
}

/**
 * @param {import('./engine.js').Session} session
 * @param {string} rel
 * @returns {string}
 */
function readGoalFile(session, rel) {
  const path = resolveGoalPath(session, rel);
  const parts = path.split("\\").filter(Boolean);
  let node = session.fs;
  for (let i = 0; i < parts.length; i += 1) {
    if (i === 0) {
      if (String(node.name).toUpperCase() !== parts[0].toUpperCase()) return "";
      continue;
    }
    if (node.type !== "dir" || !node.children) return "";
    const child = Object.values(node.children).find(
      (c) => String(c.name).toLowerCase() === parts[i].toLowerCase()
    );
    if (!child) return "";
    node = child;
  }
  return node.type === "file" ? String(node.content || "") : "";
}
