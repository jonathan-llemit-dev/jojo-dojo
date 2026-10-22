import { Link, useParams } from "react-router-dom";
import { topicBySlug, topicRegistry } from "../../topics/registry";
import { beltBadgeClass, beltDotClass, beltLevel, beltName } from "../../topics/beltStyles";
import { ArrowRightIcon } from "../ui/Icons";
import { RichText } from "./RichText";

/**
 * Individual topic page rendered at `/dojo/topic/:slug`.
 * Reads the slug from the URL, looks up the topic in the registry, and displays:
 * 1. Description / lesson explanation
 * 2. Sample code block (when available)
 * 3. Live working component demo
 *
 * Layout: one full-width column. An earlier attempt split the page at `2xl` and put
 * the Live Demo in a right-hand column, but the demo components are designed at
 * `max-w-md` / `max-w-lg` — wrapping one into a narrower column made its *own*
 * controls wrap too, so the split was dropped. The lecture is capped to a readable
 * measure; the code and the demo keep the width they were built for.
 */
export function TopicDetail() {
  // A URL param is always `string | undefined`, so read it first and only look it
  // up when it exists. That keeps the "not found" branch below honest.
  const { slug } = useParams();
  const topic = slug ? topicBySlug[slug] : undefined;

  if (!topic) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center py-16 text-center">
        <h2 className="mb-4 font-display text-4xl tracking-wide">Topic not found</h2>
        <p className="mb-6 text-dojo-muted">
          No lesson is available for &ldquo;{slug}&rdquo;.
        </p>
        <Link
          to="/dojo"
          className="inline-block rounded-lg bg-dojo-ember px-5 py-2.5 font-medium text-black transition-colors hover:bg-dojo-ember-bright"
        >
          Back to Dojo
        </Link>
      </div>
    );
  }

  // Dynamic component rendering from the registry reference.
  const Demo = topic.component;

  // Position in the recommended reading path — the same order the sidebar numbers,
  // derived from the registry so it can never disagree with it.
  const lessonIndex = topicRegistry.findIndex((item) => item.slug === topic.slug);
  const lessonNumber = lessonIndex + 1;
  const lessonTotal = topicRegistry.length;
  const nextTopic = topicRegistry[lessonIndex + 1];

  return (
    <div className="w-full">
      {/* Header — where you are in the path, then the heading. */}
      <header className="mb-8 border-b border-dojo-border pb-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-dojo-muted"
          >
            <Link to="/dojo" className="transition-colors hover:text-dojo-ember">
              All Topics
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-mono tabular-nums">
              Lesson {String(lessonNumber).padStart(2, "0")} of{" "}
              {String(lessonTotal).padStart(2, "0")}
            </span>
          </nav>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm ${beltBadgeClass(topic.belt)}`}
          >
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${beltDotClass(topic.belt)}`}
            />
            {beltName(topic.belt)} · {beltLevel(topic.belt)}
          </span>
        </div>

        <h1 className="font-display text-4xl leading-[0.95] tracking-wide md:text-5xl">
          {topic.title}
        </h1>
      </header>

      {/* Description */}
      {topic.longDescription && (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-2xl tracking-wide text-dojo-ember">
            The lesson
          </h2>
          {/* RichText understands `inline code`, ``` blocks, "- " bullets and
              blank-line paragraphs — see the convention in CLAUDE.md. */}
          <RichText text={topic.longDescription} />
        </section>
      )}

      {/* Sample code */}
      {topic.codeExample && (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-2xl tracking-wide text-dojo-ember">
            Sample Code
          </h2>
          <pre
            tabIndex={0}
            aria-label="Sample code"
            className="overflow-x-auto rounded-xl border border-dojo-border bg-dojo-surface/60 p-4"
          >
            <code className="font-mono text-sm leading-relaxed text-dojo-text">
              {topic.codeExample}
            </code>
          </pre>
        </section>
      )}

      {/* Live demo. `w-fit` keeps the panel wrapped around the demo at the width it
          was designed for, instead of stretching a mostly-empty box across the page.
          The demo carries its own card, so this wrapper adds no second frame. */}
      <section>
        <h2 className="mb-3 font-display text-2xl tracking-wide text-dojo-ember">
          Live Demo
        </h2>
        <div className="w-fit max-w-full">
          <Demo />
        </div>
      </section>

      <nav
        aria-label="Lesson navigation"
        className="mt-12 border-t border-dojo-border pr-20 pt-6"
      >
        {nextTopic ? (
          <Link
            to={`/dojo/topic/${nextTopic.slug}`}
            className="group flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <span className="text-xs uppercase tracking-[0.18em] text-dojo-muted">
              Next lesson
            </span>
            <span className="flex items-center gap-2 text-sm font-medium text-dojo-text transition-colors group-hover:text-dojo-ember sm:text-right">
              {nextTopic.title}
              <ArrowRightIcon className="h-4 w-4 shrink-0" />
            </span>
          </Link>
        ) : (
          <Link
            to="/dojo"
            className="group flex items-center justify-between text-sm font-medium text-dojo-text transition-colors hover:text-dojo-ember"
          >
            Back to all topics
            <ArrowRightIcon className="h-4 w-4 shrink-0" />
          </Link>
        )}
      </nav>
    </div>
  );
}
