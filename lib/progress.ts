import { AppState, LearnerProfile, Roadmap, LearnerStats } from './types';
import { INITIAL_STATS } from './mock-data';

const STORAGE_KEY = 'skillpath_state';

// ─── Persistence ──────────────────────────────────────────────────────────────

export function saveState(state: Partial<AppState>): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadState();
    const merged: AppState = { ...existing, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage may be unavailable in some contexts
  }
}

export function loadState(): AppState {
  if (typeof window === 'undefined') {
    return { profile: null, roadmap: null, stats: INITIAL_STATS };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { profile: null, roadmap: null, stats: INITIAL_STATS };
    return JSON.parse(raw) as AppState;
  } catch {
    return { profile: null, roadmap: null, stats: INITIAL_STATS };
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
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
