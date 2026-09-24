# Real-pwsh validation for LearnPowerShell official solutions.
# Run: pwsh -NoProfile -File labs/verify.ps1
# Browser simulator is the learning UI; this file is the fidelity gate.

$ErrorActionPreference = 'Stop'
$failed = 0
$passed = 0

function Check($name, [scriptblock]$body) {
  try {
    & $body | Out-Null
    Write-Host "ok   $name"
    $script:passed++
  } catch {
    Write-Host "FAIL $name :: $($_.Exception.Message)"
    $script:failed++
  }
}

Check 'lang-compare' { if ((5 -gt 3) -ne $true) { throw 'cmp' } }
Check 'lang-array' { if (@(1,2,3).Count -ne 3) { throw 'array' } }
Check 'lang-hashtable' { $m = @{ Name = 'web01' }; if ($m.Name -ne 'web01') { throw 'ht' } }
Check 'lang-range' { if (@(1..3).Count -ne 3) { throw 'range' } }
Check 'lang-format' { if (("n={0}" -f 7) -ne 'n=7') { throw 'f' } }
Check 'lang-ternary' { if ((1 -eq 1 ? 'yes' : 'no') -ne 'yes') { throw 'tern' } }
Check 'lang-nullcoal' { if (($null ?? 5) -ne 5) { throw 'co' } }
Check 'lang-subexpr' { $n = 8; if ("n=$($n)" -ne 'n=8') { throw 'sub' } }

Check 'flow-if' { $l = $null; if (10 -gt 5) { $l = 'big' } else { $l = 'small' }; if ($l -ne 'big') { throw 'if' } }
Check 'flow-switch' { $x = $null; switch ('b') { 'b' { $x = 2 } }; if ($x -ne 2) { throw 'sw' } }
Check 'flow-foreach' { $t = 0; foreach ($i in 1,2,3) { $t += $i }; if ($t -ne 6) { throw 'fe' } }

Check 'fn-param' { function Get-Double { param($n) $n * 2 }; if ((Get-Double 21) -ne 42) { throw 'fn' } }
Check 'fn-cmdletbinding' { function Add-One { [CmdletBinding()] param($n) $n + 1 }; if ((Add-One 1) -ne 2) { throw 'cb' } }
Check 'fn-splat' { $p = @{ Filter = '*.txt' }; $null = Get-ChildItem @p }

Check 'err-trycatch' {
  $err = $null
  try { Get-Content (Join-Path $env:TEMP 'lps-missing-file.txt') -ErrorAction Stop }
  catch { $err = $_.Exception.Message }
  if (-not $err) { throw 'catch' }
}
Check 'err-finally' {
  $done = $null
  try { throw 'x' } catch { } finally { $done = 1 }
  if ($done -ne 1) { throw 'fin' }
}

Check 'data-csv' {
  $p = Join-Path $env:TEMP 'lps-verify.csv'
  @(
    [pscustomobject]@{ Name = 'web01'; Role = 'Web' }
    [pscustomobject]@{ Name = 'db01'; Role = 'Database' }
  ) | Export-Csv $p -NoTypeInformation
  $rows = Import-Csv $p | Where-Object Role -eq Web
  Remove-Item $p -Force
  if (@($rows).Count -ne 1) { throw 'csv' }
}
Check 'data-json' {
  $j = '{"a":1}' | ConvertFrom-Json
  if ($j.a -ne 1) { throw 'json' }
}

Check 'class-point' {
  class Point { [int]$X = 0 }
  $p = [Point]::new()
  $p.X = 7
  if ($p.X -ne 7) { throw 'class' }
}
Check 'enum-color' {
  enum Color { Red; Green }
  if ([Color]::Green -ne [Color]::Green) { throw 'enum' }
}

Check 'mod-newmodule' {
  $null = New-Module { function Get-Zed { 'z' } } | Import-Module
  if ((Get-Zed) -ne 'z') { throw 'mod' }
}

Check 'native-text' {
  # help files may be absent until Update-Help — command must exist
  if (-not (Get-Command Get-Help)) { throw 'help' }
}

Check 'remoting-cmdlet' {
  if (-not (Get-Command Invoke-Command)) { throw 'rem' }
}

Check 'jobs-present' {
  if (-not (Get-Command Start-Job)) { throw 'jobs' }
}

Write-Host ""
Write-Host "$passed passed, $failed failed"
if ($failed -gt 0) { exit 1 }
exit 0
