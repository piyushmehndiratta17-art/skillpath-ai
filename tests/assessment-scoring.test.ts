import test from 'node:test';
import assert from 'node:assert/strict';
import {
  scoreAssessment,
  getAssessmentQuestions,
  getSupportedAssessmentSkills,
  estimateProficiency,
  detectWeakTopics,
  detectStrongTopics,
  sanitizeSubmissionAnswers,
} from '../lib/assessment/index';

test('Assessment Question Bank Integrity', () => {
  const skills = getSupportedAssessmentSkills();
  assert.deepEqual(skills, ['javascript', 'python', 'java', 'dsa']);

  for (const skill of skills) {
    const questions = getAssessmentQuestions(skill);
    assert.ok(
      questions.length >= 10,
      `Expected at least 10 questions for ${skill}, found ${questions.length}`
    );

    for (const q of questions) {
      assert.ok(q.id, `Question has ID`);
      assert.strictEqual(q.skill, skill);
      assert.ok(q.prompt.length > 10, `Question ${q.id} has valid prompt`);
      assert.strictEqual(q.options.length, 4, `Question ${q.id} has 4 options`);
      assert.ok(
        q.options.some((opt) => opt.id === q.correctOptionId),
        `Question ${q.id} correctOptionId (${q.correctOptionId}) must exist in options`
      );
      assert.ok(
        q.explanation.length > 15,
        `Question ${q.id} has comprehensive explanation`
      );
      assert.ok(
        ['beginner', 'intermediate', 'advanced'].includes(q.difficulty),
        `Question ${q.id} has valid difficulty`
      );
      assert.ok(q.topic.length > 2, `Question ${q.id} has valid topic`);
    }
  }
});

test('Scoring: Perfect Score (100%)', () => {
  const questions = getAssessmentQuestions('python');
  const answers: Record<string, string> = {};
  for (const q of questions) {
    answers[q.id] = q.correctOptionId;
  }

  const result = scoreAssessment({
    skill: 'python',
    answers,
  });

  assert.strictEqual(result.totalQuestions, questions.length);
  assert.strictEqual(result.correctCount, questions.length);
  assert.strictEqual(result.incorrectCount, 0);
  assert.strictEqual(result.unansweredCount, 0);
  assert.strictEqual(result.scorePercentage, 100);
  assert.strictEqual(result.estimatedProficiency, 'advanced');
  assert.strictEqual(result.weakTopics.length, 0);
  assert.ok(result.strongTopics.length > 0);
});

test('Scoring: Zero Score (0%)', () => {
  const questions = getAssessmentQuestions('javascript');
  const answers: Record<string, string> = {};
  for (const q of questions) {
    // Choose an option that is deliberately wrong
    const wrong = q.options.find((opt) => opt.id !== q.correctOptionId)!;
    answers[q.id] = wrong.id;
  }

  const result = scoreAssessment({
    skill: 'javascript',
    answers,
  });

  assert.strictEqual(result.correctCount, 0);
  assert.strictEqual(result.incorrectCount, questions.length);
  assert.strictEqual(result.scorePercentage, 0);
  assert.strictEqual(result.estimatedProficiency, 'beginner');
  assert.ok(result.weakTopics.length > 0);
  assert.strictEqual(result.strongTopics.length, 0);
});

test('Scoring: Missing / Unanswered Questions Handled Gracefully', () => {
  const questions = getAssessmentQuestions('java');
  // Only answer 4 out of 10 questions correctly, leave 6 unanswered
  const answers: Record<string, string | null> = {};
  for (let i = 0; i < 4; i++) {
    answers[questions[i].id] = questions[i].correctOptionId;
  }
  // Explicit null for 5th
  answers[questions[4].id] = null;
  // Omit the remaining questions entirely

  const result = scoreAssessment({
    skill: 'java',
    answers,
  });

  assert.strictEqual(result.totalQuestions, 10);
  assert.strictEqual(result.attemptedCount, 4);
  assert.strictEqual(result.unansweredCount, 6);
  assert.strictEqual(result.correctCount, 4);
  assert.strictEqual(result.incorrectCount, 0);
  assert.strictEqual(result.scorePercentage, 40);
  assert.strictEqual(result.estimatedProficiency, 'beginner');

  // Verify unanswered feedback items
  const unansweredFeedback = result.detailedFeedback.filter((f) => !f.wasAttempted);
  assert.strictEqual(unansweredFeedback.length, 6);
  for (const item of unansweredFeedback) {
    assert.strictEqual(item.isCorrect, false);
    assert.strictEqual(item.selectedOptionId, null);
  }
});

test('Scoring: Weak-Topic Detection & Ranking', () => {
  const questions = getAssessmentQuestions('dsa');
  // Intentionally answer correctly only on Complexity & Stacks, and fail on Linked Lists & Trees
  const answers: Record<string, string> = {};
  for (const q of questions) {
    if (q.topic.includes('Complexity') || q.topic.includes('Stacks')) {
      answers[q.id] = q.correctOptionId;
    } else {
      // Pick deliberately wrong answer
      const wrong = q.options.find((o) => o.id !== q.correctOptionId)!;
      answers[q.id] = wrong.id;
    }
  }

  const result = scoreAssessment(
    { skill: 'dsa', answers },
    { weakTopicThreshold: 60 }
  );

  assert.ok(result.weakTopics.length > 0);
  // Verify that identified weak topics really scored < 60%
  for (const wt of result.weakTopics) {
    const topicStat = result.topicBreakdown[wt];
    assert.ok(topicStat.accuracyPercentage < 60);
  }

  // Verify strong topics scored >= 80%
  for (const st of result.strongTopics) {
    const topicStat = result.topicBreakdown[st];
    assert.ok(topicStat.accuracyPercentage >= 80);
  }
});

test('Proficiency Estimation Boundaries', () => {
  assert.strictEqual(estimateProficiency(0), 'beginner');
  assert.strictEqual(estimateProficiency(49), 'beginner');
  assert.strictEqual(estimateProficiency(50), 'intermediate');
  assert.strictEqual(estimateProficiency(79), 'intermediate');
  assert.strictEqual(estimateProficiency(80), 'advanced');
  assert.strictEqual(estimateProficiency(100), 'advanced');
  // Clamping
  assert.strictEqual(estimateProficiency(-10), 'beginner');
  assert.strictEqual(estimateProficiency(120), 'advanced');
});

test('Invalid Input Resilience', () => {
  // Null submission
  const res1 = scoreAssessment(null as any);
  assert.ok(res1);
  assert.strictEqual(res1.totalQuestions, 0);
  assert.strictEqual(res1.scorePercentage, 0);

  // Unknown skill with no questions
  const res2 = scoreAssessment({
    skill: 'unknown-quantum-lang',
    answers: { 'some-q': 'a' },
  });
  assert.ok(res2);
  assert.strictEqual(res2.totalQuestions, 0);
  assert.strictEqual(res2.estimatedProficiency, 'beginner');

  // Question IDs with invalid / bogus option values
  const questions = getAssessmentQuestions('python');
  const res3 = scoreAssessment({
    skill: 'python',
    answers: {
      [questions[0].id]: 'invalid_option_xyz',
      'non-existent-q-999': 'a',
    },
  });
  assert.strictEqual(res3.totalQuestions, questions.length);
  assert.strictEqual(res3.correctCount, 0);

  const invalidFeedback = res3.detailedFeedback.find((f) => f.questionId === questions[0].id)!;
  assert.ok(invalidFeedback.selectedOptionId?.includes('invalid'));
  assert.strictEqual(invalidFeedback.isCorrect, false);
});

test('Sanitization of Array vs Map Answer Formats', () => {
  const mapData = { 'q-1': 'a', 'q-2': 'b', 'q-3': null };
  const sanitizedMap = sanitizeSubmissionAnswers(mapData);
  assert.strictEqual(sanitizedMap.length, 3);
  assert.strictEqual(sanitizedMap[0].questionId, 'q-1');
  assert.strictEqual(sanitizedMap[0].selectedOptionId, 'a');
  assert.strictEqual(sanitizedMap[2].selectedOptionId, null);

  const arrayData = [
    { questionId: 'q-1', selectedOptionId: 'a' },
    { questionId: 'q-2', selectedOptionId: 'b' },
  ];
  const sanitizedArray = sanitizeSubmissionAnswers(arrayData);
  assert.strictEqual(sanitizedArray.length, 2);

  // Null / garbage inputs
  assert.deepEqual(sanitizeSubmissionAnswers(null), []);
  assert.deepEqual(sanitizeSubmissionAnswers('string'), []);
  assert.deepEqual(sanitizeSubmissionAnswers(12345), []);
});
