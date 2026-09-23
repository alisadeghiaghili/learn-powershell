/**
 * LearnPowerShell level definitions.
 *
 * Each level is a self-contained challenge with a start world override,
 * win predicates, a par score for command golf, and teaching notes.
 */

/**
 * @typedef {Object} LevelGoal
 * @property {number} [commandsMax]
 * @property {string[]} [usedCmdlets]
 * @property {string} [pathIs]
 * @property {string} [variableIs]
 * @property {string} [fileExists]
 * @property {string} [fileMissing]
 * @property {string} [fileContains]
 * @property {string} [outputIncludes]
 * @property {number} [outputCount]
 * @property {string} [outputTypeName]
 * @property {string} [outputPropMin]
 * @property {string[]} [pipelineCmdlets]
 */

/**
 * @typedef {Object} LevelTeach
 * @property {string} what
 * @property {string[]} why
 * @property {string} [model]
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
 * @property {LevelTeach} [teach]
 * @property {string[]} [learning]
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
    hint: 'Write-Output "Hello, PowerShell"',
    par: 1,
    goal: {
      outputIncludes: "Hello, PowerShell",
      usedCmdlets: ["Write-Output"],
    },
    teach: {
      what:
        "Write-Output puts an object on the success stream. The terminal then formats that object as text so you can read it.",
      why: [
        "Almost every PowerShell idiom is about moving objects between cmdlets, not scraping text.",
        "Even a hello-world line teaches the verb-noun pattern: Write-Output.",
      ],
      model:
        "Think of the pipeline as a conveyor belt of objects. Write-Output is how you place one on the belt.",
    },
    learning: ["Verb-Noun cmdlets", "Success stream", "Write-Output"],
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
    teach: {
      what:
        "Get-Location returns the session's current path as a PathInfo object (drive + provider + path).",
      why: [
        "Relative paths resolve from this location. Knowing it is how you avoid 'file not found' confusion.",
        "pwd is an alias — aliases are shortcuts, not different tools.",
      ],
      model: "Your prompt path is session state. Get-Location reads it as an object.",
    },
    learning: ["Session location", "PathInfo", "Aliases (pwd)"],
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
    teach: {
      what:
        "Get-ChildItem enumerates provider items and emits FileInfo / DirectoryInfo objects.",
      why: [
        "You receive Length, Mode, LastWriteTime — not just names in columns.",
        "Those properties become filters and sorts in later levels.",
      ],
      model: "The filesystem is a provider of objects, the same way processes are.",
    },
    learning: ["FileInfo / DirectoryInfo", "Provider model", "Get-ChildItem"],
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
    teach: {
      what:
        "Get-Content reads a file and emits one System.String per line (unless you ask for raw).",
      why: [
        "Text files are still streams of objects once they enter the pipe.",
        "You can Select-String or Where-Object those strings without leaving PowerShell.",
      ],
      model: "Disk text becomes pipeline strings — then it is objects again.",
    },
    learning: ["Get-Content", "String stream", "File paths"],
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
    teach: {
      what:
        "Set-Location changes the session's current location. cd is the familiar alias.",
      why: [
        "After this, relative paths like readme.md resolve under docs\\.",
        "Location is session state — undo can bring you back if you go too far.",
      ],
      model: "cd is not a joke command — it rewrites the base path for everything that follows.",
    },
    learning: ["Set-Location / cd", "Relative paths", "Session state"],
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
    teach: {
      what:
        "-Filter narrows the enumeration at the provider (filesystem) side before objects enter your pipe.",
      why: [
        "Provider filters are cheaper than Where-Object after a full listing.",
        "Wildcards (*, ?) are PowerShell's -like patterns — not shell globs with every edge case.",
      ],
      model: "Filter as early as you can. That rule scales to remote and huge directories.",
    },
    learning: ["-Filter parameter", "Wildcards", "Early filtering"],
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
    teach: {
      what:
        "Get-Process emits process objects. Select-Object projects a subset of properties (Name, Id).",
      why: [
        "Projection is how you build a report shape without parsing a table.",
        "Downstream stages now see lean objects — CPU/WS are gone if you did not select them.",
      ],
      model: "Select-Object is SQL SELECT for the object pipeline.",
    },
    learning: ["Get-Process", "Select-Object projection", "Note properties"],
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
    teach: {
      what:
        "Where-Object keeps objects for which a property comparison is true (CPU -gt 50).",
      why: [
        "The comparison is on the property value — not on a text column you grepped.",
        "Operators: -eq -ne -gt -ge -lt -le -like -match.",
      ],
      model: "Where-Object is a filter on the conveyor belt. Objects that fail the test drop off.",
    },
    learning: ["Where-Object", "Comparison operators", "Property predicates"],
  },
  {
    id: "objects-03",
    series: "objects",
    name: "Sort the hungry ones",
    brief: "List process names ordered by CPU descending. Highest CPU first.",
    hint: "Get-Process | Sort-Object CPU -Descending",
    par: 1,
    goal: {
      usedCmdlets: ["Get-Process", "Sort-Object"],
    },
    teach: {
      what: "Sort-Object orders the stream by a property. -Descending flips the order.",
      why: [
        "Sorting is on typed values (numbers stay numbers).",
        "After sort, Select-Object -First N becomes a true 'top N' query.",
      ],
      model: "Order matters for reports and for -First / -Last slices.",
    },
    learning: ["Sort-Object", "-Descending", "Typed ordering"],
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
    teach: {
      what:
        "Measure-Object collapses a stream into aggregate facts. Count is always present.",
      why: [
        "Aggregation is another object — you can still Select-Object on it.",
        "With -Property CPU you also get Sum, Average, Minimum, Maximum.",
      ],
      model: "Measure is reduce/fold over the pipeline.",
    },
    learning: ["Measure-Object", "Aggregation", "Count"],
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
    teach: {
      what:
        "Select-Object can project properties and slice the stream with -First / -Last in one step.",
      why: [
        "Order of operations matters: project and take from the objects you actually want.",
        "-First 3 means three objects, not three text lines of a formatted table.",
      ],
      model: "Think: map + take. Two SQL ideas in one cmdlet.",
    },
    learning: ["Select-Object -First", "Projection + slice", "Object count"],
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
    teach: {
      what:
        "A pipeline is source → transform → shape. Here: Get-Process → Where-Object → Select-Object.",
      why: [
        "Each stage's output objects are the next stage's input objects.",
        "That composition is why PowerShell beats 'parse ls output with awk' for administration.",
      ],
      model: "UNIX pipes move bytes. PowerShell pipes move objects with structure.",
    },
    learning: ["Multi-stage pipeline", "Source → filter → project"],
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
    teach: {
      what:
        "ForEach-Object visits every object. $_ is the current one. Emitting $_.Name yields plain strings.",
      why: [
        "Transforms that need logic per item live here (not in Select-Object).",
        "The result count matches the input count when you emit one value per object.",
      ],
      model: "ForEach-Object is map() over the stream.",
    },
    learning: ["ForEach-Object", "$_", "Per-object map"],
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
    teach: {
      what:
        "Inside the script block you can compute a new value from $_.CPU. The result becomes the next object.",
      why: [
        "This is how you derive columns without leaving the pipeline.",
        "Numeric properties stay numeric — + is arithmetic, not string concat, when both sides are numbers.",
      ],
      model: "Each object can be rewritten as it moves. The belt is not read-only.",
    },
    learning: ["Derived values", "$_.Property", "Arithmetic in the pipe"],
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
    teach: {
      what:
        "Get-Content yields lines; Select-String keeps those that match a pattern and wraps them in MatchInfo.",
      why: [
        "Search is a pipeline stage, not a different tool chain.",
        "MatchInfo still has LineNumber and Path if you need them.",
      ],
      model: "Text tools can live inside PowerShell as ordinary pipeline stages.",
    },
    learning: ["Get-Content → Select-String", "MatchInfo", "Pattern match"],
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
    teach: {
      what:
        "Measure-Object -Property CPU computes Count, Sum, Average, Minimum, Maximum over that property.",
      why: [
        "You asked for a property — so aggregates are numeric, not string guesses.",
        "This one-liner is a complete summary statistic over live objects.",
      ],
      model: "Pick the field first, then reduce. That is the analytics idiom in PowerShell.",
    },
    learning: ["Measure-Object -Property", "Average / Sum", "Reduce by property"],
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
    teach: {
      what:
        "$procs = Get-Process captures the success stream into a variable as an array of process objects.",
      why: [
        "Variables remember objects — later you can $procs | Where-Object … without re-querying.",
        "This is why assignment in PowerShell is more than copying printed text.",
      ],
      model: "A variable is a handle to the objects that were on the belt.",
    },
    learning: ["Assignment $x = …", "Object arrays in variables", "Reuse of results"],
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
    teach: {
      what: "New-Item creates a filesystem item (file by default, or -ItemType Directory).",
      why: [
        "Same verb family as New-Process-style thinking: verbs describe the action.",
        "The created item is also returned as an object you could assign.",
      ],
      model: "Providers take the same New-Item / Remove-Item verbs across drives.",
    },
    learning: ["New-Item", "File creation", "Verb consistency"],
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
    teach: {
      what: "Set-Content replaces the file body with the value you provide.",
      why: [
        "Parameters and position matter: -Path and -Value can bind by name or position.",
        "Use Add-Content when you mean append — overwriting is silent and complete.",
      ],
      model: "Set = replace. Add = append. The verb is the contract.",
    },
    learning: ["Set-Content", "Path / Value binding", "Overwrite semantics"],
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
    teach: {
      what: "Remove-Item deletes a provider item. Aliases: rm, del, ri.",
      why: [
        "Non-empty directories need -Recurse — a safety rail against accidents.",
        "Deletion is a session change undo can reverse in this lab.",
      ],
      model: "Destructive verbs are explicit. That is intentional design.",
    },
    learning: ["Remove-Item", "Safety rails", "Aliases rm/del"],
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
    teach: {
      what: "Test-Path returns a Boolean object: True or False.",
      why: [
        "Guard clauses in scripts start here: if (Test-Path $p) { … }.",
        "Booleans are objects too — they print as True/False but stay typed.",
      ],
      model: "Predicates first, then act. That is reliable scripting.",
    },
    learning: ["Test-Path", "Booleans", "Guard conditions"],
  },
  {
    id: "remix-01",
    series: "remix",
    name: "Service report",
    brief:
      "Emit only running services. One pipeline. Use Where-Object Status.",
    hint: "Get-Service | Where-Object Status -eq Running",
    par: 1,
    goal: {
      pipelineCmdlets: ["Get-Service", "Where-Object"],
    },
    teach: {
      what:
        "Service Status is a property you compare with -eq. No text parsing of a service table.",
      why: [
        "This is the same filter shape as processes — one pattern, many nouns.",
        "Verb-Noun consistency is what makes PowerShell scale in your head.",
      ],
      model: "Same pipeline, different noun. That is the language design.",
    },
    learning: ["Get-Service", "Status property", "Reusable filter pattern"],
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
    teach: {
      what:
        "Sort first so -First means 'highest CPU', then project the columns you want to show.",
      why: [
        "Order of stages is the algorithm. Swap them and 'top 2' becomes wrong.",
        "This is a complete mini-report in one readable line.",
      ],
      model: "compose: source → order → shape. Learn to feel stage order.",
    },
    learning: ["Stage order", "Top-N pattern", "Report composition"],
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
    teach: {
      what:
        "Add-Content appends a line. Set-Content would wipe what you already wrote.",
      why: [
        "Knowing the difference prevents silent data loss in real scripts.",
        "Appending is the log-file habit: grow, do not rewrite.",
      ],
      model: "Set replaces the story. Add continues it.",
    },
    learning: ["Add-Content", "Append vs overwrite", "Log-friendly habits"],
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
    teach: {
      what:
        "Several statements can share one line with ;. Count commands, not keystrokes — golf is about clarity under budget.",
      why: [
        "Real work often needs more than one pipeline. Semicolons sequence them.",
        "When you can hit par, you understand the shortest correct composition.",
      ],
      model: "Golf teaches economy: no wasted stages, no decorative Format-Table in the middle.",
    },
    learning: ["Semicolon sequences", "Command golf", "Economy of expression"],
  },
];

/**
 * @param {string} id
 * @returns {Level | null}
 */
export function getLevel(id) {
  return LEVELS.find((l) => l.id === id) || null;
}

/**
 * @param {string} seriesId
 * @returns {Level[]}
 */
export function levelsInSeries(seriesId) {
  return LEVELS.filter((l) => l.series === seriesId);
}

/**
 * @param {string} seriesId
 * @returns {string}
 */
export function seriesTitle(seriesId) {
  return SERIES.find((s) => s.id === seriesId)?.name || seriesId;
}

/**
 * @param {string} id
 * @returns {string | null}
 */
export function nextLevelId(id) {
  const idx = LEVELS.findIndex((l) => l.id === id);
  if (idx < 0 || idx >= LEVELS.length - 1) return null;
  return LEVELS[idx + 1].id;
}

/**
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
      passed: n > 0 && n <= goal.commandsMax,
      detail: `${n} used`,
    });
  }

  if (goal.usedCmdlets?.length) {
    for (const cmd of goal.usedCmdlets) {
      const passed =
        session.usedCmdlets.has(cmd) || lastRun.usedCmdlets.includes(cmd);
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
    const exists = fileExistsOn(session, goal.fileExists);
    checks.push({
      id: "fileExists",
      label: `File ${goal.fileExists} exists`,
      passed: exists,
      detail: exists ? "created" : "missing",
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
    const count = lastRun.pipeline?.count ?? lastRun.output.length;
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

  return { checks, solved: checks.length > 0 && checks.every((c) => c.passed) };
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

/**
 * @param {import('./engine.js').Session} session
 * @param {string} rel
 * @returns {string}
 */
function resolveGoalPath(session, rel) {
  if (/^[A-Za-z]:/.test(rel)) return rel.replace(/\//g, "\\");
  return `${session.cwd}\\${rel.replace(/\//g, "\\")}`;
}
