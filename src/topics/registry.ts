import type { Topic } from "./types";
import { useStateTopic } from "./use-state";

/**
 * Aggregate topic registry — the single source of truth for both the sidebar
 * navigation list and the topic content panel.
 *
 * Import each new lesson's index.ts here as you add topics.
 */
export const topicRegistry: Topic[] = [useStateTopic];

/**
 * Fast slug -> Topic lookup used by the TopicDetail page.
 *
 * Typed as `Topic | undefined` on purpose: any string can be used as a key, so a
 * lookup for a slug with no lesson really can come back empty. Without the
 * `| undefined`, TypeScript would claim the result is always a Topic and the
 * "topic not found" branch in TopicDetail would look like dead code.
 */
export const topicBySlug: Record<string, Topic | undefined> = {};
for (const topic of topicRegistry) {
  topicBySlug[topic.slug] = topic;
}
