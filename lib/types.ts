// ─── Onboarding & Learner Profile ────────────────────────────────────────────

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface OnboardingFormData {
  skill: string;
  level: SkillLevel;
  goal: string;
  dailyMinutes: number;
}

export interface LearnerProfile extends OnboardingFormData {
  createdAt: string;
  name?: string;
  avatarUrl?: string;
  targetRole?: string;
}

// ─── Roadmap & Milestones ─────────────────────────────────────────────────────

export type MilestoneStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface LessonPracticeQuestion {
  id: string;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
}

export interface LessonSection {
  id: string;
  type: 'concept' | 'code' | 'tip' | 'warning';
  title: string;
  body: string;
  code?: string;
  language?: string;
}

export interface DetailedLessonContent {
  id: string;
  title: string;
  milestoneId: string;
  milestoneTitle: string;
  order: number;
  durationMinutes: number;
  xpReward: number;
  type: 'reading' | 'video' | 'quiz' | 'project';
  objective: string;
  sections: LessonSection[];
  keyTakeaways: string[];
  practiceQuestions: LessonPracticeQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'reading' | 'video' | 'quiz' | 'project';
  completed: boolean;
  xpReward?: number;
  prerequisites?: string[];
  description?: string;
}

export interface Milestone {
  id: string;
  order: number;
  title: string;
  description: string;
  estimatedHours: number;
  status: MilestoneStatus;
  lessons: Lesson[];
  xpReward: number;
  prerequisites?: string[];
}

export interface Roadmap {
  id: string;
  skill: string;
  level: SkillLevel;
  milestones: Milestone[];
  totalEstimatedHours: number;
  generatedAt?: string;
}

// ─── Progress & Stats ─────────────────────────────────────────────────────────

export interface LearnerStats {
  xp: number;
  streakDays: number;
  lessonsCompleted: number;
  hoursLearned: number;
  currentMilestoneIndex: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'xp' | 'milestone' | 'quiz' | 'special';
}

export interface DailyTask {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  icon: string;
}

export interface ActivityDay {
  day: string;
  date: string;
  minutes: number;
  completed: boolean;
  isToday?: boolean;
}

export interface RecentActivity {
  id: string;
  type: 'lesson_completed' | 'badge_unlocked' | 'streak_milestone' | 'assessment_completed';
  title: string;
  description: string;
  timestamp: string;
  xpEarned?: number;
}

// ─── Diagnostic Assessment (Integration with Member 2) ────────────────────────

export interface DiagnosticQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  topic: string;
}

export interface DiagnosticQuiz {
  skill: string;
  level: SkillLevel;
  questions: DiagnosticQuestion[];
}

export interface WeakTopic {
  topic: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AssessmentResult {
  id: string;
  skill: string;
  goal: string;
  dailyMinutes: number;
  selfReportedLevel: SkillLevel;
  scorePercent: number;
  evaluatedLevel: SkillLevel;
  strengths: string[];
  weakTopics: WeakTopic[];
  recommendedStartingMilestoneId: string;
  completedAt: string;
}

// ─── Complete App State (localStorage) ────────────────────────────────────────

export interface AppState {
  profile: LearnerProfile | null;
  roadmap: Roadmap | null;
  stats: LearnerStats;
  badges?: Badge[];
  dailyTasks?: DailyTask[];
  weeklyActivity?: ActivityDay[];
  recentActivity?: RecentActivity[];
  assessmentResult?: AssessmentResult | null;
}
