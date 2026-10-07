import type { ReactNode } from "react";

/**
 * Renders a topic's prose — paragraphs, `- ` bullets, fenced code blocks,
 * `inline code`, and **emphasis** — as ordinary React nodes.
 *
 * Nothing here uses dangerouslySetInnerHTML, so a description can never inject
 * markup: text stays text. That is deliberate, and it is why a hand-rolled parser
 * is safe to keep around.
 *
 * The markup is intentionally tiny — five rules — rather than a Markdown library:
 * no dependency to install or keep updated, and the parsing is short enough to read.
 *
 *   1. ``` alone on a line opens or closes a code block
 *   2. a blank line separates paragraphs
 *   3. a line starting with "- " is a bullet, and a plain line after one continues it
 *   4. `backticks` around a run of text become inline <code>
 *   5. `**like this**` becomes <strong> and `*like this*` becomes <em>
 *
 * The first three are structural — `parseBlocks` decides them per line. The last two
 * apply inside whatever text survives, in `withInlineCode` and `withEmphasis`.
 *
 * Order matters between 4 and 5: inline code is split out FIRST, so an asterisk inside
 * a code span stays a literal asterisk — `setReps(reps * 2)` keeps its `*`. Emphasis is
 * then applied only to the plain-text runs.
 *
 * The full convention, including what each rule is *for*, lives in `CLAUDE.md` under
 * "Key patterns to maintain". Keep the two in step: this comment used to say "three
 * rules" while the parser implemented four, and emphasis was added later still — see
 * the session log in `HISTORY.md`.
 */

type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "code"; text: string };

/** One pair of backticks around one or more non-backtick characters. */
const INLINE_CODE = /`([^`]+)`/;

/** `**bold**` — tested before emphasis, since `**` also starts a `*` run. */
const BOLD = /\*\*([^*]+)\*\*/;

/** `*italic*` — a single asterisk pair, not part of a `**` run. */
const ITALIC = /\*([^*]+)\*/;

/** Shared by every piece of code, inline or block, so they look like one family. */
const CODE_TEXT = "font-mono text-dojo-text";

/**
 * Turn `**strong**` and `*em*` into real elements.
 *
 * The split-with-capture-group trick again: `.split` with a capture alternates
 * text, capture, text…, so odd indices are the emphasised runs. Bold is tried first
 * because `**` would otherwise be read as an empty italic run followed by a literal.
 *
 * A line with an odd, unmatched asterisk is left exactly as written rather than
 * half-consumed, so a stray `*` (say, multiplication in prose) cannot corrupt the rest
 * of the line. Plain prose is returned as bare strings, so the common case adds no
 * wrapper elements at all.
 */
function withEmphasis(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];

  for (const [index, chunk] of text.split(BOLD).entries()) {
    if (index % 2 === 1) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${index}`} className="font-semibold text-dojo-text">
          {chunk}
        </strong>,
      );
      continue;
    }

    for (const [innerIndex, inner] of chunk.split(ITALIC).entries()) {
      if (innerIndex % 2 === 1) {
        nodes.push(
          <em key={`${keyPrefix}-em-${index}-${innerIndex}`} className="italic">
            {inner}
          </em>,
        );
      } else if (inner !== "") {
        nodes.push(inner);
      }
    }
  }

  return nodes;
}

/**
 * Split a line into plain text, inline <code> pieces, and emphasis.
 *
 * String.split with a capture group alternates text, capture, text, capture…, so the
 * odd indices are exactly the backticked parts. An unpaired backtick just stays as
 * literal text, which fails quietly instead of throwing.
 *
 * Code is extracted before emphasis is considered, which is what keeps an asterisk
 * inside `backticks` literal.
 */
function withInlineCode(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE_CODE).map((part, index) =>
    index % 2 === 1 ? (
      <code
        key={`${keyPrefix}-code-${index}`}
        className={`${CODE_TEXT} rounded border border-dojo-border bg-dojo-surface/80 px-1.5 py-0.5 text-[0.9em]`}
      >
        {part}
      </code>
    ) : (
      withEmphasis(part, `${keyPrefix}-text-${index}`)
    ),
  );
}

/**
 * Turn the description string into blocks — the three structural rules, applied in
 * order. The fourth rule, inline code, is handled per block by `withInlineCode` below,
 * since it applies inside a paragraph's text rather than deciding where blocks end.
 *
 *   1. ``` alone on a line opens or closes a code block — contents kept verbatim
 *   2. a line starting with "- " is a bullet; a plain line after one continues it
 *   3. a blank line closes whatever is open
 */
function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let bullets: string[] = [];
  let code: string[] | null = null;

  const endParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  const endBullets = () => {
    if (bullets.length > 0) {
      blocks.push({ kind: "list", items: bullets });
      bullets = [];
    }
  };

  for (const line of text.split("\n")) {
    if (code !== null) {
      if (line.trim() === "```") {
        blocks.push({ kind: "code", text: code.join("\n") });
        code = null;
      } else {
        code.push(line);
      }
      continue;
    }

    if (line.trim().startsWith("```")) {
      endParagraph();
      endBullets();
      code = [];
      continue;
    }

    if (line.trim() === "") {
      endParagraph();
      endBullets();
      continue;
    }

    if (line.trimStart().startsWith("- ")) {
      endParagraph();
      bullets.push(line.trimStart().slice(2));
      continue;
    }

    // A plain line while bullets are open continues the bullet above it, so a long
    // bullet can wrap in the source without breaking the list.
    if (bullets.length > 0) {
      bullets[bullets.length - 1] += ` ${line.trim()}`;
      continue;
    }

    paragraph.push(line.trim());
  }

  if (code !== null) {
    blocks.push({ kind: "code", text: code.join("\n") });
  }
  endParagraph();
  endBullets();
  return blocks;
}

/**
 * Renders a topic's Description / key rules. Feed it `topic.longDescription`.
 *
 * Conventions for writing the content live in `CLAUDE.md`.
 */
export function RichText({ text }: { text: string }) {
  return (
    <div className="text-dojo-muted">
      {parseBlocks(text).map((block, index) => {
        if (block.kind === "code") {
          return (
            <pre
              key={`block-${index}`}
              className="my-4 overflow-x-auto rounded-xl border border-dojo-border bg-dojo-surface/60 p-4 first:mt-0"
            >
              <code className={`${CODE_TEXT} text-sm leading-relaxed`}>
                {block.text}
              </code>
            </pre>
          );
        }

        if (block.kind === "list") {
          return (
            <ul
              key={`block-${index}`}
              className="my-4 flex list-disc flex-col gap-2 pl-5 leading-7"
            >
              {block.items.map((item, itemIndex) => (
                <li key={`item-${itemIndex}`}>
                  {withInlineCode(item, `block-${index}-item-${itemIndex}`)}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`block-${index}`} className="my-4 leading-7 first:mt-0">
            {withInlineCode(block.text, `block-${index}`)}
          </p>
        );
      })}
    </div>
  );
}
