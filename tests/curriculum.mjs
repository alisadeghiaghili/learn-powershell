/**
 * Curriculum solvability checks.
 * Run: node tests/curriculum.mjs
 */

import { Session } from "../assets/js/engine.js";
import { LEVELS, evaluateGoal, getLevel } from "../assets/js/levels.js";

/**
 * @param {string} id
 * @param {string[]} commands
 */
function solve(id, commands) {
  const level = getLevel(id);
  if (!level) return { id, ok: false, reason: "missing level" };
  const session = new Session();
  let last = { output: [], usedCmdlets: [], pipeline: null, commandCount: 0 };
  for (const cmd of commands) {
    last = session.run(cmd);
    if (last.error) return { id, ok: false, reason: last.error, cmd };
  }
  const result = evaluateGoal(level.goal, session, {
    output: last.output,
    usedCmdlets: [...session.usedCmdlets, ...last.usedCmdlets],
    pipeline: last.pipeline,
    commandCount: session.commandCount,
  });
  return {
    id,
    ok: result.solved,
    reason: result.solved ? "solved" : result.checks.filter((c) => !c.passed),
  };
}

const solutions = {
  "intro-01": ['Write-Output "Hello, PowerShell"'],
  "intro-02": ["Get-Location"],
  "intro-03": ["Get-ChildItem"],
  "intro-04": ["Get-Content data\\notes.txt"],
  "intro-05": ["Set-Location docs"],
  "intro-06": ["Get-ChildItem -Filter *.txt"],
  "objects-01": ["Get-Process | Select-Object Name, Id"],
  "objects-02": ["Get-Process | Where-Object CPU -gt 50"],
  "objects-03": ["Get-Process | Sort-Object CPU -Descending"],
  "objects-04": ["Get-Process | Measure-Object"],
  "objects-05": ["Get-Process | Select-Object Name, CPU -First 3"],
  "pipeline-01": [
    "Get-Process | Where-Object CPU -gt 40 | Select-Object Name",
  ],
  "pipeline-02": ["Get-Process | ForEach-Object Name"],
  "pipeline-03": ["Get-Process | ForEach-Object { $_.CPU + 10 }"],
  "pipeline-04": ["Get-Content data\\notes.txt | Select-String Select"],
  "pipeline-05": ["Get-Process | Measure-Object -Property CPU"],
  "session-01": ["$procs = Get-Process"],
  "session-02": ["New-Item report.txt"],
  "session-03": ['Set-Content report.txt "draft"'],
  "session-04": ["Remove-Item todo.txt"],
  "session-05": ["Test-Path data\\servers.csv"],
  "remix-01": ['Get-Service | Where-Object Status -eq Running'],
  "remix-02": [
    "Get-Process | Sort-Object CPU -Descending | Select-Object Name, CPU -First 2",
  ],
  "remix-03": ['New-Item report.txt; Set-Content report.txt "draft"; Add-Content report.txt "done"'],
  "remix-04": [
    "Get-Process | Measure-Object; Get-Process | Select-Object -First 1",
  ],
};

let failed = 0;
for (const [id, cmds] of Object.entries(solutions)) {
  const r = solve(id, cmds);
  if (r.ok) console.log(`ok   ${id}`);
  else {
    failed += 1;
    console.error(`FAIL ${id}`, r.reason);
  }
}

const unsolved = LEVELS.filter((l) => !solutions[l.id]);
if (unsolved.length) {
  console.error("No solution listed for", unsolved.map((l) => l.id));
  failed += unsolved.length;
}

console.log(`\n${Object.keys(solutions).length - failed} solved, ${failed} failed`);
process.exit(failed ? 1 : 0);
