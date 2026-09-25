<#
.SYNOPSIS
  Run EVERY official LearnPowerShell solution on real PowerShell.

.DESCRIPTION
  Fidelity gate for the critical score. Each solution runs in a fresh
  process-like scope: fresh temp lab, location reset, ErrorActionPreference
  Continue, expected-throw commands handled.

.EXAMPLE
  pwsh -NoProfile -File labs/verify-all.ps1
#>
[CmdletBinding()]
param(
  [string]$Only = '*',
  [switch]$FailFast
)

$ErrorActionPreference = 'Continue'
$solPath = Join-Path $PSScriptRoot 'solutions.json'
if (-not (Test-Path $solPath)) {
  Write-Host "Run node labs/export-solutions.mjs first" -ForegroundColor Yellow
  exit 2
}
$all = Get-Content $solPath -Raw | ConvertFrom-Json

function New-Lab {
  $lab = Join-Path ([IO.Path]::GetTempPath()) ("lps-lab-" + [guid]::NewGuid().ToString('N').Substring(0,8))
  New-Item -ItemType Directory -Path $lab, (Join-Path $lab 'docs'), (Join-Path $lab 'data') | Out-Null
  Set-Content (Join-Path $lab 'todo.txt') "1. Learn the pipeline`n2. Finish the levels`n"
  Set-Content (Join-Path $lab 'profile.ps1') "# lab profile`n"
  Set-Content (Join-Path $lab 'docs/readme.md') "LearnPowerShell lab`nStart with Get-ChildItem.`n"
  Set-Content (Join-Path $lab 'docs/pipeline.md') "The pipeline passes objects, not text.`nSelect-Object projects properties`n"
  Set-Content (Join-Path $lab 'data/notes.txt') "Objects > text`nSelect-Object projects properties`n"
  Set-Content (Join-Path $lab 'data/servers.csv') "Name,Role,CPU`nweb01,Web,42`nweb02,Web,18`ndb01,Database,77`napp01,App,55`n"
  return $lab
}

$passed = 0; $failed = 0; $skipped = 0
$failIds = @()
$skipReasons = @{}

foreach ($id in ($all.PSObject.Properties.Name | Sort-Object)) {
  if ($id -notlike $Only) { continue }
  $cmds = @($all.$id)
  $joined = $cmds -join ' '

  $skip = $null
  if ($joined -match 'Invoke-Command|New-PSSession|Enter-PSSession|Get-Credential') { $skip = 'sim-remoting' }
  elseif ($joined -match 'Inventory') { $skip = 'sim-module' }
  elseif ($joined -match 'web01|db01') { $skip = 'sim-hosts' }
  elseif ($joined -match 'Set-PSBreakpoint|Get-PSCallStack') { $skip = 'debugger-stub' }
  elseif ($joined -match 'Set-Location Env:') { $skip = 'provider-cwd' }
  elseif ($joined -match 'HKLM:|Cert:\\') { $skip = 'provider-registry' }
  elseif ($joined -match 'ipconfig') { $skip = 'native-host' }
  elseif ($joined -match 'Get-Help about_') { $skip = 'help-topic-not-installed' }
  elseif ($joined -match 'Set-ExecutionPolicy') { $skip = 'host-policy' }
  elseif ($joined -match 'Get-AuthenticodeSignature') { $skip = 'signature-store' }

  if ($skip) {
    Write-Host "skip $id ($skip)" -ForegroundColor DarkYellow
    $skipped++
    $skipReasons[$skip] = 1 + $skipReasons[$skip]
    continue
  }

  $lab = New-Lab
  Push-Location $lab
  $ok = $true
  $err = ''
  try {
    foreach ($cmd in $cmds) {
      $c = $cmd -replace 'Remove-Job \$job', 'Remove-Job $job -Force'
      try {
        Invoke-Expression $c -ErrorAction Continue | Out-Null
      } catch {
        if ($c -match 'Write-Error|try\s*\{|missing\.(txt|csv)|ValidateSet|ConvertFrom-Json') {
          # expected error / validation / parse lessons
        } else {
          throw
        }
      }
    }
    # Validate file-creation levels against the lab
    if ($id -eq 'data-02' -and -not (Test-Path (Join-Path $lab 'out.csv'))) { throw 'out.csv missing' }
    if ($id -eq 'formatting-03' -and -not (Test-Path (Join-Path $lab 'files.txt'))) { throw 'files.txt missing' }
    if ($id -eq 'formatting-07' -and -not (Test-Path (Join-Path $lab 'loc.txt'))) { throw 'loc.txt missing' }
    if ($id -eq 'data-07' -and -not (Test-Path (Join-Path $lab 'files.txt'))) { throw 'files.txt missing' }
    if ($id -eq 'data-08' -and -not (Test-Path (Join-Path $lab 'tee.txt'))) { throw 'tee.txt missing' }
  } catch {
    $ok = $false
    $err = $_.Exception.Message
  }
  Pop-Location
  Remove-Item $lab -Recurse -Force -ErrorAction SilentlyContinue

  if ($ok) {
    Write-Host "ok   $id"
    $passed++
  } else {
    Write-Host "FAIL $id :: $err" -ForegroundColor Red
    $failed++
    $failIds += $id
    if ($FailFast) { break }
  }
}

Write-Host ""
Write-Host "passed=$passed failed=$failed skipped=$skipped (sim-only or host-bound)"
if ($skipReasons.Count) {
  Write-Host "skip reasons:"
  $skipReasons.GetEnumerator() | ForEach-Object { Write-Host ("  {0}: {1}" -f $_.Key, $_.Value) }
}
if ($failIds) { Write-Host ("failures: " + ($failIds -join ', ')) }
if ($failed -gt 0) { exit 1 }
exit 0
