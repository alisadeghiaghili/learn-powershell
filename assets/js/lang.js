/**
 * PowerShell-like language layer: expressions, operators, and statements.
 * Used by Session.run for real control flow and data structures.
 *
 * Intentionally independent of engine.js (no circular imports).
 */

/**
 * @param {string} token
 * @returns {string}
 */
function unquote(token) {
  if (
    (token.startsWith('"') && token.endsWith('"') && token.length >= 2) ||
    (token.startsWith("'") && token.endsWith("'") && token.length >= 2)
  ) {
    return token.slice(1, -1);
  }
  return token;
}

/**
 * @param {string} raw
 * @param {Record<string, unknown>} variables
 * @returns {string}
 */
function expand(raw, variables) {
  let out = raw;
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
 * @param {unknown} v
 */
function isPSObject(v) {
  return (
    v != null &&
    typeof v === "object" &&
    "typeName" in v &&
    "props" in v &&
    typeof (/** @type {any} */ (v).get) === "function"
  );
}

/**
 * @param {unknown} v
 * @returns {string | number | boolean | null | unknown[] | Record<string, unknown>}
 */
export function coerceVal(v) {
  if (v == null) return null;
  if (isPSObject(v)) {
    const obj = /** @type {any} */ (v);
    if (obj.get("Value") !== undefined && Object.keys(obj.props).length <= 2) {
      return coerceVal(obj.get("Value"));
    }
    return v;
  }
  return v;
}

/**
 * @param {unknown} a
 * @param {unknown} b
 */
export function equals(a, b) {
  const x = coerceVal(a);
  const y = coerceVal(b);
  if (typeof x === "number" || typeof y === "number") {
    const nx = Number(x);
    const ny = Number(y);
    if (!Number.isNaN(nx) && !Number.isNaN(ny)) return nx === ny;
  }
  if (typeof x === "boolean" || typeof y === "boolean") {
    return Boolean(x) === Boolean(y);
  }
  return String(x).toLowerCase() === String(y).toLowerCase();
}

/**
 * @param {string} value
 * @param {string} pattern
 */
export function likeMatch(value, pattern) {
  const rx = String(pattern)
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");
  return new RegExp(`^${rx}$`, "i").test(String(value));
}

/**
 * @param {unknown} left
 * @param {string} op
 * @param {unknown} right
 */
export function compareOp(left, op, right) {
  const l = coerceVal(left);
  const r = coerceVal(right);
  switch (String(op).toLowerCase()) {
    case "-eq":
    case "==":
      return equals(l, r);
    case "-ne":
    case "!=":
      return !equals(l, r);
    case "-gt":
    case ">":
      return Number(l) > Number(r);
    case "-ge":
    case ">=":
      return Number(l) >= Number(r);
    case "-lt":
    case "<":
      return Number(l) < Number(r);
    case "-le":
    case "<=":
      return Number(l) <= Number(r);
    case "-like":
      return likeMatch(l, r);
    case "-notlike":
      return !likeMatch(l, r);
    case "-match":
      try {
        return new RegExp(String(r), "i").test(String(l));
      } catch {
        return false;
      }
    case "-notmatch":
      try {
        return !new RegExp(String(r), "i").test(String(l));
      } catch {
        return true;
      }
    case "-contains":
      return Array.isArray(l) && l.some((x) => equals(x, r));
    case "-in":
      return Array.isArray(r) && r.some((x) => equals(l, x));
    case "-is":
      return typeCheck(l, r);
    default:
      return equals(l, r);
  }
}

/**
 * @param {unknown} v
 * @param {unknown} typeName
 */
function typeCheck(v, typeName) {
  const t = String(typeName).toLowerCase();
  if (t.includes("int")) return typeof v === "number" && Number.isInteger(v);
  if (t.includes("double") || t.includes("float") || t.includes("decimal")) {
    return typeof v === "number";
  }
  if (t.includes("string")) return typeof v === "string";
  if (t.includes("bool")) return typeof v === "boolean";
  if (t.includes("array")) return Array.isArray(v);
  if (t.includes("hashtable") || t.includes("dict")) {
    return v != null && typeof v === "object" && !Array.isArray(v) && !(v instanceof PSObject);
  }
  return false;
}

/**
 * Split top-level by a delimiter char, respecting quotes/parens/brackets.
 * @param {string} text
 * @param {string} delims
 * @returns {string[]}
 */
export function splitTop(text, delims) {
  const parts = [];
  let cur = "";
  let quote = /** @type {null | "'" | '"'} */ (null);
  let depth = 0;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      cur += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      cur += ch;
      continue;
    }
    if (ch === "(" || ch === "[" || ch === "{") depth += 1;
    if (ch === ")" || ch === "]" || ch === "}") depth -= 1;
    if (depth === 0 && delims.includes(ch)) {
      if (cur.trim() || parts.length) parts.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.trim() || !parts.length) parts.push(cur.trim());
  return parts;
}

/**
 * Evaluate a simple expression (no cmdlets).
 * @param {string} expr
 * @param {Record<string, unknown>} vars
 * @returns {unknown}
 */
export function evalExpr(expr, vars) {
  let e = expr.trim();
  if (!e) return null;

  // parenthesized group
  if (e.startsWith("(") && e.endsWith(")") && balanced(e.slice(1, -1))) {
    return evalExpr(e.slice(1, -1), vars);
  }

  // logical -or / -and
  const orParts = splitLogical(e, "-or");
  if (orParts.length > 1) {
    return orParts.some((p) => truthy(evalExpr(p, vars)));
  }
  const andParts = splitLogical(e, "-and");
  if (andParts.length > 1) {
    return andParts.every((p) => truthy(evalExpr(p, vars)));
  }
  if (/^!/.test(e) || /^-not\s+/i.test(e)) {
    const inner = e.replace(/^!\s*/, "").replace(/^-not\s+/i, "");
    return !truthy(evalExpr(inner, vars));
  }

  // ternary (before comparison, so `a ? b : c` is not eaten by -eq)
  const ter = e.match(/^(.*?)\s+\?\s+([^:]+?)\s+:\s+(.*)$/);
  if (ter) {
    return truthy(evalExpr(ter[1], vars))
      ? evalExpr(ter[2], vars)
      : evalExpr(ter[3], vars);
  }
  // null-coalescing ??
  const coal = e.match(/^(.*?)\s*\?\?\s*(.*)$/);
  if (coal) {
    const left = evalExpr(coal[1], vars);
    return left == null ? evalExpr(coal[2], vars) : left;
  }

  // comparison operators
  const cmp = e.match(/^(.*?)\s+(-eq|-ne|-gt|-ge|-lt|-le|-like|-notlike|-match|-notmatch|-contains|-in|-is|==|!=|>=|<=|>|<)\s+(.*)$/i);
  if (cmp) {
    return compareOp(evalExpr(cmp[1], vars), cmp[2], evalExpr(cmp[3], vars));
  }

  // null-coalescing ?? and ternary handled above
  // -replace / -ireplace / -split / -join / -f / -as / ..
  const rep = e.match(/^(.*?)\s+-(?:i)?replace\s+(.*)$/i);
  if (rep) {
    const [pat, repl] = splitTop(rep[2], ",").map((s) => evalExpr(s, vars));
    return String(evalExpr(rep[1], vars)).replace(new RegExp(String(pat), "gi"), String(repl));
  }
  const fmt = e.match(/^(.*?)\s+-f\s+(.*)$/i);
  if (fmt) {
    const format = String(coerceVal(evalExpr(fmt[1], vars)) ?? "");
    const parts = splitTop(fmt[2], ",").map((s) => evalExpr(s, vars));
    return format.replace(/\{(\d+)(?::[^}]*)?\}/g, (_, n) => String(parts[Number(n)] ?? ""));
  }
  const asOp = e.match(/^(.*?)\s+-as\s+\[?(\w+)\]?$/i);
  if (asOp) {
    const v = evalExpr(asOp[1], vars);
    const t = asOp[2].toLowerCase();
    if (t.includes("int")) return Math.trunc(Number(v));
    if (t.includes("string")) return String(v ?? "");
    if (t.includes("double")) return Number(v);
    if (t.includes("bool")) return truthy(v);
    return v;
  }
  const range = e.match(/^(.+?)\.\.(.+)$/);
  if (range && /^\s*[\w$"]/.test(range[1])) {
    const a = Number(coerceVal(evalExpr(range[1], vars)) ?? 0);
    const b = Number(coerceVal(evalExpr(range[2], vars)) ?? 0);
    const out = [];
    const step = a <= b ? 1 : -1;
    for (let i = a; step > 0 ? i <= b : i >= b; i += step) out.push(i);
    return out;
  }
  const spl = e.match(/^(.*?)\s+-split\s+(.*)$/i);
  if (spl) {
    const sep = evalExpr(spl[2], vars);
    return String(evalExpr(spl[1], vars)).split(String(sep));
  }
  if (e.toLowerCase().startsWith("-join ")) {
    const inner = evalExpr(e.slice(6), vars);
    return (Array.isArray(inner) ? inner : [inner]).join("");
  }
  const joinWith = e.match(/^(.*?)\s+-join\s+(.*)$/i);
  if (joinWith) {
    const arr = evalExpr(joinWith[1], vars);
    const sep = evalExpr(joinWith[2], vars);
    return (Array.isArray(arr) ? arr : [arr]).join(String(sep));
  }

  // arithmetic (+ - * / %)
  const arith = e.match(/^(.*?)(\s*[+\-*/%]\s*)(.*)$/);
  if (arith && !/^["']/.test(e.trim()) && arith[1].trim()) {
    const op = arith[2].trim();
    // skip if this is actually a comparison remnant
    if (!/-\w/.test(op)) {
      const left = evalExpr(arith[1], vars);
      const right = evalExpr(arith[3], vars);
      const a = Number(coerceVal(left) ?? 0);
      const b = Number(coerceVal(right) ?? 0);
      if (op === "+") {
        if (typeof left === "string" || typeof right === "string") {
          return String(coerceVal(left) ?? "") + String(coerceVal(right) ?? "");
        }
        if (Array.isArray(left) || Array.isArray(right)) {
          return [
            ...(Array.isArray(left) ? left : [left]),
            ...(Array.isArray(right) ? right : [right]),
          ];
        }
        return a + b;
      }
      if (op === "-") return a - b;
      if (op === "*") {
        if (Array.isArray(left) && typeof b === "number") {
          return left.flatMap((x) => Array(b).fill(x));
        }
        return a * b;
      }
      if (op === "/") return b === 0 ? NaN : a / b;
      if (op === "%") return b === 0 ? NaN : a % b;
    }
  }

  return evalAtom(e, vars);
}

/**
 * @param {string} e
 * @param {string} op
 */
function splitLogical(e, op) {
  const parts = [];
  let cur = "";
  let quote = /** @type {null | "'" | '"'} */ (null);
  let depth = 0;
  const lower = e.toLowerCase();
  const opLen = op.length;
  for (let i = 0; i < e.length; i += 1) {
    const ch = e[i];
    if (quote) {
      cur += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      cur += ch;
      continue;
    }
    if (ch === "(" || ch === "[") depth += 1;
    if (ch === ")" || ch === "]") depth -= 1;
    if (
      depth === 0 &&
      lower.startsWith(op, i) &&
      (i === 0 || /\s/.test(e[i - 1])) &&
      (i + opLen >= e.length || /\s/.test(e[i + opLen]))
    ) {
      parts.push(cur.trim());
      cur = "";
      i += opLen - 1;
      continue;
    }
    cur += ch;
  }
  if (cur.trim() || !parts.length) parts.push(cur.trim());
  return parts.length > 1 ? parts : [e];
}

/**
 * @param {string} inner
 */
function balanced(inner) {
  let depth = 0;
  let quote = /** @type {null | "'" | '"'} */ (null);
  for (const ch of inner) {
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') quote = ch;
    if (ch === "(") depth += 1;
    if (ch === ")") {
      depth -= 1;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
}

/**
 * @param {string} e
 * @param {Record<string, unknown>} vars
 */
function evalAtom(e, vars) {
  const t = e.trim();
  if (!t) return null;
  if (t === "$true" || t.toLowerCase() === "true") return true;
  if (t === "$false" || t.toLowerCase() === "false") return false;
  if (t === "$null" || t.toLowerCase() === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  if (/^'([^']*)'$/.test(t)) return unquote(t);
  if (/^"([^"]*)"$/.test(t)) return expand(unquote(t), vars);
  if (t.startsWith("@(")) {
    const close = t.indexOf(")");
    const inner = t.slice(2, close >= 0 ? close : undefined);
    const arr = splitTop(inner, ",").map((p) => evalExpr(p, vars));
    const rest = close >= 0 ? t.slice(close + 1) : "";
    if (rest.startsWith("[")) {
      const idx = rest.match(/^\[(\d+)\]/);
      if (idx) return arr[Number(idx[1])];
    }
    return arr;
  }
  if (t.startsWith("@{")) {
    return parseHashtable(t.slice(2, t.endsWith("}") ? -1 : undefined), vars);
  }
  if (/^\[pscustomobject\]\s*@{/i.test(t)) {
    const ht = parseHashtable(t.replace(/^\[pscustomobject\]\s*@/i, "").replace(/^\{/, "").replace(/\}$/, ""), vars);
    return { typeName: "PSCustomObject", props: ht, get(name) { return this.props[name]; } };
  }
  if (/^\[int\]\s*/i.test(t)) return Math.trunc(Number(coerceVal(evalExpr(t.replace(/^\[int\]\s*/i, ""), vars)) ?? 0));
  if (/^\[string\]\s*/i.test(t)) return String(coerceVal(evalExpr(t.replace(/^\[string\]\s*/i, ""), vars)) ?? "");
  if (/^\[array\]\s*/i.test(t)) {
    const v = evalExpr(t.replace(/^\[array\]\s*/i, ""), vars);
    return Array.isArray(v) ? v : [v];
  }
  if (/^\[bool\]\s*/i.test(t)) return truthy(evalExpr(t.replace(/^\[bool\]\s*/i, ""), vars));
  if (/^\[double\]\s*/i.test(t)) return Number(coerceVal(evalExpr(t.replace(/^\[double\]\s*/i, ""), vars)) ?? 0);
  if (/^\[datetime\]\s*/i.test(t)) {
    const s = String(coerceVal(evalExpr(t.replace(/^\[datetime\]\s*/i, ""), vars)) ?? "");
    return s || new Date().toISOString();
  }
  if (t.startsWith('@"') || t.startsWith("@'")) {
    const quote = t[1];
    const end = t.indexOf(`\n${quote}@`);
    if (end > 0) return quote === '"' ? expand(t.slice(2, end), vars) : t.slice(2, end);
  }
  // [Type]::new() or [Type]::Member
  const staticM = t.match(/^\[([A-Za-z_][\w.]*)\]::(\w+)(?:\((.*)\))?$/);
  if (staticM) {
    const typeName = staticM[1];
    const member = staticM[2];
    if (member === "new") {
      const cls = vars[`__class:${typeName}`];
      const props = cls ? { ...cls.defaults } : {};
      return {
        typeName,
        props,
        get(n) {
          return this.props[n];
        },
      };
    }
    if (member === "Green" || member === "Red" || member === "Blue") {
      const order = ["Red", "Green", "Blue"];
      return order.indexOf(member);
    }
    return member;
  }
  // [Color]::Green style already handled; class instantiation [Point]::new()
  const castClass = t.match(/^\[([A-Za-z_][\w]*)\]::new\(\)$/i);
  if (castClass) return evalAtom(`[${castClass[1]}]::new()`, vars);
  // method call $Error.Clear()
  const method = t.match(/^\$(\w+)\.(\w+)\(\)$/);
  if (method) {
    let obj = vars[method[1]];
    if (method[1] === "Error" && !Array.isArray(obj)) obj = vars.Error || [];
    if (method[2] === "Clear" && Array.isArray(obj)) {
      obj.length = 0;
      vars[method[1]] = obj;
      return null;
    }
    return null;
  }

  // $var or $var.prop or $var[i] or $var.Count
  if (t.startsWith("$")) {
    return resolveVarExpr(t, vars);
  }

  // subexpression $( ... ) requires pipeline — handled by caller usually
  if (t.startsWith("$(") && t.endsWith(")")) {
    return vars.__subexpr ? vars.__subexpr(t.slice(2, -1)) : null;
  }

  // bare word / expandable
  return expand(t, vars);
}

/**
 * @param {string} body
 * @param {Record<string, unknown>} vars
 */
function parseHashtable(body, vars) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const part of splitTop(body, ";,")) {
    if (!part.trim()) continue;
    const kv = part.match(/^\s*([@'"]?[\w\-]+[@'"]?|'[^']*'|"[^"]*")\s*=\s*([\s\S]+)$/);
    if (!kv) continue;
    const key = unquote(kv[1].replace(/^@/, ""));
    out[key] = evalExpr(kv[2], vars);
  }
  return out;
}

/**
 * @param {string} t
 * @param {Record<string, unknown>} vars
 */
function resolveVarExpr(t, vars) {
  // $(...) nested
  const m = t.match(/^\$(?:\{([^}]+)\}|([A-Za-z_][A-Za-z0-9_:]*))(.*)$/);
  if (!m) return null;
  const name = m[1] || m[2];
  let rest = m[3] || "";
  let value = vars[name];
  if (value === undefined && name.includes(":")) {
    value = vars[name];
  }
  while (rest) {
    const prop = rest.match(/^\.([A-Za-z_][A-Za-z0-9_]*)/);
    const idx = rest.match(/^\[(\d+)\]/);
    if (prop) {
      const pname = prop[1];
      if (Array.isArray(value) && /^(count|length)$/i.test(pname)) {
        value = value.length;
      } else if (isPSObject(value)) {
        value = /** @type {any} */ (value).get(pname);
      } else if (value && typeof value === "object") {
        value = /** @type {any} */ (value)[pname];
      } else if (/^(count|length)$/i.test(pname)) {
        value = String(value ?? "").length;
      } else {
        value = undefined;
      }
      rest = rest.slice(prop[0].length);
      continue;
    }
    if (idx) {
      const arr = Array.isArray(value) ? value : [value];
      value = arr[Number(idx[1])];
      rest = rest.slice(idx[0].length);
      continue;
    }
    break;
  }
  return value === undefined ? null : value;
}

/**
 * @param {unknown} v
 */
export function truthy(v) {
  const x = coerceVal(v);
  if (x == null) return false;
  if (typeof x === "boolean") return x;
  if (typeof x === "number") return x !== 0;
  if (Array.isArray(x)) return x.length > 0;
  if (typeof x === "string") return x.length > 0;
  return true;
}

/**
 * Extract matching { ... } block starting at index of '{'.
 * @param {string} text
 * @param {number} start
 * @returns {{ body: string, end: number }}
 */
export function readBlock(text, start) {
  let depth = 0;
  let quote = /** @type {null | "'" | '"'} */ (null);
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      continue;
    }
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) return { body: text.slice(start + 1, i), end: i };
    }
  }
  return { body: text.slice(start + 1), end: text.length };
}
