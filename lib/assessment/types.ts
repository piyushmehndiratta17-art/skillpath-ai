import { SkillLevel } from '../types';

/**
 * Supported core skill domains for assessments.
 */
export type CoreSkill = 'javascript' | 'python' | 'java' | 'dsa';
export type SkillName = CoreSkill | (string & {});

/**
 * Question difficulty tiers.
 */
export type QuestionDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * An individual option for a multiple-choice question.
 */
export interface QuestionOption {
  id: string; // e.g. 'a', 'b', 'c', 'd'
  text: string;
}

/**
 * Assessment multiple-choice question definition.
 */
export interface AssessmentQuestion {
  id: string;
  skill: CoreSkill;
  topic: string;
  difficulty: QuestionDifficulty;
  prompt: string;
  codeSnippet?: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  conceptTested: string;
}

/**
 * Single answer submission for a question.
 */
export interface AssessmentSubmissionItem {
  questionId: string;
  selectedOptionId: string | null;
}

/**
 * Payload submitted by the user or client.
 * Supports either an object map `{ [questionId]: optionId }` or an array of items.
 */
export interface AssessmentSubmission {
  skill: string;
  answers: Record<string, string | null> | AssessmentSubmissionItem[];
  timeSpentSeconds?: number;
}

/**
 * Detailed per-question evaluation result.
 */
export interface QuestionFeedback {
  questionId: string;
  prompt: string;
  topic: string;
  difficulty: QuestionDifficulty;
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  wasAttempted: boolean;
  explanation: string;
  conceptTested: string;
}

/**
 * Performance breakdown per topic.
 */
export interface TopicScore {
  topic: string;
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  accuracyPercentage: number; // 0 - 100
  status: 'mastered' | 'proficient' | 'needs_review' | 'weak';
}

/**
 * Comprehensive assessment scoring result.
 */
export interface AssessmentResult {
  assessmentId: string;
  skill: string;
  totalQuestions: number;
  attemptedCount: number;
  unansweredCount: number;
  correctCount: number;
  incorrectCount: number;
  scorePercentage: number; // 0 - 100
  estimatedProficiency: SkillLevel; // 'beginner' | 'intermediate' | 'advanced'
  weakTopics: string[]; // sorted by lowest accuracy first
  strongTopics: string[];
  topicBreakdown: Record<string, TopicScore>;
  detailedFeedback: QuestionFeedback[];
  summaryMessage: string;
  recommendedNextAction: string;
  timestamp: string;
}

/**
 * Options to customize assessment evaluation.
 */
export interface ScoringOptions {
  weakTopicThreshold?: number; // default: 60%
  strongTopicThreshold?: number; // default: 80%
  customQuestions?: AssessmentQuestion[];
}

/**
 * Filter options for querying assessment questions.
 */
export interface QuestionFilterOptions {
  difficulty?: QuestionDifficulty;
  topic?: string;
  limit?: number;
}
