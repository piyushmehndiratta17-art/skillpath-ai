import { Roadmap, Milestone, Lesson } from '../types';
import { ExtendedMilestone, NextLessonRecommendation } from './types';
import { arePrerequisitesMet } from './prerequisites';

export interface RecommendationOptions {
  extendedMilestones?: ExtendedMilestone[];
  weakTopics?: string[];
}

/**
 * Checks if a text matches a topic name, either full match or by significant keywords.
 */
export function matchesTopic(text: string, topic: string): boolean {
  if (!text || !topic) return false;
  const tLower = text.toLowerCase();
  const topLower = topic.toLowerCase().trim();

  // Direct substring match
  if (tLower.includes(topLower)) return true;

  // Split topic into keywords (e.g., "Asynchronous JS" -> ["asynchronous", "async", "js"])
  const keywords = topLower
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4);

  // If topic has abbreviations like "oop", "dsa", "bst", "js"
  const shortAbbrs = topLower.match(/\b(oop|dsa|bst|gil|dom|es6|jvm)\b/g) || [];

  return (
    keywords.some((k) => tLower.includes(k)) ||
    shortAbbrs.some((abbr) => tLower.includes(abbr))
  );
}

/**
 * Recommends the next lesson for the learner to focus on.
 * Evaluates prerequisite satisfaction, lesson completion states, and weak-topic reinforcement priorities.
 */
export function getRecommendedNextLesson(
  roadmap: Roadmap,
  options?: RecommendationOptions
): NextLessonRecommendation | null {
  if (!roadmap || !roadmap.milestones || roadmap.milestones.length === 0) {
    return null;
  }

  const extendedMap = new Map<string, ExtendedMilestone>();
  if (options?.extendedMilestones) {
    for (const em of options.extendedMilestones) {
      extendedMap.set(em.id, em);
    }
  }

  const originalWeakTopics = options?.weakTopics || [];
  const completedMilestoneIds = new Set<string>();

  for (const m of roadmap.milestones) {
    const allLessonsDone = m.lessons.length > 0 && m.lessons.every((l) => l.completed);
    if (m.status === 'completed' || allLessonsDone) {
      completedMilestoneIds.add(m.id);
    }
  }

  // Iterate milestones in order
  for (let mIdx = 0; mIdx < roadmap.milestones.length; mIdx++) {
    const milestone = roadmap.milestones[mIdx];
    const ext = extendedMap.get(milestone.id);

    // If extended milestone has prerequisites, check if they are satisfied
    if (ext && ext.prerequisites.length > 0) {
      const unlocked = arePrerequisitesMet(ext, completedMilestoneIds);
      if (!unlocked) {
        continue;
      }
    }

    // Find first uncompleted lesson in this milestone
    const uncompletedIdx = milestone.lessons.findIndex((l) => !l.completed);
    if (uncompletedIdx !== -1) {
      const lesson = milestone.lessons[uncompletedIdx];

      // Check if this lesson or milestone targets any identified weak topic
      const combinedText = `${milestone.title} ${lesson.title} ${ext?.objectives?.join(' ') || ''}`;
      const matchedOriginalTopic = originalWeakTopics.find((orig) =>
        matchesTopic(combinedText, orig)
      );
      const isWeakTopicReinforcement = Boolean(matchedOriginalTopic);

      let reason = `Continue your structured sequence in "${milestone.title}".`;
      if (isWeakTopicReinforcement && matchedOriginalTopic) {
        reason = `High-Priority Review: This lesson reinforces your identified growth topic in "${matchedOriginalTopic}".`;
      } else if (uncompletedIdx === 0) {
        reason = `Kick off "${milestone.title}" with this foundational lesson.`;
      } else if (lesson.type === 'project') {
        reason = `Hands-on checkpoint: Put theory into practice with this milestone project.`;
      } else if (lesson.type === 'quiz') {
        reason = `Checkpoint assessment: Validate your understanding of "${milestone.title}".`;
      }

      return {
        milestone,
        lesson,
        reason,
        isWeakTopicReinforcement,
        estimatedMinutes: lesson.durationMinutes,
        progressContext: {
          milestoneIndex: mIdx + 1,
          totalMilestones: roadmap.milestones.length,
          lessonIndex: uncompletedIdx + 1,
          totalLessonsInMilestone: milestone.lessons.length,
        },
      };
    }
  }

  // If every lesson is completed across all milestones
  return null;
}
