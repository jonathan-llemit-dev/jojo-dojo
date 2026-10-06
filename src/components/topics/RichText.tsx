import type { ReactNode } from "react";

/**
 * Renders a topic's prose — paragraphs, `- ` bullets, fenced code blocks and
 * `inline code` — as ordinary React nodes.
 *
 * Nothing here uses dangerouslySetInnerHTML, so a description can never inject
 * markup: text stays text. That is deliberate, and it is why a hand-rolled parser
 * is safe to keep around.
 *
 * The markup is intentionally tiny — four rules — rather than a Markdown library:
 * no dependency to install or keep updated, and the parsing is short enough to read.
 *
 *   1. ``` alone on a line opens or closes a code block
 *   2. a blank line separates paragraphs
 *   3. a line starting with "- " is a bullet, and a plain line after one continues it
 *   4. `backticks` around a run of text become inline <code>
 *
 * The first three are structural — `parseBlocks` decides them per line. The fourth
 * applies inside whatever text survives, in `withInlineCode`.
 *
 * The full convention, including what each rule is *for*, lives in `CLAUDE.md` under
 * "Key patterns to maintain". Keep the two in step: this comment used to say "three
 * rules" while the parser implemented four.
 */

type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "code"; text: string };

/** One pair of backticks around one or more non-backtick characters. */
const INLINE_CODE = /`([^`]+)`/;

/** Shared by every piece of code, inline or block, so they look like one family. */
const CODE_TEXT = "font-mono text-dojo-text";

/**
 * Split a line into plain text and inline <code> pieces.
 *
 * String.split with a capture group alternates text, capture, text, capture…, so the
 * odd indices are exactly the backticked parts. An unpaired backtick just stays as
 * literal text, which fails quietly instead of throwing.
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
      part
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
              className="my-3 flex list-disc flex-col gap-2 pl-5 leading-relaxed"
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
          <p key={`block-${index}`} className="my-3 leading-relaxed first:mt-0">
            {withInlineCode(block.text, `block-${index}`)}
          </p>
        );
      })}
    </div>
  );
}
