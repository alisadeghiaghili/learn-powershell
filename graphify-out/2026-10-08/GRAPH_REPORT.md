# Graph Report - learn-powershell  (2026-10-08)

## Corpus Check
- 31 files · ~57,659 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 317 nodes · 748 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bde1fe86`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Session
- app.js
- engine.js
- smoke.mjs
- teach.js
- createTerminal
- fa.js
- progress.js
- export-solutions.mjs
- visuals.js
- LearnPowerShell — Design Notes
- levels-catalog.js
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `Session` - 53 edges
2. `PSObject` - 25 edges
3. `evalExpr()` - 23 edges
4. `onLevelSolved()` - 19 edges
5. `createTerminal()` - 16 edges
6. `LearnPowerShell — Design Notes` - 15 edges
7. `resolvePath()` - 14 edges
8. `getLevel()` - 14 edges
9. `getNode()` - 13 edges
10. `evaluateGoal()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `solve()` --calls--> `Session`  [EXTRACTED]
  tests/curriculum.mjs → assets/js/engine.js
- `solve()` --calls--> `getLevel()`  [EXTRACTED]
  tests/curriculum.mjs → assets/js/levels-catalog.js
- `solve()` --calls--> `evaluateGoal()`  [EXTRACTED]
  tests/curriculum.mjs → assets/js/levels-catalog.js
- `curriculum()` --indirect_call--> `localizeSeriesTitle()`  [INFERRED]
  assets/js/app.js → assets/js/i18n/index.js
- `curriculum()` --calls--> `summarizeCurriculum()`  [EXTRACTED]
  assets/js/app.js → assets/js/progress.js

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "Session"
Cohesion: 0.15
Nodes (11): basename(), clone(), coerce(), compare(), fileToItem(), getNode(), likeMatch(), parentPath() (+3 more)

### Community 1 - "app.js"
Cohesion: 0.08
Nodes (56): bootCommands, curriculum(), emptyRun(), focusGuide(), handleCommand(), lastRun, onLevelSolved(), openUiHelp() (+48 more)

### Community 2 - "engine.js"
Cohesion: 0.10
Nodes (34): CANONICAL, canonicalCmdlet(), defaultFileSystem(), defaultProcesses(), defaultServices(), expand(), formatOutput(), helpText() (+26 more)

### Community 3 - "smoke.mjs"
Cohesion: 0.08
Nodes (26): DEPTH_TIERS, getDepthContent(), SERIES_DEPTHS, goalResult, introDepthEn, introDepthFa, level, node (+18 more)

### Community 4 - "teach.js"
Cohesion: 0.47
Nodes (5): escapeHtml(), levelTeachHtml(), TEACH, teachAfterCommand(), teachFromKey()

### Community 5 - "createTerminal"
Cohesion: 0.20
Nodes (14): BASE_COMMANDS, createTerminal(), allCompletions(), applyTab(), echoPrompt(), focus(), matchingCommands(), measureText() (+6 more)

### Community 6 - "fa.js"
Cohesion: 0.60
Nodes (3): fa, faLevels, faSeries

### Community 7 - "progress.js"
Cohesion: 0.16
Nodes (17): COOKIE_KEY, loadProgress(), parseBlob(), readCookie(), saveProgress(), STORAGE_KEY, summarizeCurriculum(), writeCookie() (+9 more)

### Community 8 - "export-solutions.mjs"
Cohesion: 0.20
Nodes (6): body, end, here, solutions, src, start

### Community 10 - "visuals.js"
Cohesion: 0.43
Nodes (7): createVisualizer(), renderPipeline(), renderSession(), escapeHtml(), listCwd(), renderGoals(), shortType()

### Community 15 - "LearnPowerShell — Design Notes"
Cohesion: 0.07
Nodes (27): Build, Cognitive Depth Ladder (ELI5 to ELIPHD), Curriculum (level series), Engine, Layout system, LearnPowerShell — Design Notes, License, Non-goals (v1) (+19 more)

### Community 16 - "levels-catalog.js"
Cohesion: 0.20
Nodes (15): describe(), evaluateGoal(), fileExistsOn(), LEVELS, levelsInSeries(), lookupVar(), matchExpected(), nextLevelId() (+7 more)

## Knowledge Gaps
- **72 isolated node(s):** `session`, `lastRun`, `progressMap`, `viz`, `term` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 97 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Session` connect `Session` to `app.js`, `engine.js`, `smoke.mjs`, `LearnPowerShell — Design Notes`, `levels-catalog.js`?**
  _High betweenness centrality (0.333) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `createTerminal()` (e.g. with `clear()` and `echoPrompt()`) actually correct?**
  _`createTerminal()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `session`, `lastRun`, `progressMap` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Session` be split into smaller, more focused modules?**
  _Cohesion score 0.14904862579281183 - nodes in this community are weakly interconnected._
- **Why does `createTerminal()` connect `createTerminal` to `app.js`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0773405698778833 - nodes in this community are weakly interconnected._
- **Should `engine.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10204081632653061 - nodes in this community are weakly interconnected._