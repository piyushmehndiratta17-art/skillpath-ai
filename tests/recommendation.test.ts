import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generatePersonalizedRoadmap,
  getRecommendedNextLesson,
} from '../lib/roadmap/index';

test('Recommendation: First Lesson on New Roadmap', () => {
  const result = generatePersonalizedRoadmap({
    skill: 'Python',
    proficiency: 'beginner',
    goal: 'Automation',
    dailyMinutes: 30,
  });

  const next = getRecommendedNextLesson(result.roadmap, {
    extendedMilestones: result.extendedMilestones,
  });

  assert.ok(next);
  assert.strictEqual(next.milestone.id, 'py-m1');
  assert.strictEqual(next.lesson.id, 'py-l1-1');
  assert.strictEqual(next.progressContext.milestoneIndex, 1);
  assert.strictEqual(next.progressContext.lessonIndex, 1);
  assert.strictEqual(next.isWeakTopicReinforcement, false);
});

test('Recommendation: Progresses Sequentially Within Milestone', () => {
  const result = generatePersonalizedRoadmap({
    skill: 'Python',
    proficiency: 'beginner',
    goal: 'Automation',
    dailyMinutes: 30,
  });

  // Mark first two lessons as completed
  result.roadmap.milestones[0].lessons[0].completed = true;
  result.roadmap.milestones[0].lessons[1].completed = true;

  const next = getRecommendedNextLesson(result.roadmap, {
    extendedMilestones: result.extendedMilestones,
  });

  assert.ok(next);
  assert.strictEqual(next.milestone.id, 'py-m1');
  assert.strictEqual(next.lesson.id, 'py-l1-3');
  assert.strictEqual(next.progressContext.lessonIndex, 3);
});

test('Recommendation: Advances to Milestone 2 Once Milestone 1 Is Done', () => {
  const result = generatePersonalizedRoadmap({
    skill: 'Python',
    proficiency: 'beginner',
    goal: 'Automation',
    dailyMinutes: 30,
  });

  // Complete all lessons in Milestone 1
  for (const l of result.roadmap.milestones[0].lessons) {
    l.completed = true;
  }
  result.roadmap.milestones[0].status = 'completed';
  result.roadmap.milestones[1].status = 'in_progress';

  const next = getRecommendedNextLesson(result.roadmap, {
    extendedMilestones: result.extendedMilestones,
  });

  assert.ok(next);
  assert.strictEqual(next.milestone.id, 'py-m2');
  assert.strictEqual(next.lesson.id, 'py-l2-1');
  assert.strictEqual(next.progressContext.milestoneIndex, 2);
});

test('Recommendation: Highlights Weak-Topic Reinforcement', () => {
  const result = generatePersonalizedRoadmap({
    skill: 'JavaScript',
    proficiency: 'beginner',
    weakTopics: ['Closures'],
    goal: 'Full-stack apps',
    dailyMinutes: 30,
  });

  // Complete Milestone 1 so Milestone 2 (Closures) becomes active
  for (const l of result.roadmap.milestones[0].lessons) {
    l.completed = true;
  }
  result.roadmap.milestones[0].status = 'completed';
  result.roadmap.milestones[1].status = 'in_progress';

  const next = getRecommendedNextLesson(result.roadmap, {
    extendedMilestones: result.extendedMilestones,
    weakTopics: ['Closures'],
  });

  assert.ok(next);
  assert.strictEqual(next.milestone.id, 'js-m2');
  assert.strictEqual(next.isWeakTopicReinforcement, true);
  assert.ok(next.reason.includes('High-Priority Review'));
  assert.ok(next.reason.includes('Closures'));
});

test('Recommendation: Returns Null When All Lessons Completed', () => {
  const result = generatePersonalizedRoadmap({
    skill: 'Python',
    proficiency: 'beginner',
    goal: 'Automation',
    dailyMinutes: 30,
  });

  // Mark all lessons in all milestones complete
  for (const m of result.roadmap.milestones) {
    m.status = 'completed';
    for (const l of m.lessons) {
      l.completed = true;
    }
  }

  const next = getRecommendedNextLesson(result.roadmap, {
    extendedMilestones: result.extendedMilestones,
  });

  assert.strictEqual(next, null);
});
