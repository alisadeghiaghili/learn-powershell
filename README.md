# LearnPowerShell

An interactive PowerShell pipeline visualizer, sandbox, and series of
educational levels. Learn objects, the pipeline, and session state until the
language clicks.

**Live on GitHub Pages:** https://alisadeghiaghili.github.io/learn-powershell/

## Run it

Static site. No build step.

```powershell
# from this folder
python -m http.server 5173
# open http://localhost:5173
```

Or open `index.html` in a browser (module scripts need a local origin in some
browsers — prefer the tiny static server above).

Permalinks:

- `?NODEMO` — skip the welcome dialog
- `?command=Get-Process;%20levels` — run commands on load
- `?level=intro-01` — start a level immediately

## What you get

| Piece | What it is |
|-------|------------|
| Sandbox | Type PowerShell-shaped commands against a virtual lab machine |
| Pipeline visualizer | Objects stream through cmdlet stages as you run |
| Session panel | Live `cwd`, `$variables`, and directory listing |
| Teaching notes | Why each command matters — mental models, not just syntax |
| Levels | Guided challenges with win conditions and a par score |
| Celebrate + share | Clear a level, then post progress to LinkedIn / X / Facebook |
| Progress memory | localStorage + cookie — resume a week later |
| Terminal habits | History (↑/↓), word-by-word Tab, caret stays in the box |
| `undo` / `reset` | Snapshot restore for the whole session |
| `build level` / `import level` | Export / load custom level JSON |

## Commands to know

```
help          levels        hint          goal          steps
undo          reset         sandbox       curriculum
```

Simulated cmdlets include `Get-Location`, `Set-Location`, `Get-ChildItem`,
`Get-Content`, `Get-Process`, `Get-Service`, `Select-Object`, `Where-Object`,
`ForEach-Object`, `Sort-Object`, `Measure-Object`, `Format-Table`,
`Format-List`, `Select-String`, `New-Item`, `Set-Content`, `Add-Content`,
`Remove-Item`, `Test-Path`, `Write-Output`, `Get-Variable`, `Set-Variable`,
plus common aliases (`gci`, `cd`, `%`, `?`, …).

Pipelines pass **objects**, not text:

```powershell
Get-Process | Where-Object CPU -gt 50 | Select-Object Name, CPU
```

Assignments store objects:

```powershell
$procs = Get-Process
```

## Curriculum

1. **Getting Started** — location, listing, reading, moving
2. **Objects** — project, filter, sort, measure
3. **Pipeline** — multi-stage pipes and `ForEach-Object`
4. **Session & Files** — variables and filesystem verbs
5. **Remix** — composition and golf

Each level teaches what is happening, why it matters, and a mental model.

## Project layout

```
index.html              app shell
assets/css/app.css      layout and visual system
assets/js/engine.js     simulated PowerShell session
assets/js/levels.js     level data + goal evaluator + teaching notes
assets/js/visuals.js    pipeline + session renderers
assets/js/terminal.js   shell UI (history, Tab, ghost text)
assets/js/teach.js      after-command "why" blocks
assets/js/progress.js   localStorage + cookie persistence
assets/js/share.js      LinkedIn / X / Facebook share payloads
assets/js/confetti.js   celebration effects
assets/js/app.js        wiring, modes, modals
tests/smoke.mjs         engine smoke tests (Node)
tests/curriculum.mjs    every level is solvable (Node)
DESIGN.md               design notes
```

## Tests

```powershell
node tests/smoke.mjs
node tests/curriculum.mjs
```

## License

Apache License 2.0 — see [LICENSE](LICENSE).

## Scope

This is a **teaching simulator**, not a real `pwsh` host. It covers the
language idioms that matter for the pipeline mental model. It does not run
scripts, remoting, DSC, classes, or arbitrary .NET.
