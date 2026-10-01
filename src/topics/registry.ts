import type { Topic } from "./types";
import { useStateTopic } from "./use-state";

/**
 * Aggregate topic registry — the single source of truth for both the sidebar
 * navigation list and the topic content panel.
 *
 * Import each new lesson's index.ts here as you add topics.
 */
export const topicRegistry: Topic[] = [useStateTopic];

/** Fast slug -> Topic lookup used by the TopicDetail page. */
export const topicBySlug: Record<string, Topic> = {};
for (const topic of topicRegistry) {
  topicBySlug[topic.slug] = topic;
}
