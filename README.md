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

18 series · 148 levels — each with What / Why / mental model. Official
solutions are also checked by `labs/verify.ps1` on real pwsh.

1. **Getting Started** — location, listing, reading, moving
2. **Objects** — project, filter, sort, measure
3. **Pipeline** — multi-stage pipes and `ForEach-Object`
4. **Discovery & Help** — Get-Help, Get-Member, Get-Command, about_*
5. **Language & Types** — operators, arrays, hashtables, PSCustomObject, casting
6. **Flow Control** — if / switch / foreach / while
7. **Functions & Tools** — param, CmdletBinding, process blocks, splatting
8. **Errors & Streams** — try/catch/finally, ErrorVariable, streams
9. **Scope** — local / script / global
10. **Files & Data** — CSV, JSON, Tee, Out-File
11. **Providers** — Env, HKLM, Cert, Push/Pop-Location
12. **Remoting** — fan-out, PSSession, `$using:`
13. **Modules** — Import/Remove, Export-ModuleMember, ListAvailable
14. **Jobs & CIM** — Start/Wait/Receive/Remove-Job, CIM
15. **Security & Policy** — execution policy, Authenticode, -WhatIf
16. **Formatting & Export** — Format placement, Out-File
17. **Remix** — composition, capstones, golf
18. **Advanced & Expert** — class/enum, `$PSItem`, `??`, ternary, `$( )`,
    Measure-Command, breakpoints, native commands, New-Module

## Project layout

```
index.html                 app shell
assets/css/app.css         layout and visual system
assets/js/engine.js        simulated PowerShell session + cmdlets
assets/js/lang.js          expressions, operators, control-flow helpers
assets/js/levels.js        re-exports catalog
assets/js/levels-catalog.js 94 levels, goals, teaching notes
assets/js/visuals.js       pipeline + session renderers
assets/js/terminal.js      shell UI (history, Tab, ghost text)
assets/js/teach.js         after-command "why" blocks
assets/js/progress.js      localStorage + cookie persistence
assets/js/share.js         LinkedIn / X / Facebook share payloads
assets/js/confetti.js      celebration effects
assets/js/app.js           wiring, modes, modals
tests/smoke.mjs            engine smoke tests (Node)
tests/curriculum.mjs       every level solvable (Node)
DESIGN.md                  design notes
LICENSE                    Apache-2.0
```

## Tests

```powershell
node tests/smoke.mjs
node tests/curriculum.mjs
pwsh -NoProfile -File labs/verify.ps1
```

`labs/verify.ps1` runs the same idioms on **real** PowerShell — the fidelity
gate when the browser simulator is the learning UI.

## License

Apache License 2.0 — see [LICENSE](LICENSE).

## Scope

This is a **teaching simulator**, not a real `pwsh` host. It covers the
language idioms that matter for the pipeline mental model. It does not run
scripts, remoting, DSC, classes, or arbitrary .NET.
