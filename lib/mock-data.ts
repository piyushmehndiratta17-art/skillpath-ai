import {
  Roadmap,
  Milestone,
  LearnerStats,
  Badge,
  DailyTask,
  ActivityDay,
  RecentActivity,
  DiagnosticQuestion,
  DetailedLessonContent,
} from './types';

// ─── Python Beginner Roadmap ──────────────────────────────────────────────────

export const PYTHON_BEGINNER_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    order: 1,
    title: 'Python Fundamentals',
    description: 'Set up Python, write your first program, and understand how the interpreter works.',
    estimatedHours: 3,
    status: 'in_progress',
    xpReward: 100,
    prerequisites: ['None (Beginner Friendly)'],
    lessons: [
      {
        id: 'l1-1',
        title: 'Installing Python & VS Code',
        durationMinutes: 20,
        type: 'reading',
        completed: true,
        xpReward: 25,
        description: 'Get your development environment ready with modern tooling.',
      },
      {
        id: 'l1-2',
        title: 'Your First Python Program',
        durationMinutes: 25,
        type: 'reading',
        completed: true,
        xpReward: 25,
        description: 'Learn the print function, syntax basics, and how code runs.',
      },
      {
        id: 'l1-3',
        title: 'How the Python Interpreter Works',
        durationMinutes: 15,
        type: 'video',
        completed: false,
        xpReward: 25,
        description: 'Understand bytecode, the REPL, and step-by-step execution.',
      },
      {
        id: 'l1-4',
        title: 'Fundamentals Quiz',
        durationMinutes: 10,
        type: 'quiz',
        completed: false,
        xpReward: 50,
        description: 'Test your understanding of Python basics and runtime flow.',
      },
    ],
  },
  {
    id: 'm2',
    order: 2,
    title: 'Variables & Data Types',
    description: 'Learn strings, integers, floats, booleans, and how Python stores information in memory.',
    estimatedHours: 4,
    status: 'available',
    xpReward: 150,
    prerequisites: ['Python Fundamentals'],
    lessons: [
      {
        id: 'l2-1',
        title: 'What Are Variables?',
        durationMinutes: 20,
        type: 'reading',
        completed: false,
        xpReward: 25,
        description: 'Naming conventions, dynamic typing, and memory assignment.',
      },
      {
        id: 'l2-2',
        title: 'Numbers and Strings',
        durationMinutes: 30,
        type: 'reading',
        completed: false,
        xpReward: 25,
        description: 'Arithmetic operations, string formatting, and common string methods.',
      },
      {
        id: 'l2-3',
        title: 'Lists and Tuples',
        durationMinutes: 30,
        type: 'video',
        completed: false,
        xpReward: 30,
        description: 'Ordered sequences, indexing, slicing, and mutable vs immutable data.',
      },
      {
        id: 'l2-4',
        title: 'Dictionaries & Sets',
        durationMinutes: 25,
        type: 'reading',
        completed: false,
        xpReward: 30,
        description: 'Key-value pairs, hash lookups, and unique collections.',
      },
      {
        id: 'l2-5',
        title: 'Data Types Quiz',
        durationMinutes: 15,
        type: 'quiz',
        completed: false,
        xpReward: 50,
        description: 'Hands-on check for collections, casting, and data structure selection.',
      },
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
    prerequisites: ['Variables & Data Types'],
    lessons: [
      {
        id: 'l3-1',
        title: 'If, Elif, Else Statements',
        durationMinutes: 25,
        type: 'reading',
        completed: false,
        xpReward: 25,
      },
      {
        id: 'l3-2',
        title: 'Comparison & Logical Operators',
        durationMinutes: 20,
        type: 'reading',
        completed: false,
        xpReward: 25,
      },
      {
        id: 'l3-3',
        title: 'For Loops & Range',
        durationMinutes: 30,
        type: 'video',
        completed: false,
        xpReward: 30,
      },
      {
        id: 'l3-4',
        title: 'While Loops & Break/Continue',
        durationMinutes: 25,
        type: 'reading',
        completed: false,
        xpReward: 30,
      },
      {
        id: 'l3-5',
        title: 'Loops & Conditions Quiz',
        durationMinutes: 20,
        type: 'quiz',
        completed: false,
        xpReward: 50,
      },
    ],
  },
  {
    id: 'm4',
    order: 4,
    title: 'Functions & Modular Code',
    description: 'Write clean, reusable blocks of code with parameters, return statements, and docstrings.',
    estimatedHours: 4,
    status: 'locked',
    xpReward: 200,
    prerequisites: ['Conditions & Loops'],
    lessons: [
      {
        id: 'l4-1',
        title: 'Defining & Calling Functions',
        durationMinutes: 30,
        type: 'reading',
        completed: false,
        xpReward: 30,
      },
      {
        id: 'l4-2',
        title: 'Parameters, Default Values & *args',
        durationMinutes: 25,
        type: 'reading',
        completed: false,
        xpReward: 30,
      },
      {
        id: 'l4-3',
        title: 'Return Values & Pure Functions',
        durationMinutes: 20,
        type: 'video',
        completed: false,
        xpReward: 25,
      },
      {
        id: 'l4-4',
        title: 'Variable Scope & Namespaces',
        durationMinutes: 25,
        type: 'reading',
        completed: false,
        xpReward: 25,
      },
      {
        id: 'l4-5',
        title: 'Functions Mastery Quiz',
        durationMinutes: 15,
        type: 'quiz',
        completed: false,
        xpReward: 50,
      },
    ],
  },
  {
    id: 'm5',
    order: 5,
    title: 'Capstone Mini Project: Interactive Game',
    description: 'Synthesize everything you have learned by architecting and testing a complete command-line game.',
    estimatedHours: 4,
    status: 'locked',
    xpReward: 500,
    prerequisites: ['Functions & Modular Code'],
    lessons: [
      {
        id: 'l5-1',
        title: 'Project Brief & Architecture',
        durationMinutes: 20,
        type: 'reading',
        completed: false,
        xpReward: 50,
      },
      {
        id: 'l5-2',
        title: 'Building Core Game Loops',
        durationMinutes: 45,
        type: 'project',
        completed: false,
        xpReward: 150,
      },
      {
        id: 'l5-3',
        title: 'Error Handling & User Feedback',
        durationMinutes: 35,
        type: 'project',
        completed: false,
        xpReward: 150,
      },
      {
        id: 'l5-4',
        title: 'Final Code Review & Presentation',
        durationMinutes: 30,
        type: 'project',
        completed: false,
        xpReward: 150,
      },
    ],
  },
];

// ─── Roadmap Factory ──────────────────────────────────────────────────────────

export function generateRoadmap(skill: string, level: string): Roadmap {
  const normalizedSkill = skill.toLowerCase().trim();

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
    generatedAt: new Date().toISOString(),
  };
}

function adaptMilestonesForSkill(skill: string, template: Milestone[]): Milestone[] {
  const labels = [
    `${skill} Fundamentals & Environment`,
    `Core Syntax & Data Structures`,
    `Logic, Control Flow & Operations`,
    `Functions, Modules & Clean Architecture`,
    `${skill} Real-World Capstone Project`,
  ];
  return template.map((m, i) => ({
    ...m,
    title: labels[i] ?? m.title,
    description: `Master ${skill} by completing: ${labels[i] ?? m.title}.`,
    prerequisites: i === 0 ? ['None (Beginner Friendly)'] : [labels[i - 1]],
    lessons: m.lessons.map((l) => ({
      ...l,
      title: l.title.replace('Python', skill),
    })),
  }));
}

// ─── Initial Stats & Gamification Data ────────────────────────────────────────

export const INITIAL_STATS: LearnerStats = {
  xp: 75,
  streakDays: 3,
  lessonsCompleted: 2,
  hoursLearned: 1.2,
  currentMilestoneIndex: 0,
};

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b1',
    title: 'First Code Run',
    description: 'Completed your very first coding lesson and ran sample code.',
    icon: 'Sparkles',
    unlocked: true,
    unlockedAt: '2 days ago',
    category: 'special',
  },
  {
    id: 'b2',
    title: 'Consistency Star',
    description: 'Maintained a 3-day active learning streak without missing a day.',
    icon: 'Flame',
    unlocked: true,
    unlockedAt: 'Today',
    category: 'streak',
  },
  {
    id: 'b3',
    title: 'XP Explorer',
    description: 'Earned 100+ Total XP through lessons and quizzes.',
    icon: 'Zap',
    unlocked: false,
    category: 'xp',
  },
  {
    id: 'b4',
    title: 'Syntax Master',
    description: 'Completed all core syntax practice exercises with zero retries.',
    icon: 'Code',
    unlocked: false,
    category: 'milestone',
  },
  {
    id: 'b5',
    title: 'Quiz Ace',
    description: 'Achieved 100% score on a module diagnostic challenge.',
    icon: 'Award',
    unlocked: false,
    category: 'quiz',
  },
  {
    id: 'b6',
    title: 'Milestone 1 Graduate',
    description: 'Successfully finished all lessons in Python Fundamentals.',
    icon: 'GraduationCap',
    unlocked: false,
    category: 'milestone',
  },
];

export const INITIAL_DAILY_TASKS: DailyTask[] = [
  {
    id: 't1',
    title: 'Complete "How the Python Interpreter Works"',
    xp: 25,
    completed: false,
    icon: 'BookOpen',
  },
  {
    id: 't2',
    title: 'Solve 1 interactive practice question',
    xp: 15,
    completed: false,
    icon: 'CheckCircle2',
  },
  {
    id: 't3',
    title: 'Hit 100 Total XP milestone today',
    xp: 30,
    completed: false,
    icon: 'Zap',
  },
];

export const INITIAL_WEEKLY_ACTIVITY: ActivityDay[] = [
  { day: 'Mon', date: 'Oct 19', minutes: 30, completed: true },
  { day: 'Tue', date: 'Oct 20', minutes: 25, completed: true },
  { day: 'Wed', date: 'Oct 21', minutes: 45, completed: true },
  { day: 'Thu', date: 'Oct 22', minutes: 35, completed: true },
  { day: 'Fri', date: 'Oct 23', minutes: 20, completed: true, isToday: true },
  { day: 'Sat', date: 'Oct 24', minutes: 0, completed: false },
  { day: 'Sun', date: 'Oct 25', minutes: 0, completed: false },
];

export const INITIAL_RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: 'a1',
    type: 'badge_unlocked',
    title: 'Badge Unlocked: Consistency Star',
    description: 'Hit a 3-day active study streak!',
    timestamp: '2 hours ago',
    xpEarned: 20,
  },
  {
    id: 'a2',
    type: 'lesson_completed',
    title: 'Completed: Your First Python Program',
    description: 'Finished lesson reading and ran the greeting script.',
    timestamp: 'Yesterday',
    xpEarned: 25,
  },
  {
    id: 'a3',
    type: 'lesson_completed',
    title: 'Completed: Installing Python & VS Code',
    description: 'Configured local environment and verified interpreter installation.',
    timestamp: '2 days ago',
    xpEarned: 25,
  },
];

// ─── Diagnostic Assessment Mock Data ──────────────────────────────────────────

export const DIAGNOSTIC_QUESTIONS: Record<string, DiagnosticQuestion[]> = {
  python: [
    {
      id: 'pq-1',
      question: 'What is the output of the following Python expression?',
      codeSnippet: `x = 10\ny = "5"\nprint(x * 2)`,
      options: ['20', '"1010"', 'TypeError', '15'],
      correctOptionIndex: 0,
      topic: 'Variables & Arithmetic',
      explanation: 'x is an integer (10). x * 2 performs integer multiplication resulting in 20. The variable y is never used here.',
    },
    {
      id: 'pq-2',
      question: 'Which data type is mutable in Python?',
      codeSnippet: `# Which of these can be modified in-place?`,
      options: ['Tuple', 'String', 'List', 'Integer'],
      correctOptionIndex: 2,
      topic: 'Data Types & Mutability',
      explanation: 'Lists are mutable; you can append, pop, or change elements in-place. Strings and tuples are immutable.',
    },
    {
      id: 'pq-3',
      question: 'What does this loop print out?',
      codeSnippet: `total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)`,
      options: ['10', '6', '3', '7'],
      correctOptionIndex: 1,
      topic: 'Loops & Control Flow',
      explanation: 'range(1, 4) produces numbers 1, 2, and 3. The sum is 1 + 2 + 3 = 6.',
    },
    {
      id: 'pq-4',
      question: 'What does a function return if no return statement is specified?',
      codeSnippet: `def greet(name):\n    print(f"Hello, {name}")\n\nresult = greet("Dev")`,
      options: ['0', '"" (empty string)', 'None', 'False'],
      correctOptionIndex: 2,
      topic: 'Functions & Return Values',
      explanation: 'In Python, all functions without an explicit return statement return None by default.',
    },
  ],
  javascript: [
    {
      id: 'js-1',
      question: 'What does typeof null evaluate to in JavaScript?',
      codeSnippet: `console.log(typeof null);`,
      options: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correctOptionIndex: 2,
      topic: 'Type Coercion & Primitives',
      explanation: 'In JavaScript, typeof null returns "object" due to a legacy bug preserved for web compatibility.',
    },
    {
      id: 'js-2',
      question: 'What is the difference between let and const?',
      codeSnippet: `let a = 1;\nconst b = 2;\na = 3;\n// b = 4;`,
      options: [
        'let is block-scoped, const is function-scoped',
        'let can be reassigned, const cannot be reassigned',
        'const cannot hold objects or arrays',
        'There is no difference in ES6',
      ],
      correctOptionIndex: 1,
      topic: 'Variables & Scope',
      explanation: 'Variables declared with let can be reassigned, whereas identifiers declared with const cannot be reassigned.',
    },
    {
      id: 'js-3',
      question: 'What will the following snippet log?',
      codeSnippet: `const nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled);`,
      options: ['[1, 2, 3]', '[2, 4, 6]', 'undefined', '6'],
      correctOptionIndex: 1,
      topic: 'Higher-Order Array Methods',
      explanation: '.map() transforms each element using the callback and returns a new array with [2, 4, 6].',
    },
  ],
  general: [
    {
      id: 'gen-1',
      question: 'What is an algorithm in computer science?',
      codeSnippet: `// Step 1: Input -> Step 2: Logic -> Step 3: Output`,
      options: [
        'A physical hardware component',
        'A step-by-step procedure or set of rules to solve a problem',
        'A programming language compiler',
        'A software license agreement',
      ],
      correctOptionIndex: 1,
      topic: 'Computational Thinking',
      explanation: 'An algorithm is a well-defined sequence of instructions designed to perform a specific task or solve a computational problem.',
    },
    {
      id: 'gen-2',
      question: 'What does DRY stand for in software engineering?',
      options: [
        'Don\'t Repeat Yourself',
        'Data Retrieval Yield',
        'Dynamic Routing Yield',
        'Digital Rights Yearly',
      ],
      correctOptionIndex: 0,
      topic: 'Software Best Practices',
      explanation: 'DRY means Don\'t Repeat Yourself, advocating that every piece of knowledge must have a single, unambiguous representation.',
    },
  ],
};

// ─── Detailed Lesson Content Repository ───────────────────────────────────────

export const DETAILED_LESSONS: Record<string, DetailedLessonContent> = {
  'l1-3': {
    id: 'l1-3',
    title: 'How the Python Interpreter Works',
    milestoneId: 'm1',
    milestoneTitle: 'Python Fundamentals',
    order: 3,
    durationMinutes: 15,
    xpReward: 25,
    type: 'video',
    objective: 'Understand how Python code is translated to bytecode, executed by the PVM, and how the interactive REPL works.',
    sections: [
      {
        id: 's1',
        type: 'concept',
        title: 'Compilation vs. Interpretation in Python',
        body: `Python is often called an interpreted language, but behind the scenes it uses a two-phase process:
1. **Compilation to Bytecode**: When you execute a script, Python first compiles source text (.py) into an intermediate, optimized format called **bytecode** (.pyc).
2. **Execution via PVM**: The Python Virtual Machine (PVM) is the runtime engine that interprets and executes this bytecode instruction by instruction.

This architecture offers the developer agility of interpreted languages with fast runtime parsing!`,
      },
      {
        id: 's2',
        type: 'code',
        title: 'Inspecting Python Bytecode Directly',
        body: `# You can inspect Python's bytecode using the built-in 'dis' module!
import dis

def calculate_square(number):
    return number * number

# View internal PVM instructions
dis.dis(calculate_square)`,
        code: `LOAD_FAST                0 (number)
LOAD_FAST                0 (number)
BINARY_MULTIPLY
RETURN_VALUE`,
        language: 'python',
      },
      {
        id: 's3',
        type: 'tip',
        title: 'Pro Tip: The Power of the Interactive REPL',
        body: `The Read-Eval-Print Loop (REPL) allows you to prototype functions, test regular expressions, and inspect object methods interactively.

Type \`python\` in your terminal to start. Press \`Ctrl+D\` (or type \`exit()\`) to quit.`,
      },
    ],
    keyTakeaways: [
      'Python compiles code into bytecode before executing it in the Python Virtual Machine (PVM)',
      'Syntax errors occur during the parsing stage before runtime execution begins',
      'The REPL provides instant feedback for rapid prototyping and debugging',
      'Execution happens top-to-bottom, stopping immediately if an unhandled exception occurs',
    ],
    practiceQuestions: [
      {
        id: 'pq-l1-3-1',
        prompt: 'What intermediate format does Python compile source code into before running on the PVM?',
        options: ['Machine Code (.exe)', 'Bytecode (.pyc)', 'Assembly Language', 'JSON AST'],
        correctIndex: 1,
        explanation: 'Python compiles your human-readable .py code into bytecode (.pyc) which is then executed by the Python Virtual Machine.',
        hint: 'It begins with "byte" and is stored in .pyc cached files.',
      },
      {
        id: 'pq-l1-3-2',
        prompt: 'What happens if there is a syntax error on line 10 of a 20-line Python file?',
        options: [
          'Lines 1 to 9 execute, then it halts',
          'Python fails to compile the file and runs zero lines',
          'It skips line 10 and executes the rest',
          'It replaces line 10 with a warning',
        ],
        correctIndex: 1,
        explanation: 'Syntax errors are caught during the initial compilation/parsing phase before any bytecode execution occurs.',
        hint: 'Syntax checking occurs before execution starts.',
      },
    ],
  },

  'l1-4': {
    id: 'l1-4',
    title: 'Fundamentals Quiz & Diagnostic Check',
    milestoneId: 'm1',
    milestoneTitle: 'Python Fundamentals',
    order: 4,
    durationMinutes: 10,
    xpReward: 50,
    type: 'quiz',
    objective: 'Demonstrate mastery of environment setup, printing, basic variables, and Python runtime mechanics.',
    sections: [
      {
        id: 's1',
        type: 'concept',
        title: 'Milestone 1 Checkpoint',
        body: `Congratulations on reaching the Milestone 1 Checkpoint! This quiz tests your practical understanding of fundamental Python principles before moving into variables and memory management.

Take your time and analyze each code block carefully.`,
      },
      {
        id: 's2',
        type: 'code',
        title: 'Sample Evaluation Snippet',
        body: `user = "Alex"
score = 95
print(f"Learner {user} scored {score}%")`,
        code: `Learner Alex scored 95%`,
        language: 'python',
      },
    ],
    keyTakeaways: [
      'f-strings provide the most readable string interpolation syntax in modern Python (3.6+)',
      'Comments start with # and are ignored by the compiler',
      'Python variables do not need explicit type declarations',
    ],
    practiceQuestions: [
      {
        id: 'pq-l1-4-1',
        prompt: 'Which of the following is the modern, recommended way to format strings in Python?',
        options: [
          '"Hello " + name',
          'f"Hello {name}"',
          '"Hello %s" % name',
          '"Hello {}".format(name)',
        ],
        correctIndex: 1,
        explanation: 'f-strings (f"Hello {name}") are faster, cleaner, and standard in modern Python.',
        hint: 'It starts with the letter "f" before the opening quotation.',
      },
      {
        id: 'pq-l1-4-2',
        prompt: 'Which operator is used for exponentiation (raising to a power) in Python?',
        options: ['^', '**', '^^', 'pow() only'],
        correctIndex: 1,
        explanation: 'In Python, ** is the exponentiation operator (e.g. 2 ** 3 = 8). Note that ^ is bitwise XOR!',
        hint: 'It is two asterisks.',
      },
    ],
  },

  'l2-1': {
    id: 'l2-1',
    title: 'What Are Variables & Memory References?',
    milestoneId: 'm2',
    milestoneTitle: 'Variables & Data Types',
    order: 1,
    durationMinutes: 20,
    xpReward: 25,
    type: 'reading',
    objective: 'Master variable naming rules, assignment, dynamic typing, and Python memory reference behavior.',
    sections: [
      {
        id: 's1',
        type: 'concept',
        title: 'Variables are Name Tags, Not Boxes',
        body: `In languages like C or Java, a variable is like a box with a fixed type: you put an int into an int box.
In Python, **variables are labels (references) pointing to objects in memory**.

When you write \`x = 42\`, Python creates an integer object 42 in memory and attaches the label \`x\` to it.`,
      },
      {
        id: 's2',
        type: 'code',
        title: 'Variable References in Action',
        body: `# Both a and b point to the SAME object in memory
a = [1, 2, 3]
b = a
b.append(4)

print("a:", a)  # a is [1, 2, 3, 4]
print("b:", b)  # b is [1, 2, 3, 4]
print("Are they identical?", a is b)  # True`,
        code: `a: [1, 2, 3, 4]
b: [1, 2, 3, 4]
Are they identical? True`,
        language: 'python',
      },
      {
        id: 's3',
        type: 'warning',
        title: 'Naming Rules to Remember',
        body: `• Must start with a letter or underscore (e.g. \`user_name\`, \`_count\`)
• Cannot start with a number (e.g. \`1st_place\` is invalid)
• Case-sensitive: \`Age\` and \`age\` are completely different variables
• Use \`snake_case\` for variable names as per PEP 8 standards`,
      },
    ],
    keyTakeaways: [
      'Variables in Python are references pointing to memory addresses',
      'Python is dynamically typed: variables can be rebound to different types at runtime',
      'Follow PEP 8: use snake_case for variable and function names',
      'Use the id() function or the `is` keyword to check object identity',
    ],
    practiceQuestions: [
      {
        id: 'pq-l2-1-1',
        prompt: 'Which of the following is an invalid Python variable name?',
        options: ['user_score', '_private_var', '2nd_player', 'totalAmount'],
        correctIndex: 2,
        explanation: 'Variable names cannot begin with a numeric digit in Python.',
        hint: 'Look for the one starting with a number.',
      },
      {
        id: 'pq-l2-1-2',
        prompt: 'If x = 5 and then x = "apple", what does Python do?',
        options: [
          'Throws a TypeError because x is already an integer',
          'Reassigns the label x to a new string object "apple"',
          'Converts "apple" into an integer',
          'Crashes the interpreter',
        ],
        correctIndex: 1,
        explanation: 'Python is dynamically typed; variable names can be rebound to objects of different types freely.',
        hint: 'Python allows dynamic reassignment.',
      },
    ],
  },
};

// ─── Helper to generate fallback lesson content dynamically ──────────────────

export function getLessonContent(lessonId: string, roadmap?: Roadmap | null): DetailedLessonContent {
  if (DETAILED_LESSONS[lessonId]) {
    return DETAILED_LESSONS[lessonId];
  }

  // Find lesson from roadmap if provided
  let foundLesson = null;
  let foundMilestone = null;

  if (roadmap) {
    for (const m of roadmap.milestones) {
      const l = m.lessons.find((item) => item.id === lessonId);
      if (l) {
        foundLesson = l;
        foundMilestone = m;
        break;
      }
    }
  }

  const title = foundLesson?.title ?? `Lesson: ${lessonId}`;
  const milestoneTitle = foundMilestone?.title ?? 'Core Curriculum';
  const milestoneId = foundMilestone?.id ?? 'm1';
  const durationMinutes = foundLesson?.durationMinutes ?? 20;
  const xpReward = foundLesson?.xpReward ?? 25;
  const type = foundLesson?.type ?? 'reading';

  return {
    id: lessonId,
    title,
    milestoneId,
    milestoneTitle,
    order: 1,
    durationMinutes,
    xpReward,
    type,
    objective: `Master the key concepts and practical patterns behind ${title}.`,
    sections: [
      {
        id: 's1',
        type: 'concept',
        title: `Understanding ${title}`,
        body: `${title} is an essential building block in mastering ${roadmap?.skill ?? 'this subject'}.
In this section, we break down how it works, why industry practitioners rely on it, and how to apply it cleanly in your own projects.`,
      },
      {
        id: 's2',
        type: 'code',
        title: 'Interactive Code Example',
        body: `# Practical demonstration of ${title}
def demonstrate_feature():
    items = ["Analyze", "Implement", "Test"]
    for step, item in enumerate(items, 1):
        print(f"Step {step}: {item}")

demonstrate_feature()`,
        code: `Step 1: Analyze\nStep 2: Implement\nStep 3: Test`,
        language: 'python',
      },
      {
        id: 's3',
        type: 'tip',
        title: 'Best Practice Guidance',
        body: `Always test your assumptions with small, isolated test cases before integrating them into larger codebases. Keep functions focused on doing one thing well.`,
      },
    ],
    keyTakeaways: [
      `Key concepts of ${title} learned and reinforced`,
      'Best practice conventions applied according to modern standards',
      'Ready to apply these concepts in real-world scenarios and capstone projects',
    ],
    practiceQuestions: [
      {
        id: `pq-${lessonId}-1`,
        prompt: `What is the primary benefit of mastering ${title}?`,
        options: [
          'Writing cleaner, more maintainable code',
          'Eliminating the need for software testing',
          'Increasing file sizes',
          'None of the above',
        ],
        correctIndex: 0,
        explanation: `Mastering ${title} enables you to write robust, maintainable, and idiomatic code.`,
        hint: 'Think about readability, maintainability, and clean code.',
      },
    ],
  };
}

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
      'Bite-sized lessons with clear explanations, code snippets, and practice quizzes. Each builds directly on the last so you always know why you\'re learning it.',
  },
  {
    id: 'feedback',
    icon: 'Zap',
    title: 'Adaptive Feedback & Assessment',
    description:
      'Struggle with a concept? The platform spots knowledge gaps in your diagnostic quiz results and adjusts your next milestones automatically.',
  },
  {
    id: 'progress',
    icon: 'TrendingUp',
    title: 'Visible Progress & Gamification',
    description:
      'Track XP, streaks, daily targets, and milestone badges so momentum never stops. Every lesson completed is a tangible achievement.',
  },
];
