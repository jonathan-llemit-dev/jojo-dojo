import { Link, useParams } from "react-router-dom";
import { topicBySlug } from "../../topics/registry";

/**
 * Individual topic page rendered at `/dojo/topic/:slug`.
 * Reads the slug from the URL, looks up the topic in the registry, and displays:
 * 1. Description / lesson explanation
 * 2. Sample code block (when available)
 * 3. Live working component demo
 */
export function TopicDetail() {
  const { slug } = useParams<{ slug: string }>() as { slug: string };
  const topic = topicBySlug[slug];

  if (!topic) {
    return (
      <div className="max-w-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Topic not found</h2>
        <p className="text-dojo-muted mb-6">
          No lesson is available for the slug &ldquo;{slug}&rdquo;.
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

  return (
    <div className="max-w-4xl">
      {/* Header with belt badge */}
      <div className="mb-6">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm ${beltColor(topic.belt)}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${beltColor(topic.belt)}`}></span>
          {topic.belt} belt
        </span>
        <h1 className="text-3xl font-bold mt-3">{topic.title}</h1>
      </div>

      {/* Description */}
      {topic.longDescription && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-dojo-ember">
            Description
          </h2>
          <p className="text-dojo-muted leading-relaxed whitespace-pre-line">
            {topic.longDescription}
          </p>
        </section>
      )}

      {/* Sample code */}
      {topic.codeExample && (
        <section className="mb-8">
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
        <div className="rounded-xl border border-dojo-border bg-dojo-surface/30 p-6">
          <Demo />
        </div>
      </section>
    </div>
  );
}

/** Color mapping for belt rank indicators. */
function beltColor(belt: string) {
  switch (belt) {
    case "black":
      return "text-dojo-crimson border-dojo-crimson";
    default:
      return "text-dojo-ember border-dojo-ember";
  }
}
