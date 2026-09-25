/**
 * Full curriculum catalog: series, levels, goal evaluator.
 * Target: ≥9/10 coverage per PowerShell topic vs. standard curricula.
 */

/** @type {{ id: string, name: string, description: string }[]} */
export const SERIES = [
  { id: "intro", name: "Getting Started", description: "Navigate the provider and read what is on disk." },
  { id: "objects", name: "Objects", description: "Project, filter, sort, measure — not text columns." },
  { id: "pipeline", name: "Pipeline", description: "Chain cmdlets so objects flow through stages." },
  { id: "discovery", name: "Discovery & Help", description: "Get-Help, Get-Member, parameter sets, common parameters." },
  { id: "language", name: "Language & Types", description: "Operators, arrays, hashtables, PSCustomObject, casting." },
  { id: "flow", name: "Flow Control", description: "if, switch, loops, break/continue, return." },
  { id: "functions", name: "Functions & Tools", description: "param blocks, CmdletBinding, pipeline input, splatting." },
  { id: "errors", name: "Errors & Streams", description: "try/catch, preferences, error variables, warning/verbose." },
  { id: "scope", name: "Scope", description: "local / script / global, prefixed variables." },
  { id: "data", name: "Files & Data", description: "CSV, JSON, raw content, paths, export." },
  { id: "providers", name: "Providers", description: "Env, HKLM, Cert, PSDrives." },
  { id: "remoting", name: "Remoting", description: "Invoke-Command, PSSessions, remote jobs." },
  { id: "modules", name: "Modules", description: "Import/Remove-Module, discovery, exported commands." },
  { id: "jobs", name: "Jobs & CIM", description: "Start-Job, Receive-Job, ForEach -Parallel, CIM queries." },
  { id: "security", name: "Security & Policy", description: "Execution policy, profiles, constrained language." },
  { id: "formatting", name: "Formatting & Export", description: "Format placement, Out-File, CSV vs table views." },
  { id: "remix", name: "Remix", description: "Composition, capstones, and golf." },
  {
    id: "advanced",
    name: "Advanced",
    description: "Classes, debugging, performance, PS7, native commands.",
  },
  {
    id: "mastery",
    name: "Mastery Lab",
    description: "Debug broken scripts, design tools, transfer exam.",
  },
];

/**
 * @typedef {Object} LevelGoal
 * @property {number} [commandsMax]
 * @property {string[]} [usedCmdlets]
 * @property {string} [pathIs]
 * @property {string} [variableIs]
 * @property {string} [variableCompare]
 * @property {string} [fileExists]
 * @property {string} [fileMissing]
 * @property {string} [fileContains]
 * @property {string} [outputIncludes]
 * @property {number} [outputCount]
 * @property {string} [outputTypeName]
 * @property {string} [outputPropMin]
 * @property {string[]} [pipelineCmdlets]
 * @property {boolean} [functionDefined]
 * @property {string} [errorCaught]
 * @property {string} [policyIs]
 * @property {string} [remoteRan]
 * @property {string} [moduleLoaded]
 */

/**
 * @typedef {Object} Level
 * @property {string} id
 * @property {string} series
 * @property {string} name
 * @property {string} brief
 * @property {string} hint
 * @property {number} par
 * @property {LevelGoal} goal
 * @property {{ what: string, why: string[], model?: string }} [teach]
 * @property {string[]} [learning]
 */

/**
 * @param {string} id
 * @param {string} series
 * @param {string} name
 * @param {string} brief
 * @param {string} hint
 * @param {number} par
 * @param {LevelGoal} goal
 * @param {{ what: string, why: string[], model?: string }} teach
 * @param {string[]} learning
 * @returns {Level}
 */
function L(id, series, name, brief, hint, par, goal, teach, learning) {
  return { id, series, name, brief, hint, par, goal, teach, learning };
}

/** @type {Level[]} */
export const LEVELS = [
  // ─── intro ───────────────────────────────────────────────
  L("intro-01", "intro", "Say hello", 'Write the string Hello, PowerShell to the pipeline using Write-Output.', 'Write-Output "Hello, PowerShell"', 1,
    { outputIncludes: "Hello, PowerShell", usedCmdlets: ["Write-Output"] },
    { what: "Write-Output places an object on the success stream.", why: ["Even a string is a System.String object.", "Verb-Noun is the cmdlet grammar."], model: "The pipeline is a conveyor belt of objects." },
    ["Verb-Noun", "Success stream", "Write-Output"]),
  L("intro-02", "intro", "Where am I?", "Return the current location of the session.", "Get-Location", 1,
    { usedCmdlets: ["Get-Location"] },
    { what: "Get-Location returns a PathInfo object.", why: ["Relative paths resolve from here.", "pwd is an alias, not a different tool."], model: "Prompt path is session state." },
    ["PathInfo", "Aliases", "Session location"]),
  L("intro-03", "intro", "Look around", "List the items in the current directory.", "Get-ChildItem", 1,
    { usedCmdlets: ["Get-ChildItem"] },
    { what: "Get-ChildItem emits FileInfo / DirectoryInfo objects.", why: ["Length, Mode, LastWriteTime are properties."], model: "Filesystem is a provider of objects." },
    ["FileInfo", "Get-ChildItem"]),
  L("intro-04", "intro", "Read the notes", "Print the contents of data\\notes.txt.", "Get-Content data\\notes.txt", 1,
    { usedCmdlets: ["Get-Content"], outputIncludes: "Objects > text" },
    { what: "Get-Content emits one string per line.", why: ["Lines remain pipeline objects."], model: "Disk text becomes string objects." },
    ["Get-Content", "String stream"]),
  L("intro-05", "intro", "Change directory", "Move into the docs folder and stay there.", "Set-Location docs", 1,
    { pathIs: "C:\\lab\\docs", usedCmdlets: ["Set-Location"] },
    { what: "Set-Location rewrites the current provider location.", why: ["cd is the alias."], model: "cd rewrites the base path for later relative paths." },
    ["Set-Location", "Relative paths"]),
  L("intro-06", "intro", "Filter listing", "List only *.txt in the current directory.", "Get-ChildItem -Filter *.txt", 1,
    { usedCmdlets: ["Get-ChildItem"], outputIncludes: "todo.txt" },
    { what: "-Filter narrows enumeration at the provider.", why: ["Cheaper than Where-Object after a full listing."], model: "Filter as early as possible." },
    ["-Filter", "Wildcards"]),

  // ─── objects ─────────────────────────────────────────────
  L("objects-01", "objects", "Processes are objects", "Project only Name and Id for all processes.", "Get-Process | Select-Object Name, Id", 1,
    { usedCmdlets: ["Get-Process", "Select-Object"], outputCount: 8 },
    { what: "Select-Object projects a property subset.", why: ["Downstream sees lean objects."], model: "Select is SQL SELECT for objects." },
    ["Get-Process", "Select-Object", "Note properties"]),
  L("objects-02", "objects", "Filter with Where-Object", "Return processes with CPU greater than 50.", "Get-Process | Where-Object CPU -gt 50", 1,
    { usedCmdlets: ["Get-Process", "Where-Object"], outputPropMin: "CPU=50" },
    { what: "Where-Object keeps objects by property predicate.", why: ["Operators: -eq -ne -gt -ge -lt -le -like -match."], model: "Failed tests drop off the belt." },
    ["Where-Object", "Comparison operators"]),
  L("objects-03", "objects", "Sort the hungry ones", "Order processes by CPU descending.", "Get-Process | Sort-Object CPU -Descending", 1,
    { usedCmdlets: ["Get-Process", "Sort-Object"] },
    { what: "Sort-Object orders typed values.", why: ["Order enables true top-N."], model: "Sort then slice." },
    ["Sort-Object", "-Descending"]),
  L("objects-04", "objects", "Measure the set", "Count how many processes are running.", "Get-Process | Measure-Object", 1,
    { usedCmdlets: ["Get-Process", "Measure-Object"], outputIncludes: "Count" },
    { what: "Measure-Object reduces a stream to aggregates.", why: ["-Property adds Sum/Average/Min/Max."], model: "Measure is reduce/fold." },
    ["Measure-Object", "Aggregation"]),
  L("objects-05", "objects", "Project then take", "Name and CPU for the first 3 processes only.", "Get-Process | Select-Object Name, CPU -First 3", 1,
    { usedCmdlets: ["Get-Process", "Select-Object"], outputCount: 3 },
    { what: "Select can project and slice with -First.", why: ["-First counts objects, not text lines."], model: "map + take." },
    ["Select-Object -First", "Object count"]),
  L("objects-06", "objects", "Unique names", "Emit each distinct process Name once.", "Get-Process | Select-Object Name -Unique", 1,
    { usedCmdlets: ["Select-Object"] },
    { what: "-Unique de-duplicates projected values.", why: ["Identity of an object is its property set."], model: "Distinct after projection." },
    ["Select-Object -Unique"]),

  // ─── pipeline ────────────────────────────────────────────
  L("pipeline-01", "pipeline", "Three stages", "One pipeline: processes → CPU > 40 → Name.", "Get-Process | Where-Object CPU -gt 40 | Select-Object Name", 1,
    { pipelineCmdlets: ["Get-Process", "Where-Object", "Select-Object"] },
    { what: "Source → transform → shape.", why: ["Each stage receives prior objects."], model: "PowerShell pipes move objects, not bytes." },
    ["Multi-stage pipeline"]),
  L("pipeline-02", "pipeline", "Project each name", "ForEach-Object to emit each process Name.", "Get-Process | ForEach-Object Name", 1,
    { usedCmdlets: ["ForEach-Object"], outputCount: 8 },
    { what: "$_ is the current object.", why: ["Per-item logic lives in ForEach-Object."], model: "ForEach is map()." },
    ["ForEach-Object", "$_"]),
  L("pipeline-03", "pipeline", "Transform values", "Add 10 to every process CPU.", "Get-Process | ForEach-Object { $_.CPU + 10 }", 1,
    { usedCmdlets: ["ForEach-Object"] },
    { what: "Compute a derived value per object.", why: ["Numeric + is arithmetic."], model: "The belt can rewrite objects." },
    ["Derived values", "Arithmetic in the pipe"]),
  L("pipeline-04", "pipeline", "From files to strings", "Read notes.txt and select lines containing Select.", "Get-Content data\\notes.txt | Select-String Select", 1,
    { pipelineCmdlets: ["Get-Content", "Select-String"], outputIncludes: "Select-Object" },
    { what: "Select-String wraps matches in MatchInfo.", why: ["Search is a pipeline stage."], model: "Text tools can live inside the pipe." },
    ["Get-Content → Select-String", "MatchInfo"]),
  L("pipeline-05", "pipeline", "Average CPU", "Measure the CPU property of processes.", "Get-Process | Measure-Object -Property CPU", 1,
    { usedCmdlets: ["Measure-Object"], outputIncludes: "Average" },
    { what: "-Property CPU yields Sum/Average/Min/Max.", why: ["Pick the field, then reduce."], model: "Analytics idiom in one line." },
    ["Measure-Object -Property"]),

  // ─── discovery ───────────────────────────────────────────
  L("discovery-01", "discovery", "Help on a cmdlet", "Show help for Get-ChildItem.", "Get-Help Get-ChildItem", 1,
    { usedCmdlets: ["Get-Help"], outputIncludes: "Get-ChildItem" },
    { what: "Get-Help is the built-in manual for every cmdlet.", why: ["Syntax, parameters, examples — offline."], model: "Learn discovery first; memorize less." },
    ["Get-Help", "Cmdlet docs"]),
  L("discovery-02", "discovery", "About topics", "Show the about_Objects help topic.", "Get-Help about_Objects", 1,
    { usedCmdlets: ["Get-Help"], outputIncludes: "about_Objects" },
    { what: "about_* topics explain language concepts.", why: ["about_Objects is the mental-model page."], model: "Concepts have help too, not only cmdlets." },
    ["about_* topics"]),
  L("discovery-03", "discovery", "Members of an object", "List the members of a process object (one).", "Get-Process | Select-Object -First 1 | Get-Member", 1,
    { usedCmdlets: ["Get-Member"] },
    { what: "Get-Member shows properties and methods of the incoming type.", why: ["You cannot use a property you never discovered."], model: "Objects have a type shape — inspect it." },
    ["Get-Member", "TypeName", "Members"]),
  L("discovery-04", "discovery", "Command discovery", "Find every command whose name starts with Get-.", "Get-Command Get-*", 1,
    { usedCmdlets: ["Get-Command"] },
    { what: "Get-Command enumerates available commands and their types.", why: ["Wildcards find tools you forgot existed."], model: "The shell is searchable." },
    ["Get-Command", "Command types"]),
  L("discovery-05", "discovery", "Parameter sets", "Run Get-ChildItem with -Path and -Filter together.", "Get-ChildItem -Path . -Filter *.txt", 1,
    { usedCmdlets: ["Get-ChildItem"] },
    { what: "Named parameters make intent explicit and order-independent.", why: ["Parameter sets group compatible flags."], model: "Prefer named parameters in scripts." },
    ["Named parameters", "Parameter sets"]),
  L("discovery-06", "discovery", "Common parameter -Verbose", "Run Get-Process with -Verbose.", "Get-Process -Verbose", 1,
    { usedCmdlets: ["Get-Process"] },
    { what: "Common parameters (Verbose, ErrorAction, WhatIf) attach to advanced cmdlets.", why: ["-Verbose narrates internals on the verbose stream."], model: "One parameter vocabulary for all cmdlets." },
    ["Common parameters", "Verbose stream"]),

  // ─── language ────────────────────────────────────────────
  L("language-01", "language", "Comparison operators", "Put the result of 5 -gt 3 into $ok.", "$ok = 5 -gt 3", 1,
    { variableCompare: "ok=True", usedCmdlets: [] },
    { what: "Comparison operators return booleans.", why: ["-gt/-lt/-eq are not text tokens — they are operators."], model: "Expressions evaluate to values." },
    ["Operators", "Booleans"]),
  L("language-02", "language", "Logical -and", "Put (5 -gt 3) -and (2 -lt 4) into $flag.", "$flag = (5 -gt 3) -and (2 -lt 4)", 1,
    { variableCompare: "flag=True" },
    { what: "-and / -or / -not compose predicates.", why: ["Parentheses control grouping."], model: "Boolean algebra underpins conditions." },
    ["-and -or -not", "Grouping"]),
  L("language-03", "language", "Array literal", "Create an array 1,2,3 in $nums using @().", "$nums = @(1,2,3)", 1,
    { variableCompare: "nums=ARRAY:3" },
    { what: "@() forces array context even for one item.", why: [".Count and foreach work on arrays."], model: "Collections are first-class." },
    ["Arrays", "@()"]),
  L("language-04", "language", "Index and Count", "Put the second element of @(10,20,30) into $second.", "$second = @(10,20,30)[1]", 1,
    { variableCompare: "second=20" },
    { what: "Indexing is 0-based. Count is a property.", why: ["[1] is the second element — a classic trap."], model: "Arrays expose Count and index." },
    ["Indexing", "Count"]),
  L("language-05", "language", "Hashtable", "Create @{ Name = 'web01'; Role = 'Web' } in $map.", "$map = @{ Name = 'web01'; Role = 'Web' }", 1,
    { variableCompare: "map=HASH" },
    { what: "Hashtables store key/value pairs.", why: ["Great for parameters, config, and lookup."], model: "@{} is a dictionary." },
    ["Hashtables", "Key/Value"]),
  L("language-06", "language", "PSCustomObject", "Create [pscustomobject]@{ Id = 1; Name = 'a' } in $obj.", "$obj = [pscustomobject]@{ Id = 1; Name = 'a' }", 1,
    { variableCompare: "obj=PSOBJECT" },
    { what: "PSCustomObject wraps a property bag for reports.", why: ["Pipeline-friendly records without a C# class."], model: "Rows in the pipeline are objects." },
    ["PSCustomObject", "Property bag"]),
  L("language-07", "language", "Casting", "Cast the string '42' to [int] and store in $n.", '$n = [int]"42"', 1,
    { variableCompare: "n=42" },
    { what: "Casting converts types explicitly.", why: ["[int]'42' + 1 is 43; '42' + 1 is '421'."], model: "Types matter for math and safety." },
    ["Casting", "[int]"]),
  L("language-08", "language", "String expand vs single quotes", 'Emit the literal text n=1 using double quotes via Write-Output.', 'Write-Output "n=1"', 1,
    { outputIncludes: "n=1", usedCmdlets: ["Write-Output"] },
    { what: "Double quotes expand $variables; single quotes are literal.", why: ["Quote choice is semantic."], model: "Quoting is part of the expression." },
    ["Quoting", "Expansion"]),

  // ─── flow ────────────────────────────────────────────────
  L("flow-01", "flow", "If statement", "Set $label to big if 10 -gt 5, else small.", "if (10 -gt 5) { $label = 'big' } else { $label = 'small' }", 1,
    { variableCompare: "label=big" },
    { what: "if/else chooses a block by a boolean condition.", why: ["Condition is an expression in parentheses."], model: "Control flow is expressions + blocks." },
    ["if/else", "Blocks"]),
  L("flow-02", "flow", "ElseIf chain", "Classify $n: if $n -gt 10 set $band to high, elseif $n -gt 5 mid, else low. Set $n = 7 first.", "$n = 7; if ($n -gt 10) { $band = 'high' } elseif ($n -gt 5) { $band = 'mid' } else { $band = 'low' }", 2,
    { variableCompare: "band=mid" },
    { what: "elseif tests in order.", why: ["Order of branches is the decision tree."], model: "First match wins." },
    ["if/elseif", "Order"]),
  L("flow-03", "flow", "Switch", "Use switch on 'b' to set $x to 2: cases 'a'=1, 'b'=2, 'c'=3.", "switch ('b') { 'a' { $x = 1 } 'b' { $x = 2 } 'c' { $x = 3 } }", 1,
    { variableCompare: "x=2" },
    { what: "switch compares a value to multiple patterns.", why: ["Cleaner than long elseif chains."], model: "switch is pattern selection." },
    ["switch", "Patterns"]),
  L("flow-04", "flow", "Foreach loop", "Sum 1..3 into $total with foreach.", "$total = 0; foreach ($i in 1,2,3) { $total = $total + $i }", 2,
    { variableCompare: "total=6" },
    { what: "foreach ($i in $list) iterates a collection.", why: ["Language foreach is not ForEach-Object (cmdlet)."], model: "Two for-easts: language vs pipeline." },
    ["foreach", "Accumulator"]),
  L("flow-05", "flow", "While loop", "Count $c from 0 to 2 with while ($c -lt 3).", "$c = 0; while ($c -lt 3) { $c = $c + 1 }", 2,
    { variableCompare: "c=3" },
    { what: "while tests before each iteration.", why: ["Watch for infinite loops — update the condition variable."], model: "Pre-test loop." },
    ["while", "Loop variables"]),
  L("flow-06", "flow", "Break and continue", "Set $sum to 0; foreach 1..5 add only odd numbers (use continue); break nothing.", "$sum = 0; foreach ($i in 1,2,3,4,5) { if ($i % 2 -eq 0) { continue }; $sum = $sum + $i }", 2,
    { variableCompare: "sum=9" },
    { what: "continue skips an iteration; break exits the loop.", why: ["% is the modulus operator."], model: "Loop control is explicit." },
    ["break/continue", "Modulus"]),

  // ─── functions ───────────────────────────────────────────
  L("functions-01", "functions", "Define a function", "Define function Get-Hello that outputs 'hi'.", "function Get-Hello { 'hi' }", 1,
    { functionDefined: "Get-Hello", usedCmdlets: [] },
    { what: "function Verb-Noun { … } creates a reusable command.", why: ["Return values are just pipeline output."], model: "Functions are user commands." },
    ["function", "Verb-Noun"]),
  L("functions-02", "functions", "Param block", "Define function Get-Double with param($n) that outputs $n * 2. Then call it with 21.", "function Get-Double { param($n) $n * 2 }; Get-Double 21", 2,
    { outputIncludes: "42" },
    { what: "param() declares typed-by-position inputs.", why: ["Call site: Get-Double 21 binds 21 to $n."], model: "Parameters are named slots." },
    ["param()", "Function arguments"]),
  L("functions-03", "functions", "CmdletBinding", "Define function Add-One with [CmdletBinding()] param($n) that outputs $n + 1. Call with 1.", "function Add-One { [CmdletBinding()] param($n) $n + 1 }; Add-One 1", 2,
    { outputIncludes: "2" },
    { what: "[CmdletBinding()] turns a function into an advanced function.", why: ["Unlocks -Verbose, -ErrorAction, etc."], model: "Advanced functions share common parameters." },
    ["CmdletBinding", "Advanced functions"]),
  L("functions-04", "functions", "Pipeline input", "Define Get-Name that process { $_.Name } and pipe one process into it.", "function Get-Name { process { $_.Name } }; Get-Process | Select-Object -First 1 | Get-Name", 2,
    { usedCmdlets: ["Get-Process"] },
    { what: "process { } runs once per piped object; $_ is current.", why: ["begin/process/end is the pipeline lifecycle."], model: "Functions can be pipeline stages." },
    ["process block", "Pipeline functions"]),
  L("functions-05", "functions", "Splatting", "Call Get-ChildItem with splatting @{ Filter = '*.txt' }.", "$p = @{ Filter = '*.txt' }; Get-ChildItem @p", 2,
    { usedCmdlets: ["Get-ChildItem"], outputIncludes: "todo.txt" },
    { what: "@hashtable splats parameters into a command.", why: ["Readable dynamic arguments."], model: "Parameters are data — pass them as data." },
    ["Splatting", "@params"]),

  // ─── errors ──────────────────────────────────────────────
  L("errors-01", "errors", "Try/catch", "Catch a missing-path error and put the message in $err. Use Get-Content missing.txt.", "try { Get-Content missing.txt } catch { $err = $_.Exception.Message }", 2,
    { variableIs: "err=SET" },
    { what: "try/catch handles terminating errors.", why: ["$_ inside catch is the ErrorRecord."], model: "Failure is data you can handle." },
    ["try/catch", "ErrorRecord"]),
  L("errors-02", "errors", "Throw", "Throw an error with message boom inside try/catch and capture it in $msg.", "try { throw 'boom' } catch { $msg = $_.Exception.Message }", 2,
    { variableCompare: "msg=boom" },
    { what: "throw creates a terminating error.", why: ["Custom failures for scripts and tools."], model: "Throw is an exception constructor." },
    ["throw", "Exception messages"]),
  L("errors-03", "errors", "-ErrorAction Stop", "Force Get-Content missing.txt to throw by adding -ErrorAction Stop in try/catch; save message to $m.", "try { Get-Content missing.txt -ErrorAction Stop } catch { $m = $_.Exception.Message }", 2,
    { variableIs: "m=SET" },
    { what: "Non-terminating errors become terminating with -ErrorAction Stop.", why: ["try/catch only sees terminating errors."], model: "ErrorAction is a dial per command." },
    ["-ErrorAction", "Stop vs Continue"]),
  L("errors-04", "errors", "$ErrorActionPreference", "Set $ErrorActionPreference to 'Stop' and store that value in $pref.", "$ErrorActionPreference = 'Stop'; $pref = $ErrorActionPreference", 2,
    { variableCompare: "pref=Stop" },
    { what: "Preference variables set default stream behavior.", why: ["Session-wide Stop is common in scripts."], model: "Preferences are ambient policy." },
    ["$ErrorActionPreference", "Preferences"]),
  L("errors-05", "errors", "Write-Warning", "Write a warning message careful (use Write-Warning).", "Write-Warning careful", 1,
    { outputIncludes: "careful", usedCmdlets: ["Write-Warning"] },
    { what: "Write-Warning writes to the warning stream.", why: ["Not success output — keeps pipes clean."], model: "Six streams, not just stdout." },
    ["Warning stream", "Write-Warning"]),
  L("errors-06", "errors", "Write-Error", "Emit an error with Write-Error for text oops.", "Write-Error oops", 1,
    { usedCmdlets: ["Write-Error"] },
    { what: "Write-Error writes a non-terminating error record.", why: ["Callers can inspect $Error or -ErrorVariable."], model: "Errors are objects on a side stream." },
    ["Write-Error", "Error stream"]),

  // ─── scope ───────────────────────────────────────────────
  L("scope-01", "scope", "Local by default", "Set $localOnly = 1 at the session level (top).", "$localOnly = 1", 1,
    { variableCompare: "localOnly=1" },
    { what: "Top-level assignments land in the current scope.", why: ["Functions create child scopes."], model: "Scope is a stack of variable tables." },
    ["Scope stack"]),
  L("scope-02", "scope", "Script scope prefix", "Set $script:shared = 7 then read it back into $back.", "$script:shared = 7; $back = $script:shared", 2,
    { variableCompare: "back=7" },
    { what: "$script: names the script/file scope explicitly.", why: ["Survives function calls inside the script."], model: "Prefixes pick the scope frame." },
    ["$script:", "Prefixed variables"]),
  L("scope-03", "scope", "Global prefix", "Set $global:allUsers = 9.", "$global:allUsers = 9", 1,
    { variableCompare: "allUsers=9" },
    { what: "$global: is the session root scope.", why: ["Powerful and easy to overuse — prefer parameters."], model: "Global is the outermost frame." },
    ["$global:"]),
  L("scope-04", "scope", "Set-Variable -Scope", "Use Set-Variable -Name ping -Value 1 -Scope Global.", "Set-Variable -Name ping -Value 1 -Scope Global", 1,
    { variableCompare: "ping=1" },
    { what: "Set-Variable can address scopes by name.", why: ["Same model as prefixes, cmdlet form."], model: "Two syntaxes, one scope system." },
    ["Set-Variable -Scope"]),

  // ─── data ────────────────────────────────────────────────
  L("data-01", "data", "Import CSV", "Import data\\servers.csv into $rows.", "$rows = Import-Csv data\\servers.csv", 1,
    { variableIs: "rows=PSOBJECT_LIST", usedCmdlets: ["Import-Csv"] },
    { what: "Import-Csv turns rows into PSCustomObjects with column properties.", why: ["From here Where-Object Role -eq Web works."], model: "CSV is object-shaped on import." },
    ["Import-Csv", "PSCustomObject rows"]),
  L("data-02", "data", "Export CSV", "Export the process Name,Id to out.csv with Export-Csv (pipeline).", "Get-Process | Select-Object Name, Id | Export-Csv out.csv", 1,
    { fileExists: "out.csv", usedCmdlets: ["Export-Csv"] },
    { what: "Export-Csv writes objects as delimited rows.", why: ["Always project properties first — columns come from properties."], model: "Objects → CSV is property projection." },
    ["Export-Csv", "Projection before export"]),
  L("data-03", "data", "To JSON", "Convert one process Name,Id to JSON text (ConvertTo-Json).", "Get-Process | Select-Object -First 1 | Select-Object Name, Id | ConvertTo-Json", 1,
    { usedCmdlets: ["ConvertTo-Json"], outputIncludes: "{" },
    { what: "ConvertTo-Json serializes objects.", why: ["APIs and config love JSON."], model: "Serialization is type-preserving-ish." },
    ["ConvertTo-Json", "Serialization"]),
  L("data-04", "data", "From JSON", 'Convert the JSON string \'{"a":1}\' back to an object in $j.', "$j = ConvertFrom-Json '{\"a\":1}'", 1,
    { variableCompare: "j.a=1" },
    { what: "ConvertFrom-Json parses JSON to objects.", why: [".a becomes a real property."], model: "JSON is an interchange object format." },
    ["ConvertFrom-Json"]),
  L("data-05", "data", "Raw content", "Read todo.txt as one string with Get-Content -Raw into $raw.", "$raw = Get-Content todo.txt -Raw", 1,
    { variableIs: "raw=SET", usedCmdlets: ["Get-Content"] },
    { what: "-Raw returns a single string instead of lines.", why: ["Parsing whole documents is easier raw."], model: "Line stream vs blob." },
    ["Get-Content -Raw"]),
  L("data-06", "data", "Join-Path", "Join C:\\lab and data into $p with Join-Path.", "$p = Join-Path C:\\lab data", 1,
    { variableCompare: "p=C:\\lab\\data" },
    { what: "Join-Path builds provider paths portably.", why: ["String + is not portable path join."], model: "Paths are provider addresses." },
    ["Join-Path", "Portable paths"]),

  // ─── providers ───────────────────────────────────────────
  L("providers-01", "providers", "List drives", "Show PSDrives with Get-PSDrive.", "Get-PSDrive", 1,
    { usedCmdlets: ["Get-PSDrive"], outputIncludes: "C:" },
    { what: "Providers mount as drives (FileSystem, Env, Registry…).", why: ["One navigation model for heterogeneous data."], model: "Everything is a drive of items." },
    ["Get-PSDrive", "Providers"]),
  L("providers-02", "providers", "Env provider", "List environment variables via Env: drive.", "Get-ChildItem Env:", 1,
    { usedCmdlets: ["Get-ChildItem"], outputIncludes: "USERNAME" },
    { what: "Env: exposes environment variables as items.", why: ["Same Get-ChildItem verb as the filesystem."], model: "Provider items share verbs." },
    ["Env:", "Get-ChildItem"]),
  L("providers-03", "providers", "Set environment", "Set env LAB_MODE to dev via Env: or $env:LAB_MODE.", "$env:LAB_MODE = 'dev'", 1,
    { variableCompare: "env:LAB_MODE=dev" },
    { what: "$env:NAME reads and writes environment variables.", why: ["Child processes inherit them."], model: "Env is a provider with a $env: sugar path." },
    ["$env:", "Environment"]),
  L("providers-04", "providers", "Registry path", "List HKLM:\\Software simulated keys with Get-ChildItem HKLM:\\Software.", "Get-ChildItem HKLM:\\Software", 1,
    { usedCmdlets: ["Get-ChildItem"], outputIncludes: "Microsoft" },
    { what: "HKLM: is the Registry provider.", why: ["Config stores look like directories."], model: "Registry is a hierarchical provider." },
    ["HKLM:", "Registry"]),
  L("providers-05", "providers", "Certificate store", "List Cert:\\CurrentUser\\My with Get-ChildItem.", "Get-ChildItem Cert:\\CurrentUser\\My", 1,
    { usedCmdlets: ["Get-ChildItem"], outputIncludes: "CN=" },
    { what: "Cert: exposes certificate stores as paths.", why: ["Security tooling uses the same verbs."], model: "Certificates are provider items." },
    ["Cert:", "Certificate store"]),

  // ─── remoting ────────────────────────────────────────────
  L("remoting-01", "remoting", "Invoke-Command", "Run Get-Location on remote machine web01 and store output in $r.", "$r = Invoke-Command -ComputerName web01 -ScriptBlock { Get-Location }", 1,
    { remoteRan: "web01", usedCmdlets: ["Invoke-Command"] },
    { what: "Invoke-Command runs a script block on a remote machine.", why: ["Output is deserialized objects (PSComputerName tag)."], model: "Remoting is the pipeline across the network." },
    ["Invoke-Command", "ScriptBlock"]),
  L("remoting-02", "remoting", "Remote processes", "List remote processes on db01 via Invoke-Command (Get-Process).", "Invoke-Command -ComputerName db01 -ScriptBlock { Get-Process }", 1,
    { remoteRan: "db01", usedCmdlets: ["Invoke-Command", "Get-Process"] },
    { what: "Any command works inside the remote script block.", why: ["Fan-out one command to many machines."], model: "Remoting scales administration." },
    ["Remote Get-Process"]),
  L("remoting-03", "remoting", "PSSession", "Create a session to web01 and put the session object in $s (New-PSSession).", "$s = New-PSSession -ComputerName web01", 1,
    { remoteRan: "web01", usedCmdlets: ["New-PSSession"] },
    { what: "PSSession keeps a persistent remote connection.", why: ["Cheaper than reconnecting every Invoke-Command."], model: "Sessions are reusable remote runspaces." },
    ["New-PSSession", "PSSession"]),
  L("remoting-04", "remoting", "Invoke with session", "Use Invoke-Command -Session with an existing session variable $s after creating it; run Get-Date on remote.", "$s = New-PSSession -ComputerName web01; Invoke-Command -Session $s -ScriptBlock { Get-Date }", 2,
    { remoteRan: "web01", usedCmdlets: ["Invoke-Command", "New-PSSession"] },
    { what: "-Session reuses a PSSession object.", why: ["State (env, location) can persist per session."], model: "Bind remoting to a session handle." },
    ["Invoke-Command -Session"]),
  L("remoting-05", "remoting", "Credential object", "Create a credential for user admin and store in $c (Get-Credential simulated).", "$c = Get-Credential -UserName admin", 1,
    { usedCmdlets: ["Get-Credential"] },
    { what: "PSCredential carries username + secret for auth.", why: ["Pass -Credential to remoting instead of plaintext passwords."], model: "Credentials are objects, not strings." },
    ["Get-Credential", "PSCredential"]),

  // ─── modules ─────────────────────────────────────────────
  L("modules-01", "modules", "List modules", "List loaded modules with Get-Module.", "Get-Module", 1,
    { usedCmdlets: ["Get-Module"] },
    { what: "Get-Module shows modules loaded in the session.", why: ["Commands live inside modules."], model: "Modules package commands." },
    ["Get-Module"]),
  L("modules-02", "modules", "Import module", "Import the Inventory module (Import-Module Inventory).", "Import-Module Inventory", 1,
    { moduleLoaded: "Inventory", usedCmdlets: ["Import-Module"] },
    { what: "Import-Module loads commands from a module.", why: ["New verbs appear after import."], model: "Modules are feature packs." },
    ["Import-Module"]),
  L("modules-03", "modules", "Module commands", "After Import-Module Inventory, run Get-Inventory.", "Import-Module Inventory; Get-Inventory", 2,
    { moduleLoaded: "Inventory", usedCmdlets: ["Import-Module"] },
    { what: "Exported functions become first-class commands.", why: ["Verb-Noun keeps the grammar consistent."], model: "Import unlocks exported commands." },
    ["Exported functions"]),
  L("modules-04", "modules", "Find module commands", "Find commands from module Inventory with Get-Command -Module Inventory (import first).", "Import-Module Inventory; Get-Command -Module Inventory", 2,
    { moduleLoaded: "Inventory", usedCmdlets: ["Get-Command"] },
    { what: "Get-Command -Module filters by module.", why: ["Discoverability of a package's surface."], model: "Ask the module what it exported." },
    ["Get-Command -Module"]),
  L("modules-05", "modules", "Remove module", "Import then Remove-Module Inventory.", "Import-Module Inventory; Remove-Module Inventory", 2,
    { usedCmdlets: ["Remove-Module"] },
    { what: "Remove-Module unloads commands from the session.", why: ["Clean session hygiene and tests."], model: "Modules have a load lifecycle." },
    ["Remove-Module"]),

  // ─── jobs & cim ──────────────────────────────────────────
  L("jobs-01", "jobs", "Start-Job", "Start a job that returns 42 and put the job in $job.", "$job = Start-Job { 42 }", 1,
    { usedCmdlets: ["Start-Job"] },
    { what: "Start-Job runs a script block in the background.", why: ["Shell stays responsive."], model: "Jobs are background runspaces." },
    ["Start-Job"]),
  L("jobs-02", "jobs", "Get-Job", "Create a job and list it with Get-Job.", "$job = Start-Job { 1 }; Get-Job", 2,
    { usedCmdlets: ["Get-Job", "Start-Job"] },
    { what: "Get-Job lists job objects and state.", why: ["State: Running, Completed, Failed."], model: "Jobs are monitorable objects." },
    ["Get-Job", "Job state"]),
  L("jobs-03", "jobs", "Receive-Job", "Start a job that outputs 7 and receive its output into $out.", "$job = Start-Job { 7 }; $out = Receive-Job $job", 2,
    { variableIs: "out=SET", usedCmdlets: ["Receive-Job", "Start-Job"] },
    { what: "Receive-Job harvests output from a job.", why: ["Output is just pipeline objects when received."], model: "Job output joins the pipeline late." },
    ["Receive-Job"]),
  L("jobs-04", "jobs", "ForEach -Parallel", "Run ForEach-Object -Parallel on 1,2 and note it needs PS7 (use it).", "1,2 | ForEach-Object -Parallel { $_ }", 1,
    { usedCmdlets: ["ForEach-Object"] },
    { what: "-Parallel runs the block concurrently (pwsh 7+).", why: ["Faster fan-out on multi-core."], model: "Parallel map over the stream." },
    ["ForEach-Object -Parallel"]),
  L("jobs-05", "jobs", "CIM query", "Query Win32_OperatingSystem with Get-CimInstance and keep output in $os.", "$os = Get-CimInstance Win32_OperatingSystem", 1,
    { usedCmdlets: ["Get-CimInstance"] },
    { what: "Get-CimInstance reads CIM/WMI classes as objects.", why: ["OS, disk, process inventory live here."], model: "CIM is object management instrumentation." },
    ["Get-CimInstance", "WMI/CIM"]),

  // ─── security ────────────────────────────────────────────
  L("security-01", "security", "Get-ExecutionPolicy", "Show the current execution policy.", "Get-ExecutionPolicy", 1,
    { usedCmdlets: ["Get-ExecutionPolicy"], outputIncludes: "RemoteSigned" },
    { what: "Execution policy gates which scripts may run.", why: ["Not a security boundary — a safety rail."], model: "Policy is a script trust dial." },
    ["Get-ExecutionPolicy"]),
  L("security-02", "security", "Set-ExecutionPolicy", "Set execution policy to RemoteSigned (simulated).", "Set-ExecutionPolicy RemoteSigned", 1,
    { policyIs: "RemoteSigned", usedCmdlets: ["Set-ExecutionPolicy"] },
    { what: "Set-ExecutionPolicy changes the trust mode.", why: ["Restricted / RemoteSigned / Unrestricted / Bypass."], model: "Know the mode you are running under." },
    ["Set-ExecutionPolicy", "Policy modes"]),
  L("security-03", "security", "Profile path", "Put $PROFILE value into $profilePath.", "$profilePath = $PROFILE", 1,
    { variableIs: "profilePath=SET" },
    { what: "$PROFILE is the per-user startup script path.", why: ["Aliases and prompts are customized there."], model: "Session bootstrap is data." },
    ["$PROFILE"]),
  L("security-04", "security", "WhatIf", "Run Remove-Item todo.txt -WhatIf (simulated dry-run).", "Remove-Item todo.txt -WhatIf", 1,
    { usedCmdlets: ["Remove-Item"], outputIncludes: "What if" },
    { what: "-WhatIf shows what would happen without doing it.", why: ["Safe rehearsal for destructive commands."], model: "Support ShouldProcess in tools." },
    ["-WhatIf", "ShouldProcess"]),
  L("security-05", "security", "Constrained awareness", "Read Get-Help about_ConstrainedLanguage and note it exists.", "Get-Help about_ConstrainedLanguage", 1,
    { usedCmdlets: ["Get-Help"], outputIncludes: "Constrained" },
    { what: "Constrained Language Mode limits types and methods.", why: ["AppLocker / WDAC can enforce it."], model: "Hardening reduces language surface." },
    ["Constrained Language"]),

  // ─── formatting ──────────────────────────────────────────
  L("formatting-01", "formatting", "Format-Table", "Format processes as table Name, CPU only.", "Get-Process | Format-Table Name, CPU", 1,
    { usedCmdlets: ["Format-Table"] },
    { what: "Format-Table builds a view object at the end of a pipe.", why: ["Never put Format-* in the middle of a data pipeline."], model: "Views are for humans at the edge." },
    ["Format-Table", "End of pipe"]),
  L("formatting-02", "formatting", "Format-List", "Format one process as a list of Name and Id.", "Get-Process | Select-Object -First 1 | Format-List Name, Id", 1,
    { usedCmdlets: ["Format-List"] },
    { what: "Format-List shows property/value pairs.", why: ["Wide objects read better as lists."], model: "List view for deep objects." },
    ["Format-List"]),
  L("formatting-03", "formatting", "Out-File", "Write Get-ChildItem output to files.txt with Out-File.", "Get-ChildItem | Out-File files.txt", 1,
    { fileExists: "files.txt", usedCmdlets: ["Out-File"] },
    { what: "Out-File writes the formatted text of input to a file.", why: ["Text log ≠ Export-Csv structured data."], model: "Choose text vs structured export." },
    ["Out-File", "Text vs data"]),
  L("formatting-04", "formatting", "Out-String", "Collapse Get-Service into a single string (Out-String).", "Get-Service | Out-String", 1,
    { usedCmdlets: ["Out-String"] },
    { what: "Out-String flattens formatted output to one string.", why: ["Useful when a host needs a text blob."], model: "Stringify at the boundary." },
    ["Out-String"]),
  L("formatting-05", "formatting", "Format placement rule", "Emit raw objects: Get-Process | Select-Object Name, Id (no Format-*).", "Get-Process | Select-Object Name, Id", 1,
    { usedCmdlets: ["Select-Object"], outputCount: 8 },
    { what: "Data pipelines should end with objects, not Format-* views.", why: ["Format-* output cannot be re-filtered usefully."], model: "Separate computation from presentation." },
    ["Data vs view"]),

  // ─── remix capstones ─────────────────────────────────────
  L("remix-01", "remix", "Service report", "Emit only running services in one pipeline.", "Get-Service | Where-Object Status -eq Running", 1,
    { pipelineCmdlets: ["Get-Service", "Where-Object"] },
    { what: "Same filter shape as processes.", why: ["Verb-Noun consistency scales."], model: "Same pipeline, different noun." },
    ["Reusable filter pattern"]),
  L("remix-02", "remix", "Top talkers", "Top 2 by CPU with Name and CPU in one pipeline.", "Get-Process | Sort-Object CPU -Descending | Select-Object Name, CPU -First 2", 1,
    { pipelineCmdlets: ["Get-Process", "Sort-Object", "Select-Object"], outputCount: 2 },
    { what: "Sort then take then project.", why: ["Stage order is the algorithm."], model: "compose: source → order → shape." },
    ["Stage order", "Top-N"]),
  L("remix-03", "remix", "CSV report", "Import servers.csv, filter Role Web, export web.csv.", "$rows = Import-Csv data\\servers.csv; $rows | Where-Object Role -eq Web | Export-Csv web.csv", 2,
    { fileExists: "web.csv", usedCmdlets: ["Import-Csv", "Export-Csv"] },
    { what: "Import → filter → export is the ETL micro-pattern.", why: ["Objects flow across file formats."], model: "CSV is an object conveyor between tools." },
    ["Import-Csv → Export-Csv", "ETL"]),
  L("remix-04", "remix", "Function report", "Define Get-TopCPU returning top 1 CPU process Name; call it.", "function Get-TopCPU { Get-Process | Sort-Object CPU -Descending | Select-Object -First 1 -ExpandProperty Name }; Get-TopCPU", 2,
    { functionDefined: "Get-TopCPU" },
    { what: "Package a pipeline as a tool.", why: ["Functions are how PowerShell grows."], model: "Tools are named pipelines." },
    ["Function packaging"]),
  L("remix-05", "remix", "Golf: two facts", "In ≤2 commands produce Count and a process Name.", "Get-Process | Measure-Object; Get-Process | Select-Object -First 1", 2,
    { commandsMax: 2, outputIncludes: "Count", usedCmdlets: ["Get-Process"] },
    { what: "Semicolon sequences statements. Golf the structure, not the pixels.", why: ["Economy teaches correct composition."], model: "No wasted stages." },
    ["Semicolons", "Command golf"]),
  L("remix-06", "remix", "Capstone: remote CSV", "On remote web01, run Get-Process | Select-Object -First 1 and keep it in $cap.", "$cap = Invoke-Command -ComputerName web01 -ScriptBlock { Get-Process | Select-Object -First 1 }", 1,
    { remoteRan: "web01", usedCmdlets: ["Invoke-Command"] },
    { what: "Remote pipelines return deserialized objects.", why: ["Full mental model: objects across remoting."], model: "The pipeline does not stop at the NIC." },
    ["Remote pipeline", "Capstone"]),

  // ─── depth: operators & strings ──────────────────────────
  L("language-09", "language", "Format operator -f", 'Use -f to build "n=7" from "n={0}" and 7 into $s.', '$s = "n={0}" -f 7', 1,
    { variableCompare: "s=n=7" },
    { what: "-f is .NET composite formatting.", why: ["Cleaner than many + concatenations."], model: "Format string + values." },
    ["-f format", "Composite format"]),
  L("language-10", "language", "Range operator ..", "Create 1..3 into $r (array 1,2,3).", "$r = 1..3", 1,
    { variableCompare: "r=ARRAY:3" },
    { what: ".. builds an integer range array.", why: ["foreach ($i in 1..10) is idiomatic."], model: "Ranges are just arrays." },
    [".. range"]),
  L("language-11", "language", "Match and $matches", 'Use -match on "web01" vs "^web" and put $true/$false into $isWeb via the comparison.', "$isWeb = 'web01' -match '^web'", 1,
    { variableCompare: "isWeb=True" },
    { what: "-match returns bool and fills $Matches on success.", why: ["Capture groups land in $Matches."], model: "Regex is an operator, not a cmdlet." },
    ["-match", "Regex"]),
  L("language-12", "language", "Compound +=", "Start $n = 1 then use += to reach 3.", "$n = 1; $n += 2", 2,
    { variableCompare: "n=3" },
    { what: "+= mutates a variable with addition/append.", why: ["+= on arrays appends items."], model: "Sugar over $x = $x + y." },
    ["+=", "Compound assignment"]),
  L("language-13", "language", "Here-string", "Emit a double-quoted here-string with two lines: line1 and line2 via Write-Output.", 'Write-Output "line1`nline2"', 1,
    { outputIncludes: "line1" },
    { what: "Multi-line strings use here-strings or `n escapes.", why: ["Scripts and SQL live in multi-line text."], model: "Text is still a string object." },
    ["Here-strings", "Escapes"]),

  // ─── depth: functions advanced ───────────────────────────
  L("functions-06", "functions", "Mandatory parameter", "Define Get-Need with [Parameter(Mandatory=$true)] param($Name) that outputs $Name. Call with x.", "function Get-Need { param([Parameter(Mandatory=$true)]$Name) $Name }; Get-Need x", 2,
    { outputIncludes: "x" },
    { what: "Mandatory marks required parameters.", why: ["Tools fail fast instead of silently doing nothing."], model: "Declare the contract." },
    ["[Parameter(Mandatory)]"]),
  L("functions-07", "functions", "ValidateSet", "Define Get-Size with ValidateSet S,M param($s) and call with S.", "function Get-Size { param([ValidateSet('S','M')]$s) $s }; Get-Size S", 2,
    { outputIncludes: "S" },
    { what: "ValidateSet restricts legal values.", why: ["Turns typos into binding errors."], model: "Types + validation = safer tools." },
    ["ValidateSet"]),
  L("functions-08", "functions", "OutVariable", "Run Get-Process with -OutVariable procs and keep a count via $procs.Count in $c.", "Get-Process -OutVariable procs | Out-Null; $c = $procs.Count", 2,
    { variableCompare: "c=8" },
    { what: "-OutVariable saves pipeline output while still passing it on.", why: ["Debug without a second query."], model: "Side-channel the stream." },
    ["-OutVariable"]),

  // ─── depth: errors ───────────────────────────────────────
  L("errors-07", "errors", "ErrorVariable", "Run Get-Content missing.txt -ErrorVariable ev -ErrorAction SilentlyContinue; set $n to $ev.Count.", "Get-Content missing.txt -ErrorVariable ev -ErrorAction SilentlyContinue; $n = $ev.Count", 2,
    { variableCompare: "n=1" },
    { what: "-ErrorVariable captures error records without stopping.", why: ["Inspect failures while the script continues."], model: "Errors are collectable objects." },
    ["-ErrorVariable", "$Error"]),
  L("errors-08", "errors", "Finally block", "Use try/catch/finally to set $done = 1 in finally after a caught error.", "try { throw 'x' } catch { $e = 1 } finally { $done = 1 }", 1,
    { variableCompare: "done=1" },
    { what: "finally always runs — cleanup belongs there.", why: ["Close files/sessions even when catch throws."], model: "try/catch/finally is resource hygiene." },
    ["finally", "Cleanup"]),

  // ─── depth: remoting fan-out ─────────────────────────────
  L("remoting-06", "remoting", "Fan-out two machines", "Invoke-Command on web01 and db01 in one call (comma list) running Get-Date.", "Invoke-Command -ComputerName web01,db01 -ScriptBlock { Get-Date }", 1,
    { remoteRan: "db01", usedCmdlets: ["Invoke-Command"] },
    { what: "-ComputerName accepts a list — one command, many boxes.", why: ["Fleet administration is a pipeline over machines."], model: "Remoting scales horizontally." },
    ["Fan-out", "Computer list"]),
  L("remoting-07", "remoting", "$using: local variable", "Set $envName = 'web01' and pass it into a remote script with $using:.", "$envName = 'web01'; Invoke-Command -ComputerName $envName -ScriptBlock { $using:envName }", 2,
    { remoteRan: "web01", usedCmdlets: ["Invoke-Command"] },
    { what: "$using: serializes a local variable into the remote script block.", why: ["Remote scope cannot see your locals by default."], model: "Crossing the boundary needs explicit export." },
    ["$using:", "Remote scope"]),
  L("remoting-08", "remoting", "Enter/Exit PSSession", "Enter a session on web01 then exit it.", "Enter-PSSession -ComputerName web01; Exit-PSSession", 2,
    { remoteRan: "web01", usedCmdlets: ["Enter-PSSession", "Exit-PSSession"] },
    { what: "Interactive remoting vs one-shot Invoke-Command.", why: ["State persists inside a session until you exit."], model: "Session is a remote prompt." },
    ["Enter-PSSession", "Interactive remoting"]),

  // ─── depth: jobs ─────────────────────────────────────────
  L("jobs-06", "jobs", "Wait-Job", "Start a named job and Wait-Job for it.", "$job = Start-Job -Name t1 { 1 }; Wait-Job $job", 2,
    { usedCmdlets: ["Start-Job", "Wait-Job"] },
    { what: "Wait-Job blocks until the job completes.", why: ["Sync points before Receive-Job."], model: "Jobs need lifecycle management." },
    ["Wait-Job", "Job lifecycle"]),
  L("jobs-07", "jobs", "Remove-Job", "Start a job then Remove-Job to clean up.", "$job = Start-Job { 1 }; Remove-Job $job", 2,
    { usedCmdlets: ["Remove-Job"] },
    { what: "Remove-Job deletes job records.", why: ["Otherwise the job table fills up."], model: "Create → receive → remove." },
    ["Remove-Job"]),
  L("jobs-08", "jobs", "Receive -Keep", "Receive-Job -Keep so the job still has data after receive.", "$job = Start-Job { 9 }; Receive-Job $job -Keep", 2,
    { outputIncludes: "9" },
    { what: "-Keep leaves HasMoreData set so you can receive again.", why: ["Inspect twice without restarting work."], model: "Receive is not always destructive." },
    ["Receive-Job -Keep"]),

  // ─── depth: data edges ───────────────────────────────────
  L("data-07", "data", "Out-File -Append", "Append Get-Location text to files.txt using Out-File -Append.", "Get-Location | Out-File files.txt -Append", 1,
    { fileExists: "files.txt", usedCmdlets: ["Out-File"] },
    { what: "-Append grows a file instead of replacing it.", why: ["Logs should append."], model: "Same verb, parameter changes semantics." },
    ["Out-File -Append"]),
  L("data-08", "data", "Tee-Object", "Tee process names to tee.txt while still emitting them.", "Get-Process | Select-Object Name | Tee-Object tee.txt", 1,
    { fileExists: "tee.txt", usedCmdlets: ["Tee-Object"] },
    { what: "Tee-Object writes a copy and passes the stream through.", why: ["See and save without a second pipeline."], model: "Tee splits the belt." },
    ["Tee-Object"]),
  L("data-09", "data", "JSON depth of objects", "ConvertTo-Json one process Name,Id and store in $js.", "$js = Get-Process | Select-Object -First 1 | Select-Object Name, Id | ConvertTo-Json", 1,
    { variableIs: "js=SET", usedCmdlets: ["ConvertTo-Json"] },
    { what: "ConvertTo-Json keeps property names as keys.", why: ["Interop with REST APIs and config files."], model: "Serialization preserves shape." },
    ["ConvertTo-Json shape"]),

  // ─── depth: providers / locations ────────────────────────
  L("providers-06", "providers", "Push-Location", "Push location into docs then pop back.", "Push-Location docs; Pop-Location", 2,
    { pathIs: "C:\\lab", usedCmdlets: ["Push-Location", "Pop-Location"] },
    { what: "Push/Pop maintain a location stack.", why: ["Scripts can explore and return safely."], model: "Location is a stack, not a single slot." },
    ["Push-Location", "Location stack"]),
  L("providers-07", "providers", "Env as location", "Set-Location Env: then Get-Location (or stay and list).", "Set-Location Env:; Get-ChildItem", 2,
    { usedCmdlets: ["Set-Location", "Get-ChildItem"], outputIncludes: "USERNAME" },
    { what: "You can cd into Env: like a drive.", why: ["Provider model is uniform."], model: "Everything is a navigable hierarchy." },
    ["cd Env:", "Provider navigation"]),

  // ─── depth: security ─────────────────────────────────────
  L("security-06", "security", "about_Execution_Policies", "Read about_Execution_Policies.", "Get-Help about_Execution_Policies", 1,
    { usedCmdlets: ["Get-Help"], outputIncludes: "Execution" },
    { what: "Policy modes control script trust, not user identity.", why: ["RemoteSigned is the common developer default."], model: "Policy is a safety rail." },
    ["about_Execution_Policies"]),
  L("security-07", "security", "Authenticode", "Check a signature with Get-AuthenticodeSignature.", "Get-AuthenticodeSignature profile.ps1", 1,
    { usedCmdlets: ["Get-AuthenticodeSignature"], outputIncludes: "Valid" },
    { what: "Authenticode verifies script publishers.", why: ["AllSigned policy requires a trusted signature."], model: "Signing is identity for scripts." },
    ["Get-AuthenticodeSignature"]),

  // ─── depth: formatting ───────────────────────────────────
  L("formatting-06", "formatting", "Format-Table -AutoSize", "Format Name,Id as an auto-sized table.", "Get-Process | Format-Table Name, Id -AutoSize", 1,
    { usedCmdlets: ["Format-Table"] },
    { what: "-AutoSize sizes columns to content.", why: ["Default width can truncate."], model: "Presentation knobs live on Format-*." },
    ["Format-Table -AutoSize"]),
  L("formatting-07", "formatting", "Redirect to file", "Write Get-Location into loc.txt via Out-File (explicit path).", "Get-Location | Out-File loc.txt", 1,
    { fileExists: "loc.txt", usedCmdlets: ["Out-File"] },
    { what: "Explicit Out-File is clearer than bare > redirection in scripts.", why: ["Encoding and -Append are parameters you control."], model: "Be explicit at the boundary." },
    ["Out-File", "Redirection habits"]),

  // ─── depth: discovery ────────────────────────────────────
  L("discovery-07", "discovery", "about_Arrays", "Read about_Arrays.", "Get-Help about_Arrays", 1,
    { usedCmdlets: ["Get-Help"], outputIncludes: "about_Arrays" },
    { what: "about_Arrays documents unrolling and @().", why: ["Classic source of off-by-one bugs."], model: "Collections need explicit array context." },
    ["about_Arrays"]),
  L("discovery-08", "discovery", "about_Operators", "Read about_Operators.", "Get-Help about_Operators", 1,
    { usedCmdlets: ["Get-Help"], outputIncludes: "about_Operators" },
    { what: "The full operator reference lives in help.", why: ["Stop guessing -eq vs ==."], model: "Operators are language, not syntax tricks." },
    ["about_Operators"]),
  L("discovery-09", "discovery", "Get-Command -Syntax", "Show syntax of Get-ChildItem via Get-Command -Syntax.", "Get-Command Get-ChildItem -Syntax", 1,
    { usedCmdlets: ["Get-Command"] },
    { what: "-Syntax prints parameter sets compactly.", why: ["Faster than full help when you know the name."], model: "Discovery has multiple depths." },
    ["Get-Command -Syntax"]),

  // ─── capstones (multi-step) ──────────────────────────────
  L("remix-07", "remix", "Capstone: ETL + function", "Import servers.csv, define Get-Web that filters Role Web, call it and export web2.csv.", "function Get-Web { Import-Csv data\\servers.csv | Where-Object Role -eq Web }; Get-Web | Export-Csv web2.csv", 2,
    { fileExists: "web2.csv", functionDefined: "Get-Web", usedCmdlets: ["Export-Csv"] },
    { what: "Package ETL as a reusable tool.", why: ["Functions make pipelines project assets."], model: "Toolmaking is the point of PowerShell." },
    ["ETL + function", "Capstone"]),
  L("remix-08", "remix", "Capstone: remote measure", "On both web01 and db01, count processes via Invoke-Command and Measure-Object in the remote block.", "Invoke-Command -ComputerName web01,db01 -ScriptBlock { Get-Process | Measure-Object }", 1,
    { remoteRan: "db01", usedCmdlets: ["Invoke-Command", "Measure-Object"] },
    { what: "Reduce remotely, return small objects.", why: ["Do the heavy filter/measure on the far side."], model: "Push compute to the data." },
    ["Remote Measure", "Capstone"]),
  L("remix-09", "remix", "Capstone: job + receive", "Start a job that outputs 21, receive it into $got, double into $final.", "$job = Start-Job { 21 }; $got = Receive-Job $job; $final = $got * 2", 3,
    { variableCompare: "final=42", usedCmdlets: ["Start-Job", "Receive-Job"] },
    { what: "Jobs feed the same expression language.", why: ["Background work still lands as values."], model: "Async now, expressions later." },
    ["Job → expression", "Capstone"]),
  L("remix-10", "remix", "Capstone: error + csv", "Try to import missing.csv, catch, then still export a report.csv from processes (1 command line allowed 3).", "try { Import-Csv missing.csv } catch { $err = $_.Exception.Message }; Get-Process | Select-Object Name, Id | Export-Csv report.csv", 3,
    { fileExists: "report.csv", errorCaught: "err", usedCmdlets: ["Export-Csv"] },
    { what: "Resilient scripts continue after a failed step.", why: ["Real ops scripts fail soft and still deliver."], model: "Handle, then keep going." },
    ["Resilience", "Capstone"]),
  L("remix-11", "remix", "Golf: one pipeline", "Get web services names in ONE pipeline (Get-Service, Where-Object Name -like 'Win*', Select-Object Name).", "Get-Service | Where-Object Name -like 'Win*' | Select-Object Name", 1,
    { pipelineCmdlets: ["Get-Service", "Where-Object", "Select-Object"] },
    { what: "Compose source → filter → shape without intermediates.", why: ["Golf rewards the clean pipeline."], model: "One belt, three stations." },
    ["Pipeline golf"]),
  L("remix-12", "remix", "Final lab", "Define Get-Report that returns Get-Process | Measure-Object -Property CPU; call it into $rep.", "function Get-Report { Get-Process | Measure-Object -Property CPU }; $rep = Get-Report", 2,
    { functionDefined: "Get-Report", variableIs: "rep=SET", usedCmdlets: ["Measure-Object"] },
    { what: "A tool that returns a measure object you can still select from.", why: ["End state: functions as building blocks."], model: "You now compose tools, not one-liners." },
    ["Final composition"]),

  // ─── advanced: language surface ──────────────────────────
  L("adv-01", "advanced", "Subexpression $( )", 'Capture a command inside a string with $( ) — set $msg to "n=8" using $().', '$n = 8; $msg = "n=$($n)"', 2,
    { variableCompare: "msg=n=8" },
    { what: "$() evaluates an expression inside a double-quoted string.", why: ["Plain $n stops at non-name chars; $( ) is exact."], model: "String interpolation has two modes." },
    ["$( )", "Interpolation"]),
  L("adv-02", "advanced", "Null-coalescing ??", "Use ?? so $v is 5 when $x is $null: $v = $x ?? 5.", "$v = $x ?? 5", 1,
    { variableCompare: "v=5" },
    { what: "?? returns the right side when the left is null (pwsh 7+).", why: ["Cleaner than if/else for defaults."], model: "Defaults without ceremony." },
    ["??", "PS7 operators"]),
  L("adv-03", "advanced", "Ternary ? :", "Set $label to yes when 1 -eq 1, else no, using ? :.", "$label = (1 -eq 1) ? 'yes' : 'no'", 1,
    { variableCompare: "label=yes" },
    { what: "Ternary is expression-level choice (pwsh 7+).", why: ["Short alternatives without if blocks."], model: "Expressions can branch." },
    ["Ternary", "PS7"]),
  L("adv-04", "advanced", "$PSItem alias", "In ForEach-Object, $PSItem is the same as $_. Emit Name via $PSItem.Name.", "Get-Process | Select-Object -First 1 | ForEach-Object { $PSItem.Name }", 1,
    { usedCmdlets: ["ForEach-Object"] },
    { what: "$PSItem is the modern alias of $_.", why: ["Clearer scripts; same object."], model: "Two names, one current item." },
    ["$PSItem", "$_"]),
  L("adv-05", "advanced", "Class definition", "Define class Point with property X and instantiate it into $p.", "class Point { [int]$X }; $p = [Point]::new()", 2,
    { variableIs: "p=SET" },
    { what: "class creates a .NET-like type in script.", why: ["Structure beyond PSCustomObject; methods and validation."], model: "PowerShell has a type system you can extend." },
    ["class", "Type system"]),
  L("adv-06", "advanced", "Enum definition", "Define enum Color with Green and put [Color]::Green into $c.", "enum Color { Green }; $c = [Color]::Green", 2,
    { variableIs: "c=SET" },
    { what: "enum defines named constants with an underlying int.", why: ["Safer than magic strings in parameters."], model: "Closed sets of values." },
    ["enum", "Named constants"]),
  L("adv-07", "advanced", "Measure-Command", "Time Get-Process with Measure-Command and keep milliseconds in $ms.", "$t = Measure-Command { Get-Process }; $ms = $t.TotalMilliseconds", 2,
    { variableIs: "ms=SET" },
    { what: "Measure-Command times a script block.", why: ["Performance work starts with a stopwatch."], model: "Measure before optimize." },
    ["Measure-Command", "Performance"]),
  L("adv-08", "advanced", "Pipeline vs foreach perf note", "Build 1..50 and sum with foreach into $sum (language loop, not ForEach-Object).", "$sum = 0; foreach ($i in 1..50) { $sum += $i }", 2,
    { variableCompare: "sum=1275" },
    { what: "Language foreach over an in-memory array avoids pipeline overhead.", why: ["Hot loops are faster outside the pipeline."], model: "Choose the right loop for the cost." },
    ["Performance", "foreach vs ForEach-Object"]),

  // ─── advanced: modules & native ──────────────────────────
  L("adv-09", "advanced", "New-Module script", "Create a dynamic module with New-Module and load it.", "New-Module { function Get-Zed { 'z' } } | Import-Module; Get-Zed", 2,
    { usedCmdlets: ["New-Module", "Import-Module"] },
    { what: "New-Module builds a module from a script block in memory.", why: ["Lightweight packaging without files."], model: "Modules are command containers." },
    ["New-Module", "Dynamic module"]),
  L("adv-10", "advanced", "Export-ModuleMember", "Inside a dynamic module, Export-ModuleMember the public function then import.", "New-Module { function Get-Pub { 1 }; function Get-Priv { 2 }; Export-ModuleMember Get-Pub } | Import-Module", 1,
    { usedCmdlets: ["Export-ModuleMember", "Import-Module"] },
    { what: "Export-ModuleMember sets the public surface of a module.", why: ["Private helpers stay out of Get-Command."], model: "API boundary of a module." },
    ["Export-ModuleMember", "Public API"]),
  L("adv-11", "advanced", "Native command", "Run the native command ipconfig /all (simulated) and capture output in $net.", "$net = ipconfig /all", 1,
    { variableIs: "net=SET" },
    { what: "Native executables write text; $LASTEXITCODE holds the exit code.", why: ["Interop with the OS still matters."], model: "Text boundary at the edge of .NET." },
    ["Native commands", "$LASTEXITCODE"]),
  L("adv-12", "advanced", "Redirect native stderr", "Run a native command and understand 2>&1 merges error stream to output (use it on ipconfig).", "ipconfig /all 2>&1 | Select-Object -First 1", 1,
    { usedCmdlets: ["Select-Object"] },
    { what: "2>&1 merges the native error stream into success output.", why: ["CI logs need both streams."], model: "Streams can be re-mapped." },
    ["Redirection", "Streams"]),

  // ─── advanced: debugging & errors ────────────────────────
  L("adv-13", "advanced", "Set-PSBreakpoint", "Set a breakpoint on line 1 with Set-PSBreakpoint and store the breakpoint in $bp.", "$bp = Set-PSBreakpoint -Line 1", 1,
    { usedCmdlets: ["Set-PSBreakpoint"], variableIs: "bp=SET" },
    { what: "Breakpoints pause scripts for inspection.", why: ["Debugging is a first-class skill."], model: "The debugger is part of the language toolchain." },
    ["Set-PSBreakpoint", "Debugging"]),
  L("adv-14", "advanced", "Get-PSCallStack", "Read Get-PSCallStack help or run it; store result in $stack.", "$stack = Get-PSCallStack", 1,
    { variableIs: "stack=SET" },
    { what: "The call stack shows function frames.", why: ["Trace who called whom."], model: "Stack frames are objects too." },
    ["Get-PSCallStack", "Call stack"]),
  L("adv-15", "advanced", "$Error.Clear", "Clear the error list with $Error.Clear() after an error, then set $n to $Error.Count.", "try { throw 'z' } catch { }; $Error.Clear(); $n = $Error.Count", 1,
    { variableCompare: "n=0" },
    { what: "$Error is a list of recent ErrorRecords; Clear() empties it.", why: ["Session hygiene in long-running consoles."], model: "Errors accumulate until cleared." },
    ["$Error", "Error list"]),

  // ─── advanced: parameter engine ──────────────────────────
  L("adv-16", "advanced", "Argument mode", "In argument mode, bare words are strings. Write-Output the word hello (unquoted).", "Write-Output hello", 1,
    { outputIncludes: "hello", usedCmdlets: ["Write-Output"] },
    { what: "After a command name, arguments are in argument mode (bare = string).", why: ["Why dir *.txt works without quotes."], model: "Mode switch after the verb-noun." },
    ["Argument mode", "Parsing modes"]),
  L("adv-17", "advanced", "Expression mode", "In expression mode, $n = 1 + 1 evaluates as math (result 2).", "$n = 1 + 1", 1,
    { variableCompare: "n=2" },
    { what: "Right-hand side of = is expression mode.", why: ["Same tokens, different meaning than arguments."], model: "Two languages share one lexer." },
    ["Expression mode"]),
  L("adv-18", "advanced", "Dynamic param sketch", "Read about_Functions_Advanced_Parameters via Get-Help.", "Get-Help about_Functions_Advanced_Parameters", 1,
    { usedCmdlets: ["Get-Help"], outputIncludes: "about_Functions" },
    { what: "Advanced parameters include dynamic params and pipeline binding attributes.", why: ["Professional tools expose rich parameter metadata."], model: "Parameters are an API." },
    ["about_Functions_Advanced_Parameters"]),

  // ─── advanced: capstone 10 ───────────────────────────────
  L("adv-19", "advanced", "Capstone: typed tool", "Define class Box with [int]$Size, create [Box]@{ Size = 3 } style or new + set Size to 3 in $b.", "class Box { [int]$Size }; $b = [Box]::new(); $b.Size = 3", 3,
    { variableIs: "b=SET" },
    { what: "Classes give typed tooling at the edge of the pipeline.", why: ["SDK-quality scripts use types."], model: "Typed objects at the boundary." },
    ["class property", "Capstone"]),
  L("adv-20", "advanced", "Capstone: remote + job", "Start-Job that runs Get-Process | Measure-Object and keep received object in $m.", "$job = Start-Job { Get-Process | Measure-Object }; $m = Receive-Job $job", 2,
    { variableIs: "m=SET", usedCmdlets: ["Start-Job", "Receive-Job", "Measure-Object"] },
    { what: "Background measure returns a measure object you can still select from.", why: ["Full async → expression chain."], model: "Everything is still an object." },
    ["Job → object", "Final capstone"]),

  // ─── mastery: debug broken scripts ───────────────────────
  L("mst-01", "mastery", "Debug: wrong operator", "A script uses = instead of -eq and never branches. Fix it so $flag becomes True when 1 -eq 1.", "$flag = (1 -eq 1)", 1,
    { variableCompare: "flag=True" },
    { what: "Assignment is not comparison. -eq returns Boolean.", why: ["Classic bug when coming from C/Java."], model: "Operators carry type semantics." },
    ["Debug", "-eq vs ="]),
  L("mst-02", "mastery", "Debug: unrolled array", "Someone wrote $a = (1). Then $a += 2 makes a string. Fix by forcing an array so $a.Count is 2.", "$a = @(1); $a += 2", 2,
    { variableCompare: "a=ARRAY:2" },
    { what: "@() forces array context even for one item.", why: ["Comma/paren unrolling is a PowerShell footgun."], model: "Always be explicit about collections." },
    ["Debug", "@()"]),
  L("mst-03", "mastery", "Debug: Format mid-pipe", "A pipeline does Format-Table then Measure-Object and Count is empty. Use objects then measure instead — set $c to Count of Name projected process list.", "Get-Process | Select-Object Name | Measure-Object | ForEach-Object { $c = $_.Count }", 2,
    { variableIs: "c=SET" },
    { what: "Format-* emits view objects; Measure on those is meaningless.", why: ["Presentation must be last."], model: "Separate computation from view." },
    ["Debug", "Format placement"]),
  L("mst-04", "mastery", "Debug: scope leak", "A function set $x = 1 but the caller cannot see it. Re-read scope and set $outer using $script:shared = 9 pattern to force script scope.", "$script:shared = 9; $outer = $script:shared", 2,
    { variableCompare: "outer=9" },
    { what: "Functions get a child scope; assignment is local by default.", why: ["Why 'my variable is empty' after a function call."], model: "Scope is a stack." },
    ["Debug", "Scope"]),
  L("mst-05", "mastery", "Debug: silent error", "Get-Content missing.txt without -ErrorAction Stop cannot be caught. Make it terminating and capture $msg.", "try { Get-Content missing.txt -ErrorAction Stop } catch { $msg = 'caught' }", 2,
    { variableCompare: "msg=caught" },
    { what: "try/catch only sees terminating errors.", why: ["-ErrorAction Stop is the bridge."], model: "Error mode is a dial." },
    ["Debug", "ErrorAction"]),

  // ─── mastery: design tasks ───────────────────────────────
  L("mst-06", "mastery", "Design: report function", "Design Get-TopCPU returning top 1 Name via function + call into $name.", "function Get-TopCPU { Get-Process | Sort-Object CPU -Descending | Select-Object -First 1 -ExpandProperty Name }; $name = Get-TopCPU", 2,
    { functionDefined: "Get-TopCPU", variableIs: "name=SET" },
    { what: "Tools are named pipelines with a contract.", why: ["Design = verb-noun + output shape."], model: "Start from the output object." },
    ["Design", "Toolmaking"]),
  L("mst-07", "mastery", "Design: filter tool", "Design Get-Running that outputs only Running services, then call it into $rs.", "function Get-Running { Get-Service | Where-Object Status -eq Running }; $rs = Get-Running", 2,
    { functionDefined: "Get-Running", variableIs: "rs=SET" },
    { what: "Encapsulate a filter as a command.", why: ["Reuse beats copy-paste."], model: "Predicate → tool." },
    ["Design", "Filter tool"]),
  L("mst-08", "mastery", "Design: CSV to objects", "Import servers.csv and keep only Role Web in $web (objects, not strings).", "$web = Import-Csv data\\servers.csv | Where-Object Role -eq Web", 1,
    { variableIs: "web=SET", usedCmdlets: ["Import-Csv"] },
    { what: "ETL design: load → filter → hold objects.", why: ["Reports start from object sets."], model: "CSV is an object source." },
    ["Design", "ETL"]),
  L("mst-09", "mastery", "Design: safe delete tool", "Design Remove-Todo that uses -WhatIf when $WhatIf is true; call Remove-Item todo.txt -WhatIf via it once.", "function Remove-Todo { param([switch]$WhatIf) Remove-Item todo.txt -WhatIf:$WhatIf }; Remove-Todo -WhatIf", 2,
    { functionDefined: "Remove-Todo", usedCmdlets: ["Remove-Item"] },
    { what: "ShouldProcess-aware tools pass -WhatIf through.", why: ["Safety is part of the API."], model: "Design for rehearsal." },
    ["Design", "ShouldProcess"]),

  // ─── mastery: transfer exam ──────────────────────────────
  L("mst-10", "mastery", "Exam: compose 4 stages", "One pipeline: processes, CPU > 30, Name only, then Measure-Object. Keep Count in $n.", "Get-Process | Where-Object CPU -gt 30 | Select-Object Name | Measure-Object | ForEach-Object { $n = $_.Count }", 2,
    { variableIs: "n=SET", pipelineCmdlets: ["Get-Process", "Where-Object", "Select-Object", "Measure-Object"] },
    { what: "Transfer: source → filter → shape → reduce without help.", why: ["Exam tests composition, not recall."], model: "You own the pipeline when you can compose freely." },
    ["Exam", "Composition"]),
  L("mst-11", "mastery", "Exam: error + continue", "Import missing.csv in try/catch, set $recovered = 1 in catch, then Export-Csv report3.csv from Name of processes.", "try { Import-Csv missing.csv } catch { $recovered = 1 }; Get-Process | Select-Object Name | Export-Csv report3.csv", 2,
    { variableCompare: "recovered=1", fileExists: "report3.csv", usedCmdlets: ["Export-Csv"] },
    { what: "Resilient delivery: handle failure, still ship output.", why: ["Production scripts fail soft."], model: "Recover and deliver." },
    ["Exam", "Resilience"]),
  L("mst-12", "mastery", "Exam: tool + call + measure", "Define Get-ProcCount that returns Get-Process | Measure-Object -Property Id; call it into $m and put Count into $c.", "function Get-ProcCount { Get-Process | Measure-Object -Property Id }; $m = Get-ProcCount; $c = $m.Count", 3,
    { functionDefined: "Get-ProcCount", variableIs: "c=SET", usedCmdlets: ["Measure-Object"] },
    { what: "Close the loop: design tool → call → use property.", why: ["This is the unit of real automation work."], model: "Tools return objects you can keep using." },
    ["Exam", "End-to-end"]),
];

/**
 * @param {string} id
 * @returns {Level | null}
 */
export function getLevel(id) {
  return LEVELS.find((l) => l.id === id) || null;
}

/**
 * @param {string} seriesId
 * @returns {Level[]}
 */
export function levelsInSeries(seriesId) {
  return LEVELS.filter((l) => l.series === seriesId);
}

/**
 * @param {string} seriesId
 * @returns {string}
 */
export function seriesTitle(seriesId) {
  return SERIES.find((s) => s.id === seriesId)?.name || seriesId;
}

/**
 * @param {string} id
 * @returns {string | null}
 */
export function nextLevelId(id) {
  const idx = LEVELS.findIndex((l) => l.id === id);
  if (idx < 0 || idx >= LEVELS.length - 1) return null;
  return LEVELS[idx + 1].id;
}

/**
 * @param {import('./engine.js').Session} session
 * @param {string} rel
 */
function resolveGoalPath(session, rel) {
  if (/^[A-Za-z]:/.test(rel)) return rel.replace(/\//g, "\\");
  return `${session.cwd}\\${rel.replace(/\//g, "\\")}`;
}

/**
 * @param {import('./engine.js').Session} session
 * @param {string} rel
 */
function fileExistsOn(session, rel) {
  const path = resolveGoalPath(session, rel);
  const parts = path.split("\\").filter(Boolean);
  let node = session.fs;
  for (let i = 0; i < parts.length; i += 1) {
    if (i === 0) {
      if (String(node.name).toUpperCase() !== parts[0].toUpperCase()) return false;
      continue;
    }
    if (node.type !== "dir" || !node.children) return false;
    const child = Object.values(node.children).find(
      (c) => String(c.name).toLowerCase() === parts[i].toLowerCase()
    );
    if (!child) return false;
    node = child;
  }
  return true;
}

/**
 * @param {import('./engine.js').Session} session
 * @param {string} rel
 */
function readGoalFile(session, rel) {
  const path = resolveGoalPath(session, rel);
  const parts = path.split("\\").filter(Boolean);
  let node = session.fs;
  for (let i = 0; i < parts.length; i += 1) {
    if (i === 0) {
      if (String(node.name).toUpperCase() !== parts[0].toUpperCase()) return "";
      continue;
    }
    if (node.type !== "dir" || !node.children) return "";
    const child = Object.values(node.children).find(
      (c) => String(c.name).toLowerCase() === parts[i].toLowerCase()
    );
    if (!child) return "";
    node = child;
  }
  return node.type === "file" ? String(node.content || "") : "";
}

/**
 * @param {LevelGoal} goal
 * @param {import('./engine.js').Session} session
 * @param {{ output: string[], usedCmdlets: string[], pipeline: any, commandCount: number }} lastRun
 */
export function evaluateGoal(goal, session, lastRun) {
  /** @type {{ id: string, label: string, passed: boolean, detail: string }[]} */
  const checks = [];

  if (goal.commandsMax != null) {
    const n = session.commandCount;
    checks.push({
      id: "commandsMax",
      label: `At most ${goal.commandsMax} commands`,
      passed: n > 0 && n <= goal.commandsMax,
      detail: `${n} used`,
    });
  }

  if (goal.usedCmdlets?.length) {
    for (const cmd of goal.usedCmdlets) {
      const passed =
        session.usedCmdlets.has(cmd) || lastRun.usedCmdlets.includes(cmd);
      checks.push({
        id: `used:${cmd}`,
        label: `Used ${cmd}`,
        passed,
        detail: passed ? "ok" : "not used yet",
      });
    }
  }

  if (goal.pathIs) {
    const passed = session.cwd.toUpperCase() === goal.pathIs.toUpperCase();
    checks.push({
      id: "pathIs",
      label: `Location is ${goal.pathIs}`,
      passed,
      detail: session.cwd,
    });
  }

  if (goal.variableIs) {
    const [name] = goal.variableIs.split("=");
    const value = session.variables[name];
    const passed = value != null && value !== "";
    checks.push({
      id: "variableIs",
      label: `Variable $${name} is set`,
      passed,
      detail: value == null ? "missing" : typeof value,
    });
  }

  if (goal.variableCompare) {
    let name;
    let expected;
    const dotted = goal.variableCompare.match(/^([A-Za-z_][\w:]*\.[A-Za-z_]\w*)=(.*)$/);
    if (dotted) {
      name = dotted[1];
      expected = dotted[2];
    } else {
      const parts = goal.variableCompare.split(/=(.*)/s);
      name = parts[0];
      expected = parts[1];
    }
    let value;
    if (name.includes(".")) {
      const [head, tail] = name.split(".");
      const base = lookupVar(session, head);
      value =
        base && typeof base === "object"
          ? (base.props ? base.props[tail] : base[tail])
          : undefined;
      // compare raw property value
      const passed = String(value) === expected;
      checks.push({
        id: "variableCompare",
        label: `$${name} is ${expected}`,
        passed,
        detail: value == null ? "missing" : String(value),
      });
    } else {
      value = lookupVar(session, name);
      const passed = matchExpected(value, expected);
      checks.push({
        id: "variableCompare",
        label: `$${name} is ${expected}`,
        passed,
        detail: describe(value),
      });
    }
  }

  if (goal.fileExists) {
    const exists = fileExistsOn(session, goal.fileExists);
    checks.push({
      id: "fileExists",
      label: `File ${goal.fileExists} exists`,
      passed: exists,
      detail: exists ? "created" : "missing",
    });
  }

  if (goal.fileMissing) {
    const exists = fileExistsOn(session, goal.fileMissing);
    checks.push({
      id: "fileMissing",
      label: `File ${goal.fileMissing} is gone`,
      passed: !exists,
      detail: exists ? "still present" : "removed",
    });
  }

  if (goal.fileContains) {
    const [file, needle] = goal.fileContains.split("::");
    const text = readGoalFile(session, file);
    const passed = text.includes(needle);
    checks.push({
      id: "fileContains",
      label: `${file} contains "${needle}"`,
      passed,
      detail: passed ? "ok" : text ? "not found" : "file missing",
    });
  }

  if (goal.outputIncludes) {
    const hay = lastRun.output.join("\n");
    const passed = hay.includes(goal.outputIncludes);
    checks.push({
      id: "outputIncludes",
      label: `Output includes "${goal.outputIncludes}"`,
      passed,
      detail: passed ? "ok" : "not in last output",
    });
  }

  if (goal.outputCount != null) {
    const count = lastRun.pipeline?.count ?? lastRun.output.length;
    checks.push({
      id: "outputCount",
      label: `Pipeline emits ${goal.outputCount} objects`,
      passed: count === goal.outputCount,
      detail: `${count} emitted`,
    });
  }

  if (goal.outputPropMin) {
    const [prop, minStr] = goal.outputPropMin.split("=");
    const min = Number(minStr);
    const sample = lastRun.pipeline?.stages?.at(-1)?.sample || [];
    const passed =
      sample.length > 0 &&
      sample.every((s) => Number(s.fields[prop] ?? s.title) >= min);
    checks.push({
      id: "outputPropMin",
      label: `Every ${prop} ≥ ${min}`,
      passed,
      detail: passed ? "ok" : "below threshold",
    });
  }

  if (goal.pipelineCmdlets?.length) {
    const stages = lastRun.pipeline?.stages?.map((s) => s.name) || [];
    const passed = goal.pipelineCmdlets.every((c) => stages.includes(c));
    checks.push({
      id: "pipelineCmdlets",
      label: `Pipeline uses ${goal.pipelineCmdlets.join(" → ")}`,
      passed,
      detail: stages.join(" → ") || "no pipeline yet",
    });
  }

  if (goal.functionDefined) {
    const passed = Boolean(session.functions?.[goal.functionDefined]);
    checks.push({
      id: "functionDefined",
      label: `Function ${goal.functionDefined} defined`,
      passed,
      detail: passed ? "ok" : "not defined",
    });
  }

  if (goal.errorCaught) {
    const passed = Boolean(session.variables.err) || Boolean(session.variables.m) || Boolean(session.variables.msg);
    checks.push({
      id: "errorCaught",
      label: "Error captured in a variable",
      passed,
      detail: passed ? "ok" : "no catch yet",
    });
  }

  if (goal.policyIs) {
    const passed = String(session.executionPolicy) === goal.policyIs;
    checks.push({
      id: "policyIs",
      label: `ExecutionPolicy is ${goal.policyIs}`,
      passed,
      detail: String(session.executionPolicy),
    });
  }

  if (goal.remoteRan) {
    const passed = session.remoteLog?.includes(goal.remoteRan);
    checks.push({
      id: "remoteRan",
      label: `Ran on ${goal.remoteRan}`,
      passed: Boolean(passed),
      detail: passed ? "ok" : "no remote yet",
    });
  }

  if (goal.moduleLoaded) {
    const loaded = session.modules?.has?.(goal.moduleLoaded) || session.loadedModules?.includes?.(goal.moduleLoaded);
    checks.push({
      id: "moduleLoaded",
      label: `Module ${goal.moduleLoaded} loaded`,
      passed: Boolean(loaded),
      detail: loaded ? "ok" : "not loaded",
    });
  }

  return {
    checks,
    solved: checks.length > 0 && checks.every((c) => c.passed),
  };
}

/**
 * @param {any} session
 * @param {string} name
 */
function lookupVar(session, name) {
  const bare = name.replace(/^(global|script|local):/i, "");
  return session.variables[name] ?? session.variables[bare];
}

/**
 * @param {unknown} value
 * @param {string} expected
 */
function matchExpected(value, expected) {
  let v = value;
  if (v && v.props && v.get("Value") !== undefined && Object.keys(v.props).length <= 2) {
    v = v.get("Value");
  }
  if (expected === "ARRAY:3") return Array.isArray(v) && v.length === 3;
  if (expected === "ARRAY:2") return Array.isArray(v) && v.length === 2;
  if (/^ARRAY:(\d+)$/.test(expected)) {
    const n = Number(expected.split(":")[1]);
    return Array.isArray(v) && v.length === n;
  }
  if (expected === "HASH") {
    return (
      v != null &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      !v.typeName
    );
  }
  if (expected === "PSOBJECT") {
    return v != null && typeof v === "object" && (v.typeName === "PSCustomObject" || v.props);
  }
  if (expected === "True") return v === true || String(v) === "True";
  if (expected === "False") return v === false || String(v) === "False";
  if (expected.includes(".")) {
    const tail = expected.split(".").slice(1).join(".");
    const got =
      v && typeof v === "object"
        ? (v.props ? v.props[tail] : v[tail])
        : undefined;
    return String(got) === expected.slice(expected.indexOf(".") + 1);
  }
  if (v && v.props && v.props.Value !== undefined) return String(v.props.Value) === expected;
  return String(v) === expected;
}

/**
 * @param {unknown} value
 */
function describe(value) {
  if (value == null) return "missing";
  if (Array.isArray(value)) return `array[${value.length}]`;
  if (typeof value === "object") return value.typeName || "object";
  return String(value);
}
