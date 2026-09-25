/**
 * Export official solutions to labs/solutions.json for real-pwsh validation.
 * Run: node labs/export-solutions.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, "..", "tests", "curriculum.mjs"), "utf8");
const start = src.indexOf("const solutions = {");
const end = src.indexOf("\n};", start);
if (start < 0 || end < 0) {
  console.error("solutions block not found");
  process.exit(1);
}
const body = src.slice(start + "const solutions = ".length, end + 2);
const solutions = new Function(`return ${body}`)();
writeFileSync(join(here, "solutions.json"), JSON.stringify(solutions, null, 2));
console.log(`exported ${Object.keys(solutions).length} solutions`);
