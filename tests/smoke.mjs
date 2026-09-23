/**
 * Engine smoke tests for LearnPowerShell.
 * Run: node tests/smoke.mjs
 */

import {
  Session,
  splitPipeline,
  tokenize,
  resolvePath,
  getNode,
} from "../assets/js/engine.js";
import { LEVELS, evaluateGoal, getLevel } from "../assets/js/levels.js";

let passed = 0;
let failed = 0;

/**
 * @param {string} name
 * @param {boolean} cond
 * @param {unknown} [detail]
 */
function ok(name, cond, detail) {
  if (cond) {
    passed += 1;
    console.log(`ok   ${name}`);
  } else {
    failed += 1;
    console.error(`FAIL ${name}`, detail ?? "");
  }
}

// tokenizer
ok("splitPipeline basic", splitPipeline("a | b | c").length === 3);
ok(
  "splitPipeline quotes",
  splitPipeline('Write-Output "a | b" | more')[0].includes("a | b")
);
ok("tokenize quotes", tokenize('Set-Content f "hello world"')[2] === "hello world");

// paths
ok("resolvePath parent", resolvePath("C:\\lab", "..\\lab") === "C:\\lab");
ok("resolvePath abs", resolvePath("C:\\lab", "C:\\lab\\docs") === "C:\\lab\\docs");
ok("getNode file", getNode(new Session().fs, "C:\\lab\\todo.txt")?.type === "file");

// commands
const s1 = new Session();
const r1 = s1.run("Write-Output \"Hello, PowerShell\"");
ok("Write-Output", r1.output.includes("Hello, PowerShell"), r1);

const s2 = new Session();
s2.run("Get-ChildItem");
ok("Get-ChildItem used", s2.usedCmdlets.has("Get-ChildItem"));

const s3 = new Session();
const r3 = s3.run("Get-Content data\\notes.txt");
ok("Get-Content", r3.output.some((l) => l.includes("Objects > text")), r3);

const s4 = new Session();
s4.run("Set-Location docs");
ok("Set-Location", s4.cwd === "C:\\lab\\docs", s4.cwd);

const s5 = new Session();
const r5 = s5.run("Get-Process | Where-Object CPU -gt 50");
ok("Where-Object filter", r5.pipeline.count >= 1, r5.pipeline);

const s6 = new Session();
const r6 = s6.run("Get-Process | Select-Object Name, Id");
ok("Select-Object count", r6.pipeline.count === 8, r6.pipeline.count);

const s7 = new Session();
s7.run("$procs = Get-Process");
ok(
  "assignment list",
  Array.isArray(s7.variables.procs) && s7.variables.procs.length === 8,
  s7.variables.procs
);

const s8 = new Session();
s8.run("Get-Process | Measure-Object");
ok("Measure-Object", s8.usedCmdlets.has("Measure-Object"));

const s9 = new Session();
const r9 = s9.run("Get-Process | Sort-Object CPU -Descending | Select-Object Name, CPU -First 2");
ok("top talkers count", r9.pipeline.count === 2, r9.pipeline);

const s10 = new Session();
s10.run("New-Item report.txt");
s10.run('Set-Content report.txt "draft"');
const node = getNode(s10.fs, "C:\\lab\\report.txt");
ok("file write", String(node?.content).includes("draft"), node);

const s11 = new Session();
const before = s11.commandCount;
s11.run("Get-Location");
s11.undo();
ok("undo count", s11.commandCount === before, s11.commandCount);

// goal evaluation
const level = getLevel("intro-01");
const s12 = new Session();
const r12 = s12.run('Write-Output "Hello, PowerShell"');
const goalResult = evaluateGoal(level.goal, s12, {
  output: r12.output,
  usedCmdlets: r12.usedCmdlets,
  pipeline: r12.pipeline,
  commandCount: s12.commandCount,
});
ok("level intro-01 solvable", goalResult.solved, goalResult);

ok("levels loaded", LEVELS.length >= 20, LEVELS.length);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
