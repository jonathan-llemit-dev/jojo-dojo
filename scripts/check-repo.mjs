// Repo-vs-docs verification. Mechanical: counts, versions, paths, parity, doc claims.
import { readFileSync, readdirSync, existsSync } from "node:fs";

// The version this run expects. Kept as one constant so a topic bump is a one-line edit
// here rather than four scattered literals.
const VERSION = "0.15.0";
const SHORT = "v0.15";

let fails = 0;
const ok = (m) => console.log(`  ok   ${m}`);
const bad = (m) => { fails++; console.log(`  FAIL ${m}`); };
const head = (m) => console.log(`\n== ${m} ==`);

// ── stripper: character walk, string-aware, drops comment-only lines ──────────
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
const isResidue = (l) => /^\{\s*\}$/.test(l.trim());

// ── 0. the docs, read once ───────────────────────────────────────────────────
const notes = readFileSync("NOTES.md", "utf8");
const roadmap = readFileSync("ROADMAP.md", "utf8");
const readme = readFileSync("README.md", "utf8");
const history = readFileSync("HISTORY.md", "utf8");
const claude = readFileSync("CLAUDE.md", "utf8");

// ── 1. version, in all its places ────────────────────────────────────────────
head(`version ${VERSION} in every artefact`);
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
const home = readFileSync("src/pages/HomePage.tsx", "utf8");
const badge = home.match(/v\d+\.\d+/g) ?? [];
console.log(`  package.json ${pkg.version} | lock.root ${lock.version} | lock[""] ${lock.packages?.[""]?.version} | badge ${JSON.stringify(badge)}`);
if (pkg.version === VERSION) ok(`package.json is ${VERSION}`); else bad(`package.json is ${pkg.version}`);
if (lock.version === pkg.version && lock.packages?.[""]?.version === pkg.version) ok("both lock version fields match");
else bad("lock version fields disagree with package.json");
if (badge.length === 1 && badge[0] === SHORT) ok(`HomePage badge is exactly ${SHORT}`);
else bad(`HomePage badge is ${JSON.stringify(badge)}`);
// Only flag a doc that claims a DIFFERENT version is the CURRENT one. A bare "0.10"
// can legitimately appear as history — CLAUDE.md's versioning note explains that
// 0.10 was once misread as illegal — so matching any old number is a false positive.
for (const f of ["CLAUDE.md", "NOTES.md", "ROADMAP.md", "README.md"]) {
  const text = readFileSync(f, "utf8");
  const currentClaims = [...text.matchAll(/(?:current version is|Version `|at \*\*`|is at \*\*`|version is \*\*`)(\d+\.\d+\.\d+)/g)].map((m) => m[1]);
  const wrong = currentClaims.filter((v) => v !== VERSION);
  if (wrong.length) bad(`${f} claims current version ${[...new Set(wrong)].join(", ")}`);
  else ok(`${f}: no wrong current-version claim${currentClaims.length ? ` (says ${[...new Set(currentClaims)].join(", ")})` : ""}`);
}

// ── 2. registry / folders / markers ──────────────────────────────────────────
head("registry, folders and markers");
const reg = readFileSync("src/topics/registry.ts", "utf8");
const entries = [...(reg.match(/export const topicRegistry: Topic\[\] = \[([\s\S]*?)\];/)?.[1] ?? "").matchAll(/^\s*(\w+),/gm)].map((m) => m[1]);
const dirs = readdirSync("src/topics", { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
console.log(`  ${entries.length} registry entries | ${dirs.length} folders`);
if (entries.length === 12 && dirs.length === 12) ok("12 entries and 12 folders"); else bad("entry/folder count mismatch");
for (const d of dirs) {
  const demo = readFileSync(`src/topics/${d}/demo.tsx`, "utf8");
  const status = demo.match(/Status: (OK|LD|RV)/)?.[1];
  const slugs = readFileSync(`src/topics/${d}/index.ts`, "utf8").match(/slug:\s*"([^"]+)"/)?.[1];
  const problems = [];
  if (!status) problems.push("no marker status");
  if (slugs !== d) problems.push(`slug "${slugs}" != folder`);
  if (!existsSync(`src/topics/${d}/index.ts`)) problems.push("no index.ts");
  if (problems.length) bad(`${d}: ${problems.join("; ")}`);
  else ok(`${d} — slug matches, status ${status}`);
}
// A lesson may ship as `LD` while its hands-on work is outstanding, so this asserts
// *agreement with the docs* rather than "everything is finished". Either all markers read
// OK and NOTES.md says nothing is in progress, or every non-OK lesson is named in the
// notes and on the roadmap.
const nonOk = dirs.filter((d) => !/Status: OK/.test(readFileSync(`src/topics/${d}/demo.tsx`, "utf8")));
if (nonOk.length === 0) {
  if (notes.includes("Every registered lesson is verified")) ok("every marker reads OK, and NOTES.md says so");
  else bad("every marker reads OK but NOTES.md still lists a lesson as outstanding");
} else {
  const undocumented = nonOk.filter((d) => !notes.includes(d) || !roadmap.includes(d));
  if (undocumented.length) bad(`marker not OK but not named in NOTES.md and ROADMAP.md: ${undocumented.join(", ")}`);
  else ok(`${nonOk.length} lesson(s) in progress (${nonOk.join(", ")}) — named in NOTES.md and ROADMAP.md`);
}

// ── 3. parity ────────────────────────────────────────────────────────────────
head("codeExample <-> demo.tsx parity");
const EXPECT = { jsx: "export elided", "use-state": "trimmed" };
const parity = {};
for (const name of dirs) {
  const demo = strip(readFileSync(`src/topics/${name}/demo.tsx`, "utf8")).filter((l) => !isResidue(l));
  const sample = strip(extractSample(readFileSync(`src/topics/${name}/index.ts`, "utf8")).replace(/\\`/g, "`").replace(/\\\$\{/g, "${"));
  const norm = (ls) => name === "jsx" ? ls.map((l) => l.replace(/^export\s+/, "")) : ls;
  const a = norm(demo), b = norm(sample);
  let same = 0;
  for (let k = 0; k < Math.min(a.length, b.length); k++) { if (a[k] === b[k]) same++; else break; }
  const exact = same === a.length && same === b.length;
  parity[name] = { a: a.length, b: b.length, same, exact };
  if (exact) ok(`${name}: ${same} of ${a.length} — EXACT MIRROR`);
  else if (EXPECT[name]) console.log(`  note ${name}: demo ${a.length} / sample ${b.length} (documented: ${EXPECT[name]})`);
  else bad(`${name}: demo ${a.length} / sample ${b.length}, first ${same} identical`);
}

// ── 4. the numbers CLAUDE.md claims ─────────────────────────────────────────
head("CLAUDE.md parity claims vs measured");
const claims = { "components-props": 46, "conditional-rendering": 63, "event-handling": 105, "lists-and-keys": 62, "use-effect": 64, forms: 53, "use-state-deep-dive": 114, "use-ref": 77, "use-context-reducer": 376, "custom-hooks": 147 };
for (const [slug, n] of Object.entries(claims)) {
  const claimed = claude.includes(`${n} of ${n}`);
  const measured = parity[slug]?.exact && parity[slug].a === n;
  if (claimed && measured) ok(`${slug}: doc says ${n} of ${n}, measured ${parity[slug].a}`);
  else bad(`${slug}: doc claims ${n}, measured ${parity[slug]?.a} (doc-mentions=${claimed}, exact=${parity[slug]?.exact})`);
}

// ── 5. docs consistency ─────────────────────────────────────────────────────
head("docs consistency");
const checks = [
  [claude.includes("twelve lessons registered — eleven verified, one awaiting its build task"), "CLAUDE.md: twelve/eleven+1 one-liner"],
  [claude.includes("Do not commit. The learner makes every commit."), "CLAUDE.md: the no-commit rule is present"],
  [claude.includes(`**\`${VERSION}\`** with twelve topics`), "CLAUDE.md: versioning sentence"],
  [claude.includes("the site has been live on Vercel"), "CLAUDE.md: deploy framed as settled"],
  [!claude.includes("Deploy to Vercel — the current version"), "CLAUDE.md: no deploy objective remains"],
  [claude.includes("**Build-on task** — a correct lecture"), "CLAUDE.md: build-on task is the documented default"],
  [roadmap.includes("React and TypeScript topics only"), "ROADMAP.md: scope stated"],
  [roadmap.includes("twelve lessons live"), "ROADMAP.md: footer twelve"],
  [!/^- \[ \] .*(Deploy|Social links|Custom domain|LinkedIn)/m.test(roadmap), "ROADMAP.md: three chores not re-added"],
  [!/^- \[ \] Vite \+ React/m.test(roadmap), "ROADMAP.md: chore section removed"],
  [roadmap.includes("Redux") && roadmap.includes("Next.js"), "ROADMAP.md: Redux/Next.js parked under 'Later'"],
  [roadmap.includes("`BUILD` = lecture live"), "ROADMAP.md: BUILD marker documented"],
  [notes.includes("## 11 — `useRef`"), "NOTES.md: entry 11 present"],
  [notes.includes("## 12 — `useContext` & `useReducer`"), "NOTES.md: entry 12 present"],
  [notes.includes("## 13 — Custom hooks"), "NOTES.md: entry 13 present"],
  [/^- \*\*Never used at all:\*\*(?!.*useReducer)/m.test(notes), "NOTES.md: useReducer off the 'never used' line"],
  [readme.includes("Eleven lessons verified"), "README.md: eleven lessons verified"],
  [readme.includes("jojo-dojo.vercel.app"), "README.md: live URL present"],
  [!/\[ \] Deploy to Vercel/m.test(readme), "README.md: deploy chore removed"],
  [history.includes("The hands-on exercise becomes a build, not a repair"), "HISTORY.md: the exercise-model decision is logged"],
];
for (const [pass, label] of checks) { if (pass) ok(label); else bad(label); }

console.log(`\n${fails === 0 ? "ALL CHECKS PASSED" : fails + " CHECK(S) FAILED"}`);
process.exit(fails === 0 ? 0 : 1);
