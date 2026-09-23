# LearnPowerShell — Design Notes

Internal design document for the interactive PowerShell tutorial game
inspired by [learnGitBranching](https://github.com/pcottle/learnGitBranching).

## Product thesis

LearnGitBranching teaches git by making the invisible commit graph visible
while you type commands. PowerShell’s CLI hides a different structure: the
**object pipeline**, session variables, and the provider filesystem.

LearnPowerShell is that same game loop for PowerShell:

- type real PowerShell-shaped commands
- watch objects flow through the pipeline
- complete levels against a stated goal
- keep a command-count score (PowerShell golf)
- `undo` / `reset` / `levels` / `help`

It is **not** a git clone with PowerShell skin. Branching is a git concept.
The PowerShell analog of the commit tree is the pipeline + session panel.

## Style anchor

Windows Terminal / Cascadia-era Microsoft terminal product chrome, crossed
with learnGitBranching’s dual-pane game HUD (live visualizer above, shell
below, level goal always visible).

Feel: a serious learning tool that ships with the OS — cool blue-slate,
dense information, monospace-first — not a SaaS marketing site.

## Palette

| Token            | Hex       | Role                                      |
|------------------|-----------|-------------------------------------------|
| `--bg`           | `#0C111B` | App background (blue-black)               |
| `--panel`        | `#141B2A` | Primary panels (visualizer, terminal)     |
| `--elevated`     | `#1C2538` | Cards, inputs, hover surfaces             |
| `--ink`          | `#E8EEF7` | Primary text                              |
| `--muted`        | `#8B9BB4` | Secondary text, meta                      |
| `--accent`       | `#2B7FFF` | PowerShell blue — primary action, focus   |
| `--accent-soft`  | `#5B9DFF` | Links, selected states                    |
| `--flow`         | `#2DD4BF` | Pipeline connectors, object stream        |
| `--object`       | `#F5C542` | Object tokens (PSObject gold)             |
| `--success`      | `#34D399` | Goal met, success                         |
| `--danger`       | `#F87171` | Errors                                    |
| `--warn`         | `#F59E0B` | Warnings, par-score edges                 |

No cream/terracotta. No neon-on-black. No decorative gradients.

## Typography

| Role              | Stack                                                        |
|-------------------|--------------------------------------------------------------|
| UI chrome         | `"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif` |
| Terminal / code   | `"Cascadia Code", "Cascadia Mono", Consolas, monospace`       |
| Object labels     | same mono, 11–12px                                           |

Scale: 11 / 12 / 13 / 14 / 16 / 20 / 28. Weights: 400 body, 600 titles,
700 only for the product wordmark. Sentence case. No ALL-CAPS eyebrows.

## Layout system

Full-viewport app shell. 8px spacing rhythm. Max content width none —
this is a tool, not a landing page.

```
┌────────────────────────────────────────────────────────────┐
│ wordmark          mode · progress · command counter        │ 40px
├───────────────────────────────────┬────────────────────────┤
│                                   │  goal / level panel    │
│     PIPELINE VISUALIZER           │  (title, brief,        │
│     objects → cmdlets → output    │   win checks, hint)    │
│                                   ├────────────────────────┤
│                                   │  SESSION               │
│                                   │  cwd · $vars · files   │
├───────────────────────────────────┴────────────────────────┤
│  terminal scrollback                                       │
│  PS C:\lab> █                                               │  ~38vh
└────────────────────────────────────────────────────────────┘
```

Level browser is a modal overlay (same as LGB’s `levels` dialog).
Level intro / success use the same modal family.

Responsive: below 900px stack visualizer → goal → session → terminal.
Keyboard focus rings on every interactive control. `prefers-reduced-motion`
disables pipeline animation.

## Signature moments

1. **Pipeline burst** — after a command runs, object tokens stream along
   the connector through each cmdlet node (420ms, staggered). This is the
   product’s one loud animation.
2. **Goal lock-in** — win conditions check off in sequence with a 80ms
   stagger, then a quiet success bar (not confetti).

## Game model (mirrors LGB)

| LGB                    | LearnPowerShell                      |
|------------------------|--------------------------------------|
| commit tree visualizer | pipeline + session visualizer        |
| git sandbox            | PowerShell sandbox                   |
| `levels`               | `levels` (series tabs)               |
| goal tree match        | goal predicates (output / state / usage) |
| command golf           | command golf (par per level)         |
| `undo` / `reset`       | `undo` / `reset`                     |
| level builder          | `build level` → JSON export          |
| permalinks `?command=` | same                                 |

## Curriculum (level series)

1. **intro** — location, listing, reading, moving
2. **objects** — process objects, properties, Select / Where / Sort / Measure
3. **pipeline** — multi-stage pipes, ForEach-Object, composition
4. **session** — variables, files, providers
5. **remix** — multi-command challenges + golf

Each level: `{ id, series, name, brief, hint, par, start, goal }`.
`goal` predicates: `commandsUsed`, `outputMatches`, `pathIs`, `variableIs`,
`filesMatch`, `usedCmdlets`, `pipelineDepth`.

## Engine

Client-side simulated PowerShell (no real `pwsh` execution):

- tokenizer for quoted strings, parameters, pipeline `|`
- cmdlet table with aliases (`gci`, `cd`, `%`, `?`, …)
- virtual filesystem + process/service tables
- `$variables`, simple subexpressions, string interpolation (basic)
- history, `undo` stack (full session snapshots)

## Non-goals (v1)

- Real remoting / DSC / classes / full language parser
- Network calls
- Account system
- Exact Format-Table pretty-printer fidelity

## Build

Static multi-file web app (no bundler). Entry: `index.html`.
Open or serve as static files. Tests: lightweight engine unit checks in
`tests/engine.test.html` (browser) — no npm required to play.
