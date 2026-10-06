import { Link, useParams } from "react-router-dom";
import { topicBySlug, topicRegistry } from "../../topics/registry";
import { beltBadgeClass, beltDotClass } from "../../topics/beltStyles";
import { RichText } from "./RichText";

/**
 * Individual topic page rendered at `/dojo/topic/:slug`.
 * Reads the slug from the URL, looks up the topic in the registry, and displays:
 * 1. Description / lesson explanation
 * 2. Sample code block (when available)
 * 3. Live working component demo
 */
export function TopicDetail() {
  // A URL param is always `string | undefined`, so read it first and only look it
  // up when it exists. That keeps the "not found" branch below honest.
  const { slug } = useParams();
  const topic = slug ? topicBySlug[slug] : undefined;

  if (!topic) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Topic not found</h2>
        <p className="text-dojo-muted mb-6">
          No lesson is available for &ldquo;{slug}&rdquo;.
        </p>
        <Link
          to="/dojo"
          className="inline-block rounded-lg bg-dojo-ember px-5 py-2.5 text-black font-medium hover:bg-dojo-ember-bright transition"
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
  const lessonNumber = topicRegistry.findIndex((item) => item.slug === topic.slug) + 1;
  const lessonTotal = topicRegistry.length;

  return (
    <div className="max-w-4xl">
      {/* Header — where you are in the path, then the belt, then the heading. */}
      <header className="mb-8 border-b border-dojo-border pb-6">
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex flex-wrap items-center gap-2 text-xs text-dojo-muted"
        >
          <Link to="/dojo" className="transition hover:text-dojo-ember">
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
            className={`h-2 w-2 rounded-full ${beltDotClass(topic.belt)}`}
          ></span>
          {topic.belt} belt
        </span>
        <h1 className="text-2xl font-bold mt-3 md:text-3xl">{topic.title}</h1>
      </header>

      {/* Description */}
      {topic.longDescription && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-dojo-ember">
            Description
          </h2>
          {/* RichText understands `inline code`, ``` blocks, "- " bullets and
              blank-line paragraphs — see the convention in CLAUDE.md. */}
          <RichText text={topic.longDescription} />
        </section>
      )}

      {/* Sample code */}
      {topic.codeExample && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-dojo-ember">
            Sample Code
          </h2>
          <pre className="rounded-xl border border-dojo-border bg-dojo-surface/60 p-4 overflow-x-auto">
            <code className="text-sm text-dojo-text font-mono leading-relaxed">
              {topic.codeExample}
            </code>
          </pre>
        </section>
      )}

      {/* Live demo */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-dojo-ember">
          Live Demo
        </h2>
        <div className="rounded-xl border border-dojo-border bg-dojo-surface/30 p-4 md:p-6">
          <Demo />
        </div>
      </section>
    </div>
  );
}
