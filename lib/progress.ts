import {
  AppState,
  LearnerProfile,
  Roadmap,
  LearnerStats,
  Badge,
  DailyTask,
  ActivityDay,
  RecentActivity,
  AssessmentResult,
} from './types';
import {
  INITIAL_STATS,
  INITIAL_BADGES,
  INITIAL_DAILY_TASKS,
  INITIAL_WEEKLY_ACTIVITY,
  INITIAL_RECENT_ACTIVITY,
} from './mock-data';

const STORAGE_KEY = 'skillpath_state';

// ─── Core Persistence ─────────────────────────────────────────────────────────

export function saveState(state: Partial<AppState>): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadState();
    const merged: AppState = { ...existing, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (error) {
    console.error('Failed to save state to localStorage', error);
  }
}

export function loadState(): AppState {
  if (typeof window === 'undefined') {
    return {
      profile: null,
      roadmap: null,
      stats: INITIAL_STATS,
      badges: INITIAL_BADGES,
      dailyTasks: INITIAL_DAILY_TASKS,
      weeklyActivity: INITIAL_WEEKLY_ACTIVITY,
      recentActivity: INITIAL_RECENT_ACTIVITY,
      assessmentResult: null,
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        profile: null,
        roadmap: null,
        stats: INITIAL_STATS,
        badges: INITIAL_BADGES,
        dailyTasks: INITIAL_DAILY_TASKS,
        weeklyActivity: INITIAL_WEEKLY_ACTIVITY,
        recentActivity: INITIAL_RECENT_ACTIVITY,
        assessmentResult: null,
      };
    }
    const parsed = JSON.parse(raw) as AppState;
    return {
      profile: parsed.profile ?? null,
      roadmap: parsed.roadmap ?? null,
      stats: parsed.stats ?? INITIAL_STATS,
      badges: parsed.badges && parsed.badges.length > 0 ? parsed.badges : INITIAL_BADGES,
      dailyTasks: parsed.dailyTasks && parsed.dailyTasks.length > 0 ? parsed.dailyTasks : INITIAL_DAILY_TASKS,
      weeklyActivity: parsed.weeklyActivity && parsed.weeklyActivity.length > 0 ? parsed.weeklyActivity : INITIAL_WEEKLY_ACTIVITY,
      recentActivity: parsed.recentActivity && parsed.recentActivity.length > 0 ? parsed.recentActivity : INITIAL_RECENT_ACTIVITY,
      assessmentResult: parsed.assessmentResult ?? null,
    };
  } catch (error) {
    console.error('Failed to load state from localStorage', error);
    return {
      profile: null,
      roadmap: null,
      stats: INITIAL_STATS,
      badges: INITIAL_BADGES,
      dailyTasks: INITIAL_DAILY_TASKS,
      weeklyActivity: INITIAL_WEEKLY_ACTIVITY,
      recentActivity: INITIAL_RECENT_ACTIVITY,
      assessmentResult: null,
    };
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear state', error);
  }
}

// ─── Profile Helpers ──────────────────────────────────────────────────────────

export function saveProfile(profile: LearnerProfile): void {
  saveState({ profile });
}

export function loadProfile(): LearnerProfile | null {
  return loadState().profile;
}

// ─── Roadmap Helpers ──────────────────────────────────────────────────────────

export function saveRoadmap(roadmap: Roadmap): void {
  saveState({ roadmap });
}

export function loadRoadmap(): Roadmap | null {
  return loadState().roadmap;
}

// ─── Stats Helpers ────────────────────────────────────────────────────────────

export function loadStats(): LearnerStats {
  return loadState().stats ?? INITIAL_STATS;
}

export function saveStats(stats: LearnerStats): void {
  saveState({ stats });
}

// ─── Gamification & Feed Helpers ──────────────────────────────────────────────

export function loadBadges(): Badge[] {
  return loadState().badges ?? INITIAL_BADGES;
}

export function saveBadges(badges: Badge[]): void {
  saveState({ badges });
}

export function loadDailyTasks(): DailyTask[] {
  return loadState().dailyTasks ?? INITIAL_DAILY_TASKS;
}

export function saveDailyTasks(dailyTasks: DailyTask[]): void {
  saveState({ dailyTasks });
}

export function loadWeeklyActivity(): ActivityDay[] {
  return loadState().weeklyActivity ?? INITIAL_WEEKLY_ACTIVITY;
}

export function saveWeeklyActivity(weeklyActivity: ActivityDay[]): void {
  saveState({ weeklyActivity });
}

export function loadRecentActivity(): RecentActivity[] {
  return loadState().recentActivity ?? INITIAL_RECENT_ACTIVITY;
}

export function saveRecentActivity(recentActivity: RecentActivity[]): void {
  saveState({ recentActivity });
}

export function loadAssessmentResult(): AssessmentResult | null {
  return loadState().assessmentResult ?? null;
}

export function saveAssessmentResult(assessmentResult: AssessmentResult): void {
  saveState({ assessmentResult });
}

// ─── Progress Calculation ─────────────────────────────────────────────────────

export function overallProgress(roadmap: Roadmap): number {
  const total = roadmap.milestones.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  );
  const completed = roadmap.milestones.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.completed).length,
    0
  );
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function milestoneProgress(milestone: { lessons: { completed: boolean }[] }): number {
  const total = milestone.lessons.length;
  if (total === 0) return 0;
  const done = milestone.lessons.filter((l) => l.completed).length;
  return Math.round((done / total) * 100);
}

export function nextLesson(roadmap: Roadmap) {
  for (const milestone of roadmap.milestones) {
    if (milestone.status === 'in_progress' || milestone.status === 'available') {
      const lesson = milestone.lessons.find((l) => !l.completed);
      if (lesson) return { milestone, lesson };
    }
  }
  return null;
}

// ─── Complete Lesson & Update Progression Engine ──────────────────────────────

export interface CompleteLessonResult {
  updatedRoadmap: Roadmap;
  updatedStats: LearnerStats;
  xpEarned: number;
  newBadgesUnlocked: Badge[];
  isMilestoneCompleted: boolean;
  completedMilestoneTitle?: string;
}

export function completeLesson(lessonId: string, milestoneId?: string): CompleteLessonResult | null {
  const state = loadState();
  if (!state.roadmap) return null;

  let targetLessonTitle = '';
  let xpAwarded = 25;
  let targetMilestoneIndex = -1;
  let targetLessonIndex = -1;

  // Clone roadmap to avoid direct mutation
  const updatedRoadmap: Roadmap = JSON.parse(JSON.stringify(state.roadmap));

  // Find the lesson and milestone
  for (let mIdx = 0; mIdx < updatedRoadmap.milestones.length; mIdx++) {
    const milestone = updatedRoadmap.milestones[mIdx];
    const lIdx = milestone.lessons.findIndex((l) => l.id === lessonId);
    if (lIdx !== -1) {
      targetMilestoneIndex = mIdx;
      targetLessonIndex = lIdx;
      targetLessonTitle = milestone.lessons[lIdx].title;
      xpAwarded = milestone.lessons[lIdx].xpReward ?? 25;
      milestone.lessons[lIdx].completed = true;
      break;
    }
  }

  if (targetMilestoneIndex === -1 || targetLessonIndex === -1) {
    return null;
  }

  const currentMilestone = updatedRoadmap.milestones[targetMilestoneIndex];
  const allLessonsDoneInMilestone = currentMilestone.lessons.every((l) => l.completed);

  let isMilestoneCompleted = false;
  let completedMilestoneTitle: string | undefined = undefined;

  if (allLessonsDoneInMilestone) {
    currentMilestone.status = 'completed';
    isMilestoneCompleted = true;
    completedMilestoneTitle = currentMilestone.title;

    // Unlock subsequent milestone if available
    const nextMilestone = updatedRoadmap.milestones[targetMilestoneIndex + 1];
    if (nextMilestone && nextMilestone.status === 'locked') {
      nextMilestone.status = 'in_progress';
    }
  } else {
    currentMilestone.status = 'in_progress';
  }

  // Update learner stats
  const currentStats = state.stats ?? INITIAL_STATS;
  const newXp = currentStats.xp + xpAwarded;
  const updatedStats: LearnerStats = {
    ...currentStats,
    xp: newXp,
    lessonsCompleted: currentStats.lessonsCompleted + 1,
    hoursLearned: Number((currentStats.hoursLearned + 0.3).toFixed(1)),
  };

  // Check and unlock badges
  const currentBadges = state.badges ?? INITIAL_BADGES;
  const newBadgesUnlocked: Badge[] = [];
  const updatedBadges = currentBadges.map((badge) => {
    if (badge.unlocked) return badge;

    // Check unlock conditions
    let shouldUnlock = false;
    if (badge.id === 'b3' && newXp >= 100) {
      shouldUnlock = true;
    } else if (badge.id === 'b6' && targetMilestoneIndex === 0 && allLessonsDoneInMilestone) {
      shouldUnlock = true;
    }

    if (shouldUnlock) {
      const unlockedBadge = {
        ...badge,
        unlocked: true,
        unlockedAt: 'Just now',
      };
      newBadgesUnlocked.push(unlockedBadge);
      return unlockedBadge;
    }
    return badge;
  });

  // Update daily tasks
  const currentDailyTasks = state.dailyTasks ?? INITIAL_DAILY_TASKS;
  const updatedDailyTasks = currentDailyTasks.map((task) => {
    if (task.id === 't1' || task.title.toLowerCase().includes(targetLessonTitle.toLowerCase())) {
      return { ...task, completed: true };
    }
    if (task.id === 't3' && newXp >= 100) {
      return { ...task, completed: true };
    }
    return task;
  });

  // Update weekly activity for today
  const currentWeeklyActivity = state.weeklyActivity ?? INITIAL_WEEKLY_ACTIVITY;
  const updatedWeeklyActivity = currentWeeklyActivity.map((day) => {
    if (day.isToday) {
      return {
        ...day,
        minutes: day.minutes + 15,
        completed: true,
      };
    }
    return day;
  });

  // Prepend recent activity
  const currentRecent = state.recentActivity ?? INITIAL_RECENT_ACTIVITY;
  const newActivityItem: RecentActivity = {
    id: `act-${Date.now()}`,
    type: 'lesson_completed',
    title: `Completed: ${targetLessonTitle}`,
    description: `Finished lesson and earned +${xpAwarded} XP!`,
    timestamp: 'Just now',
    xpEarned: xpAwarded,
  };

  const extraActivities: RecentActivity[] = newBadgesUnlocked.map((b) => ({
    id: `badge-${Date.now()}-${b.id}`,
    type: 'badge_unlocked',
    title: `Badge Unlocked: ${b.title}`,
    description: b.description,
    timestamp: 'Just now',
    xpEarned: 25,
  }));

  const updatedRecentActivity = [newActivityItem, ...extraActivities, ...currentRecent].slice(0, 10);

  // Save full state
  saveState({
    roadmap: updatedRoadmap,
    stats: updatedStats,
    badges: updatedBadges,
    dailyTasks: updatedDailyTasks,
    weeklyActivity: updatedWeeklyActivity,
    recentActivity: updatedRecentActivity,
  });

  return {
    updatedRoadmap,
    updatedStats,
    xpEarned: xpAwarded,
    newBadgesUnlocked,
    isMilestoneCompleted,
    completedMilestoneTitle,
  };
}
