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
}

// ─── Roadmap & Milestones ─────────────────────────────────────────────────────

export type MilestoneStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'reading' | 'video' | 'quiz' | 'project';
  completed: boolean;
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
}

export interface Roadmap {
  id: string;
  skill: string;
  level: SkillLevel;
  milestones: Milestone[];
  totalEstimatedHours: number;
}

// ─── Progress & Stats ─────────────────────────────────────────────────────────

export interface LearnerStats {
  xp: number;
  streakDays: number;
  lessonsCompleted: number;
  hoursLearned: number;
  currentMilestoneIndex: number;
}

export interface AppState {
  profile: LearnerProfile | null;
  roadmap: Roadmap | null;
  stats: LearnerStats;
}
