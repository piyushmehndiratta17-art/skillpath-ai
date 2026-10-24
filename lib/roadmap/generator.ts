import { Roadmap, Milestone, SkillLevel } from '../types';
import {
  RoadmapGeneratorInput,
  PersonalizedRoadmapResult,
  ExtendedMilestone,
} from './types';
import { getMilestonesForSkill } from './catalog';
import {
  validatePrerequisiteOrder,
  topologicalSortMilestones,
} from './prerequisites';
import { matchesTopic } from './recommendation';

/**
 * Generates a personalized learning roadmap deterministically.
 * Requires 0 external API calls or paid tokens.
 */
export function generatePersonalizedRoadmap(
  input: RoadmapGeneratorInput
): PersonalizedRoadmapResult {
  const rawSkill = (input.skill || 'Programming').trim();
  const proficiency = (input.proficiency || 'beginner') as SkillLevel;
  const goal = (input.goal || 'Master the fundamentals and build real projects').trim();
  const dailyMinutes = Math.max(10, input.dailyMinutes || 30);
  const weakTopics = Array.isArray(input.weakTopics) ? input.weakTopics : [];

  // Retrieve base milestones for this skill (tailored core track or deterministic custom track)
  let rawMilestones = getMilestonesForSkill(rawSkill, proficiency, goal);

  // Apply weak topic reinforcement
  if (weakTopics.length > 0) {
    rawMilestones = rawMilestones.map((milestone) => {
      const milestoneText = `${milestone.title} ${milestone.description} ${milestone.objectives?.join(' ') || ''}`;
      const matchesMilestone = weakTopics.some((wt) => matchesTopic(milestoneText, wt));

      let hasWeakLesson = false;
      const updatedLessons = milestone.lessons.map((lesson) => {
        const lessonText = `${lesson.title} ${lesson.objective || ''}`;
        const matchesLesson = weakTopics.some((wt) => matchesTopic(lessonText, wt));
        if (matchesLesson) {
          hasWeakLesson = true;
          return {
            ...lesson,
            isWeakTopicReinforcement: true,
            title: lesson.title.includes('🎯') ? lesson.title : `🎯 ${lesson.title}`,
          };
        }
        return lesson;
      });

      if (matchesMilestone || hasWeakLesson) {
        return {
          ...milestone,
          isReinforcedForWeakTopic: true,
          xpReward: milestone.xpReward + 50,
          description: `${milestone.description} [Reinforced focus on your identified growth areas]`,
          lessons: updatedLessons,
        };
      }

      return {
        ...milestone,
        lessons: updatedLessons,
      };
    });
  }

  // Adjust milestones based on proficiency tier if advanced/intermediate
  if (proficiency === 'intermediate') {
    // Intermediate learners start with milestone 1 completed and milestone 2 in progress
    if (rawMilestones.length > 1) {
      rawMilestones[0] = {
        ...rawMilestones[0],
        status: 'completed',
        lessons: rawMilestones[0].lessons.map((l) => ({ ...l, completed: true })),
      };
      rawMilestones[1] = {
        ...rawMilestones[1],
        status: 'in_progress',
      };
    }
  } else if (proficiency === 'advanced') {
    // Advanced learners have milestones 1 & 2 completed, milestone 3 in progress
    if (rawMilestones.length > 2) {
      rawMilestones[0] = {
        ...rawMilestones[0],
        status: 'completed',
        lessons: rawMilestones[0].lessons.map((l) => ({ ...l, completed: true })),
      };
      rawMilestones[1] = {
        ...rawMilestones[1],
        status: 'completed',
        lessons: rawMilestones[1].lessons.map((l) => ({ ...l, completed: true })),
      };
      rawMilestones[2] = {
        ...rawMilestones[2],
        status: 'in_progress',
      };
    }
  }

  // Ensure prerequisite ordering is sound; topologically sort if needed
  const validation = validatePrerequisiteOrder(rawMilestones);
  let sortedMilestones = rawMilestones;
  if (!validation.isValid) {
    sortedMilestones = topologicalSortMilestones(rawMilestones);
  }

  // Compute total estimated hours
  const totalEstimatedHours = sortedMilestones.reduce(
    (sum, m) => sum + (m.estimatedHours || 0),
    0
  );

  // Estimate completion time in weeks assuming 5 study days per week
  const estimatedWeeksToComplete = Math.max(
    1,
    Math.ceil((totalEstimatedHours * 60) / (dailyMinutes * 5))
  );

  // Convert to Member 1 standard Roadmap format for 100% UI compatibility
  const standardMilestones: Milestone[] = sortedMilestones.map((em) => ({
    id: em.id,
    order: em.order,
    title: em.title,
    description: em.description,
    estimatedHours: em.estimatedHours,
    status: em.status,
    xpReward: em.xpReward,
    lessons: em.lessons.map((el) => ({
      id: el.id,
      title: el.title,
      durationMinutes: el.durationMinutes,
      type: el.type,
      completed: el.completed,
    })),
  }));

  const standardRoadmap: Roadmap = {
    id: `roadmap-${Date.now()}`,
    skill: rawSkill,
    level: proficiency,
    milestones: standardMilestones,
    totalEstimatedHours,
  };

  // Find first active milestone
  const firstActiveMilestone = sortedMilestones.find(
    (m) => m.status === 'in_progress' || m.status === 'available'
  ) || sortedMilestones[0];

  const firstLesson = firstActiveMilestone?.lessons.find((l) => !l.completed) ||
    firstActiveMilestone?.lessons[0];

  return {
    roadmap: standardRoadmap,
    extendedMilestones: sortedMilestones,
    skill: rawSkill,
    proficiency,
    goal,
    dailyMinutes,
    totalEstimatedHours,
    estimatedWeeksToComplete,
    weakTopicsTargeted: weakTopics,
    recommendedFirstLesson: {
      milestoneId: firstActiveMilestone.id,
      milestoneTitle: firstActiveMilestone.title,
      lessonId: firstLesson.id,
      lessonTitle: firstLesson.title,
    },
    generatedAt: new Date().toISOString(),
  };
}
