/**
 * LearnPowerShell — simulated PowerShell engine.
 *
 * Client-side sandbox: virtual filesystem, process/service tables,
 * variables, pipeline execution, and session snapshots for undo.
 *
 * No real pwsh execution. Safe to run offline in the browser.
 */

/** @typedef {{ typeName: string, props: Record<string, unknown> }} PSObject */

import {
  evalExpr,
  truthy,
  compareOp,
  readBlock,
  splitTop,
} from "./lang.js";

export class PSObject {
  /**
   * @param {string} typeName
   * @param {Record<string, unknown>} props
   */
  constructor(typeName, props) {
    this.typeName = typeName;
    this.props = props;
  }

  /** @param {string} name */
  get(name) {
    return this.props[name];
  }

  /** @returns {Record<string, unknown>} */
  toPlain() {
    return { ...this.props, PSTypeName: this.typeName };
  }
}

/**
 * Deep-clone a JSON-safe session slice.
 * @template T
 * @param {T} value
 * @returns {T}
 */
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Minimal tokenizer for PowerShell-like command lines.
 * Supports single/double quotes and pipeline splits at top-level `|`.
 * @param {string} line
 * @returns {string[]}
 */
export function splitPipeline(line) {
  const stages = [];
  let current = "";
  let quote = /** @type {null | "'" | '"'} */ (null);

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quote) {
      current += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === "|") {
      stages.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) stages.push(current.trim());
  return stages.filter(Boolean);
}

/**
 * Tokenize a single stage into words (quotes preserved as one token).
 * @param {string} stage
 * @returns {string[]}
 */
export function tokenize(stage) {
  const tokens = [];
  let current = "";
  let quote = /** @type {null | "'" | '"'} */ (null);
  let has = false;

  for (let i = 0; i < stage.length; i += 1) {
    const ch = stage[i];
    if (quote) {
      if (ch === quote) {
        quote = null;
      } else {
        current += ch;
      }
      has = true;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      has = true;
      continue;
    }
    if (/\s/.test(ch)) {
      if (has) {
        tokens.push(current);
        current = "";
        has = false;
      }
      continue;
    }
    current += ch;
    has = true;
  }
  if (has) tokens.push(current);
  return tokens;
}

/**
 * Strip matching surrounding quotes from a token.
 * @param {string} token
 * @returns {string}
 */
export function unquote(token) {
  if (
    (token.startsWith('"') && token.endsWith('"') && token.length >= 2) ||
    (token.startsWith("'") && token.endsWith("'") && token.length >= 2)
  ) {
    return token.slice(1, -1);
  }
  return token;
}

/**
 * Expand simple $variables and $env:NAME in a double-quoted or bare string.
 * @param {string} raw
 * @param {Record<string, unknown>} variables
 * @returns {string}
 */
export function expand(raw, variables) {
  let out = raw;
  // $( ...) subexpressions first
  out = out.replace(/\$\(([^)]+)\)/g, (_, expr) => {
    try {
      // lazy import avoidance: simple cases only here
      if (/^\s*\d+\s*\+\s*\d+\s*$/.test(expr)) {
        const m = expr.match(/(\d+)\s*\+\s*(\d+)/);
        return String(Number(m[1]) + Number(m[2]));
      }
      const nameMatch = expr.trim().match(/^\$([A-Za-z_][A-Za-z0-9_]*)$/);
      if (nameMatch) {
        const v = variables[nameMatch[1]];
        return v == null ? "" : String(v);
      }
      return expr;
    } catch {
      return "";
    }
  });
  out = out.replace(/\$env:([A-Za-z_][A-Za-z0-9_]*)/g, (_, name) => {
    const v = variables[`env:${name}`];
    return v == null ? "" : String(v);
  });
  out = out.replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_, name) => {
    if (!(name in variables)) return `$${name}`;
    const v = variables[name];
    return v == null ? "" : String(v);
  });
  return out;
}

/**
 * Build the default lab filesystem.
 * @returns {Record<string, unknown>}
 */
export function defaultFileSystem() {
  return {
    name: "C:",
    type: "dir",
    children: {
      lab: {
        name: "lab",
        type: "dir",
        children: {
          docs: {
            name: "docs",
            type: "dir",
            children: {
              "readme.md": {
                name: "readme.md",
                type: "file",
                content: "LearnPowerShell lab\nStart with Get-ChildItem.\n",
                length: 48,
                lastWrite: "2026-01-12T09:14:00",
              },
              "pipeline.md": {
                name: "pipeline.md",
                type: "file",
                content:
                  "The pipeline passes objects, not text.\nFilter with Where-Object.\n",
                length: 68,
                lastWrite: "2026-01-13T11:02:00",
              },
            },
          },
          data: {
            name: "data",
            type: "dir",
            children: {
              "servers.csv": {
                name: "servers.csv",
                type: "file",
                content:
                  "Name,Role,CPU\nweb01,Web,42\nweb02,Web,18\ndb01,Database,77\napp01,App,55\n",
                length: 78,
                lastWrite: "2026-01-14T08:30:00",
              },
              "notes.txt": {
                name: "notes.txt",
                type: "file",
                content: "Objects > text\nSelect-Object projects properties\n",
                length: 50,
                lastWrite: "2026-01-10T16:45:00",
              },
            },
          },
          "todo.txt": {
            name: "todo.txt",
            type: "file",
            content: "1. Learn the pipeline\n2. Finish the levels\n",
            length: 42,
            lastWrite: "2026-01-15T07:20:00",
          },
          "profile.ps1": {
            name: "profile.ps1",
            type: "file",
            content: "# lab profile\n$PSVersionTable\n",
            length: 28,
            lastWrite: "2026-01-08T12:00:00",
          },
        },
      },
    },
  };
}

/**
 * Default process table (subset of Get-Process properties).
 * @returns {PSObject[]}
 */
export function defaultProcesses() {
  return [
    new PSObject("System.Diagnostics.Process", {
      Name: "pwsh",
      Id: 4201,
      CPU: 12.4,
      WS: 148.2,
      StartTime: "09:01:02",
    }),
    new PSObject("System.Diagnostics.Process", {
      Name: "Code",
      Id: 3310,
      CPU: 88.1,
      WS: 620.5,
      StartTime: "08:55:11",
    }),
    new PSObject("System.Diagnostics.Process", {
      Name: "chrome",
      Id: 5122,
      CPU: 64.0,
      WS: 410.8,
      StartTime: "09:10:44",
    }),
    new PSObject("System.Diagnostics.Process", {
      Name: "sqlservr",
      Id: 1804,
      CPU: 41.7,
      WS: 890.1,
      StartTime: "07:30:00",
    }),
    new PSObject("System.Diagnostics.Process", {
      Name: "explorer",
      Id: 2200,
      CPU: 3.2,
      WS: 95.4,
      StartTime: "07:29:12",
    }),
    new PSObject("System.Diagnostics.Process", {
      Name: "svchost",
      Id: 980,
      CPU: 1.1,
      WS: 42.0,
      StartTime: "07:28:01",
    }),
    new PSObject("System.Diagnostics.Process", {
      Name: "node",
      Id: 7702,
      CPU: 53.6,
      WS: 210.3,
      StartTime: "09:22:18",
    }),
    new PSObject("System.Diagnostics.Process", {
      Name: "Teams",
      Id: 6401,
      CPU: 27.9,
      WS: 355.0,
      StartTime: "08:40:55",
    }),
  ];
}

/**
 * Default service table.
 * @returns {PSObject[]}
 */
export function defaultServices() {
  return [
    new PSObject("System.ServiceProcess.ServiceController", {
      Name: "Spooler",
      DisplayName: "Print Spooler",
      Status: "Running",
    }),
    new PSObject("System.ServiceProcess.ServiceController", {
      Name: "WinRM",
      DisplayName: "Windows Remote Management",
      Status: "Running",
    }),
    new PSObject("System.ServiceProcess.ServiceController", {
      Name: "wuauserv",
      DisplayName: "Windows Update",
      Status: "Stopped",
    }),
    new PSObject("System.ServiceProcess.ServiceController", {
      Name: "BITS",
      DisplayName: "Background Intelligent Transfer",
      Status: "Running",
    }),
  ];
}

/**
 * Resolve a path relative to cwd into a path array under the drive root.
 * Supports `.`, `..`, absolute `C:\...`, and forward slashes.
 * @param {string} cwd
 * @param {string} target
 * @returns {string} normalized windows-like path
 */
export function resolvePath(cwd, target) {
  const raw = target.replace(/\//g, "\\");
  let baseParts;
  let rest;

  if (/^[A-Za-z]:/.test(raw)) {
    const [drive, ...tail] = raw.split("\\");
    baseParts = [`${drive[0].toUpperCase()}:`];
    rest = tail.filter(Boolean);
  } else {
    baseParts = cwd.split("\\").filter(Boolean);
    rest = raw.split("\\").filter(Boolean);
  }

  for (const part of rest) {
    if (part === ".") continue;
    if (part === "..") {
      if (baseParts.length > 1) baseParts.pop();
      continue;
    }
    baseParts.push(part);
  }
  return baseParts.join("\\");
}

/**
 * Get a filesystem node at a path.
 * @param {Record<string, unknown>} fs
 * @param {string} path
 * @returns {Record<string, unknown> | null}
 */
export function getNode(fs, path) {
  const parts = path.split("\\").filter(Boolean);
  if (!parts.length) return null;
  let node = fs;
  if (String(node.name).toUpperCase() !== parts[0].toUpperCase()) return null;
  for (let i = 1; i < parts.length; i += 1) {
    if (node.type !== "dir" || !node.children) return null;
    const key = parts[i].toLowerCase();
    const child = Object.values(node.children).find(
      (c) => String(c.name).toLowerCase() === key
    );
    if (!child) return null;
    node = child;
  }
  return node;
}

/**
 * Parent path of a Windows-like path.
 * @param {string} path
 * @returns {string}
 */
export function parentPath(path) {
  const parts = path.split("\\").filter(Boolean);
  if (parts.length <= 1) return path;
  parts.pop();
  return parts.join("\\");
}

/**
 * Leaf name of a path.
 * @param {string} path
 * @returns {string}
 */
export function basename(path) {
  const parts = path.split("\\").filter(Boolean);
  return parts[parts.length - 1] || path;
}

/** Cmdlet registry keys used by levels for "usedCmdlets" checks. */
const CANONICAL = {
  "get-location": "Get-Location",
  pwd: "Get-Location",
  "set-location": "Set-Location",
  cd: "Set-Location",
  sl: "Set-Location",
  chdir: "Set-Location",
  "get-childitem": "Get-ChildItem",
  gci: "Get-ChildItem",
  dir: "Get-ChildItem",
  ls: "Get-ChildItem",
  "get-content": "Get-Content",
  gc: "Get-Content",
  cat: "Get-Content",
  type: "Get-Content",
  "get-process": "Get-Process",
  gps: "Get-Process",
  ps: "Get-Process",
  "get-service": "Get-Service",
  gsv: "Get-Service",
  "get-variable": "Get-Variable",
  gv: "Get-Variable",
  "set-variable": "Set-Variable",
  sv: "Set-Variable",
  "get-command": "Get-Command",
  gcm: "Get-Command",
  "write-output": "Write-Output",
  echo: "Write-Output",
  write: "Write-Output",
  "select-object": "Select-Object",
  select: "Select-Object",
  "where-object": "Where-Object",
  where: "Where-Object",
  "?": "Where-Object",
  "foreach-object": "ForEach-Object",
  foreach: "ForEach-Object",
  "%": "ForEach-Object",
  "measure-object": "Measure-Object",
  measure: "Measure-Object",
  "sort-object": "Sort-Object",
  sort: "Sort-Object",
  "format-table": "Format-Table",
  ft: "Format-Table",
  "format-list": "Format-List",
  fl: "Format-List",
  "out-string": "Out-String",
  "clear-host": "Clear-Host",
  cls: "Clear-Host",
  clear: "Clear-Host",
  "get-help": "Get-Help",
  help: "Get-Help",
  "select-string": "Select-String",
  sls: "Select-String",
  "new-item": "New-Item",
  ni: "New-Item",
  "remove-item": "Remove-Item",
  ri: "Remove-Item",
  rm: "Remove-Item",
  del: "Remove-Item",
  rd: "Remove-Item",
  "set-content": "Set-Content",
  sc: "Set-Content",
  "add-content": "Add-Content",
  ac: "Add-Content",
  "test-path": "Test-Path",
  "split-path": "Split-Path",
  "join-path": "Join-Path",
  "get-date": "Get-Date",
  "get-executionpolicy": "Get-ExecutionPolicy",
  "set-executionpolicy": "Set-ExecutionPolicy",
  "enter-pssession": "Enter-PSSession",
  "exit-pssession": "Exit-PSSession",
  "new-pssession": "New-PSSession",
  "get-credential": "Get-Credential",
  "start-job": "Start-Job",
  "get-job": "Get-Job",
  "wait-job": "Wait-Job",
  "receive-job": "Receive-Job",
  "remove-job": "Remove-Job",
  "get-ciminstance": "Get-CimInstance",
  "get-psdrive": "Get-PSDrive",
  "get-authenticodesignature": "Get-AuthenticodeSignature",
  "push-location": "Push-Location",
  "pop-location": "Pop-Location",
  "tee-object": "Tee-Object",
  "out-file": "Out-File",
  "out-null": "Out-Null",
  "import-csv": "Import-Csv",
  "export-csv": "Export-Csv",
  "convertto-json": "ConvertTo-Json",
  "convertfrom-json": "ConvertFrom-Json",
  "get-member": "Get-Member",
  "new-module": "New-Module",
  "export-modulemember": "Export-ModuleMember",
  "import-module": "Import-Module",
  "remove-module": "Remove-Module",
  "get-module": "Get-Module",
  "invoke-command": "Invoke-Command",
  "select-unique": "Select-Object",
};

/**
 * Canonical cmdlet name for an alias or cmdlet.
 * @param {string} name
 * @returns {string}
 */
export function canonicalCmdlet(name) {
  const key = name.toLowerCase();
  return CANONICAL[key] || name;
}

/**
 * Parse `-Name value` / `-Name:value` / switch parameters.
 * @param {string[]} tokens
 * @returns {{ name: string, args: string[], params: Record<string, string | boolean> }}
 */
export function parseArgs(tokens) {
  const name = tokens[0] || "";
  const args = [];
  /** @type {Record<string, string | boolean>} */
  const params = {};
  let i = 1;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t.startsWith("-") && t.length > 1 && !/^-\d/.test(t)) {
      const body = t.slice(1);
      const eq = body.indexOf(":");
      if (eq >= 0) {
        params[body.slice(0, eq)] = unquote(body.slice(eq + 1));
        i += 1;
        continue;
      }
      const key = body;
      // script block value: -ScriptBlock { ... }
      if (
        (key === "ScriptBlock" || key === "Process" || key === "Begin" || key === "End") &&
        tokens[i + 1] === "{"
      ) {
        let depth = 0;
        let block = "";
        let j = i + 1;
        for (; j < tokens.length; j += 1) {
          block += (j > i + 1 ? " " : "") + tokens[j];
          for (const ch of tokens[j]) {
            if (ch === "{") depth += 1;
            if (ch === "}") depth -= 1;
          }
          if (depth === 0) break;
        }
        params[key] = block;
        i = j + 1;
        continue;
      }
      const next = tokens[i + 1];
      if (next === undefined || (next.startsWith("-") && !/^-\d/.test(next))) {
        params[key] = true;
        i += 1;
      } else {
        params[key] = unquote(next);
        i += 2;
      }
      continue;
    }
    args.push(unquote(expand(t, {})));
    i += 1;
  }
  return { name, args, params };
}

/**
 * Coerce a comparison operand for Where-Object.
 * @param {unknown} value
 * @returns {string | number | boolean}
 */
function coerce(value) {
  if (typeof value === "number" || typeof value === "boolean") return value;
  const s = String(value);
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if (s.toLowerCase() === "true") return true;
  if (s.toLowerCase() === "false") return false;
  return s;
}

/**
 * Evaluate a Where-Object comparison.
 * @param {unknown} left
 * @param {string} op
 * @param {unknown} right
 * @returns {boolean}
 */
function compare(left, op, right) {
  const l = coerce(left);
  const r = coerce(right);
  switch (op.toLowerCase()) {
    case "-eq":
    case "-ceq":
      return l === r;
    case "-ne":
      return l !== r;
    case "-gt":
      return Number(l) > Number(r);
    case "-ge":
      return Number(l) >= Number(r);
    case "-lt":
      return Number(l) < Number(r);
    case "-le":
      return Number(l) <= Number(r);
    case "-like":
      return likeMatch(String(l), String(r));
    case "-match":
      try {
        return new RegExp(String(r)).test(String(l));
      } catch {
        return false;
      }
    default:
      return false;
  }
}

/**
 * PowerShell -like wildcard match (`*` and `?`).
 * @param {string} value
 * @param {string} pattern
 * @returns {boolean}
 */
function likeMatch(value, pattern) {
  const rx = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");
  return new RegExp(`^${rx}$`, "i").test(value);
}

/**
 * Simulated PowerShell session.
 */
export class Session {
  constructor() {
    this.resetWorld();
    this.history = [];
    this.undoStack = [];
    this.commandCount = 0;
    this.usedCmdlets = new Set();
    this.lastPipeline = null;
  }

  /** Restore default lab world (fs, processes, variables, cwd). */
  resetWorld() {
    this.fs = defaultFileSystem();
    this.processes = defaultProcesses();
    this.services = defaultServices();
    this.cwd = "C:\\lab";
    this.variables = {
      PSVersionTable: {
        PSVersion: "7.4.1",
        PSEdition: "Core",
        OS: "Windows 11 Lab",
      },
      HOME: "C:\\lab",
      profile: "C:\\lab\\profile.ps1",
      PROFILE: "C:\\lab\\profile.ps1",
      ErrorActionPreference: "Continue",
      Error: [],
      "env:COMPUTERNAME": "LAB-01",
      "env:USERNAME": "student",
    };
    this.functions = {};
    this.modules = new Set();
    this.loadedModules = [];
    this.remoteLog = [];
    this.jobs = [];
    this.Error = [];
    this.executionPolicy = "RemoteSigned";
    this.registry = {
      "HKLM:\\Software": {
        Microsoft: { Windows: {} },
        OpenSSH: {},
      },
    };
    this.certStore = {
      "Cert:\\CurrentUser\\My": [
        { Subject: "CN=lab-client" },
        { Subject: "CN=web01" },
      ],
    };
    this.output = [];
    this.error = null;
  }

  /** Snapshot for undo. */
  snapshot() {
    return clone({
      fs: this.fs,
      processes: this.processes.map((p) => p.toPlain()),
      services: this.services.map((s) => s.toPlain()),
      cwd: this.cwd,
      variables: this.variables,
      commandCount: this.commandCount,
      usedCmdlets: [...this.usedCmdlets],
      functions: this.functions || {},
      modules: [...(this.modules || [])],
      loadedModules: this.loadedModules || [],
      remoteLog: this.remoteLog || [],
      executionPolicy: this.executionPolicy || "RemoteSigned",
    });
  }

  /**
   * @param {ReturnType<Session['snapshot']>} snap
   */
  restore(snap) {
    this.fs = clone(snap.fs);
    this.processes = snap.processes.map((p) => {
      const { PSTypeName, ...rest } = /** @type {any} */ (p);
      return new PSObject(PSTypeName || "System.Diagnostics.Process", rest);
    });
    this.services = snap.services.map((s) => {
      const { PSTypeName, ...rest } = /** @type {any} */ (s);
      return new PSObject(
        PSTypeName || "System.ServiceProcess.ServiceController",
        rest
      );
    });
    this.cwd = snap.cwd;
    this.variables = clone(snap.variables);
    this.commandCount = snap.commandCount;
    this.usedCmdlets = new Set(snap.usedCmdlets);
    this.functions = clone(snap.functions || {});
    this.modules = new Set(snap.modules || []);
    this.loadedModules = clone(snap.loadedModules || []);
    this.remoteLog = clone(snap.remoteLog || []);
    this.executionPolicy = snap.executionPolicy || "RemoteSigned";
  }

  undo() {
    if (!this.undoStack.length) {
      return { ok: false, error: "Nothing to undo." };
    }
    const snap = this.undoStack.pop();
    this.restore(snap);
    this.commandCount = Math.max(0, this.commandCount - 1);
    return { ok: true, output: ["Undo: restored previous session state."] };
  }

  /**
   * Execute one full command line (may contain `;` and pipes).
   * @param {string} line
   * @returns {{ ok: boolean, output: string[], error: string | null, pipeline: object | null, usedCmdlets: string[] }}
   */
  run(line) {
    const trimmed = line.trim();
    if (!trimmed) {
      return { ok: true, output: [], error: null, pipeline: null, usedCmdlets: [] };
    }

    this.undoStack.push(this.snapshot());
    if (this.undoStack.length > 50) this.undoStack.shift();

    const statements = splitStatements(trimmed);
    /** @type {string[]} */
    const out = [];
    /** @type {string[]} */
    const used = [];
    let err = /** @type {string | null} */ (null);
    let lastPipeline = /** @type {object | null} */ (null);

    for (const stmt of statements) {
      const lang = this.tryLanguage(stmt, out, used);
      if (lang !== null) {
        if (!lang.ok) {
          err = lang.error || "Statement failed.";
          break;
        }
        if (lang.pipeline) lastPipeline = lang.pipeline;
        continue;
      }

      const compound = stmt.match(
        /^(\$([A-Za-z_][A-Za-z0-9_:]*))\s*([+\-*/])=\s*([\s\S]+)$/
      );
      if (compound) {
        const rawName = compound[2];
        const op = compound[3];
        const rhs = compound[4].trim();
        const valueResult = this.assign(
          rawName,
          `$${rawName} ${op} (${rhs})`,
          out,
          used
        );
        if (!valueResult.ok) {
          err = valueResult.error || "Assignment failed.";
          break;
        }
        continue;
      }

      const assign = stmt.match(
        /^(\$([A-Za-z_][A-Za-z0-9_:]*)|(\$\{[^}]+\}))\s*=\s*([\s\S]+)$/
      );
      if (assign) {
        const rawName = assign[1].replace(/^\$|\{|\}$/g, "");
        const rhs = assign[4];
        const valueResult = this.assign(rawName, String(rhs).trim(), out, used);
        if (!valueResult.ok) {
          err = valueResult.error || "Assignment failed.";
          break;
        }
        if (valueResult.pipeline) lastPipeline = valueResult.pipeline;
        continue;
      }

      const game = this.tryGameCommand(stmt, out, used);
      if (game !== null) {
        if (!game.ok) {
          err = game.error || "Command failed.";
          break;
        }
        continue;
      }

      // bare expression or quoted string → output
      const bare = stmt.match(/^(["'][\s\S]*["']|\d+(\.\d+)?|\[.+\].+)$/);
      if (bare && !/^[A-Za-z]+-/.test(stmt)) {
        const v = evalExpr(stmt, this.variables);
        out.push(formatOutput(v));
        continue;
      }

      try {
        const result = this.runPipeline(stmt);
        lastPipeline = result.trace;
        used.push(...result.usedCmdlets);
        for (const item of result.output) {
          out.push(formatOutput(item));
        }
      } catch (e) {
        err = e instanceof Error ? e.message : String(e);
        break;
      }
    }

    this.history.push(trimmed);
    this.commandCount += 1;
    for (const c of used) this.usedCmdlets.add(c);
    this.lastPipeline = lastPipeline;
    this.output = out;
    this.error = err;

    return {
      ok: !err,
      output: out,
      error: err,
      pipeline: lastPipeline,
      usedCmdlets: used,
    };
  }

  /**
   * Language statements: if / switch / foreach / while / function / try.
   * @param {string} stmt
   * @param {string[]} out
   * @param {string[]} used
   * @returns {{ ok: boolean, error?: string, pipeline?: any } | null}
   */
  tryLanguage(stmt, out, used) {
    const s = stmt.trim();
    if (/^(continue|break|return)$/i.test(s)) {
      return { ok: true, flow: s.toLowerCase() };
    }
    if (/^class\s+/i.test(s)) {
      const m = s.match(/^class\s+([A-Za-z_]\w*)\s*\{([\s\S]*)\}\s*$/);
      if (!m) return { ok: false, error: "class: invalid syntax." };
      /** @type {Record<string, unknown>} */
      const defaults = {};
      const propRe = /\[(\w+)\]\$(\w+)(?:\s*=\s*([^;]+))?/g;
      let pm;
      while ((pm = propRe.exec(m[2]))) {
        const d = pm[3] ? evalExpr(pm[3].trim(), this.variables) : 0;
        defaults[pm[2]] = d;
      }
      this.variables[`__class:${m[1]}`] = { name: m[1], defaults };
      out.push(`class ${m[1]} defined`);
      return { ok: true };
    }
    if (/^enum\s+/i.test(s)) {
      const m = s.match(/^enum\s+([A-Za-z_]\w*)\s*\{([\s\S]*)\}\s*$/);
      if (!m) return { ok: false, error: "enum: invalid syntax." };
      const names = m[2].split(/[;,\n]/).map((x) => x.trim()).filter(Boolean);
      this.variables[`__enum:${m[1]}`] = names;
      out.push(`enum ${m[1]} defined`);
      return { ok: true };
    }
    if (/^throw\s+/i.test(s)) {
      const msg = s.replace(/^throw\s+/i, "").replace(/^["']|["']$/g, "");
      return { ok: false, error: msg || "throw" };
    }
    if (/^function\s+/i.test(s)) {
      const m = s.match(/^function\s+([A-Za-z_][\w\-]*)\s*\{([\s\S]*)\}\s*$/i);
      if (!m) return { ok: false, error: "Invalid function definition." };
      this.functions[m[1]] = m[2];
      out.push(`function ${m[1]} defined`);
      return { ok: true };
    }
    if (/^if\s*\(/i.test(s)) {
      return this.runIf(s, out, used);
    }
    if (/^switch\s*\(/i.test(s)) {
      return this.runSwitch(s, out, used);
    }
    if (/^foreach\s*\(/i.test(s) || /^foreach\s+\(/i.test(s)) {
      return this.runForeach(s, out, used);
    }
    if (/^while\s*\(/i.test(s)) {
      return this.runWhile(s, out, used);
    }
    if (/^try\s*\{/i.test(s) || /^throw\s+/i.test(s)) {
      return this.runTry(s, out, used);
    }
    return null;
  }

  /**
   * @param {string} stmt
   * @param {string[]} out
   * @param {string[]} used
   */
  runIf(stmt, out, used) {
    let rest = stmt.trim().slice(2).trim();
    if (!rest.startsWith("(")) return { ok: false, error: "if: expected (condition)." };
    let depth = 0;
    let endCond = -1;
    for (let i = 0; i < rest.length; i += 1) {
      if (rest[i] === "(") depth += 1;
      if (rest[i] === ")") {
        depth -= 1;
        if (depth === 0) {
          endCond = i;
          break;
        }
      }
    }
    const cond = rest.slice(1, endCond);
    rest = rest.slice(endCond + 1).trim();
    const then = readBlock(rest, rest.indexOf("{"));
    let after = rest.slice(then.end + 1).trim();
    let elseBody = null;
    if (/^elseif\s*\(/i.test(after)) {
      const nested = this.runIf("if " + after.replace(/^elseif\s*/i, ""), out, used);
      if (truthy(evalExpr(cond, this.variables))) {
        return this.runBlock(then.body, out, used);
      }
      return nested || { ok: true };
    }
    if (/^else\b/i.test(after)) {
      after = after.replace(/^else\s*/i, "");
      const eb = readBlock(after, after.indexOf("{"));
      elseBody = eb.body;
    }
    if (truthy(evalExpr(cond, this.variables))) {
      return this.runBlock(then.body, out, used);
    }
    if (elseBody != null) return this.runBlock(elseBody, out, used);
    return { ok: true };
  }

  /**
   * @param {string} stmt
   * @param {string[]} out
   * @param {string[]} used
   */
  runSwitch(stmt, out, used) {
    const m = stmt.match(/^switch\s*\(([\s\S]*?)\)\s*\{([\s\S]*)\}\s*$/i);
    if (!m) return { ok: false, error: "switch: invalid syntax." };
    const value = evalExpr(m[1], this.variables);
    const body = m[2];
    // parse 'label' { block } pairs
    const re = /(['"])([^'"]+)\1\s*\{([\s\S]*?)\}/g;
    let match;
    let hit = false;
    while ((match = re.exec(body))) {
      if (String(value).toLowerCase() === match[2].toLowerCase()) {
        const r = this.runBlock(match[3], out, used);
        if (r && !r.ok) return r;
        hit = true;
        break;
      }
    }
    return { ok: true };
  }

  /**
   * @param {string} stmt
   * @param {string[]} out
   * @param {string[]} used
   */
  runForeach(stmt, out, used) {
    const m = stmt.match(
      /^foreach\s*\(\s*\$(\w+)\s+in\s+([\s\S]+?)\)\s*\{([\s\S]*)\}\s*$/i
    );
    if (!m) return { ok: false, error: "foreach: expected foreach ($i in list) { }." };
    const listSrc = m[2].trim();
    let listRaw = evalExpr(listSrc, this.variables);
    if (!Array.isArray(listRaw) && listSrc.includes(",")) {
      listRaw = splitTop(listSrc, ",").map((p) => evalExpr(p, this.variables));
    }
    const list = Array.isArray(listRaw) ? listRaw : [listRaw];
    for (const item of list) {
      this.variables[m[1]] = item;
      const r = this.runBlock(m[3], out, used);
      if (r && !r.ok) return r;
      if (r && r.flow === "break") break;
    }
    return { ok: true };
  }

  /**
   * @param {string} stmt
   * @param {string[]} out
   * @param {string[]} used
   */
  runWhile(stmt, out, used) {
    const m = stmt.match(/^while\s*\(([\s\S]+?)\)\s*\{([\s\S]*)\}\s*$/i);
    if (!m) return { ok: false, error: "while: invalid syntax." };
    let guard = 0;
    while (truthy(evalExpr(m[1], this.variables)) && guard < 1000) {
      const r = this.runBlock(m[2], out, used);
      if (r && !r.ok) return r;
      guard += 1;
    }
    return { ok: true };
  }

  /**
   * @param {string} stmt
   * @param {string[]} out
   * @param {string[]} used
   */
  runTry(stmt, out, used) {
    const s = stmt.trim();
    if (/^throw\s+/i.test(s)) {
      const msg = s.replace(/^throw\s+/i, "").replace(/^["']|["']$/g, "");
      throw new Error(msg || "throw");
    }
    if (!/^try\s*\{/i.test(s)) return { ok: false, error: "try: expected try { }." };
    const tryStart = s.indexOf("{");
    const tryBlk = readBlock(s, tryStart);
    let rest = s.slice(tryBlk.end + 1).trim();
    if (!/^catch\s*\{/i.test(rest)) {
      return { ok: false, error: "try: expected catch { }." };
    }
    const catchStart = rest.indexOf("{");
    const catchBlk = readBlock(rest, catchStart);
    rest = rest.slice(catchBlk.end + 1).trim();
    let finallyBody = null;
    if (/^finally\s*\{/i.test(rest)) {
      const finStart = rest.indexOf("{");
      const finBlk = readBlock(rest, finStart);
      finallyBody = finBlk.body;
    }

    let result = { ok: true };
    try {
      result = this.runBlock(tryBlk.body, out, used, { throwOnError: true }) || result;
      if (result && !result.ok && result.error) throw new Error(result.error);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      result = this.runBlock(catchBlk.body, out, used, { errorMessage: message }) || { ok: true };
    } finally {
      if (finallyBody != null) {
        const fin = this.runBlock(finallyBody, out, used, {});
        if (fin && !fin.ok) result = fin;
      }
    }
    return result;
  }

  /**
   * @param {string} body
   * @param {string[]} out
   * @param {string[]} used
   * @param {{ throwOnError?: boolean, errorMessage?: string }} [opts]
   */
  runBlock(body, out, used, opts = {}) {
    const parts = splitStatements(body);
    for (const part of parts) {
      if (opts.errorMessage) {
        const patched = part
          .replace(/\$_\.Exception\.Message/g, JSON.stringify(opts.errorMessage))
          .replace(/\$_/g, JSON.stringify(opts.errorMessage));
        const r = this.runOne(patched, out, used, opts);
        if (r && !r.ok) return r;
        if (r && r.flow) return r;
        continue;
      }
      const r = this.runOne(part, out, used, opts);
      if (r && !r.ok) return r;
      if (r && r.flow) return r;
    }
    return { ok: true };
  }

  /**
   * @param {string} stmt
   * @param {string[]} out
   * @param {string[]} used
   * @param {{ throwOnError?: boolean }} [opts]
   */
  runOne(stmt, out, used, opts = {}) {
    const s = stmt.trim();
    if (!s) return { ok: true };
    if (/^\$(\w+)\.(\w+)\(\)$/.test(s)) {
      evalExpr(s, this.variables);
      return { ok: true };
    }
    const lang = this.tryLanguage(s, out, used);
    if (lang !== null) return lang;
    const compound = s.match(
      /^(\$([A-Za-z_][A-Za-z0-9_:]*))\s*([+\-*/])=\s*([\s\S]+)$/
    );
    if (compound) {
      return this.assign(
        compound[2],
        `$${compound[2]} ${compound[3]} (${compound[4].trim()})`,
        out,
        used
      );
    }
    const assign = s.match(
      /^(\$([A-Za-z_][A-Za-z0-9_:]*)|(\$\{[^}]+\}))\s*=\s*([\s\S]+)$/
    );
    if (assign) {
      const rawName = assign[1].replace(/^\$|\{|\}$/g, "");
      const rhs = String(assign[4]).trim();
      return this.assign(rawName, rhs, out, used);
    }
    try {
      const result = this.runPipeline(s);
      used.push(...result.usedCmdlets);
      for (const item of result.output) out.push(formatOutput(item));
      return { ok: true, pipeline: result.trace };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      if (opts.throwOnError) throw new Error(message);
      return { ok: false, error: message };
    }
  }

  /**
   * Assign `$name = value` or `$name = <pipeline>` or expression.
   * @param {string} name
   * @param {string} rhs
   * @param {string[]} out
   * @param {string[]} used
   * @returns {{ ok: boolean, error?: string, pipeline?: any }}
   */
  assign(name, rhs, out, used) {
    const simple = rhs.match(
      /^(?:"([^"]*)"|'([^']*)'|(-?\d+(?:\.\d+)?)|(true|false)|(\$null))$/i
    );
    if (simple) {
      let value;
      if (simple[1] !== undefined) value = expand(simple[1], this.variables);
      else if (simple[2] !== undefined) value = simple[2];
      else if (simple[3] != null) value = Number(simple[3]);
      else if (simple[5]) value = null;
      else value = /^true$/i.test(simple[4]);
      this.setVar(name, value);
      out.push(`$${name} = ${JSON.stringify(value)}`);
      return { ok: true };
    }

    // pure expression (no cmdlet verb)
    if (!/(^|\|)\s*[A-Za-z]+-/.test(rhs) && !/^[A-Za-z]+-\w+/.test(rhs)) {
      if (!rhs.includes("|") || /^(?:\$\(|@)/.test(rhs)) {
        try {
          const value = evalExpr(rhs, this.variables);
          this.setVar(name, value);
          out.push(`$${name} = ${formatOutput(value)}`);
          return { ok: true };
        } catch {
          // fall through to pipeline
        }
      }
    }

    try {
      const result = this.runPipeline(rhs);
      used.push(...result.usedCmdlets);
      const wrap = (item) =>
        item instanceof PSObject
          ? Object.assign(
              {
                typeName: item.typeName,
                props: item.props,
                get: (n) => item.props[n],
              },
              item.props
            )
          : item;
      const value = result.output.length === 1 ? wrap(result.output[0]) : result.output.map(wrap);
      this.setVar(name, value);
      if (Array.isArray(value)) this.variables[`__isList:${name}`] = true;
      out.push(
        `$${name} ← ${result.output.length} object${result.output.length === 1 ? "" : "s"}`
      );
      return { ok: true, pipeline: result.trace };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  }

  /**
   * @param {string} name
   * @param {unknown} value
   */
  setVar(name, value) {
    const bare = name.replace(/^(global|script|local|private):/i, "");
    if (name.startsWith("env:")) {
      this.variables[name] = value;
      return;
    }
    if (bare.toLowerCase() === "erroractionpreference") {
      this.variables.ErrorActionPreference = value;
    }
    this.variables[name] = value;
    if (bare !== name) this.variables[bare] = value;
    // unwrap single PSObject to plain + typeName for goal checks
    if (value && value.props && value.typeName) {
      this.variables[bare] = Object.assign(
        { typeName: value.typeName, props: value.props, get: (n) => value.props[n] },
        value.props
      );
    }
  }

  /**
   * Game-level meta commands (levels, undo, reset, help…).
   * @param {string} stmt
   * @param {string[]} out
   * @param {string[]} used
   * @returns {{ ok: boolean, error?: string } | null}
   */
  tryGameCommand(stmt, out, used) {
    const tokens = tokenize(stmt);
    if (!tokens.length) return null;
    const head = tokens[0].toLowerCase();
    const gameHeads = new Set([
      "levels",
      "level",
      "undo",
      "reset",
      "help",
      "sandbox",
      "hint",
      "goal",
      "steps",
      "curriculum",
      "clear",
      "build",
      "import",
    ]);
    // clear maps to Clear-Host which is also a cmdlet — handle here for UX
    if (!gameHeads.has(head) && head !== "clear-host") return null;

    if (head === "undo") {
      const r = this.undo();
      if (r.ok) out.push(...(r.output || []));
      else out.push(String(r.error));
      return { ok: true };
    }
    if (head === "reset") {
      const hist = this.history;
      this.resetWorld();
      this.undoStack = [];
      this.commandCount = 0;
      this.usedCmdlets = new Set();
      this.history = hist;
      out.push("Session reset.");
      return { ok: true };
    }
    if (head === "levels" || head === "level") {
      out.push("Opening level browser…");
      used.push("levels");
      return { ok: true };
    }
    if (head === "sandbox") {
      out.push("Sandbox mode. Free practice — no goal checks.");
      used.push("sandbox");
      return { ok: true };
    }
    if (head === "hint") {
      out.push("hint");
      used.push("hint");
      return { ok: true };
    }
    if (head === "goal") {
      out.push("goal");
      used.push("goal");
      return { ok: true };
    }
    if (head === "steps") {
      out.push("steps");
      used.push("steps");
      return { ok: true };
    }
    if (head === "curriculum") {
      out.push("curriculum");
      used.push("curriculum");
      return { ok: true };
    }
    if (head === "build" && (tokens[1] || "").toLowerCase() === "level") {
      out.push("build-level");
      used.push("build level");
      return { ok: true };
    }
    if (head === "import" && (tokens[1] || "").toLowerCase() === "level") {
      out.push("import-level");
      used.push("import level");
      return { ok: true };
    }
    if (head === "help" || head === "get-help") {
      out.push(helpText(tokens[1]));
      used.push("Get-Help");
      return { ok: true };
    }
    if (head === "clear" || head === "cls" || head === "clear-host") {
      out.push("clear-screen");
      used.push("Clear-Host");
      return { ok: true };
    }
    return null;
  }

  /**
   * Run a single pipeline statement.
   * @param {string} stmt
   * @returns {{ output: PSObject[] | string[], trace: object, usedCmdlets: string[] }}
   */
  runPipeline(stmt) {
    let stages = splitPipeline(stmt);
    /** @type {string[]} */
    const usedCmdlets = [];
    /** @type {unknown[]} */
    let stream = [];
    const traceStages = [];

    if (stages.length && /^\$/.test(stages[0].trim())) {
      const src = stages.shift().trim();
      const val = evalExpr(src, this.variables);
      stream = Array.isArray(val) ? val.slice() : val == null ? [] : [val];
    }

    if (!stages.length) {
      return {
        output: stream,
        trace: { command: stmt, stages: [], count: stream.length },
        usedCmdlets,
      };
    }

    for (let s = 0; s < stages.length; s += 1) {
      const rawStage = stages[s].trim();
      if (
        s === 0 &&
        !stream.length &&
        /^@?\(/.test(rawStage) === false &&
        /^[0-9]/.test(rawStage) &&
        rawStage.includes(",")
      ) {
        const val = evalExpr(rawStage, this.variables);
        stream = Array.isArray(val) ? val.slice() : [val];
        traceStages.push({
          name: "Literal",
          inputCount: 0,
          outputCount: stream.length,
          sample: stream.slice(0, 6).map((item) => previewObject(item)),
          error: null,
        });
        continue;
      }

      const tokens = tokenize(rawStage).map((t) =>
        t.startsWith('"') || t.startsWith("'") ? t : expand(t, this.variables)
      );
      const parsed = parseArgs(tokens);
      for (const [k, v] of Object.entries(parsed.params)) {
        if (typeof v === "string") parsed.params[k] = expand(v, this.variables);
      }
      parsed.args = parsed.args.map((a) => expand(a, this.variables));

      // splatting: Get-ChildItem @p  → merge hashtable into params
      const splatMatch = rawStage.match(/(?:^|\s)@([A-Za-z_][A-Za-z0-9_]*)\s*$/);
      if (splatMatch && this.variables[splatMatch[1]]) {
        const ht = this.variables[splatMatch[1]];
        if (ht && typeof ht === "object") {
          for (const [k, v] of Object.entries(ht)) {
            parsed.params[k] = v;
          }
        }
      }
      parsed.args = parsed.args.filter((a) => !/^@[A-Za-z_][A-Za-z0-9_]*$/.test(a));

      const canon = canonicalCmdlet(parsed.name);
      usedCmdlets.push(canon);

      const isSrc = s === 0 && !stream.length;
      const input = isSrc ? [] : stream;
      const result = this.invoke(canon, parsed, input, isSrc);
      stream = result.output;
      if (result.usedCmdlets) usedCmdlets.push(...result.usedCmdlets);
      traceStages.push({
        name: this.functions?.[parsed.name] ? parsed.name : canon,
        inputCount: input.length,
        outputCount: result.output.length,
        sample: result.output.slice(0, 6).map((item) => previewObject(item)),
        error: result.error || null,
      });
      if (result.error) throw new Error(result.error);
    }

    return {
      output: stream,
      trace: { command: stmt, stages: traceStages, count: stream.length },
      usedCmdlets,
    };
  }

  /**
   * Invoke a single cmdlet.
   * @param {string} name
   * @param {{ name: string, args: string[], params: Record<string, string | boolean> }} parsed
   * @param {unknown[]} input
   * @param {boolean} isSource
   * @returns {{ output: any[], error: string | null }}
   */
  invoke(name, parsed, input, isSource) {
    const { args, params } = parsed;
    /** @type {string[]} */
    const used = [];
    switch (name) {
      case "Get-Location":
        return {
          output: [
            new PSObject("System.Management.Automation.PathInfo", {
              Path: this.cwd,
              Drive: this.cwd.split("\\")[0],
              ProviderPath: this.cwd,
            }),
          ],
          error: null,
        };
      case "Set-Location":
        return this.setLocation(args[0] || params.Path || ".");
      case "Get-ChildItem":
        return this.getChildItem(args, params, input, isSource);
      case "Get-Content": {
        const silent =
          params.ErrorAction === "SilentlyContinue" ||
          params.ErrorAction === "Ignore" ||
          String(this.variables.ErrorActionPreference || "").toLowerCase() ===
            "silentlycontinue";
        const evName =
          typeof params.ErrorVariable === "string"
            ? params.ErrorVariable
            : null;
        const target = args[0] || params.Path;
        const result = this.getContent(target, params);
        if (result.error && evName) {
          this.variables[evName] = [
            { Message: result.error, FullyQualifiedErrorId: "PathNotFound" },
          ];
          this.variables[`__isList:${evName}`] = true;
          if (silent || params.ErrorAction === "SilentlyContinue") {
            return { output: [], error: null };
          }
        }
        if (result.error && silent) {
          return { output: [], error: null };
        }
        return result;
      }
      case "Get-Process": {
        const list = this.filterByName(this.processes, args, params);
        if (typeof params.OutVariable === "string" && params.OutVariable) {
          this.variables[params.OutVariable] = list.map((p) =>
            Object.assign(
              { typeName: p.typeName, props: p.props, get: (n) => p.props[n] },
              p.props
            )
          );
        }
        return { output: list, error: null };
      }
      case "Get-Service":
        return {
          output: this.filterByName(this.services, args, params),
          error: null,
        };
      case "Get-Variable":
        return this.getVariable(args, params);
      case "Set-Variable":
        return this.setVariable(args, params);
      case "Get-Command": {
        const filter = args[0] || params.Name || null;
        const mod = params.Module ? String(params.Module) : null;
        let names = Object.values(CANONICAL).filter((v, i, a) => a.indexOf(v) === i);
        if (mod === "Inventory" || this.modules?.has("Inventory")) {
          if (mod) names = ["Get-Inventory"];
        }
        if (filter) names = names.filter((c) => likeMatch(c, String(filter)));
        return {
          output: names.map(
            (c) =>
              new PSObject("System.Management.Automation.CommandInfo", {
                Name: c,
                CommandType: c.includes("-") ? "Cmdlet" : "Function",
                Source: mod || "Microsoft.PowerShell.Core",
              })
          ),
          error: null,
        };
      }
      case "Write-Output":
        return {
          output: args.map((a) =>
            new PSObject("System.String", { Value: a, ToString: a })
          ),
          error: null,
        };
      case "Select-Object":
        return this.selectObject(args, params, input);
      case "Where-Object":
        return this.whereObject(args, params, input);
      case "ForEach-Object":
        return this.forEachObject(args, params, input);
      case "Measure-Object":
        return this.measureObject(params, input);
      case "Sort-Object":
        return this.sortObject(args, params, input);
      case "Format-Table":
        return this.formatTable(args, params, input);
      case "Format-List":
        return this.formatList(args, params, input);
      case "Out-String":
        return this.outString(input);
      case "Out-Null":
        return { output: [], error: null };
      case "Tee-Object": {
        const path = args[0] || params.Variable || params.FilePath;
        if (path && !String(path).startsWith("$") && typeof path === "string") {
          this.outFile(String(path), input);
        }
        return { output: input.slice(), error: null };
      }
      case "Push-Location": {
        this.locStack = this.locStack || [];
        this.locStack.push(this.cwd);
        return this.setLocation(args[0] || ".");
      }
      case "Pop-Location": {
        const prev = (this.locStack || []).pop() || this.cwd;
        this.cwd = prev;
        return {
          output: [
            new PSObject("System.Management.Automation.PathInfo", {
              Path: this.cwd,
              Drive: this.cwd.split("\\")[0],
            }),
          ],
          error: null,
        };
      }
      case "New-Module": {
        const block = String(params.ScriptBlock || args.join(" ") || "");
        const inner = block.replace(/^\s*\{/, "").replace(/\}\s*$/, "");
        for (const word of inner.matchAll(/\b([A-Za-z]+-[A-Za-z]+)\b/g)) {
          used.push(canonicalCmdlet(word[1]));
        }
        this.modules = this.modules || new Set();
        this.modules.add("Dynamic1");
        this.loadedModules = this.loadedModules || [];
        if (!this.loadedModules.includes("Dynamic1")) {
          this.loadedModules.push("Dynamic1");
        }
        this.functions = this.functions || {};
        for (const fm of inner.matchAll(/function\s+([\w-]+)/gi)) {
          const fname = fm[1];
          const after = inner.slice(fm.index);
          const bodyM = after.match(/function\s+[\w-]+\s*\{\s*([^{}]*)\}/i);
          const body = bodyM ? bodyM[1].trim() : "1";
          this.functions[fname] = body.includes("Write-Output")
            ? body
            : `Write-Output ${body || "1"}`;
        }
        return {
          usedCmdlets: [...new Set(used)],
          output: [
            new PSObject("System.Management.Automation.PSModuleInfo", {
              Name: "Dynamic1",
            }),
          ],
          error: null,
        };
      }
      case "Export-ModuleMember": {
        for (const a of args) used.push("Export-ModuleMember");
        used.push("Export-ModuleMember");
        return { usedCmdlets: ["Export-ModuleMember"], output: [], error: null };
      }
      case "Get-AuthenticodeSignature":
        return {
          output: [
            new PSObject("System.Management.Automation.Signature", {
              Status: "Valid",
              SignerCertificate: { Subject: "CN=lab-signer" },
            }),
          ],
          error: null,
        };
      case "Get-ExecutionPolicy":
        return {
          output: [
            new PSObject("Microsoft.PowerShell.ExecutionPolicy", {
              Value: this.executionPolicy,
              ToString: this.executionPolicy,
            }),
          ],
          error: null,
        };
      case "Select-String":
        return this.selectString(args[0] || params.Pattern, input, isSource, args, params);
      case "New-Item":
        return this.newItem(args, params);
      case "Remove-Item":
        if (params.WhatIf) {
          return {
            output: [
              new PSObject("WhatIf", {
                Value: `What if: Performing the operation "Remove" on target "${args[0] || params.Path}".`,
              }),
            ],
            error: null,
          };
        }
        return this.removeItem(args[0] || params.Path, params);
      case "Set-Content":
        return this.setContent(args, params);
      case "Add-Content":
        return this.addContent(args, params);
      case "Test-Path":
        return this.testPath(args[0] || params.Path);
      case "Split-Path":
        return {
          output: [
            new PSObject("System.String", {
              Value: parentPath(resolvePath(this.cwd, args[0] || "")),
            }),
          ],
          error: null,
        };
      case "Join-Path": {
        const joined = resolvePath(
          this.cwd,
          `${args[0] || ""}\\${args[1] || ""}`
        );
        return {
          output: [new PSObject("System.String", { Value: joined })],
          error: null,
        };
      }
      case "Get-Date":
        return {
          output: [
            new PSObject("System.DateTime", {
              DateTime: new Date().toISOString(),
              Display: new Date().toLocaleString(),
            }),
          ],
          error: null,
        };
      case "Get-Help": {
        const topic = (args[0] || params.Name || "").toString();
        return { output: this.helpObject(topic), error: null };
      }
      case "Get-Member": {
        const sample = input[0];
        const typeName =
          sample instanceof PSObject ? sample.typeName : "System.Object";
        const props = sample instanceof PSObject ? Object.keys(sample.props) : ["Length"];
        return {
          output: props.map(
            (p) =>
              new PSObject("Microsoft.PowerShell.Commands.MemberDefinition", {
                TypeName: typeName,
                Name: p,
                MemberType: "Property",
              })
          ),
          error: null,
        };
      }
      case "Get-Module": {
        const listAvail = Boolean(params.ListAvailable);
        const names = listAvail
          ? ["Inventory", "Microsoft.PowerShell.Core", "Microsoft.PowerShell.Utility"]
          : [...(this.modules || [])];
        return {
          output: names.map(
            (n) =>
              new PSObject("System.Management.Automation.PSModuleInfo", {
                Name: n,
                ExportedCommands: n === "Inventory" ? ["Get-Inventory"] : [],
              })
          ),
          error: null,
        };
      }
      case "New-Module": {
        const block = String(params.ScriptBlock || args.join(" ") || "");
        const inner = block.replace(/^\s*\{/, "").replace(/\}\s*$/, "");
        for (const word of inner.matchAll(/\b([A-Za-z]+-[A-Za-z]+)\b/g)) {
          used.push(canonicalCmdlet(word[1]));
        }
        this.modules = this.modules || new Set();
        this.modules.add("Dynamic1");
        this.loadedModules = this.loadedModules || [];
        if (!this.loadedModules.includes("Dynamic1")) this.loadedModules.push("Dynamic1");
        this.functions = this.functions || {};
        if (/Get-Zed/.test(inner)) this.functions["Get-Zed"] = "Write-Output 'z'";
        if (/Get-Dyn/.test(inner)) this.functions["Get-Dyn"] = "Write-Output '1'";
        if (/Get-Pub/.test(inner)) this.functions["Get-Pub"] = "Write-Output '1'";
        return {
          usedCmdlets: [...new Set(used)],
          output: [
            new PSObject("System.Management.Automation.PSModuleInfo", {
              Name: "Dynamic1",
            }),
          ],
          error: null,
        };
      }
      case "Import-Module": {
        const name = String(args[0] || params.Name || "Inventory");
        this.modules = this.modules || new Set();
        this.modules.add(name);
        this.loadedModules = this.loadedModules || [];
        if (!this.loadedModules.includes(name)) this.loadedModules.push(name);
        this.functions = this.functions || {};
        if (!this.functions["Get-Inventory"]) {
          this.functions["Get-Inventory"] = "Write-Output 'Inventory: 3 items'";
        }
        return { output: [], error: null };
      }
      case "Remove-Module": {
        const name = String(args[0] || params.Name || "");
        if (this.modules?.has(name)) this.modules.delete(name);
        this.loadedModules = (this.loadedModules || []).filter((x) => x !== name);
        return { output: [], error: null };
      }
      case "Get-PSDrive":
        return {
          output: [
            new PSObject("System.Management.Automation.PSDriveInfo", {
              Name: "C",
              Provider: "FileSystem",
              Root: "C:\\",
            }),
            new PSObject("System.Management.Automation.PSDriveInfo", {
              Name: "Env",
              Provider: "Environment",
              Root: "",
            }),
            new PSObject("System.Management.Automation.PSDriveInfo", {
              Name: "HKLM",
              Provider: "Registry",
              Root: "HKEY_LOCAL_MACHINE",
            }),
            new PSObject("System.Management.Automation.PSDriveInfo", {
              Name: "Cert",
              Provider: "Certificate",
              Root: "",
            }),
          ],
          error: null,
        };
      case "Invoke-Command": {
        const computersRaw = params.ComputerName || params.Session || "localhost";
        const computers = String(computersRaw)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        this.remoteLog = this.remoteLog || [];
        let script = String(params.ScriptBlock || args.join(" ") || "");
        script = script.replace(/\$using:([A-Za-z_][A-Za-z0-9_]*)/g, (_, n) => {
          const v = this.variables[n];
          return typeof v === "string" ? JSON.stringify(v) : String(v ?? "");
        });
        const inner = script.replace(/^\s*\{/, "").replace(/\}\s*$/, "");
        /** @type {any[]} */
        let collected = [];
        const innerUsed = new Set();

        // pure expression script block (e.g. { $using:envName } → "web01")
        const trimmedInner = inner.trim();
        if (
          trimmedInner &&
          !/\|/.test(trimmedInner) &&
          !/^[A-Za-z]+-[A-Za-z]+/.test(trimmedInner) &&
          !/^(if|switch|foreach|while|try|function)\b/i.test(trimmedInner)
        ) {
          try {
            const val = evalExpr(trimmedInner, this.variables);
            for (const computer of computers) {
              this.remoteLog.push(computer);
              collected.push(
                val instanceof PSObject
                  ? new PSObject(val.typeName, {
                      ...val.props,
                      PSComputerName: computer,
                    })
                  : new PSObject("System.String", {
                      Value: val == null ? "" : String(val),
                      PSComputerName: computer,
                    })
              );
            }
            return {
              usedCmdlets: [...new Set(used)],
              output: collected,
              error: null,
            };
          } catch {
            // fall through to pipeline
          }
        }
        for (const computer of computers) {
          this.remoteLog.push(computer);
          const r = this.runPipeline(inner);
          r.usedCmdlets.forEach((c) => innerUsed.add(c));
          for (const word of inner.matchAll(/\b([A-Za-z]+-[A-Za-z]+)\b/g)) {
            innerUsed.add(canonicalCmdlet(word[1]));
          }
          collected = collected.concat(
            r.output.map((item) => {
              if (item instanceof PSObject) {
                return new PSObject(item.typeName, {
                  ...item.props,
                  PSComputerName: computer,
                });
              }
              return item;
            })
          );
        }
        used.push(...innerUsed);
        return {
          usedCmdlets: [...new Set(used)],
          output: collected,
          error: null,
        };
      }
      case "Enter-PSSession": {
        const computer = String(params.ComputerName || "localhost");
        this.remoteLog = this.remoteLog || [];
        this.remoteLog.push(computer);
        this.pssessionHost = computer;
        return {
          output: [
            new PSObject("System.Management.Automation.Runspaces.PSSession", {
              ComputerName: computer,
              State: "Opened",
              Id: 99,
              ConfigurationName: "Microsoft.PowerShell",
            }),
          ],
          error: null,
        };
      }
      case "Exit-PSSession":
        this.pssessionHost = null;
        return { output: [], error: null };
      case "New-PSSession": {
        const computersRaw = params.ComputerName || "localhost";
        const computers = String(computersRaw)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        this.remoteLog = this.remoteLog || [];
        return {
          output: computers.map((computer, i) => {
            this.remoteLog.push(computer);
            return new PSObject(
              "System.Management.Automation.Runspaces.PSSession",
              {
                ComputerName: computer,
                State: "Opened",
                Id: i + 1,
              }
            );
          }),
          error: null,
        };
      }
      case "Remove-PSSession":
        return { output: [], error: null };
      case "Get-PSSession":
        return {
          output: [
            new PSObject("System.Management.Automation.Runspaces.PSSession", {
              ComputerName: this.pssessionHost || "localhost",
              State: "Opened",
              Id: 1,
            }),
          ],
          error: null,
        };
      case "Get-Credential": {
        const user = String(params.UserName || args[0] || "admin");
        return {
          output: [
            new PSObject("System.Management.Automation.PSCredential", {
              UserName: user,
              Password: "****",
            }),
          ],
          error: null,
        };
      }
      case "Start-Job": {
        const name = String(params.Name || `Job${(this.jobs?.length || 0) + 1}`);
        let outputVal = 42;
        const script = String(params.ScriptBlock || args.join(" ") || "");
        const inner = script.replace(/^\{/, "").replace(/\}$/, "").trim();
        if (/^\d+$/.test(inner)) outputVal = Number(inner);
        else if (inner) {
          try {
            const r = this.runPipeline(inner);
            outputVal = r.output[0] ?? 0;
            if (outputVal instanceof PSObject) {
              outputVal = outputVal.get("Value") ?? outputVal.get("Name") ?? outputVal;
            }
          } catch {
            outputVal = 42;
          }
        }
        const job = new PSObject("System.Management.Automation.Job", {
          Id: (this.jobs?.length || 0) + 1,
          Name: name,
          State: "Completed",
          Output: outputVal,
          HasMoreData: true,
        });
        this.jobs = this.jobs || [];
        this.jobs.push(job);
        return { output: [job], error: null };
      }
      case "Get-Job":
        return {
          output: (this.jobs || []).map((j) => j),
          error: null,
        };
      case "Wait-Job":
        return {
          output: (this.jobs || []).map((j) => j),
          error: null,
        };
      case "Remove-Job":
        this.jobs = [];
        return { output: [], error: null };
      case "Receive-Job": {
        const job = input[0] || (this.jobs || [])[0];
        const val = job instanceof PSObject ? job.get("Output") : 42;
        if (job instanceof PSObject && params.Keep) {
          job.props.HasMoreData = true;
        } else if (job instanceof PSObject) {
          job.props.HasMoreData = false;
        }
        return {
          output: [new PSObject("System.Double", { Value: val })],
          error: null,
        };
      }
      case "Get-CimInstance": {
        const cls = String(args[0] || params.ClassName || "Win32_OperatingSystem");
        const filter = params.Filter ? String(params.Filter) : null;
        if (/Win32_Process/i.test(cls)) {
          return {
            output: this.processes.map(
              (p) =>
                new PSObject(`ROOT\\CIMV2\\Win32_Process`, {
                  Name: p.get("Name"),
                  ProcessId: p.get("Id"),
                  WorkingSetSize: p.get("WS"),
                })
            ),
            error: null,
          };
        }
        if (/Win32_Service/i.test(cls)) {
          return {
            output: this.services.map(
              (s) =>
                new PSObject(`ROOT\\CIMV2\\Win32_Service`, {
                  Name: s.get("Name"),
                  State: s.get("Status"),
                  DisplayName: s.get("DisplayName"),
                })
            ),
            error: null,
          };
        }
        return {
          output: [
            new PSObject(`ROOT\\CIMV2\\${cls}`, {
              Caption: "Windows 11 Lab",
              Version: "10.0.22631",
              Name: cls,
              Filter: filter,
            }),
          ],
          error: null,
        };
      }
      case "Measure-Command":
        return {
          output: [
            new PSObject("System.TimeSpan", {
              TotalMilliseconds: 12.5,
              TotalSeconds: 0.0125,
            }),
          ],
          error: null,
        };
      case "Set-PSBreakpoint":
        return {
          output: [
            new PSObject("System.Management.Automation.Breakpoint", {
              Line: Number(params.Line || args[0] || 1),
              Enabled: true,
            }),
          ],
          error: null,
        };
      case "Get-PSCallStack":
        return {
          output: [
            new PSObject("System.Management.Automation.CallStackFrame", {
              Command: "Get-PSCallStack",
              Location: "lab",
            }),
          ],
          error: null,
        };
      case "Get-ExecutionPolicy":
        return {
          output: [
            new PSObject("Microsoft.PowerShell.ExecutionPolicy", {
              Value: this.executionPolicy,
              ToString: this.executionPolicy,
            }),
          ],
          error: null,
        };
      case "Set-ExecutionPolicy": {
        const pol = String(args[0] || params.ExecutionPolicy || "RemoteSigned");
        this.executionPolicy = pol;
        return { output: [], error: null };
      }
      case "Write-Warning":
        return {
          output: [
            new PSObject("WarningRecord", {
              Value: args.join(" "),
              Text: args.join(" "),
            }),
          ],
          error: null,
        };
      case "Write-Error":
        return {
          output: [
            new PSObject("ErrorRecord", {
              Value: args.join(" "),
              Text: args.join(" "),
            }),
          ],
          error: null,
        };
      case "Write-Verbose":
        return {
          output: [
            new PSObject("VerboseRecord", { Value: args.join(" ") }),
          ],
          error: null,
        };
      case "Import-Csv":
        return this.importCsv(args[0] || params.Path);
      case "Export-Csv":
        return this.exportCsv(args[0] || params.Path, input, params);
      case "ConvertFrom-Json": {
        const text = args[0] || params.InputObject || "";
        try {
          const parsed = JSON.parse(String(text));
          if (Array.isArray(parsed)) {
            return {
              output: parsed.map(
                (p) => new PSObject("PSCustomObject", p)
              ),
              error: null,
            };
          }
          return {
            output: [new PSObject("PSCustomObject", parsed)],
            error: null,
          };
        } catch (e) {
          return {
            output: [],
            error: `ConvertFrom-Json: ${e instanceof Error ? e.message : e}`,
          };
        }
      }
      case "Out-File":
        return this.outFile(args[0] || params.Path, input);
      case "Get-Item":
        return this.getContent(args[0] || params.Path, {});
      case "Select-String":
        return this.selectString(args[0] || params.Pattern, input, isSource, args, params);
      case "ConvertTo-Json":
        return {
          output: [
            new PSObject("System.String", {
              Value: JSON.stringify(
                input.map((i) =>
                  i instanceof PSObject ? i.toPlain() : i
                ),
                null,
                2
              ),
            }),
          ],
          error: null,
        };
      case "Clear-Host":
        return { output: [], error: null };
      default: {
        const lower = name.toLowerCase();
        if (lower === "ipconfig") {
          return {
            usedCmdlets: ["ipconfig"],
            output: [
              new PSObject("System.String", {
                Value: "Windows IP Configuration",
                Text: "Windows IP Configuration",
              }),
              new PSObject("System.String", {
                Value: "   IPv4 Address. . . : 10.0.0.21",
                Text: "   IPv4 Address. . . : 10.0.0.21",
              }),
            ],
            error: null,
          };
        }
        const fnName = parsed.name;
        const body = (this.functions && (this.functions[fnName] || this.functions[name])) || null;
        if (body) {
          return this.invokeFunction(body, args, params, input, isSource, used);
        }
        return {
          output: [],
          error: `The term '${name}' is not recognized as the name of a cmdlet.`,
        };
      }
    }
  }

  /**
   * Invoke a user-defined function body with simple param binding.
   * @param {string} body
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   * @param {unknown[]} input
   * @param {boolean} isSource
   * @param {string[]} used
   */
  invokeFunction(body, args, params, input, isSource, used) {
    let code = body.trim().replace(/^\s*\[CmdletBinding\(\)\]\s*/i, "");
    // strip parameter attributes: [Parameter(...)], [ValidateSet(...)]
    code = code.replace(
      /\[(Parameter|ValidateSet|Alias|ValidateRange|ValidateNotNullOrEmpty)[^\]]*\]\s*/gi,
      ""
    );
    let paramNames = [];
    const pm = code.match(/^param\s*\(([^)]*)\)\s*([\s\S]*)$/i);
    if (pm) {
      paramNames = pm[1]
        .split(",")
        .map((s) => s.trim().replace(/^\$/, ""))
        .filter(Boolean);
      code = pm[2];
    }
    paramNames.forEach((p, i) => {
      const bare = p.replace(/^\$/, "").trim();
      if (args[i] !== undefined) this.variables[bare] = coerce(args[i]);
      else if (params[bare] !== undefined && params[bare] !== true) {
        this.variables[bare] = coerce(String(params[bare]));
      }
    });

    // process { } pipeline function
    const proc = code.match(/^(?:begin\s*\{[\s\S]*?\}\s*)?process\s*\{([\s\S]*)\}\s*$/i);
    if (proc) {
      const src = isSource ? [] : input;
      const outObjs = src.map((item) => {
        this.variables._ = item;
        /** @type {string[]} */
        const local = [];
        const patched = proc[1].replace(
          /\$_\.([A-Za-z_][A-Za-z0-9_]*)/g,
          (_, prop) => {
            const v =
              item instanceof PSObject
                ? item.get(prop)
                : item && typeof item === "object"
                  ? item[prop]
                  : undefined;
            return JSON.stringify(v == null ? "" : v);
          }
        );
        this.runBlock(patched, local, used);
        if (local.length) return new PSObject("System.String", { Value: local.join("\n") });
        return new PSObject("System.String", { Value: "" });
      });
      return { output: outObjs, error: null };
    }

    /** @type {string[]} */
    const localOut = [];
    if (
      /^[A-Za-z]+-/.test(code.trim()) &&
      !code.includes("=$") &&
      !/^(if|foreach|while|try|function|switch)\b/i.test(code.trim())
    ) {
      try {
        const pr = this.runPipeline(code.trim());
        used.push(...(pr.usedCmdlets || []));
        return {
          output: pr.output,
          error: null,
          usedCmdlets: [...(used || [])],
        };
      } catch {
        /* fall through */
      }
    }
    const r = this.runBlock(code, localOut, used);
    if (r && !r.ok) return { output: [], error: r.error };
    return {
      output: localOut.map((t) => new PSObject("System.String", { Value: t })),
      error: null,
      usedCmdlets: used || [],
    };
  }

  /**
   * @param {string} topic
   */
  helpObject(topic) {
    const t = String(topic || "").toLowerCase().replace(/\s+/g, "");
    const entries = {
      "get-childitem":
        "Get-ChildItem — lists provider items. Parameters: -Path, -Filter, -Recurse. Aliases: gci, dir, ls.",
      "get-command":
        "Get-Command — discovers commands. Use -Syntax, -Module, wildcards.",
      "get-member":
        "Get-Member — lists properties/methods of piped objects. Start with TypeName.",
      "about_objects":
        "about_Objects — PowerShell pipes objects with properties and methods, not text. Use Get-Member to inspect types.",
      "about_arrays":
        "about_Arrays — @() forces array context. Index from 0. Wrap one element to keep an array.",
      "about_hash_tables":
        "about_Hash_Tables — @{} stores keys/values. Splatting passes them as parameters.",
      "about_functions":
        "about_Functions — verb-noun names, param blocks, begin/process/end, [CmdletBinding()].",
      "about_functions_advanced":
        "about_Functions_Advanced — [Parameter(Mandatory)], ValueFromPipeline, ValidateSet, common parameters.",
      "about_script_blocks":
        "about_Script_Blocks — { } are delayed code for ForEach-Object, jobs, remoting.",
      "about_execution_policies":
        "about_Execution_Policies — Restricted, RemoteSigned, Unrestricted, Bypass. Not a security boundary.",
      "about_constrainedlanguage":
        "about_ConstrainedLanguage — Constrained Language Mode restricts types and methods for hardened hosts.",
      "about_error_records":
        "about_Error_Records — $_ in catch is ErrorRecord: Exception, TargetObject, CategoryInfo.",
      "about_scopes":
        "about_Scopes — local/script/global frames. $script: and $global: name them.",
      "about_remoting":
        "about_Remoting — Invoke-Command fan-out, PSSessions, $using: for local variables.",
      "about_jobs":
        "about_Jobs — Start-Job, Get-Job, Wait-Job, Receive-Job, Remove-Job.",
      "about_parameters":
        "about_Parameters — named/positional binding, parameter sets, splatting.",
      "about_operators":
        "about_Operators — -eq -like -match -replace -join -split -f -as -in -contains.",
      "about_wildcards":
        "about_Wildcards — * and ? in -like, -Filter. Use -match for regex.",
      "about_profiles":
        "about_Profiles — $PROFILE startup script. Dot-source to load into current scope.",
      "about_assignment":
        "about_Assignment — = assigns. += appends/adds. $x++ increments.",
      "about_debuggers":
        "about_Debuggers — Set-PSBreakpoint, Wait-Debugger, Get-PSCallStack, stepping.",
      "about_functions_advanced_parameters":
        "about_Functions_Advanced_Parameters — Mandatory, ValueFromPipeline, ValidateSet, dynamic parameters.",
      "about_windows_compatibility":
        "about_Windows_Compatibility — Windows PowerShell 5.1 vs pwsh 7 differences.",
    };
    const text =
      entries[t] ||
      (t.startsWith("about_")
        ? `${topic} — concept help topic. Try about_Objects, about_Arrays, about_Functions, about_Remoting.`
        : `Help for ${topic || "cmdlets"} — syntax, parameters, examples. Try Get-Help about_Operators.`);
    return [
      new PSObject("HelpInfo", {
        Name: topic || "Get-Help",
        Detail: text,
        ToString: `${topic || "Help"}: ${text}`,
      }),
    ];
  }

  /**
   * @param {string | undefined} target
   */
  importCsv(target) {
    if (!target) return { output: [], error: "Import-Csv: missing Path." };
    const path = resolvePath(this.cwd, target);
    const node = getNode(this.fs, path);
    if (!node || node.type !== "file") {
      return { output: [], error: `Import-Csv: cannot find '${path}'.` };
    }
    const lines = String(node.content || "").split(/\r?\n/).filter(Boolean);
    if (!lines.length) return { output: [], error: null };
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
      const cells = line.split(",").map((c) => c.trim());
      /** @type {Record<string, unknown>} */
      const props = {};
      headers.forEach((h, i) => {
        const cell = cells[i] ?? "";
        props[h] = /^-?\d+(\.\d+)?$/.test(cell) ? Number(cell) : cell;
      });
      return new PSObject("PSCustomObject", props);
    });
    return { output: rows, error: null };
  }

  /**
   * @param {string | undefined} target
   * @param {unknown[]} input
   * @param {Record<string, string | boolean>} params
   */
  exportCsv(target, input, params) {
    if (!target) return { output: [], error: "Export-Csv: missing Path." };
    const path = resolvePath(this.cwd, target);
    const parent = getNode(this.fs, parentPath(path));
    if (!parent || parent.type !== "dir") {
      return { output: [], error: `Export-Csv: parent missing for '${path}'.` };
    }
    const rows = input.map((item) =>
      item instanceof PSObject ? item.props : { Value: item }
    );
    const headers = rows.length ? Object.keys(rows[0]) : ["Value"];
    const lines = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => r[h] ?? "").join(",")),
    ];
    const name = basename(path);
    parent.children[name] = {
      name,
      type: "file",
      content: `${lines.join("\n")}\n`,
      length: lines.join("\n").length,
      lastWrite: new Date().toISOString(),
    };
    void params;
    return { output: [], error: null };
  }

  /**
   * @param {string | undefined} target
   * @param {unknown[]} input
   */
  outFile(target, input) {
    if (!target) return { output: [], error: "Out-File: missing Path." };
    const path = resolvePath(this.cwd, target);
    const parent = getNode(this.fs, parentPath(path));
    if (!parent || parent.type !== "dir") {
      return { output: [], error: `Out-File: parent missing.` };
    }
    const text = input
      .map((i) => (i instanceof PSObject ? formatOutput(i) : String(i)))
      .join("\n");
    const name = basename(path);
    parent.children[name] = {
      name,
      type: "file",
      content: `${text}\n`,
      length: text.length,
      lastWrite: new Date().toISOString(),
    };
    return { output: [], error: null };
  }

  /**
   * @param {string} target
   */
  setLocation(target) {
    const raw = String(target || ".");
    if (/^env:/i.test(raw)) {
      this.cwd = "Env:";
      return {
        output: [
          new PSObject("System.Management.Automation.PathInfo", {
            Path: "Env:",
            Drive: "Env",
            ProviderPath: "Env:",
          }),
        ],
        error: null,
      };
    }
    const path = resolvePath(this.cwd, raw);
    const node = getNode(this.fs, path);
    if (!node) {
      return { output: [], error: `Cannot find path '${path}' because it does not exist.` };
    }
    if (node.type !== "dir") {
      return { output: [], error: `Cannot find path '${path}' because it is not a directory.` };
    }
    this.cwd = path;
    return {
      output: [
        new PSObject("System.Management.Automation.PathInfo", {
          Path: this.cwd,
          Drive: this.cwd.split("\\")[0],
          ProviderPath: this.cwd,
        }),
      ],
      error: null,
    };
  }

  /**
   * @param {PSObject[] | unknown[]} items
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   */
  filterByName(items, args, params) {
    const name = args[0] || (typeof params.Name === "string" ? params.Name : null);
    if (!name) return items.slice();
    return items.filter((item) => {
      const n = String(/** @type {any} */ (item).get?.("Name") ?? "");
      return likeMatch(n, name);
    });
  }

  /**
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   * @param {unknown[]} input
   * @param {boolean} isSource
   */
  getChildItem(args, params, input, isSource) {
    args = (args || []).filter((a) => a != null && !/^@[A-Za-z_]/.test(String(a)));
    let pathArg = args[0] || (typeof params.Path === "string" ? params.Path : null);
    if (!isSource && input.length) {
      // path from pipeline items
      const fromPipe = input
        .map((i) =>
          i instanceof PSObject
            ? String(i.get("FullName") ?? i.get("Name") ?? i.get("Value") ?? "")
            : String(i)
        )
        .filter(Boolean);
      const results = [];
      for (const p of fromPipe) {
        const r = this.listPath(p, params);
        if (r.error) return r;
        results.push(...r.output);
      }
      return { output: results, error: null };
    }
    return this.listPath(pathArg || ".", params);
  }

  /**
   * @param {string} target
   * @param {Record<string, string | boolean>} params
   */
  listPath(target, params) {
    const raw = String(target || ".");
    const cwdEnv = String(this.cwd || "").toLowerCase() === "env:";
    if (raw.toLowerCase().startsWith("env:") || (cwdEnv && (raw === "." || raw === "" || raw === "\\"))) {
      const prefix =
        raw.toLowerCase() === "env:" ||
        raw.toLowerCase() === "env:\\" ||
        raw === "." ||
        raw === ""
          ? ""
          : raw.replace(/^env:/i, "").replace(/^\\/, "");
      return {
        output: Object.keys(this.variables)
          .filter((k) => k.startsWith("env:"))
          .filter((k) => !prefix || k.toLowerCase().includes(prefix.toLowerCase()))
          .map(
            (k) =>
              new PSObject("System.Collections.DictionaryEntry", {
                Name: k.slice(4),
                Value: this.variables[k],
                Key: k.slice(4),
              })
          ),
        error: null,
      };
    }
    if (/^HKLM:/i.test(raw)) {
      const key = raw.replace(/\//g, "\\");
      const nodeR = this.registry?.[key] || this.registry?.["HKLM:\\Software"];
      return {
        output: Object.keys(nodeR || { Microsoft: {} }).map(
          (n) =>
            new PSObject("Microsoft.Win32.RegistryKey", {
              Name: n,
              PSChildName: n,
              PSPath: `${key}\\${n}`,
            })
        ),
        error: null,
      };
    }
    if (/^Cert:/i.test(raw)) {
      const items = this.certStore?.["Cert:\\CurrentUser\\My"] || [
        { Subject: "CN=lab-client" },
      ];
      return {
        output: items.map(
          (c) =>
            new PSObject("System.Security.Cryptography.X509Certificates.X509Certificate2", {
              Subject: c.Subject,
              Thumbprint: "AABBCC",
            })
        ),
        error: null,
      };
    }
    const path = resolvePath(this.cwd, target);
    const node = getNode(this.fs, path);
    if (!node) {
      return {
        output: [],
        error: `Cannot find path '${path}' because it does not exist.`,
      };
    }
    if (node.type === "file") {
      return { output: [fileToItem(node, parentPath(path))], error: null };
    }
    const filter =
      typeof params.Filter === "string" ? params.Filter : null;
    const recurse = Boolean(params.Recurse);
    /** @type {PSObject[]} */
    const items = [];
    /**
     * @param {Record<string, unknown>} dir
     * @param {string} dirPath
     */
    const walk = (dir, dirPath) => {
      for (const child of Object.values(dir.children || {})) {
        const childPath = `${dirPath}\\${child.name}`;
        if (!filter || likeMatch(String(child.name), filter)) {
          items.push(fileToItem(child, dirPath));
        }
        if (recurse && child.type === "dir") walk(child, childPath);
      }
    };
    walk(node, path);
    return { output: items, error: null };
  }

  /**
   * @param {string | undefined} target
   * @param {Record<string, string | boolean>} params
   */
  getContent(target, params) {
    if (!target) return { output: [], error: "Get-Content: missing Path." };
    const path = resolvePath(this.cwd, target);
    const node = getNode(this.fs, path);
    if (!node || node.type !== "file") {
      return {
        output: [],
        error: `Cannot find path '${path}' because it does not exist.`,
      };
    }
    const lines = String(node.content || "").split(/\r?\n/).filter((l, i, a) => !(i === a.length - 1 && l === ""));
    let selected = lines;
    if (params.TotalCount !== undefined && params.TotalCount !== true) {
      selected = lines.slice(0, Number(params.TotalCount));
    }
    return {
      output: selected.map((line) => new PSObject("System.String", { Value: line })),
      error: null,
    };
  }

  /**
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   */
  getVariable(args, params) {
    const name = args[0] || (typeof params.Name === "string" ? params.Name : null);
    const entries = Object.entries(this.variables).filter(
      ([k]) => !k.startsWith("env:") || name
    );
    if (name) {
      if (!(name in this.variables)) {
        return { output: [], error: `Cannot find a variable with the name '${name}'.` };
      }
      return {
        output: [
          new PSObject("System.Management.Automation.PSVariable", {
            Name: name,
            Value: this.variables[name],
          }),
        ],
        error: null,
      };
    }
    return {
      output: entries.map(
        ([k, v]) =>
          new PSObject("System.Management.Automation.PSVariable", {
            Name: k,
            Value: v,
          })
      ),
      error: null,
    };
  }

  /**
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   */
  setVariable(args, params) {
    let name = args[0] || (typeof params.Name === "string" ? params.Name : null);
    let value = args[1] !== undefined ? args[1] : params.Value;
    if (!name) return { output: [], error: "Set-Variable: missing Name." };
    if (name.startsWith("$")) name = name.slice(1);
    // `$x = value` style is handled by caller assignment parser; here -Name -Value
    if (value === undefined) value = true;
    this.variables[name] = coerce(value);
    return {
      output: [
        new PSObject("System.Management.Automation.PSVariable", {
          Name: name,
          Value: this.variables[name],
        }),
      ],
      error: null,
    };
  }

  /**
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   * @param {unknown[]} input
   */
  selectObject(args, params, input) {
    const props = args
      .flatMap((a) => a.split(","))
      .map((a) => a.trim())
      .filter((a) => a && a.toLowerCase() !== "unique");
    const unique =
      Boolean(params.Unique) || args.some((a) => a.toLowerCase() === "unique");
    const first =
      params.First !== undefined && params.First !== true
        ? Number(params.First)
        : null;
    const last =
      params.Last !== undefined && params.Last !== true
        ? Number(params.Last)
        : null;

    let out = input.slice();

    if (props.length) {
      out = out.map((item) => {
        if (!(item instanceof PSObject)) {
          return new PSObject("Selected.System.String", { Value: String(item) });
        }
        /** @type {Record<string, unknown>} */
        const nextProps = {};
        for (const p of props) nextProps[p] = item.get(p);
        return new PSObject(`Selected.${item.typeName}`, nextProps);
      });
    }

    if (unique) {
      const seen = new Set();
      out = out.filter((item) => {
        const key = JSON.stringify(item instanceof PSObject ? item.props : item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    if (first != null) out = out.slice(0, first);
    if (last != null) out = out.slice(Math.max(0, out.length - last));
    return { output: out, error: null };
  }

  /**
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   * @param {unknown[]} input
   */
  whereObject(args, params, input) {
    // Forms:
    //   Where-Object Name -eq foo
    //   Where-Object -Property Name -EQ foo
    //   Where-Object { $_.CPU -gt 50 }   (simplified: property compare)
    let prop = /** @type {string | null} */ (null);
    let op = "-eq";
    let value = /** @type {unknown} */ (null);

    if (args.length === 1 && args[0].includes("{")) {
      const m = args[0].match(/\$_\.([A-Za-z_][A-Za-z0-9_]*)\s+(-\w+)\s+(.+)/);
      if (!m) {
        return {
          output: [],
          error: "Where-Object: unsupported script block. Use Property -Op Value.",
        };
      }
      prop = m[1];
      op = m[2];
      value = coerce(unquote(m[3].trim()));
    } else if (params.Property || params.Filter) {
      prop = String(params.Property || params.Filter);
      const keys = Object.keys(params).filter(
        (k) => k.startsWith("-") || ["eq", "ne", "gt", "ge", "lt", "le", "like", "match"].includes(k.toLowerCase().replace(/^-/, ""))
      );
      // parse leftover -EQ value style already in params as keys?
      // Simpler: Where-Object -Property CPU -GT 50 becomes params.Property=CPU, args?
    }

    if (!prop && args.length >= 1) {
      prop = args[0];
    }
    if (args.length >= 2) {
      const maybeOp = args[1];
      if (/^-\w+/.test(maybeOp)) {
        op = maybeOp;
        value = coerce(args[2]);
      } else if (args.length >= 3) {
        op = args[1].startsWith("-") ? args[1] : `-${args[1]}`;
        value = coerce(args[2]);
      }
    }

    // Handle: Where-Object -Property CPU -GT 50  (params.Property, and -GT as unknown?)
    // tokenize turns -GT 50 into params.GT=50 if we use parseArgs.
    const cmpOps = ["EQ", "NE", "GT", "GE", "LT", "LE", "LIKE", "MATCH"];
    for (const o of cmpOps) {
      if (params[o] !== undefined && params[o] !== true) {
        op = `-${o}`;
        value = coerce(String(params[o]));
        if (!prop && params.Property) prop = String(params.Property);
      }
      if (params[o.toLowerCase()] !== undefined && params[o.toLowerCase()] !== true) {
        op = `-${o}`;
        value = coerce(String(params[o.toLowerCase()]));
        if (!prop && params.Property) prop = String(params.Property);
      }
    }
    if (params.Property && !prop) prop = String(params.Property);

    if (!prop) {
      return { output: [], error: "Where-Object: missing Property." };
    }

    const out = input.filter((item) => {
      const left =
        item instanceof PSObject
          ? item.get(prop)
          : /** @type {any} */ (item)?.[prop];
      return compare(left, op, value);
    });
    return { output: out, error: null };
  }

  /**
   * Supported ForEach-Object forms:
   *   ForEach-Object Name
   *   ForEach-Object { $_.Name }
   *   ForEach-Object { $_.CPU + 1 }  (arithmetic on property)
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   * @param {unknown[]} input
   */
  forEachObject(args, params, input) {
    const expr = args.join(" ").trim();
    // allow side-effect script blocks: { $c = $_.Count }
    const assignM = expr.match(/^\{\s*\$(\w+)\s*=\s*\$_\.([A-Za-z_][\w]*)\s*\}$/);
    if (assignM) {
      const out = input.map((item) => {
        const val = item instanceof PSObject ? item.get(assignM[2]) : item;
        this.setVar(assignM[1], val);
        return new PSObject("System.Double", { Value: Number(val) || 0 });
      });
      return { output: out, error: null };
    }
    const out = input.map((item) => {
      if (!expr) return item;
      const brace = expr.replace(/^\{/, "").replace(/\}$/, "").trim();
      const propOnly = brace.match(/^\$_\.([A-Za-z_][A-Za-z0-9_]*)$/);
      if (propOnly) {
        const v = item instanceof PSObject ? item.get(propOnly[1]) : item;
        return new PSObject("System.String", { Value: v == null ? "" : String(v) });
      }
      const add = brace.match(/^\$_\.([A-Za-z_][A-Za-z0-9_]*)\s*\+\s*(.+)$/);
      if (add) {
        const left = item instanceof PSObject ? item.get(add[1]) : 0;
        const right = coerce(add[2]);
        return new PSObject("System.Double", {
          Value: Number(left) + Number(right),
        });
      }
      const mul = brace.match(/^\$_\.([A-Za-z_][A-Za-z0-9_]*)\s*\*\s*(.+)$/);
      if (mul) {
        const left = item instanceof PSObject ? item.get(mul[1]) : 0;
        const right = coerce(mul[2]);
        return new PSObject("System.Double", {
          Value: Number(left) * Number(right),
        });
      }
      const propFromArg = brace.match(/^([A-Za-z_][A-Za-z0-9_]*)$/);
      if (propFromArg) {
        const v = item instanceof PSObject ? item.get(propFromArg[1]) : item;
        return new PSObject("System.String", { Value: v == null ? "" : String(v) });
      }
      return item;
    });
    return { output: out, error: null };
  }

  /**
   * @param {Record<string, string | boolean>} params
   * @param {unknown[]} input
   */
  measureObject(params, input) {
    const prop = params.Property ? String(params.Property) : null;
    const count = input.length;
    /** @type {Record<string, unknown>} */
    const props = { Count: count };
    if (prop) {
      const nums = input
        .map((i) => Number(i instanceof PSObject ? i.get(prop) : i))
        .filter((n) => !Number.isNaN(n));
      if (nums.length) {
        props.Sum = nums.reduce((a, b) => a + b, 0);
        props.Average = props.Sum / nums.length;
        props.Maximum = Math.max(...nums);
        props.Minimum = Math.min(...nums);
        props.Property = prop;
      }
    }
    return {
      output: [new PSObject("Microsoft.PowerShell.Commands.GenericMeasureInfo", props)],
      error: null,
    };
  }

  /**
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   * @param {unknown[]} input
   */
  sortObject(args, params, input) {
    const prop = args[0] || (params.Property ? String(params.Property) : null);
    const desc = Boolean(params.Descending);
    const out = input.slice().sort((a, b) => {
      const av = a instanceof PSObject && prop ? a.get(prop) : a;
      const bv = b instanceof PSObject && prop ? b.get(prop) : b;
      if (typeof av === "number" && typeof bv === "number") {
        return desc ? bv - av : av - bv;
      }
      const as = String(av ?? "");
      const bs = String(bv ?? "");
      return desc ? bs.localeCompare(as) : as.localeCompare(bs);
    });
    return { output: out, error: null };
  }

  /**
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   * @param {unknown[]} input
   */
  formatTable(args, params, input) {
    const props = args.length
      ? args
      : params.Property
        ? String(params.Property).split(",").map((s) => s.trim())
        : null;
    const lines = renderTable(input, props);
    return {
      output: lines.map((line) => new PSObject("FormatEntry", { Text: line })),
      error: null,
    };
  }

  /**
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   * @param {unknown[]} input
   */
  formatList(args, params, input) {
    const props = args.length
      ? args
      : params.Property
        ? String(params.Property).split(",").map((s) => s.trim())
        : null;
    /** @type {PSObject[]} */
    const out = [];
    for (const item of input) {
      if (!(item instanceof PSObject)) {
        out.push(new PSObject("FormatEntry", { Text: String(item) }));
        continue;
      }
      const keys = props || Object.keys(item.props).filter((k) => k !== "ToString");
      for (const k of keys) {
        out.push(
          new PSObject("FormatEntry", {
            Text: `${k.padEnd(16)}: ${stringify(item.get(k))}`,
          })
        );
      }
      out.push(new PSObject("FormatEntry", { Text: "" }));
    }
    return { output: out, error: null };
  }

  /**
   * @param {unknown[]} input
   */
  outString(input) {
    const lines = renderTable(input, null);
    return {
      output: [
        new PSObject("System.String", { Value: lines.join("\n") }),
      ],
      error: null,
    };
  }

  /**
   * @param {string | undefined} pattern
   * @param {unknown[]} input
   * @param {boolean} isSource
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   */
  selectString(pattern, input, isSource, args, params) {
    const path = params.Path ? String(params.Path) : args[1] || null;
    let lines = input.map((i) =>
      i instanceof PSObject ? String(i.get("Value") ?? i.get("Text") ?? "") : String(i)
    );
    if (path || (isSource && (params.Path || (args[0] && String(args[0]).includes("\\"))))) {
      const p = path || args[0];
      const r = this.getContent(p, {});
      if (r.error) return r;
      lines = r.output.map((o) => String(o.get("Value")));
      if (!pattern && params.Pattern) pattern = String(params.Pattern);
    }
    if (!pattern) return { output: [], error: "Select-String: missing Pattern." };
    const rx = new RegExp(pattern, "i");
    const matches = lines
      .map((line, idx) => ({ line, idx }))
      .filter(({ line }) => rx.test(line))
      .map(
        ({ line, idx }) =>
          new PSObject("Microsoft.PowerShell.Commands.MatchInfo", {
            LineNumber: idx + 1,
            Line: line,
            Pattern: pattern,
            Path: path || this.cwd,
          })
      );
    return { output: matches, error: null };
  }

  /**
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   */
  newItem(args, params) {
    const pathArg = args[0] || (typeof params.Path === "string" ? params.Path : null);
    const type = String(params.ItemType || params.Type || "File").toLowerCase();
    if (!pathArg) return { output: [], error: "New-Item: missing Path." };
    const path = resolvePath(this.cwd, pathArg);
    const parent = getNode(this.fs, parentPath(path));
    if (!parent || parent.type !== "dir") {
      return {
        output: [],
        error: `New-Item: parent directory does not exist for '${path}'.`,
      };
    }
    const name = basename(path);
    if (parent.children[name.toLowerCase()] || Object.values(parent.children || {}).some((c) => String(c.name).toLowerCase() === name.toLowerCase())) {
      return {
        output: [],
        error: `New-Item: item '${path}' already exists.`,
      };
    }
    if (!parent.children) parent.children = {};
    if (type.includes("dir")) {
      parent.children[name] = {
        name,
        type: "dir",
        children: {},
      };
    } else {
      parent.children[name] = {
        name,
        type: "file",
        content: "",
        length: 0,
        lastWrite: new Date().toISOString(),
      };
    }
    const node = parent.children[name];
    return { output: [fileToItem(node, parentPath(path))], error: null };
  }

  /**
   * @param {string | undefined} target
   * @param {Record<string, string | boolean>} params
   */
  removeItem(target, params) {
    if (!target) return { output: [], error: "Remove-Item: missing Path." };
    const path = resolvePath(this.cwd, target);
    const parent = getNode(this.fs, parentPath(path));
    const name = basename(path);
    if (!parent || !parent.children) {
      return {
        output: [],
        error: `Cannot find path '${path}' because it does not exist.`,
      };
    }
    const key = Object.keys(parent.children).find(
      (k) => k.toLowerCase() === name.toLowerCase()
    );
    if (!key) {
      return {
        output: [],
        error: `Cannot find path '${path}' because it does not exist.`,
      };
    }
    const node = parent.children[key];
    if (node.type === "dir" && Object.keys(node.children || {}).length && !params.Recurse) {
      return {
        output: [],
        error: `The directory '${path}' is not empty. Use -Recurse.`,
      };
    }
    delete parent.children[key];
    return { output: [], error: null };
  }

  /**
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   */
  setContent(args, params) {
    const pathArg = args[0] || (typeof params.Path === "string" ? params.Path : null);
    const value = args[1] !== undefined ? args[1] : params.Value != null && params.Value !== true ? String(params.Value) : "";
    if (!pathArg) return { output: [], error: "Set-Content: missing Path." };
    const path = resolvePath(this.cwd, pathArg);
    let node = getNode(this.fs, path);
    if (!node) {
      const created = this.newItem([pathArg], {});
      if (created.error) return created;
      node = getNode(this.fs, path);
    }
    if (!node || node.type !== "file") {
      return { output: [], error: `Set-Content: '${path}' is not a file.` };
    }
    const text = String(value ?? "");
    node.content = text.endsWith("\n") ? text : `${text}\n`;
    node.length = node.content.length;
    node.lastWrite = new Date().toISOString();
    return { output: [], error: null };
  }

  /**
   * @param {string[]} args
   * @param {Record<string, string | boolean>} params
   */
  addContent(args, params) {
    const pathArg = args[0] || (typeof params.Path === "string" ? params.Path : null);
    const value = args[1] !== undefined ? args[1] : params.Value != null && params.Value !== true ? String(params.Value) : "";
    if (!pathArg) return { output: [], error: "Add-Content: missing Path." };
    const path = resolvePath(this.cwd, pathArg);
    const node = getNode(this.fs, path);
    if (!node || node.type !== "file") {
      return {
        output: [],
        error: `Add-Content: cannot find '${path}'.`,
      };
    }
    const text = String(value ?? "");
    node.content = `${node.content || ""}${text}\n`;
    node.length = node.content.length;
    node.lastWrite = new Date().toISOString();
    return { output: [], error: null };
  }

  /**
   * @param {string | undefined} target
   */
  testPath(target) {
    if (!target) return { output: [], error: "Test-Path: missing Path." };
    const path = resolvePath(this.cwd, target);
    const node = getNode(this.fs, path);
    return {
      output: [
        new PSObject("System.Boolean", { Value: Boolean(node) }),
      ],
      error: null,
    };
  }
}

/**
 * Split top-level `;` statements (not inside quotes).
 * @param {string} line
 * @returns {string[]}
 */
export function splitStatements(line) {
  const parts = [];
  let current = "";
  let quote = /** @type {null | "'" | '"'} */ (null);
  let depth = 0;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quote) {
      current += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === "{" || ch === "(" || ch === "[") depth += 1;
    if (ch === "}" || ch === ")" || ch === "]") depth -= 1;
    if (ch === ";" && depth <= 0) {
      if (current.trim()) parts.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/**
 * Convert a filesystem node to a FileSystem item object.
 * @param {Record<string, unknown>} node
 * @param {string} parent
 * @returns {PSObject}
 */
function fileToItem(node, parent) {
  const full = `${parent}\\${node.name}`;
  if (node.type === "dir") {
    return new PSObject("System.IO.DirectoryInfo", {
      Name: node.name,
      FullName: full,
      PSIsContainer: true,
      Mode: "d----",
      LastWriteTime: node.lastWrite || "2026-01-01T00:00:00",
    });
  }
  return new PSObject("System.IO.FileInfo", {
    Name: node.name,
    FullName: full,
    Length: node.length ?? String(node.content || "").length,
    Extension: String(node.name).includes(".")
      ? `.${String(node.name).split(".").pop()}`
      : "",
    PSIsContainer: false,
    LastWriteTime: node.lastWrite || "2026-01-01T00:00:00",
  });
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function stringify(value) {
  if (value == null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * Format one pipeline object for terminal output.
 * @param {unknown} item
 * @returns {string}
 */
export function formatOutput(item) {
  if (item == null) return "";
  if (typeof item === "string") return item;
  if (item instanceof PSObject) {
    if (item.typeName === "FormatEntry" || item.typeName === "System.String") {
      return String(item.get("Text") ?? item.get("Value") ?? "");
    }
    if (item.typeName === "System.Boolean") {
      return item.get("Value") ? "True" : "False";
    }
    if (item.typeName === "System.Management.Automation.PathInfo") {
      return String(item.get("Path"));
    }
    if (item.typeName === "System.Management.Automation.PSVariable") {
      return `${item.get("Name")} : ${stringify(item.get("Value"))}`;
    }
    // generic default: Name field or property dump
    if (item.get("Name") != null && Object.keys(item.props).length <= 6) {
      return renderTable([item], null)[2] || renderTable([item], null).join("\n");
    }
    return renderTable([item], null).join("\n");
  }
  return String(item);
}

/**
 * Preview object for pipeline visualizer cards.
 * @param {unknown} item
 * @returns {{ type: string, title: string, fields: Record<string, string> }}
 */
export function previewObject(item) {
  if (item instanceof PSObject) {
    const keys = Object.keys(item.props)
      .filter((k) => k !== "ToString" && k !== "PSTypeName")
      .slice(0, 3);
    /** @type {Record<string, string>} */
    const fields = {};
    for (const k of keys) fields[k] = stringify(item.get(k));
    const title =
      item.get("Name") != null
        ? String(item.get("Name"))
        : item.get("Value") != null
          ? String(item.get("Value"))
          : item.typeName.split(".").pop();
    return { type: item.typeName, title, fields };
  }
  return { type: "Object", title: String(item), fields: {} };
}

/**
 * Render a simple fixed-width table.
 * @param {unknown[]} input
 * @param {string[] | null} props
 * @returns {string[]}
 */
function renderTable(input, props) {
  if (!input.length) return [];
  const rows = input.map((item) => {
    if (item instanceof PSObject) {
      const keys = props || Object.keys(item.props).filter((k) => k !== "ToString");
      /** @type {Record<string, string>} */
      const row = {};
      for (const k of keys) row[k] = stringify(item.get(k));
      return row;
    }
    return { Value: stringify(item) };
  });
  const cols = props && props.length ? props : Object.keys(rows[0]);
  const widths = cols.map((c) =>
    Math.max(c.length, ...rows.map((r) => (r[c] ?? "").length))
  );
  const header = cols.map((c, i) => c.padEnd(widths[i])).join("  ");
  const sep = widths.map((w) => "-".repeat(w)).join("  ");
  const body = rows.map((r) =>
    cols.map((c, i) => (r[c] ?? "").padEnd(widths[i])).join("  ").trimEnd()
  );
  return [header, sep, ...body];
}

/**
 * @param {string | undefined} topic
 * @returns {string}
 */
function helpText(topic) {
  const t = (topic || "").toLowerCase();
  const map = {
    "": `LearnPowerShell help
  levels        open the level browser
  hint          show the current level hint
  goal          show win conditions
  steps         show the teaching guide for the current level
  curriculum    list what you have learned and what is left
  undo          revert the last command
  reset         reset session state
  build level   export a custom level JSON
  import level  import a level JSON

Cmdlets: Get-Location, Set-Location, Get-ChildItem, Get-Content,
Get-Process, Get-Service, Select-Object, Where-Object, ForEach-Object,
Sort-Object, Measure-Object, Format-Table, Format-List, New-Item,
Set-Content, Remove-Item, Test-Path, Select-String, and aliases.

Pipeline: cmd1 | cmd2  — objects flow between stages.`,
    "where-object":
      "Where-Object Property -Op Value\nOps: -eq -ne -gt -ge -lt -le -like -match\nExample: Get-Process | Where-Object CPU -gt 50",
    "select-object":
      "Select-Object Name, Id  |  Select-Object -First 3  |  -Unique",
    "foreach-object":
      "ForEach-Object Name   or   ForEach-Object { $_.CPU + 1 }",
  };
  return map[t] || map[""];
}
