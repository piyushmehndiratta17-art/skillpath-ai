import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generatePersonalizedRoadmap,
  validatePrerequisiteOrder,
  topologicalSortMilestones,
  getMilestonesForSkill,
  ExtendedMilestone,
} from '../lib/roadmap/index';

test('Roadmap Generation for Core Skills', () => {
  const skills = ['JavaScript', 'Python', 'Java', 'DSA'];

  for (const skill of skills) {
    const res = generatePersonalizedRoadmap({
      skill,
      proficiency: 'beginner',
      goal: `Become proficient in ${skill}`,
      dailyMinutes: 30,
    });

    assert.ok(res.roadmap, `Roadmap object exists for ${skill}`);
    assert.strictEqual(res.roadmap.skill, skill);
    assert.strictEqual(res.roadmap.level, 'beginner');
    assert.strictEqual(res.roadmap.milestones.length, 5, `Must have 5 milestones`);
    assert.ok(res.totalEstimatedHours > 0, `Total estimated hours is positive`);
    assert.ok(res.estimatedWeeksToComplete > 0, `Estimated weeks is positive`);

    // Verify milestone structure compatibility with Member 1's UI
    for (let i = 0; i < res.roadmap.milestones.length; i++) {
      const m = res.roadmap.milestones[i];
      assert.strictEqual(m.order, i + 1);
      assert.ok(m.title.length > 5);
      assert.ok(m.description.length > 10);
      assert.ok(m.lessons.length >= 3);
      assert.ok(m.xpReward >= 100);

      // Verify each lesson
      for (const l of m.lessons) {
        assert.ok(l.id);
        assert.ok(l.title);
        assert.ok(l.durationMinutes > 0);
        assert.ok(['reading', 'video', 'quiz', 'project'].includes(l.type));
      }
    }

    // Verify extended metadata is present
    for (const em of res.extendedMilestones) {
      assert.ok(Array.isArray(em.prerequisites));
      assert.ok(Array.isArray(em.objectives));
      assert.ok(em.objectives.length > 0);
      assert.ok(em.practiceTask);
      assert.ok(em.practiceTask.title);
      assert.ok(em.practiceTask.instructions.length > 0);
      assert.ok(em.checkpointQuiz);
      assert.ok(em.checkpointQuiz.questionCount > 0);
    }
  }
});

test('Deterministic Fallback for Unknown / Custom Skills', () => {
  const customSkills = ['Rust', 'Golang', 'DevOps & Kubernetes', 'Machine Learning'];

  for (const skill of customSkills) {
    const res = generatePersonalizedRoadmap({
      skill,
      proficiency: 'beginner',
      goal: `Build a production service using ${skill}`,
      dailyMinutes: 45,
    });

    assert.ok(res.roadmap);
    assert.strictEqual(res.roadmap.skill, skill);
    assert.strictEqual(res.roadmap.milestones.length, 5);
    assert.ok(res.roadmap.milestones[0].title.includes(skill));

    // Verify strict prerequisite ordering in fallback
    const validation = validatePrerequisiteOrder(res.extendedMilestones);
    assert.strictEqual(validation.isValid, true);
    assert.strictEqual(validation.errors.length, 0);
  }
});

test('Prerequisite Ordering: Validation & Topological Sort', () => {
  // 1. Verify all core tracks pass prerequisite validation out of the box
  for (const skill of ['javascript', 'python', 'java', 'dsa']) {
    const milestones = getMilestonesForSkill(skill, 'beginner', 'learn');
    const val = validatePrerequisiteOrder(milestones);
    assert.strictEqual(
      val.isValid,
      true,
      `Prerequisites invalid for ${skill}: ${val.errors.join(', ')}`
    );
  }

  // 2. Test intentional prerequisite inversion
  const badMilestones: ExtendedMilestone[] = [
    {
      id: 'm1',
      order: 1,
      title: 'Advanced Module',
      description: 'Desc',
      estimatedHours: 3,
      status: 'in_progress',
      xpReward: 100,
      prerequisites: ['m2'], // VIOLATION: depends on m2 which appears AFTER m1!
      objectives: ['Obj'],
      lessons: [],
      practiceTask: {} as any,
      checkpointQuiz: {} as any,
    },
    {
      id: 'm2',
      order: 2,
      title: 'Foundational Module',
      description: 'Desc',
      estimatedHours: 3,
      status: 'locked',
      xpReward: 100,
      prerequisites: [],
      objectives: ['Obj'],
      lessons: [],
      practiceTask: {} as any,
      checkpointQuiz: {} as any,
    },
  ];

  const badVal = validatePrerequisiteOrder(badMilestones);
  assert.strictEqual(badVal.isValid, false);
  assert.ok(badVal.errors.some((e) => e.includes('Prerequisite violation')));

  // 3. Test topological sorting resolves the ordering
  const sorted = topologicalSortMilestones(badMilestones);
  assert.strictEqual(sorted[0].id, 'm2'); // Foundational module comes first
  assert.strictEqual(sorted[1].id, 'm1'); // Dependent module comes second
  assert.strictEqual(sorted[0].order, 1);
  assert.strictEqual(sorted[1].order, 2);

  const recheck = validatePrerequisiteOrder(sorted);
  assert.strictEqual(recheck.isValid, true);
});

test('Circular Prerequisite Detection', () => {
  const circularMilestones: ExtendedMilestone[] = [
    {
      id: 'm1',
      order: 1,
      title: 'Module 1',
      description: 'Desc',
      estimatedHours: 2,
      status: 'available',
      xpReward: 100,
      prerequisites: ['m2'], // m1 depends on m2
      objectives: [],
      lessons: [],
      practiceTask: {} as any,
      checkpointQuiz: {} as any,
    },
    {
      id: 'm2',
      order: 2,
      title: 'Module 2',
      description: 'Desc',
      estimatedHours: 2,
      status: 'available',
      xpReward: 100,
      prerequisites: ['m1'], // m2 depends on m1 -> cycle!
      objectives: [],
      lessons: [],
      practiceTask: {} as any,
      checkpointQuiz: {} as any,
    },
  ];

  const val = validatePrerequisiteOrder(circularMilestones);
  assert.strictEqual(val.isValid, false);
  assert.ok(val.errors.some((e) => e.includes('Circular prerequisite')));
});

test('Weak-Topic Reinforcement in Roadmap', () => {
  const weakTopics = ['Closures', 'Asynchronous JS'];

  const res = generatePersonalizedRoadmap({
    skill: 'javascript',
    proficiency: 'beginner',
    weakTopics,
    goal: 'Master modern full-stack web applications',
    dailyMinutes: 30,
  });

  assert.deepEqual(res.weakTopicsTargeted, weakTopics);

  // Milestone 2 covers Closures and Milestone 3 covers Asynchronous JS
  const reinforcedMilestones = res.extendedMilestones.filter(
    (m) => m.isReinforcedForWeakTopic
  );
  assert.ok(
    reinforcedMilestones.length >= 2,
    `Expected at least 2 reinforced milestones, found ${reinforcedMilestones.length}`
  );

  for (const rm of reinforcedMilestones) {
    assert.ok(rm.description.includes('Reinforced focus'));
    assert.ok(rm.xpReward > 200); // boosted XP reward
  }

  // Check that lessons in the standard roadmap reflect the targeted indicator
  const reinforcedLessons = res.roadmap.milestones
    .flatMap((m) => m.lessons)
    .filter((l) => l.title.includes('🎯'));
  assert.ok(reinforcedLessons.length > 0);
});

test('Daily Study Time and Pacing Calculation', () => {
  const shortPace = generatePersonalizedRoadmap({
    skill: 'Python',
    proficiency: 'beginner',
    goal: 'Data Analysis',
    dailyMinutes: 15,
  });

  const fastPace = generatePersonalizedRoadmap({
    skill: 'Python',
    proficiency: 'beginner',
    goal: 'Data Analysis',
    dailyMinutes: 60,
  });

  assert.strictEqual(shortPace.totalEstimatedHours, fastPace.totalEstimatedHours);
  // Studying 15 min/day should take 4x more weeks than 60 min/day
  assert.ok(shortPace.estimatedWeeksToComplete > fastPace.estimatedWeeksToComplete);

  // Exact math check: totalHours * 60 / (dailyMinutes * 5 days/week)
  const expectedWeeksShort = Math.ceil(
    (shortPace.totalEstimatedHours * 60) / (15 * 5)
  );
  assert.strictEqual(shortPace.estimatedWeeksToComplete, expectedWeeksShort);
});
