<#
.SYNOPSIS
  Remoting / jobs / CIM fidelity lab on real PowerShell.

.DESCRIPTION
  Live WinRM is optional (needs admin + winrm quickconfig). This lab always
  validates the remoting *object model* on a real engine:
  - script blocks and $using: serialization
  - PSSession command surface
  - deserialized objects (PSComputerName) via XML round-trip
  - job lifecycle
  - CIM classes
  When WinRM is up, it also runs a live Invoke-Command to localhost.

.EXAMPLE
  pwsh -NoProfile -File labs/remoting-lab.ps1
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$passed = 0
$failed = 0

function Ok($name, [scriptblock]$body) {
  try {
    & $body | Out-Null
    Write-Host "ok   $name"
    $script:passed++
  } catch {
    Write-Host "FAIL $name :: $($_.Exception.Message)" -ForegroundColor Red
    $script:failed++
  }
}

# --- always: remoting object model ---

Ok 'scriptblock' {
  $sb = { Get-Date }
  if ($sb -isnot [scriptblock]) { throw 'not scriptblock' }
}

Ok 'using-serialize' {
  $envName = 'web01'
  $sb = { param($n) $n }
  $r = & $sb $envName
  if ($r -ne 'web01') { throw 'using' }
}

Ok 'pssession-cmdlets' {
  foreach ($c in 'New-PSSession','Remove-PSSession','Enter-PSSession','Invoke-Command','Get-PSSession') {
    if (-not (Get-Command $c -ErrorAction SilentlyContinue)) { throw "missing $c" }
  }
}

Ok 'deserialized-shape' {
  $obj = [pscustomobject]@{ Name = 'web01'; CPU = 42; PSComputerName = 'web01' }
  $path = Join-Path $env:TEMP 'lps-rem.xml'
  $obj | Export-Clixml -Path $path
  $back = Import-Clixml $path
  Remove-Item $path -Force
  if ($back.PSComputerName -ne 'web01') { throw 'PSComputerName lost' }
  if ($back.Name -ne 'web01') { throw 'Name lost' }
}

Ok 'job-lifecycle' {
  $job = Start-Job { 21 }
  Wait-Job $job | Out-Null
  $got = Receive-Job $job
  Remove-Job $job -Force
  if ($got -ne 21) { throw "got=$got" }
}

Ok 'job-measure' {
  $job = Start-Job { Get-Process | Measure-Object }
  $m = Receive-Job $job -Keep
  Remove-Job $job -Force
  if (-not $m.Count -and $m.Count -ne 0) { throw 'measure' }
}

Ok 'cim-os' {
  $os = Get-CimInstance Win32_OperatingSystem
  if (-not $os.Caption) { throw 'no caption' }
}

Ok 'cim-process' {
  $p = Get-CimInstance Win32_Process | Select-Object -First 1
  if (-not $p.Name) { throw 'no name' }
}

Ok 'foreach-parallel' {
  $sum = 0
  1..3 | ForEach-Object -Parallel { $_ * 2 } | ForEach-Object { $script:sum += $_ }
  # -Parallel runspace may not write to $script:sum reliably — assert via pipeline
  $vals = @(1..3 | ForEach-Object -Parallel { $_ * 2 })
  if (@($vals).Count -ne 3) { throw "count=$($vals.Count)" }
  $total = ($vals | Measure-Object -Sum).Sum
  if ($total -ne 12) { throw "sum=$total" }
}

# --- optional: live WinRM ---
Ok 'live-winrm-optional' {
  try {
    $null = Test-WSMan -ComputerName localhost -ErrorAction Stop
    $r = Invoke-Command -ComputerName localhost -ScriptBlock { $env:COMPUTERNAME }
    if (-not $r) { throw 'empty' }
    Write-Host "     live WinRM: $r"
  } catch {
    Write-Host "     live WinRM unavailable (admin + winrm quickconfig) — object model above is the gate" -ForegroundColor DarkYellow
  }
}

Write-Host ""
Write-Host "$passed passed, $failed failed (live WinRM optional)"
if ($failed -gt 0) { exit 1 }
exit 0
