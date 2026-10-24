/**
 * Assessment Engine Adapter Interface
 * Member 1 (Frontend) <-> Member 2 (Skill Assessment Engine & Roadmap Generator)
 *
 * NOTE: Member 2 will provide the actual backend or scoring engine.
 * Keep scoring logic decoupled from the frontend UI components.
 */

import {
  SkillLevel,
  DiagnosticQuestion,
  DiagnosticQuiz,
  AssessmentResult,
  WeakTopic,
} from './types';
import { DIAGNOSTIC_QUESTIONS } from './mock-data';

export interface AssessmentSubmission {
  skill: string;
  goal: string;
  proficiency: SkillLevel;
  dailyMinutes: number;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
}

/**
 * Retrieves the diagnostic questions for a selected skill and proficiency.
 * Coordinates with Member 2's question bank.
 */
export function getDiagnosticQuestionsForSkill(
  skill: string,
  level: SkillLevel
): DiagnosticQuestion[] {
  const normalized = skill.toLowerCase().trim();
  if (normalized.includes('python')) {
    return DIAGNOSTIC_QUESTIONS.python;
  }
  if (normalized.includes('javascript') || normalized.includes('web') || normalized.includes('react')) {
    return DIAGNOSTIC_QUESTIONS.javascript;
  }
  return DIAGNOSTIC_QUESTIONS.general;
}

/**
 * Temporary mock evaluator for Stage 1.
 * Member 2 will plug in their ML / Rule-based diagnostic scoring engine here.
 */
export async function evaluateAssessment(
  submission: AssessmentSubmission
): Promise<AssessmentResult> {
  // Simulate network/inference latency
  await new Promise((r) => setTimeout(r, 600));

  const questions = getDiagnosticQuestionsForSkill(submission.skill, submission.proficiency);
  let correctCount = 0;
  const incorrectTopics: string[] = [];
  const correctTopics: string[] = [];

  questions.forEach((q) => {
    const selected = submission.answers[q.id];
    if (selected === q.correctOptionIndex) {
      correctCount++;
      correctTopics.push(q.topic);
    } else {
      incorrectTopics.push(q.topic);
    }
  });

  const total = Math.max(1, questions.length);
  const scorePercent = Math.round((correctCount / total) * 100);

  let evaluatedLevel: SkillLevel = submission.proficiency;
  if (scorePercent >= 80) {
    evaluatedLevel = submission.proficiency === 'beginner' ? 'intermediate' : 'advanced';
  } else if (scorePercent < 40) {
    evaluatedLevel = 'beginner';
  }

  // Build weak topics payload
  const weakTopics: WeakTopic[] = incorrectTopics.length > 0
    ? incorrectTopics.map((topic) => ({
        topic,
        recommendation: `Targeted review recommended: practice foundational syntax and mental models for ${topic}.`,
        priority: 'high',
      }))
    : [
        {
          topic: 'Advanced Idioms & Architecture',
          recommendation: 'Solid fundamentals detected! Progress directly to functional design patterns.',
          priority: 'low',
        },
      ];

  const strengths = correctTopics.length > 0
    ? Array.from(new Set(correctTopics))
    : ['Basic Computational Logic', 'Goal Clarity'];

  return {
    id: `assess-${Date.now()}`,
    skill: submission.skill,
    goal: submission.goal,
    dailyMinutes: submission.dailyMinutes,
    selfReportedLevel: submission.proficiency,
    scorePercent,
    evaluatedLevel,
    strengths,
    weakTopics,
    recommendedStartingMilestoneId: scorePercent >= 75 ? 'm2' : 'm1',
    completedAt: new Date().toISOString(),
  };
}
