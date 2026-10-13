# Graph Report - learn-powershell  (2026-10-12)

## Corpus Check
- 33 files · ~64,037 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 330 nodes · 802 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `75210523`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Session
- app.js
- engine.js
- smoke.mjs
- dialog.js
- createTerminal
- index.js
- share.js
- export-solutions.mjs
- visuals.js
- LearnPowerShell — Design Notes
- levels-catalog.js
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `Session` - 53 edges
2. `PSObject` - 25 edges
3. `evalExpr()` - 23 edges
4. `onLevelSolved()` - 22 edges
5. `ui()` - 16 edges
6. `createTerminal()` - 16 edges
7. `handleCommand()` - 15 edges
8. `LearnPowerShell — Design Notes` - 15 edges
9. `showLevels()` - 14 edges
10. `resolvePath()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `solve()` --calls--> `Session`  [EXTRACTED]
  tests/curriculum.mjs → assets/js/engine.js
- `solve()` --calls--> `getLevel()`  [EXTRACTED]
  tests/curriculum.mjs → assets/js/levels-catalog.js
- `solve()` --calls--> `evaluateGoal()`  [EXTRACTED]
  tests/curriculum.mjs → assets/js/levels-catalog.js
- `curriculum()` --indirect_call--> `localizeSeriesTitle()`  [INFERRED]
  assets/js/app.js → assets/js/i18n/index.js
- `renderDock()` --calls--> `evaluateGoal()`  [EXTRACTED]
  assets/js/app.js → assets/js/levels-catalog.js

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "Session"
Cohesion: 0.15
Nodes (11): basename(), clone(), coerce(), compare(), fileToItem(), getNode(), likeMatch(), parentPath() (+3 more)

### Community 1 - "app.js"
Cohesion: 0.10
Nodes (51): askQuiz(), bootCommands, curriculum(), emptyRun(), focusGuide(), handleCommand(), lastRun, onLevelSolved() (+43 more)

### Community 2 - "engine.js"
Cohesion: 0.10
Nodes (34): CANONICAL, canonicalCmdlet(), defaultFileSystem(), defaultProcesses(), defaultServices(), expand(), formatOutput(), helpText() (+26 more)

### Community 3 - "smoke.mjs"
Cohesion: 0.08
Nodes (25): DEPTH_TIERS, SERIES_DEPTHS, goalResult, introDepthEn, introDepthFa, level, node, r1 (+17 more)

### Community 4 - "dialog.js"
Cohesion: 0.53
Nodes (8): isListItem(), isTableRow(), isTableSeparator(), renderInline(), renderListItem(), renderProse(), renderTable(), splitTableRow()

### Community 5 - "createTerminal"
Cohesion: 0.20
Nodes (14): BASE_COMMANDS, createTerminal(), allCompletions(), applyTab(), echoPrompt(), focus(), matchingCommands(), measureText() (+6 more)

### Community 6 - "index.js"
Cohesion: 0.18
Nodes (13): de, en, fa, faLevels, faSeries, applyDocumentLocale(), catalogs, detectLocale() (+5 more)

### Community 7 - "share.js"
Cohesion: 0.15
Nodes (18): COOKIE_KEY, loadProgress(), parseBlob(), readCookie(), saveProgress(), STORAGE_KEY, writeCookie(), buildShareTargets() (+10 more)

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
Cohesion: 0.14
Nodes (20): describe(), evaluateGoal(), fileExistsOn(), L(), LEVELS, lookupVar(), makeMindset(), matchExpected() (+12 more)

## Knowledge Gaps
- **73 isolated node(s):** `session`, `lastRun`, `progressMap`, `viz`, `term` (+68 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 97 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Session` connect `Session` to `app.js`, `engine.js`, `smoke.mjs`, `LearnPowerShell — Design Notes`, `levels-catalog.js`?**
  _High betweenness centrality (0.326) - this node is a cross-community bridge._
- **What connects `session`, `lastRun`, `progressMap` to the rest of the system?**
  _73 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Session` be split into smaller, more focused modules?**
  _Cohesion score 0.14904862579281183 - nodes in this community are weakly interconnected._
- **Why does `createTerminal()` connect `createTerminal` to `app.js`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09935710111046171 - nodes in this community are weakly interconnected._
- **Should `engine.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10204081632653061 - nodes in this community are weakly interconnected._
- **Should `smoke.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.07671957671957672 - nodes in this community are weakly interconnected._