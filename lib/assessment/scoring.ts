import {
  AssessmentQuestion,
  AssessmentSubmission,
  AssessmentSubmissionItem,
  AssessmentResult,
  QuestionFeedback,
  TopicScore,
  ScoringOptions,
  QuestionFilterOptions,
  CoreSkill,
} from './types';
import { ASSESSMENT_QUESTIONS } from './questions';
import { SkillLevel } from '../types';

/**
 * Normalizes skill string to lowercase and trimmed.
 */
export function normalizeSkill(skill: string): string {
  if (!skill || typeof skill !== 'string') return '';
  const s = skill.toLowerCase().trim();
  if (s.includes('js') || s.includes('javascript') || s.includes('ecmascript')) return 'javascript';
  if (s.includes('py') || s.includes('python')) return 'python';
  if (s.includes('java') && !s.includes('script')) return 'java';
  if (s.includes('dsa') || s.includes('algorithm') || s.includes('data structure')) return 'dsa';
  return s;
}

/**
 * Retrieves the list of standard supported assessment skills.
 */
export function getSupportedAssessmentSkills(): CoreSkill[] {
  return ['javascript', 'python', 'java', 'dsa'];
}

/**
 * Fetches assessment questions for a given skill, with optional filtering.
 */
export function getAssessmentQuestions(
  skill: string,
  options?: QuestionFilterOptions
): AssessmentQuestion[] {
  const normalized = normalizeSkill(skill);
  let questions = ASSESSMENT_QUESTIONS.filter((q) => q.skill === normalized);

  // If no questions matched directly, return fallback or empty array
  if (questions.length === 0) {
    return [];
  }

  if (options?.difficulty) {
    questions = questions.filter((q) => q.difficulty === options.difficulty);
  }

  if (options?.topic) {
    const topicFilter = options.topic.toLowerCase().trim();
    questions = questions.filter((q) => q.topic.toLowerCase().includes(topicFilter));
  }

  if (options?.limit && options.limit > 0) {
    questions = questions.slice(0, options.limit);
  }

  return questions;
}

/**
 * Retrieves distinct topics available for a skill.
 */
export function getTopicsForSkill(skill: string): string[] {
  const questions = getAssessmentQuestions(skill);
  const topicsSet = new Set<string>();
  for (const q of questions) {
    topicsSet.add(q.topic);
  }
  return Array.from(topicsSet);
}

/**
 * Safely parses and normalizes submitted answers into a standard array of items.
 * Handles:
 * - Map: { "py-q1": "b", "py-q2": "c" }
 * - Array: [ { questionId: "py-q1", selectedOptionId: "b" } ]
 * - Null / undefined / invalid inputs
 */
export function sanitizeSubmissionAnswers(
  rawAnswers: unknown
): AssessmentSubmissionItem[] {
  if (!rawAnswers || typeof rawAnswers !== 'object') {
    return [];
  }

  // If it's already an array
  if (Array.isArray(rawAnswers)) {
    const sanitized: AssessmentSubmissionItem[] = [];
    for (const item of rawAnswers) {
      if (item && typeof item === 'object' && 'questionId' in item) {
        const qId = String((item as Record<string, unknown>).questionId ?? '').trim();
        if (!qId) continue;
        const sel = (item as Record<string, unknown>).selectedOptionId;
        const selectedOptionId =
          sel === null || sel === undefined ? null : String(sel).trim();
        sanitized.push({ questionId: qId, selectedOptionId });
      }
    }
    return sanitized;
  }

  // If it's an object/map of key-values
  const sanitized: AssessmentSubmissionItem[] = [];
  for (const [key, val] of Object.entries(rawAnswers as Record<string, unknown>)) {
    const qId = String(key).trim();
    if (!qId) continue;
    const selectedOptionId = val === null || val === undefined ? null : String(val).trim();
    sanitized.push({ questionId: qId, selectedOptionId });
  }
  return sanitized;
}

/**
 * Estimates skill proficiency level based on score percentage.
 * < 50%  => beginner
 * 50-79% => intermediate
 * >= 80% => advanced
 */
export function estimateProficiency(scorePercentage: number): SkillLevel {
  const score = Math.max(0, Math.min(100, Math.round(scorePercentage)));
  if (score >= 80) return 'advanced';
  if (score >= 50) return 'intermediate';
  return 'beginner';
}

/**
 * Determines weak topics from topic breakdown.
 * Returns topic names with accuracy below the threshold, ordered from lowest score to highest.
 */
export function detectWeakTopics(
  topicBreakdown: Record<string, TopicScore>,
  threshold: number = 60
): string[] {
  const weak: { topic: string; accuracy: number }[] = [];
  for (const [topic, score] of Object.entries(topicBreakdown)) {
    if (score.accuracyPercentage < threshold) {
      weak.push({ topic, accuracy: score.accuracyPercentage });
    }
  }
  // Sort ascending: lowest accuracy first
  weak.sort((a, b) => a.accuracy - b.accuracy);
  return weak.map((w) => w.topic);
}

/**
 * Determines strong topics from topic breakdown.
 * Returns topic names with accuracy >= threshold, ordered descending.
 */
export function detectStrongTopics(
  topicBreakdown: Record<string, TopicScore>,
  threshold: number = 80
): string[] {
  const strong: { topic: string; accuracy: number }[] = [];
  for (const [topic, score] of Object.entries(topicBreakdown)) {
    if (score.accuracyPercentage >= threshold) {
      strong.push({ topic, accuracy: score.accuracyPercentage });
    }
  }
  strong.sort((a, b) => b.accuracy - a.accuracy);
  return strong.map((s) => s.topic);
}

/**
 * Scores an assessment submission.
 * Handles missing answers, invalid question IDs, invalid option selections, and empty submissions.
 */
export function scoreAssessment(
  submission: AssessmentSubmission,
  options?: ScoringOptions
): AssessmentResult {
  const weakThreshold = options?.weakTopicThreshold ?? 60;
  const strongThreshold = options?.strongTopicThreshold ?? 80;

  const rawSkill = submission?.skill ?? '';
  const normalizedSkill = normalizeSkill(rawSkill);

  // Determine questions set: either custom passed in options, or loaded from bank
  const baseQuestions =
    options?.customQuestions && options.customQuestions.length > 0
      ? options.customQuestions
      : getAssessmentQuestions(normalizedSkill);

  // If question bank has no questions for this skill, handle gracefully
  if (baseQuestions.length === 0) {
    const timestamp = new Date().toISOString();
    return {
      assessmentId: `assessment-${Date.now()}`,
      skill: rawSkill || 'General',
      totalQuestions: 0,
      attemptedCount: 0,
      unansweredCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      scorePercentage: 0,
      estimatedProficiency: 'beginner',
      weakTopics: [],
      strongTopics: [],
      topicBreakdown: {},
      detailedFeedback: [],
      summaryMessage: `No assessment questions found for skill "${rawSkill}". Assessment defaulted to beginner level.`,
      recommendedNextAction: 'Start with foundational concepts.',
      timestamp,
    };
  }

  // Parse and sanitize answers
  const sanitizedAnswers = sanitizeSubmissionAnswers(submission?.answers);
  const answersMap = new Map<string, string | null>();
  for (const item of sanitizedAnswers) {
    answersMap.set(item.questionId, item.selectedOptionId);
  }

  // Evaluate each question
  const feedbackList: QuestionFeedback[] = [];
  const topicStats: Record<
    string,
    { total: number; attempted: number; correct: number }
  > = {};

  let totalQuestions = baseQuestions.length;
  let attemptedCount = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  for (const q of baseQuestions) {
    // Initialize topic stats if first time encountered
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { total: 0, attempted: 0, correct: 0 };
    }
    topicStats[q.topic].total += 1;

    const rawChoice = answersMap.get(q.id);
    const hasAnswered =
      rawChoice !== undefined &&
      rawChoice !== null &&
      rawChoice !== '' &&
      typeof rawChoice === 'string';

    if (!hasAnswered) {
      // Unanswered question
      unansweredCount += 1;
      feedbackList.push({
        questionId: q.id,
        prompt: q.prompt,
        topic: q.topic,
        difficulty: q.difficulty,
        selectedOptionId: null,
        correctOptionId: q.correctOptionId,
        isCorrect: false,
        wasAttempted: false,
        explanation: q.explanation,
        conceptTested: q.conceptTested,
      });
      continue;
    }

    // Question was attempted
    attemptedCount += 1;
    topicStats[q.topic].attempted += 1;

    // Validate if the selected option is a legitimate option id
    const validOptionIds = q.options.map((opt) => opt.id);
    const isValidOption = validOptionIds.includes(rawChoice);

    const isCorrect = isValidOption && rawChoice === q.correctOptionId;

    if (isCorrect) {
      correctCount += 1;
      topicStats[q.topic].correct += 1;
    } else {
      incorrectCount += 1;
    }

    feedbackList.push({
      questionId: q.id,
      prompt: q.prompt,
      topic: q.topic,
      difficulty: q.difficulty,
      selectedOptionId: isValidOption ? rawChoice : `invalid (${rawChoice})`,
      correctOptionId: q.correctOptionId,
      isCorrect,
      wasAttempted: true,
      explanation: q.explanation,
      conceptTested: q.conceptTested,
    });
  }

  // Calculate score percentage
  const scorePercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Build topic breakdown
  const topicBreakdown: Record<string, TopicScore> = {};
  for (const [topic, stats] of Object.entries(topicStats)) {
    const accuracy =
      stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

    let status: TopicScore['status'] = 'needs_review';
    if (accuracy >= strongThreshold) status = 'mastered';
    else if (accuracy >= weakThreshold) status = 'proficient';
    else if (accuracy >= 40) status = 'needs_review';
    else status = 'weak';

    topicBreakdown[topic] = {
      topic,
      totalQuestions: stats.total,
      attemptedCount: stats.attempted,
      correctCount: stats.correct,
      accuracyPercentage: accuracy,
      status,
    };
  }

  // Detect weak and strong topics
  const weakTopics = detectWeakTopics(topicBreakdown, weakThreshold);
  const strongTopics = detectStrongTopics(topicBreakdown, strongThreshold);

  // Estimate proficiency
  const estimatedProficiency = estimateProficiency(scorePercentage);

  // Generate actionable summary message
  let summaryMessage = '';
  let recommendedNextAction = '';

  if (scorePercentage >= 80) {
    summaryMessage = `Outstanding! You scored ${scorePercentage}% (${correctCount}/${totalQuestions}) in ${rawSkill}. You demonstrate advanced proficiency.`;
    recommendedNextAction =
      weakTopics.length > 0
        ? `Focus on refining advanced edge cases in: ${weakTopics.join(', ')}.`
        : 'Proceed to advanced architectural projects and system design challenges.';
  } else if (scorePercentage >= 50) {
    summaryMessage = `Solid foundation! You scored ${scorePercentage}% (${correctCount}/${totalQuestions}) in ${rawSkill}. You are at an intermediate level.`;
    recommendedNextAction =
      weakTopics.length > 0
        ? `Target your weak areas to unlock advanced topics: ${weakTopics.join(', ')}.`
        : 'Continue building practical projects to cement intermediate concepts.';
  } else {
    summaryMessage = `Great start! You scored ${scorePercentage}% (${correctCount}/${totalQuestions}) in ${rawSkill}. Starting at the beginner tier will build a rock-solid foundation.`;
    recommendedNextAction =
      'Follow the curated beginner roadmap focusing on core syntax, mental models, and foundational exercises.';
  }

  return {
    assessmentId: `assessment-${Date.now()}`,
    skill: rawSkill || normalizedSkill,
    totalQuestions,
    attemptedCount,
    unansweredCount,
    correctCount,
    incorrectCount,
    scorePercentage,
    estimatedProficiency,
    weakTopics,
    strongTopics,
    topicBreakdown,
    detailedFeedback: feedbackList,
    summaryMessage,
    recommendedNextAction,
    timestamp: new Date().toISOString(),
  };
}
