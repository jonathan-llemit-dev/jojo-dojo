// Regenerate a lesson's `codeExample` from its `demo.tsx`.
//
//   npm run sync:samples                 # every lesson that is not a documented exception
//   npm run sync:samples -- custom-hooks # one lesson, by slug
//
// The Sample Code panel is meant to be the code that runs, and the two drift apart silently if
// they are edited by hand. `scripts/check-repo.mjs` is the *assertion* — it re-derives both
// sides, strips comments and blank lines, and fails the run if any lesson's numbers disagree.
// This script is the *generator*, so keeping them in step is one command instead of a
// throwaway script re-invented each session.
//
// Two lessons are deliberately not mirrors and are skipped by the no-argument form:
//
//   jsx         — the sample omits the leading `export` on purpose (illustrative, not pasteable)
//   use-state   — the sample is trimmed from 38 lines to 11 for readability
//
// Both are documented in `CLAUDE.md` under "Current parity". Naming either explicitly still
// works, because a deliberate overwrite should be possible — it just should not happen by
// accident.
//
// Two rules this shares with the checker, and they have to agree or the run fails loudly:
//
//   1. a `{}`-only line is residue. A JSX block comment (`{/* … */}`) collapses into one,
//      because a block comment swallows its own newlines. The checker strips that line from
//      the *demo* side and expects the sample not to contain it, so it is filtered here too;
//   2. a lesson whose sample already matches is left alone. Regenerating an in-sync sample
//      rewrites the file with no visible change, which turns a tidy command into a diff.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const EXCEPTIONS = {
  jsx: "sample omits the leading `export` on purpose",
  "use-state": "sample is trimmed for readability",
};

/** Strip comments and blank lines — the same character walk `check-repo.mjs` uses. */
function strip(src) {
  let i = 0, state = "code";
  const lines = []; let cur = "";
  const flush = () => { lines.push(cur); cur = ""; };
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (state === "code") {
      if (c === "/" && n === "*") { state = "block"; i += 2; continue; }
      if (c === "/" && n === "/") { state = "line"; i += 2; continue; }
      if (c === "\n") { flush(); i++; continue; }
      if (c === "`") state = "str"; else if (c === '"') state = "dstr"; else if (c === "'") state = "sstr";
      cur += c; i++; continue;
    }
    if (state === "block") { if (c === "*" && n === "/") { state = "code"; i += 2; continue; } i++; continue; }
    if (state === "line") { if (c === "\n") { state = "code"; flush(); } i++; continue; }
    if (c === "\\") { cur += c + (n ?? ""); i += 2; continue; }
    if (c === "\n") { flush(); i++; continue; }
    cur += c;
    if ((state === "str" && c === "`") || (state === "dstr" && c === '"') || (state === "sstr" && c === "'")) state = "code";
    i++; continue;
  }
  lines.push(cur);
  return lines.map((l) => l.trimEnd()).filter((l) => l.trim().length > 0);
}

const isResidue = (l) => /^\{\s*\}$/.test(l.trim());

/** The unescaped body of a `codeExample` template literal. */
function extractSample(src) {
  const s = src.indexOf("codeExample:");
  let i = src.indexOf("`", s); i++; let out = "";
  while (i < src.length) {
    const c = src[i];
    if (c === "\\") { out += c + (src[i + 1] ?? ""); i += 2; continue; }
    if (c === "`") break;
    out += c; i++;
  }
  return out;
}

/** Replace whatever is between the `codeExample` backticks — a placeholder or a real sample. */
function replaceSample(index, sample) {
  const start = index.indexOf("codeExample: `");
  if (start < 0) throw new Error("no codeExample field");
  const open = index.indexOf("`", start);
  let i = open + 1;
  while (i < index.length) {
    if (index[i] === "\\") { i += 2; continue; }  // an escaped backtick inside the sample
    if (index[i] === "`") break;
    i++;
  }
  if (i >= index.length) throw new Error("unterminated codeExample");
  return index.slice(0, open + 1) + sample + index.slice(i);
}

const requested = process.argv.slice(2);
const all = readdirSync("src/topics", { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const targets = requested.length ? requested : all.filter((slug) => !(slug in EXCEPTIONS));
if (!requested.length) {
  for (const slug of Object.keys(EXCEPTIONS)) console.log(`  skip ${slug} — ${EXCEPTIONS[slug]}`);
}

let written = 0;
for (const slug of targets) {
  const demoLines = strip(readFileSync(`src/topics/${slug}/demo.tsx`, "utf8")).filter((l) => !isResidue(l));
  const index = readFileSync(`src/topics/${slug}/index.ts`, "utf8");
  const existing = index.includes("__CODE_EXAMPLE__")
    ? null
    : strip(extractSample(index).replace(/\\`/g, "`").replace(/\\\$\{/g, "${"));

  if (existing && existing.length === demoLines.length && existing.every((l, k) => l === demoLines[k])) {
    console.log(`  same ${slug} — already in sync`);
    continue;
  }

  // Escape for the template literal, in the order the parity checker unescapes.
  const sample = demoLines.join("\n").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  writeFileSync(`src/topics/${slug}/index.ts`, replaceSample(index, sample), "utf8");
  written += 1;
  console.log(`  ok   ${slug} — ${demoLines.length} lines`);
}

console.log(`\n${written} sample(s) rewritten`);
