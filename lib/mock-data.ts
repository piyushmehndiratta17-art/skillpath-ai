import { Roadmap, Milestone, LearnerStats } from './types';

// ─── Python Beginner Roadmap ──────────────────────────────────────────────────

const PYTHON_BEGINNER_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    order: 1,
    title: 'Python Fundamentals',
    description: 'Set up Python, write your first program, and understand how the interpreter works.',
    estimatedHours: 3,
    status: 'in_progress',
    xpReward: 100,
    lessons: [
      { id: 'l1-1', title: 'Installing Python & VS Code', durationMinutes: 20, type: 'reading', completed: true },
      { id: 'l1-2', title: 'Your First Python Program', durationMinutes: 25, type: 'reading', completed: true },
      { id: 'l1-3', title: 'How the Python Interpreter Works', durationMinutes: 15, type: 'video', completed: false },
      { id: 'l1-4', title: 'Fundamentals Quiz', durationMinutes: 10, type: 'quiz', completed: false },
    ],
  },
  {
    id: 'm2',
    order: 2,
    title: 'Variables & Data Types',
    description: 'Learn strings, integers, floats, booleans, and how Python stores information.',
    estimatedHours: 4,
    status: 'available',
    xpReward: 150,
    lessons: [
      { id: 'l2-1', title: 'What Are Variables?', durationMinutes: 20, type: 'reading', completed: false },
      { id: 'l2-2', title: 'Numbers and Strings', durationMinutes: 30, type: 'reading', completed: false },
      { id: 'l2-3', title: 'Lists and Tuples', durationMinutes: 30, type: 'video', completed: false },
      { id: 'l2-4', title: 'Dictionaries', durationMinutes: 25, type: 'reading', completed: false },
      { id: 'l2-5', title: 'Data Types Quiz', durationMinutes: 15, type: 'quiz', completed: false },
    ],
  },
  {
    id: 'm3',
    order: 3,
    title: 'Conditions & Loops',
    description: 'Control program flow with if/else statements and repeat actions with for and while loops.',
    estimatedHours: 5,
    status: 'locked',
    xpReward: 200,
    lessons: [
      { id: 'l3-1', title: 'If, Elif, Else', durationMinutes: 25, type: 'reading', completed: false },
      { id: 'l3-2', title: 'Comparison & Logical Operators', durationMinutes: 20, type: 'reading', completed: false },
      { id: 'l3-3', title: 'For Loops', durationMinutes: 30, type: 'video', completed: false },
      { id: 'l3-4', title: 'While Loops', durationMinutes: 25, type: 'reading', completed: false },
      { id: 'l3-5', title: 'Loops & Conditions Quiz', durationMinutes: 20, type: 'quiz', completed: false },
    ],
  },
  {
    id: 'm4',
    order: 4,
    title: 'Functions',
    description: 'Write reusable blocks of code with functions, parameters, and return values.',
    estimatedHours: 4,
    status: 'locked',
    xpReward: 200,
    lessons: [
      { id: 'l4-1', title: 'Defining & Calling Functions', durationMinutes: 30, type: 'reading', completed: false },
      { id: 'l4-2', title: 'Parameters & Arguments', durationMinutes: 25, type: 'reading', completed: false },
      { id: 'l4-3', title: 'Return Values', durationMinutes: 20, type: 'video', completed: false },
      { id: 'l4-4', title: 'Scope & Namespaces', durationMinutes: 25, type: 'reading', completed: false },
      { id: 'l4-5', title: 'Functions Quiz', durationMinutes: 15, type: 'quiz', completed: false },
    ],
  },
  {
    id: 'm5',
    order: 5,
    title: 'Mini Project: Number Guessing Game',
    description: 'Apply everything you have learned by building a complete interactive game from scratch.',
    estimatedHours: 3,
    status: 'locked',
    xpReward: 500,
    lessons: [
      { id: 'l5-1', title: 'Project Brief & Planning', durationMinutes: 20, type: 'reading', completed: false },
      { id: 'l5-2', title: 'Building the Game Logic', durationMinutes: 45, type: 'project', completed: false },
      { id: 'l5-3', title: 'Adding User Feedback', durationMinutes: 30, type: 'project', completed: false },
      { id: 'l5-4', title: 'Code Review & Improvements', durationMinutes: 25, type: 'reading', completed: false },
    ],
  },
];

// ─── Roadmap Factory ──────────────────────────────────────────────────────────

export function generateRoadmap(skill: string, level: string): Roadmap {
  const normalizedSkill = skill.toLowerCase().trim();

  // For Stage 1, we return the Python roadmap for Python-like inputs,
  // and a generic adapted version for anything else.
  const milestones =
    normalizedSkill.includes('python')
      ? PYTHON_BEGINNER_MILESTONES
      : adaptMilestonesForSkill(skill, PYTHON_BEGINNER_MILESTONES);

  return {
    id: `roadmap-${Date.now()}`,
    skill,
    level: level as Roadmap['level'],
    milestones,
    totalEstimatedHours: milestones.reduce((sum, m) => sum + m.estimatedHours, 0),
  };
}

function adaptMilestonesForSkill(skill: string, template: Milestone[]): Milestone[] {
  const labels = [
    `${skill} Fundamentals`,
    `Core Concepts & Syntax`,
    `Control Flow & Logic`,
    `Reusable Code Patterns`,
    `Mini Project`,
  ];
  return template.map((m, i) => ({
    ...m,
    title: labels[i] ?? m.title,
    description: `Master ${skill} by completing this milestone: ${labels[i] ?? m.title}.`,
  }));
}

// ─── Initial Stats ────────────────────────────────────────────────────────────

export const INITIAL_STATS: LearnerStats = {
  xp: 50,
  streakDays: 1,
  lessonsCompleted: 2,
  hoursLearned: 0.75,
  currentMilestoneIndex: 0,
};

// ─── Lesson Types Display ─────────────────────────────────────────────────────

export const LESSON_TYPE_LABELS: Record<string, string> = {
  reading: 'Reading',
  video: 'Video',
  quiz: 'Quiz',
  project: 'Project',
};

// ─── Feature Highlights for Landing Page ─────────────────────────────────────

export const FEATURES = [
  {
    id: 'roadmap',
    icon: 'Map',
    title: 'Personalized Roadmaps',
    description:
      'Answer a few questions and get a custom learning path built around your skill level and goals — not a generic course list.',
  },
  {
    id: 'lessons',
    icon: 'BookOpen',
    title: 'Guided Lessons',
    description:
      'Bite-sized lessons with clear explanations. Each one builds directly on the last so you always know why you\'re learning it.',
  },
  {
    id: 'feedback',
    icon: 'Zap',
    title: 'Adaptive Feedback',
    description:
      'Struggle with a concept? The platform spots it in your quiz results and adjusts your next steps automatically.',
  },
  {
    id: 'progress',
    icon: 'TrendingUp',
    title: 'Visible Progress',
    description:
      'Track XP, streaks, and milestone completions so momentum never stops. Every lesson is a win you can see.',
  },
];
