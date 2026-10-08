// Prose validator for topic longDescriptions — run with `npm run check:prose`.
//
//  1. safety  — the RichText rules (balanced backticks, even code fences, no risky asterisks)
//  2. voice   — the faults the 2026-10-07 rewrite set out to fix: long blocks, editor-tics,
//               hollow phrasing. See "Write to a person, not to a compiler" in CLAUDE.md.
//
// Exits non-zero on any safety problem, or when a hard voice limit is exceeded. A bullet
// counts as one block per bullet, because that is how a reader meets them.
//
// What this does NOT measure: reading ease. Flesch rated `use-ref` the easiest of all ten
// lessons while it was the hardest to read — such scores count word and sentence length and
// are blind to abstraction, which was the actual problem.
import { readFileSync, readdirSync } from "node:fs";

const MAX_PARA = 70;   // hard cap on words in one paragraph
const MAX_TICS = 2;    // editor-tics allowed per lesson

/** The short `description` reaches the grid as PLAIN TEXT, so it must carry no markup. */
function getDesc(src) {
  return src.match(/^\s*description:\s*\n?\s*"((?:[^"\\]|\\.)*)"/m)?.[1] ?? "";
}

function getLong(src) {
  const start = src.indexOf("longDescription:");
  if (start < 0) return "";
  const rest = src.slice(start);
  // Bound the value at the `codeExample:` KEY — a line that is exactly that key.
  // (Searching for a `//` comment truncates wrongly: a fenced code block inside the
  // description can contain one, and the demo's own comments are inside codeExample.)
  const end = rest.search(/\n\s{2}codeExample:/);
  const body = end > 0 ? rest.slice(0, end) : rest;
  // Both quote styles: this file mixes "…" and '…' freely.
  return [...body.matchAll(/(?:"((?:[^"\\]|\\.)*)")|(?:'((?:[^'\\]|\\.)*)')/g)]
    .map((m) => m[1] ?? m[2]).join("")
    .replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\'/g, "'");
}

/** Collapse the source's line wrapping so a paragraph is one line of text. */
function unwrap(text) {
  return text.replace(/\n(?!\s*\n)/g, " ").replace(/[ \t]{2,}/g, " ");
}

const TICS = [
  /\bworth (naming|expecting|keeping|remembering|stealing|knowing)\b/gi,
  /\bthe (mistake|trap|thing|rule|point|reason|catch) (this|that|the)\b/gi,
  /\bis not (defensive )?noise\b/gi,
  /\brather than (debugging|leaving)\b/gi,
  /\bthere is (a|one) (rule|thing|catch|consequence)\b/gi,
  /\bwhat this (hook|lesson|concept) invites\b/gi,
  /\bcomes down to\b/gi,
  /\bworth knowing by name\b/gi,
];
// Words that only ever appeared in the abstract framing, never in an explanation.
const HOLLOW = /\b(honest|invites|non-negotiable|so different that|the whole rest|that is the point)\b/gi;

// A description reads as markup-free prose; catch stray double spaces left by edits.
let safetyFails = 0, voiceFails = 0;
console.log("lesson".padEnd(24), "paras".padStart(5), "max".padStart(4), "avg".padStart(4), ">70w".padStart(5), "tics".padStart(5), "hollow".padStart(7), "  verdict");
for (const dir of readdirSync("src/topics", { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
  const text = getLong(readFileSync(`src/topics/${dir}/index.ts`, "utf8"));
  const flat = unwrap(text);          // line wrapping removed, for prose checks
  const problems = [];
  const voiceProblems = [];

  // ---- safety ----
  // A fence may carry a language tag (` ```tsx `). RichText accepts and ignores the tag, so the
  // tag is optional here too — but it must still be *counted*, or a tagged fence would leave its
  // three backticks in the text and the inline-backtick check would report a false imbalance.
  const fences = (text.match(/^```\w*$/gm) ?? []).length;
  if (fences % 2 !== 0) problems.push(`${fences} fence lines (odd)`);
  const noFences = text.replace(/^```\w*$/gm, "");
  const inline = (noFences.match(/`/g) ?? []).length;
  if (inline % 2 !== 0) problems.push(`${inline} inline backticks (odd)`);
  for (const [i, line] of noFences.split("\n").entries()) {
    const stripped = line.replace(/`[^`]*`/g, "");
    const stars = (stripped.match(/\*/g) ?? []).length;
    if (stars >= 2 && stars % 2 !== 0) problems.push(`line ${i + 1}: ${stars} bare asterisks`);
  }
  // A real double space survives unwrapping; one created by the source's line breaks does not.
  for (const m of flat.matchAll(/ {2,}/g)) {
    const after = flat.slice(m.index + m[0].length, m.index + m[0].length + 12);
    if (after && !/^\s/.test(after)) { problems.push(`double space before "${after.trim()}"`); break; }
  }
  // `description` is rendered as plain text by TopicIndex, so backticks or asterisks
  // would show up literally on the page.
  const desc = getDesc(readFileSync(`src/topics/${dir}/index.ts`, "utf8"));
  if (/[*`]/.test(desc)) problems.push("description contains ` or * (rendered as plain text)");

  // ---- voice ----
  // A run of bullets is ONE paragraph in the source, but a reader meets each bullet
  // separately, so measure them one at a time. A long bullet is still a long block.
  const sections = text.replace(/```[\s\S]*?```/g, "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const blocks = [];
  for (const s of sections) {
    if (/^[-*] /m.test(s)) {
      for (const bullet of s.split(/\n(?=[-*] )/)) blocks.push(bullet.replace(/^[-*] /, "").trim());
    } else blocks.push(s);
  }
  const wc = (p) => p.split(/\s+/).filter((x) => /[a-zA-Z0-9]/.test(x)).length;
  const paraWords = blocks.map(wc);
  const maxPara = Math.max(...paraWords);
  const over = paraWords.filter((n) => n > MAX_PARA).length;
  const tics = TICS.reduce((n, re) => n + (text.match(re) ?? []).length, 0);
  const hollow = (text.match(HOLLOW) ?? []).length;
  if (over > 0) voiceProblems.push(`${over} block(s) over ${MAX_PARA} words (longest ${maxPara})`);
  if (tics > MAX_TICS) voiceProblems.push(`${tics} editor-tics (max ${MAX_TICS})`);
  if (hollow > 0) voiceProblems.push(`${hollow} hollow phrase(s)`);

  if (problems.length) safetyFails++;
  if (voiceProblems.length) voiceFails++;
  const verdict = problems.length ? "SAFETY: " + problems.join("; ")
    : voiceProblems.length ? "voice: " + voiceProblems.join("; ")
      : "ok";
  console.log(
    dir.padEnd(24), String(sections.length).padStart(5), String(maxPara).padStart(4),
    String(Math.round(paraWords.reduce((a, b) => a + b, 0) / blocks.length)).padStart(4),
    String(over).padStart(5), String(tics).padStart(5), String(hollow).padStart(7), "  " + verdict,
  );
}
console.log(`\nsafety failures: ${safetyFails}   voice failures: ${voiceFails}`);
process.exit(safetyFails > 0 ? 1 : 0);
