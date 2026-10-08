# LearnPowerShell — Design Notes

Internal design document for the interactive PowerShell tutorial game.

## Product thesis

PowerShell's CLI hides the structure that matters: the **object pipeline**,
session variables, and the provider filesystem. LearnPowerShell makes that
structure visible while you type commands.

Game loop:

- type real PowerShell-shaped commands
- watch objects flow through the pipeline
- complete levels against a stated goal
- keep a command-count score (PowerShell golf)
- celebrate and share progress
- `undo` / `reset` / `levels` / `help` / `steps`

## Style anchor

Windows Terminal / Cascadia-era Microsoft terminal product chrome, crossed
with a dual-pane learning HUD (live visualizer above, shell below, level goal
always visible).

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
| neon current     | `#FF8C1A` | Active goal step (orange neon ring)       |

No cream/terracotta. No neon-on-black as a whole theme. No decorative gradients.

## Typography

| Role              | Stack                                                        |
|-------------------|--------------------------------------------------------------|
| UI chrome         | `"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif` |
| Terminal / code   | `"Cascadia Code", "Cascadia Mono", Consolas, monospace`       |
| Object labels     | same mono, 11–12px                                           |

Scale: 11 / 12 / 13 / 14 / 16 / 20 / 28. Weights: 400 body, 600 titles,
700 only for the product wordmark. Sentence case.

## Layout system

Full-viewport app shell. 8px spacing rhythm. Tool density, not landing page.

```
┌────────────────────────────────────────────────────────────┐
│ wordmark          mode · progress · command counter        │ 44px
├───────────────────────────────────┬────────────────────────┤
│                                   │  goal / level panel    │
│     PIPELINE VISUALIZER           │  title, brief, hint    │
│     objects → cmdlets → output    │  win checks (neon)     │
│                                   │  teaching boxes        │
│                                   ├────────────────────────┤
│                                   │  SESSION               │
│                                   │  cwd · $vars · files   │
├───────────────────────────────────┴────────────────────────┤
│  terminal scrollback                                       │
│  hint bar                                                  │
│  PS C:\lab> █   (ghost word + caret)                       │  ~38vh
└────────────────────────────────────────────────────────────┘
```

Level browser and celebration use the modal family.

Responsive: below 900px stack visualizer → goal → session → terminal.
Keyboard focus rings on every interactive control. `prefers-reduced-motion`
disables pipeline animation and neon pulse.

## Signature moments

1. **Pipeline burst** — after a command runs, object tokens stream along
   the connector through each cmdlet node (420ms, staggered).
2. **Neon current step** — first unmet goal check gets an orange neon ring.
3. **Celebrate** — confetti + fanfare + share card with learned curriculum.

## Terminal behavior (must match a real shell)

- Empty input: placeholder only (never stacked with ghost text).
- Ghost text: only the suffix of the *current word* (or the next word after space).
- Tab: complete current word; repeated Tab cycles candidates.
- ArrowUp / ArrowDown: history with draft restore.
- Caret stays in the command box after every submit and after modal close.

## Progress memory

`localStorage` + cookie (`learn_powershell_progress`), merged on load.
Share payloads list every solved level (series: name) plus the live URL.

## Curriculum (level series)

1. **intro** — location, listing, reading, moving
2. **objects** — process objects, properties, Select / Where / Sort / Measure
3. **pipeline** — multi-stage pipes, ForEach-Object, composition
4. **session** — variables, files, providers
5. **remix** — multi-command challenges + golf

Each level: `{ id, series, name, brief, hint, par, goal, teach, learning }`.
`goal` predicates: `commandsMax`, `usedCmdlets`, `pathIs`, `variableIs`,
`fileExists`, `fileMissing`, `fileContains`, `outputIncludes`, `outputCount`,
`pipelineCmdlets`.

## Cognitive Depth Ladder (ELI5 to ELIPHD)

To avoid cognitive fatigue and jargon alienation while preserving deep engineering rigor, the pedagogical surface is decoupled into 5 interactive cognitive tiers (`assets/js/depth.js`):

1. **ELI5** (Kindergarten / Physical Metaphors): Zero jargon. Every concept is mapped to an everyday tangible artifact (conveyor belts, Lego blocks, luggage carousels, sealed envelopes, factory inspection gates, flight simulators, crash test dummies).
2. **ELI10** (Primary / Grammar & Mechanics): Command structure, `Verb-Noun` taxonomy, switch flags, line pipes `|`, path navigation.
3. **ELI15** (Secondary / Coding & Data): Objects vs strings, streaming execution, scriptblocks, hashtables, parameter binding mechanics.
4. **ELI20** (Undergraduate & DevOps / Enterprise Engineering): Production idempotency, error streams, CI/CD pipeline verification, automated test suites (Pester), security defense-in-depth.
5. **ELIPHD** (Doctorate / Runtime Internals): Abstract Syntax Tree (`[Language.Parser]`), Extended Type System (ETS) metadata adapters, DLR expression trees, CLR reflection, Win32 / Roslyn compilation, thread runspaces, DPAPI/CNG cryptography, ETW/AMSI telemetry.

UI Integration:
- In the `.dock` learning guide, users can toggle between depth tiers with quick pills (`🧸 ELI5`, `🎒 ELI10`, `💻 ELI15`, `🚀 ELI20`, `🔬 ELIPHD`).
- Users can toggle between **Focused View** (single selected tier) and **Full 5-Tier Spectrum Ladder** (stacked simultaneous view).
- Preferred depth tier is persisted in `localStorage` (`learnpowershell-depth`).


## Engine

Client-side simulated PowerShell (no real `pwsh` execution):

- tokenizer for quoted strings, parameters, pipeline `|`
- cmdlet table with aliases
- virtual filesystem + process/service tables
- `$variables`, simple assignment, string expansion
- history, `undo` stack (full session snapshots)

## Non-goals (v1)

- Real remoting / DSC / classes / full language parser
- Network calls
- Account system
- Exact Format-Table pretty-printer fidelity

## Build

Static multi-file web app (no bundler). Entry: `index.html`.
Tests: `tests/smoke.mjs`, `tests/curriculum.mjs` (Node).

## License

Apache License 2.0.
