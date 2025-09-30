import type { Quiz, QuizBlock } from "../types/quizType";
import { nowIso } from "./datetime";

export const withUpdatedAt = <T extends { updatedAt?: string }>(obj: T): T => ({
  ...obj,
  updatedAt: nowIso(),
});

export const publishQuiz = (quiz: Quiz): Quiz => ({
  ...quiz,
  published: true,
  publishedAt: nowIso(),
  updatedAt: nowIso(),
});

export const unpublishQuiz = (quiz: Quiz): Quiz => ({
  ...quiz,
  published: false,
  publishedAt: undefined,
  updatedAt: nowIso(),
});

export const withBlocks = (quiz: Quiz, blocks: QuizBlock[]): Quiz => ({
  ...quiz,
  blocks,
  updatedAt: nowIso(),
});
