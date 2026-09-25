/**
 * Curriculum solvability checks for the full catalog.
 * Run: node tests/curriculum.mjs
 */

import { Session } from "../assets/js/engine.js";
import { LEVELS, evaluateGoal, getLevel } from "../assets/js/levels.js";

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
  "objects-06": ["Get-Process | Select-Object Name -Unique"],
  "pipeline-01": ["Get-Process | Where-Object CPU -gt 40 | Select-Object Name"],
  "pipeline-02": ["Get-Process | ForEach-Object Name"],
  "pipeline-03": ["Get-Process | ForEach-Object { $_.CPU + 10 }"],
  "pipeline-04": ["Get-Content data\\notes.txt | Select-String Select"],
  "pipeline-05": ["Get-Process | Measure-Object -Property CPU"],
  "discovery-01": ["Get-Help Get-ChildItem"],
  "discovery-02": ["Get-Help about_Objects"],
  "discovery-03": ["Get-Process | Select-Object -First 1 | Get-Member"],
  "discovery-04": ["Get-Command Get-*"],
  "discovery-05": ["Get-ChildItem -Path . -Filter *.txt"],
  "discovery-06": ["Get-Process -Verbose"],
  "language-01": ["$ok = 5 -gt 3"],
  "language-02": ["$flag = (5 -gt 3) -and (2 -lt 4)"],
  "language-03": ["$nums = @(1,2,3)"],
  "language-04": ["$second = @(10,20,30)[1]"],
  "language-05": ["$map = @{ Name = 'web01'; Role = 'Web' }"],
  "language-06": ["$obj = [pscustomobject]@{ Id = 1; Name = 'a' }"],
  "language-07": ['$n = [int]"42"'],
  "language-08": ['Write-Output "n=1"'],
  "flow-01": ["if (10 -gt 5) { $label = 'big' } else { $label = 'small' }"],
  "flow-02": ["$n = 7; if ($n -gt 10) { $band = 'high' } elseif ($n -gt 5) { $band = 'mid' } else { $band = 'low' }"],
  "flow-03": ["switch ('b') { 'a' { $x = 1 } 'b' { $x = 2 } 'c' { $x = 3 } }"],
  "flow-04": ["$total = 0; foreach ($i in 1,2,3) { $total = $total + $i }"],
  "flow-05": ["$c = 0; while ($c -lt 3) { $c = $c + 1 }"],
  "flow-06": ["$sum = 0; foreach ($i in 1,2,3,4,5) { if ($i % 2 -eq 0) { continue }; $sum = $sum + $i }"],
  "functions-01": ["function Get-Hello { 'hi' }"],
  "functions-02": ["function Get-Double { param($n) $n * 2 }; Get-Double 21"],
  "functions-03": ["function Add-One { [CmdletBinding()] param($n) $n + 1 }; Add-One 1"],
  "functions-04": ["function Get-Name { process { $_.Name } }; Get-Process | Select-Object -First 1 | Get-Name"],
  "functions-05": ["$p = @{ Filter = '*.txt' }; Get-ChildItem @p"],
  "errors-01": ["try { Get-Content missing.txt } catch { $err = $_.Exception.Message }"],
  "errors-02": ["try { throw 'boom' } catch { $msg = $_.Exception.Message }"],
  "errors-03": ["try { Get-Content missing.txt -ErrorAction Stop } catch { $m = $_.Exception.Message }"],
  "errors-04": ["$ErrorActionPreference = 'Stop'; $pref = $ErrorActionPreference"],
  "errors-05": ["Write-Warning careful"],
  "errors-06": ["Write-Error oops"],
  "scope-01": ["$localOnly = 1"],
  "scope-02": ["$script:shared = 7; $back = $script:shared"],
  "scope-03": ["$global:allUsers = 9"],
  "scope-04": ["Set-Variable -Name ping -Value 1 -Scope Global"],
  "data-01": ["$rows = Import-Csv data\\servers.csv"],
  "data-02": ["Get-Process | Select-Object Name, Id | Export-Csv out.csv"],
  "data-03": ["Get-Process | Select-Object -First 1 | Select-Object Name, Id | ConvertTo-Json"],
  "data-04": ["$j = ConvertFrom-Json '{\"a\":1}'"],
  "data-05": ["$raw = Get-Content todo.txt -Raw"],
  "data-06": ["$p = Join-Path C:\\lab data"],
  "providers-01": ["Get-PSDrive"],
  "providers-02": ["Get-ChildItem Env:"],
  "providers-03": ["$env:LAB_MODE = 'dev'"],
  "providers-04": ["Get-ChildItem HKLM:\\Software"],
  "providers-05": ["Get-ChildItem Cert:\\CurrentUser\\My"],
  "remoting-01": ["$r = Invoke-Command -ComputerName web01 -ScriptBlock { Get-Location }"],
  "remoting-02": ["Invoke-Command -ComputerName db01 -ScriptBlock { Get-Process }"],
  "remoting-03": ["$s = New-PSSession -ComputerName web01"],
  "remoting-04": ["$s = New-PSSession -ComputerName web01; Invoke-Command -Session $s -ScriptBlock { Get-Date }"],
  "remoting-05": ["$c = Get-Credential -UserName admin"],
  "modules-01": ["Get-Module"],
  "modules-02": ["Import-Module Inventory"],
  "modules-03": ["Import-Module Inventory; Get-Inventory"],
  "modules-04": ["Import-Module Inventory; Get-Command -Module Inventory"],
  "modules-05": ["Import-Module Inventory; Remove-Module Inventory"],
  "jobs-01": ["$job = Start-Job { 42 }"],
  "jobs-02": ["$job = Start-Job { 1 }; Get-Job"],
  "jobs-03": ["$job = Start-Job { 7 }; $out = Receive-Job $job"],
  "jobs-04": ["1,2 | ForEach-Object -Parallel { $_ }"],
  "jobs-05": ["$os = Get-CimInstance Win32_OperatingSystem"],
  "security-01": ["Get-ExecutionPolicy"],
  "security-02": ["Set-ExecutionPolicy RemoteSigned"],
  "security-03": ["$profilePath = $PROFILE"],
  "security-04": ["Remove-Item todo.txt -WhatIf"],
  "security-05": ["Get-Help about_ConstrainedLanguage"],
  "formatting-01": ["Get-Process | Format-Table Name, CPU"],
  "formatting-02": ["Get-Process | Select-Object -First 1 | Format-List Name, Id"],
  "formatting-03": ["Get-ChildItem | Out-File files.txt"],
  "formatting-04": ["Get-Service | Out-String"],
  "formatting-05": ["Get-Process | Select-Object Name, Id"],
  "remix-01": ["Get-Service | Where-Object Status -eq Running"],
  "remix-02": ["Get-Process | Sort-Object CPU -Descending | Select-Object Name, CPU -First 2"],
  "remix-03": ["$rows = Import-Csv data\\servers.csv; $rows | Where-Object Role -eq Web | Export-Csv web.csv"],
  "remix-04": ["function Get-TopCPU { Get-Process | Sort-Object CPU -Descending | Select-Object -First 1 -ExpandProperty Name }; Get-TopCPU"],
  "remix-05": ["Get-Process | Measure-Object; Get-Process | Select-Object -First 1"],
  "remix-06": ["$cap = Invoke-Command -ComputerName web01 -ScriptBlock { Get-Process | Select-Object -First 1 }"],
  "language-09": ['$s = "n={0}" -f 7'],
  "language-10": ["$r = 1..3"],
  "language-11": ["$isWeb = 'web01' -match '^web'"],
  "language-12": ["$n = 1; $n += 2"],
  "language-13": ['Write-Output "line1`nline2"'],
  "functions-06": ["function Get-Need { param([Parameter(Mandatory=$true)]$Name) $Name }; Get-Need x"],
  "functions-07": ["function Get-Size { param([ValidateSet('S','M')]$s) $s }; Get-Size S"],
  "functions-08": ["Get-Process -OutVariable procs | Out-Null; $c = $procs.Count"],
  "errors-07": ["Get-Content missing.txt -ErrorVariable ev -ErrorAction SilentlyContinue; $n = $ev.Count"],
  "errors-08": ["try { throw 'x' } catch { $e = 1 } finally { $done = 1 }"],
  "remoting-06": ["Invoke-Command -ComputerName web01,db01 -ScriptBlock { Get-Date }"],
  "remoting-07": ["$envName = 'web01'; Invoke-Command -ComputerName $envName -ScriptBlock { $using:envName }"],
  "remoting-08": ["Enter-PSSession -ComputerName web01; Exit-PSSession"],
  "jobs-06": ["$job = Start-Job -Name t1 { 1 }; Wait-Job $job"],
  "jobs-07": ["$job = Start-Job { 1 }; Remove-Job $job"],
  "jobs-08": ["$job = Start-Job { 9 }; Receive-Job $job -Keep"],
  "data-07": ["Get-Location | Out-File files.txt -Append"],
  "data-08": ["Get-Process | Select-Object Name | Tee-Object tee.txt"],
  "data-09": ["$js = Get-Process | Select-Object -First 1 | Select-Object Name, Id | ConvertTo-Json"],
  "providers-06": ["Push-Location docs; Pop-Location"],
  "providers-07": ["Set-Location Env:; Get-ChildItem"],
  "security-06": ["Get-Help about_Execution_Policies"],
  "security-07": ["Get-AuthenticodeSignature profile.ps1"],
  "formatting-06": ["Get-Process | Format-Table Name, Id -AutoSize"],
  "formatting-07": ["Get-Location | Out-File loc.txt"],
  "discovery-07": ["Get-Help about_Arrays"],
  "discovery-08": ["Get-Help about_Operators"],
  "discovery-09": ["Get-Command Get-ChildItem -Syntax"],
  "remix-07": ["function Get-Web { Import-Csv data\\servers.csv | Where-Object Role -eq Web }; Get-Web | Export-Csv web2.csv"],
  "remix-08": ["Invoke-Command -ComputerName web01,db01 -ScriptBlock { Get-Process | Measure-Object }"],
  "remix-09": ["$job = Start-Job { 21 }; $got = Receive-Job $job; $final = $got * 2"],
  "remix-10": ["try { Import-Csv missing.csv } catch { $err = $_.Exception.Message }; Get-Process | Select-Object Name, Id | Export-Csv report.csv"],
  "remix-11": ["Get-Service | Where-Object Name -like 'Win*' | Select-Object Name"],
  "remix-12": ["function Get-Report { Get-Process | Measure-Object -Property CPU }; $rep = Get-Report"],
  "adv-01": ['$n = 8; $msg = "n=$($n)"'],
  "adv-02": ["$v = $x ?? 5"],
  "adv-03": ["$label = (1 -eq 1) ? 'yes' : 'no'"],
  "adv-04": ["Get-Process | Select-Object -First 1 | ForEach-Object { $PSItem.Name }"],
  "adv-05": ["class Point { [int]$X }; $p = [Point]::new()"],
  "adv-06": ["enum Color { Green }; $c = [Color]::Green"],
  "adv-07": ["$t = Measure-Command { Get-Process }; $ms = $t.TotalMilliseconds"],
  "adv-08": ["$sum = 0; foreach ($i in 1..50) { $sum += $i }"],
  "adv-09": ["New-Module { function Get-Zed { 'z' } } | Import-Module; Get-Zed"],
  "adv-10": ["New-Module { function Get-Pub { 1 }; function Get-Priv { 2 }; Export-ModuleMember Get-Pub } | Import-Module"],
  "adv-11": ["$net = ipconfig /all"],
  "adv-12": ["ipconfig /all 2>&1 | Select-Object -First 1"],
  "adv-13": ["$bp = Set-PSBreakpoint -Line 1"],
  "adv-14": ["$stack = Get-PSCallStack"],
  "adv-15": ["try { throw 'z' } catch { }; $Error.Clear(); $n = $Error.Count"],
  "adv-16": ["Write-Output hello"],
  "adv-17": ["$n = 1 + 1"],
  "adv-18": ["Get-Help about_Functions_Advanced_Parameters"],
  "adv-19": ["class Box { [int]$Size }; $b = [Box]::new(); $b.Size = 3"],
  "adv-20": ["$job = Start-Job { Get-Process | Measure-Object }; $m = Receive-Job $job"],
  "mst-01": ["$flag = (1 -eq 1)"],
  "mst-02": ["$a = @(1); $a += 2"],
  "mst-03": ["Get-Process | Select-Object Name | Measure-Object | ForEach-Object { $c = $_.Count }"],
  "mst-04": ["$script:shared = 9; $outer = $script:shared"],
  "mst-05": ["try { Get-Content missing.txt -ErrorAction Stop } catch { $msg = 'caught' }"],
  "mst-06": ["function Get-TopCPU { Get-Process | Sort-Object CPU -Descending | Select-Object -First 1 -ExpandProperty Name }; $name = Get-TopCPU"],
  "mst-07": ["function Get-Running { Get-Service | Where-Object Status -eq Running }; $rs = Get-Running"],
  "mst-08": ["$web = Import-Csv data\\servers.csv | Where-Object Role -eq Web"],
  "mst-09": ["function Remove-Todo { param([switch]$WhatIf) Remove-Item todo.txt -WhatIf:$WhatIf }; Remove-Todo -WhatIf"],
  "mst-10": ["Get-Process | Where-Object CPU -gt 30 | Select-Object Name | Measure-Object | ForEach-Object { $n = $_.Count }"],
  "mst-11": ["try { Import-Csv missing.csv } catch { $recovered = 1 }; Get-Process | Select-Object Name | Export-Csv report3.csv"],
  "mst-12": ["function Get-ProcCount { Get-Process | Measure-Object -Property Id }; $m = Get-ProcCount; $c = $m.Count"],
};

let failed = 0;
for (const [id, cmds] of Object.entries(solutions)) {
  const r = solve(id, cmds);
  if (r.ok) console.log(`ok   ${id}`);
  else {
    failed += 1;
    console.error(`FAIL ${id}`, JSON.stringify(r.reason));
  }
}

const missing = LEVELS.filter((l) => !solutions[l.id]);
if (missing.length) {
  console.error("No solution for", missing.map((l) => l.id));
  failed += missing.length;
}

console.log(
  `\n${Object.keys(solutions).length - failed}/${LEVELS.length} levels solved (${failed} failed)`
);
process.exit(failed ? 1 : 0);
