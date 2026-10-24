import { Milestone, Lesson, Roadmap, SkillLevel, MilestoneStatus } from '../types';

/**
 * Hands-on practice task for a module/milestone.
 */
export interface PracticeTask {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  starterCode?: string;
  hints: string[];
}

/**
 * Milestone checkpoint verification quiz.
 */
export interface CheckpointQuiz {
  id: string;
  title: string;
  questionCount: number;
  passingPercentage: number;
  topicsCovered: string[];
}

/**
 * Extended lesson with learning objectives and weak topic tagging.
 */
export interface ExtendedLesson extends Lesson {
  objective: string;
  keyTakeaways?: string[];
  isWeakTopicReinforcement?: boolean;
}

/**
 * Extended milestone with explicit prerequisite ordering, practice tasks, and checkpoint quizzes.
 */
export interface ExtendedMilestone extends Milestone {
  prerequisites: string[]; // IDs of preceding required milestones
  objectives: string[];
  lessons: ExtendedLesson[];
  practiceTask: PracticeTask;
  checkpointQuiz: CheckpointQuiz;
  isReinforcedForWeakTopic?: boolean;
}

/**
 * Input parameters for roadmap generation.
 */
export interface RoadmapGeneratorInput {
  skill: string;
  proficiency: SkillLevel;
  weakTopics?: string[];
  goal: string;
  dailyMinutes: number; // e.g. 15, 30, 45, 60, 90
}

/**
 * Result of the roadmap generation engine.
 */
export interface PersonalizedRoadmapResult {
  roadmap: Roadmap;
  extendedMilestones: ExtendedMilestone[];
  skill: string;
  proficiency: SkillLevel;
  goal: string;
  dailyMinutes: number;
  totalEstimatedHours: number;
  estimatedWeeksToComplete: number;
  weakTopicsTargeted: string[];
  recommendedFirstLesson: {
    milestoneId: string;
    milestoneTitle: string;
    lessonId: string;
    lessonTitle: string;
  };
  generatedAt: string;
}

/**
 * Recommendation for the learner's next step.
 */
export interface NextLessonRecommendation {
  milestone: Milestone;
  lesson: Lesson;
  reason: string;
  isWeakTopicReinforcement: boolean;
  estimatedMinutes: number;
  progressContext: {
    milestoneIndex: number;
    totalMilestones: number;
    lessonIndex: number;
    totalLessonsInMilestone: number;
  };
}
