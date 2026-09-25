<#
.SYNOPSIS
  Capstone: build a real PowerShell module and prove it with assertions.

.DESCRIPTION
  Assessment fidelity: not a checklist — write Get-Report.psm1, import it,
  and assert on real output. Transfer gate for Assessment 8.5.

.EXAMPLE
  pwsh -NoProfile -File labs/capstone-module.ps1
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$failed = 0

function Assert([bool]$cond, [string]$name) {
  if ($cond) {
    Write-Host "ok   $name"
  } else {
    Write-Host "FAIL $name" -ForegroundColor Red
    $script:failed++
  }
}

$root = Join-Path ([IO.Path]::GetTempPath()) ("lps-mod-" + [guid]::NewGuid().ToString('N').Substring(0,8))
$modDir = Join-Path $root 'GetReport'
New-Item -ItemType Directory -Path $modDir | Out-Null

$fixed = @'
function Get-Report {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Name
    )
    process {
        Get-Process |
            Where-Object { $_.Name -like $Name } |
            Select-Object Name, Id, CPU
    }
}

Export-ModuleMember -Function Get-Report
'@

Set-Content (Join-Path $modDir 'Get-Report.psm1') $fixed
Import-Module (Join-Path $modDir 'Get-Report.psm1') -Force

Assert ([bool](Get-Command Get-Report -ErrorAction SilentlyContinue)) 'module exports Get-Report'

$r = @(Get-Report -Name '*')
Assert ($r.Count -gt 0) 'Get-Report finds processes'
if ($r.Count) {
  $item = $r[0]
  Assert ($item.PSObject.Properties.Name -contains 'Name') 'output has Name'
  Assert ($item.PSObject.Properties.Name -contains 'Id') 'output has Id'
  Assert ($item -isnot [string]) 'output is objects not text'
}

$threw = $false
try { Get-Report -ErrorAction Stop | Out-Null } catch { $threw = $true }
Assert $threw 'mandatory rejects missing -Name'

# broken starter emits text — learners must see the failure mode
function Get-ReportBroken {
  param($Name)
  Get-Process | Where-Object { $_.Name -like $Name } | ForEach-Object { "$($_.Name) $($_.Id)" }
}
$brokenOut = @(Get-ReportBroken -Name '*')
Assert (@($brokenOut | Where-Object { $_ -is [string] }).Count -gt 0) 'broken emits text (failure mode)'

Remove-Module Get-Report -Force -ErrorAction SilentlyContinue
Remove-Item $root -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
if ($failed) { Write-Host "$failed failed"; exit 1 }
Write-Host "capstone module: all assertions green"
exit 0
