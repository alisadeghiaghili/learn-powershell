# Graph Report - learn-powershell  (2026-10-12)

## Corpus Check
- 33 files · ~61,868 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 326 nodes · 790 edges · 16 communities (11 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d8972865`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Session
- app.js
- evalExpr
- smoke.mjs
- createTerminal
- index.js
- progress.js
- export-solutions.mjs
- visuals.js
- LearnPowerShell — Design Notes
- teach.js
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `Session` - 53 edges
2. `PSObject` - 25 edges
3. `evalExpr()` - 23 edges
4. `onLevelSolved()` - 19 edges
5. `ui()` - 16 edges
6. `createTerminal()` - 16 edges
7. `LearnPowerShell — Design Notes` - 15 edges
8. `handleCommand()` - 14 edges
9. `resolvePath()` - 14 edges
10. `getLevel()` - 14 edges

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

## Communities (16 total, 5 thin omitted)

### Community 0 - "Session"
Cohesion: 0.10
Nodes (27): basename(), CANONICAL, canonicalCmdlet(), clone(), coerce(), compare(), defaultFileSystem(), defaultProcesses() (+19 more)

### Community 1 - "app.js"
Cohesion: 0.09
Nodes (54): askQuiz(), bootCommands, curriculum(), emptyRun(), focusGuide(), handleCommand(), lastRun, onLevelSolved() (+46 more)

### Community 2 - "evalExpr"
Cohesion: 0.19
Nodes (18): balanced(), coerceVal(), compareOp(), equals(), evalAtom(), evalExpr(), expand(), findTopArithmetic() (+10 more)

### Community 3 - "smoke.mjs"
Cohesion: 0.06
Nodes (41): DEPTH_TIERS, SERIES_DEPTHS, describe(), evaluateGoal(), fileExistsOn(), L(), LEVELS, levelsInSeries() (+33 more)

### Community 5 - "createTerminal"
Cohesion: 0.20
Nodes (14): BASE_COMMANDS, createTerminal(), allCompletions(), applyTab(), echoPrompt(), focus(), matchingCommands(), measureText() (+6 more)

### Community 6 - "index.js"
Cohesion: 0.17
Nodes (14): de, en, fa, faLevels, faSeries, applyDocumentLocale(), catalogs, detectLocale() (+6 more)

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

### Community 16 - "teach.js"
Cohesion: 0.47
Nodes (5): escapeHtml(), levelTeachHtml(), TEACH, teachAfterCommand(), teachFromKey()

## Knowledge Gaps
- **72 isolated node(s):** `session`, `lastRun`, `progressMap`, `viz`, `term` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 96 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Session` connect `Session` to `app.js`, `evalExpr`, `smoke.mjs`, `LearnPowerShell — Design Notes`?**
  _High betweenness centrality (0.328) - this node is a cross-community bridge._
- **What connects `session`, `lastRun`, `progressMap` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Session` be split into smaller, more focused modules?**
  _Cohesion score 0.09769335142469471 - nodes in this community are weakly interconnected._
- **Why does `createTerminal()` connect `createTerminal` to `app.js`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09216589861751152 - nodes in this community are weakly interconnected._
- **Should `smoke.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.06290471785383904 - nodes in this community are weakly interconnected._
- **Should `LearnPowerShell — Design Notes` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._