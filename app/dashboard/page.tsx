'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Flame,
  Zap,
  CheckCircle,
  ArrowRight,
  Map,
  RotateCcw,
  Clock,
  Target,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
} from 'lucide-react';
import {
  LearnerProfile,
  Roadmap,
  LearnerStats,
  Badge,
  DailyTask,
  ActivityDay,
  RecentActivity,
} from '@/lib/types';
import {
  loadProfile,
  loadRoadmap,
  loadStats,
  loadBadges,
  loadDailyTasks,
  loadWeeklyActivity,
  loadRecentActivity,
  overallProgress,
  nextLesson,
  saveState,
} from '@/lib/progress';
import StatCard from '@/components/StatCard';
import ProgressBar from '@/components/ProgressBar';
import RoadmapView from '@/components/roadmap/RoadmapView';
import LearnerProfileCard from '@/components/dashboard/LearnerProfileCard';
import DailyTasksWidget from '@/components/dashboard/DailyTasksWidget';
import WeeklyActivityWidget from '@/components/dashboard/WeeklyActivityWidget';
import BadgesWidget from '@/components/dashboard/BadgesWidget';
import RecentActivityWidget from '@/components/dashboard/RecentActivityWidget';

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-36 w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-72 w-full" />
    </div>
  );
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [stats, setStats] = useState<LearnerStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<ActivityDay[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'badges'>('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const p = loadProfile();
    const r = loadRoadmap();
    const s = loadStats();
    if (!p || !r) {
      router.replace('/onboarding');
      return;
    }
    setProfile(p);
    setRoadmap(r);
    setStats(s);
    setBadges(loadBadges());
    setDailyTasks(loadDailyTasks());
    setWeeklyActivity(loadWeeklyActivity());
    setRecentActivity(loadRecentActivity());
  }, [router]);

  const handleTaskCompleted = (taskId: string, xpEarned: number) => {
    if (!stats) return;
    const updatedStats = { ...stats, xp: stats.xp + xpEarned };
    setStats(updatedStats);
    saveState({ stats: updatedStats });
  };

  if (!mounted || !profile || !roadmap || !stats) {
    return (
      <div className="min-h-screen bg-cream">
        <DashboardHeader />
        <main className="max-w-5xl mx-auto px-6 py-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  const progress = overallProgress(roadmap);
  const levelLabel = profile.level.charAt(0).toUpperCase() + profile.level.slice(1);
  const estimateWeeks = Math.ceil(
    (roadmap.totalEstimatedHours * 60) / (profile.dailyMinutes * 5)
  );
  const next = nextLesson(roadmap);

  return (
    <div className="min-h-screen bg-cream">
      <DashboardHeader
        profile={profile}
        onReset={() => router.push('/onboarding')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ── Tab Navigation Bar ───────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Curriculum Roadmap
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'badges'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Badges & Activity
            </button>
          </div>

          <Link
            href="/assessment"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-brand-600 font-semibold hover:text-brand-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Skill Assessment
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* ── 1. Learner Profile Card ────────────────────────────────────── */}
        <LearnerProfileCard
          profile={profile}
          stats={stats}
          onEditGoal={() => router.push('/onboarding')}
        />

        {activeTab === 'overview' && (
          <>
            {/* ── 2. Goal summary & Overall Progress Card ────────────────── */}
            <div className="card p-6 shadow-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold">
                      {profile.skill}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {levelLabel}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      Self-Paced
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 leading-tight">
                    {profile.goal}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {profile.dailyMinutes} min/day commitment
                    </span>
                    <span>·</span>
                    <span>~{estimateWeeks} week{estimateWeeks !== 1 ? 's' : ''} to completion</span>
                    <span>·</span>
                    <span>{roadmap.totalEstimatedHours}h curriculum total</span>
                  </p>
                </div>

                <div className="text-left md:text-right flex-shrink-0 md:border-l md:border-slate-100 md:pl-8">
                  <div className="flex items-baseline md:justify-end gap-1.5">
                    <span className="text-4xl font-black text-navy-900">{progress}%</span>
                    <span className="text-xs text-slate-400 font-medium">completed</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 mt-0.5">Overall Path Mastery</p>
                  <div className="w-48 max-w-full">
                    <ProgressBar value={progress} size="md" color="brand" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── 3. Continue Learning Hero Card ─────────────────────────── */}
            {next && (
              <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 rounded-2xl p-6 text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Zap className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-brand-100 text-[11px] font-bold uppercase tracking-wider">
                        Continue Learning
                      </span>
                      <span className="text-xs text-brand-200">
                        {next.milestone.title}
                      </span>
                    </div>
                    <h2 className="font-extrabold text-lg sm:text-xl mt-1 leading-snug">
                      {next.lesson.title}
                    </h2>
                    <p className="text-xs text-brand-100 mt-1 flex items-center gap-2">
                      <span className="capitalize">{next.lesson.type}</span>
                      <span>·</span>
                      <span>{next.lesson.durationMinutes} min</span>
                      <span>·</span>
                      <span>+{next.lesson.xpReward ?? 25} XP</span>
                    </p>
                  </div>
                </div>

                <Link
                  href={`/lesson?id=${next.lesson.id}&milestone=${next.milestone.id}`}
                  className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-brand-50 transition-all shadow-md active:scale-95"
                >
                  Resume Lesson
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* ── 4. Stats Row ───────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total XP Earned"
                value={stats.xp}
                icon={Zap}
                iconColor="text-amber-600"
                iconBg="bg-amber-100"
                sublabel={`${Math.max(0, 100 - (stats.xp % 100))} XP to next tier`}
              />
              <StatCard
                label="Active Streak"
                value={`${stats.streakDays} Days 🔥`}
                icon={Flame}
                iconColor="text-orange-600"
                iconBg="bg-orange-100"
                sublabel="Keep practicing daily"
              />
              <StatCard
                label="Lessons Completed"
                value={stats.lessonsCompleted}
                icon={CheckCircle}
                iconColor="text-emerald-600"
                iconBg="bg-emerald-100"
                sublabel={`${stats.hoursLearned}h learned so far`}
              />
            </div>

            {/* ── 5. Daily Tasks & Weekly Activity Row ───────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DailyTasksWidget
                tasks={dailyTasks}
                onTaskCompleted={handleTaskCompleted}
              />
              <WeeklyActivityWidget
                activity={weeklyActivity}
                dailyTargetMinutes={profile.dailyMinutes}
              />
            </div>

            {/* ── 6. Badges Showcase ─────────────────────────────────────── */}
            <BadgesWidget badges={badges} />

            {/* ── 7. Reusable Roadmap Section ────────────────────────────── */}
            <div id="roadmap">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-brand-600" />
                  <h2 className="font-extrabold text-navy-900 text-lg sm:text-xl">
                    Learning Roadmap & Modules
                  </h2>
                </div>
                <span className="text-xs text-slate-500">
                  {roadmap.milestones.filter((m) => m.status === 'completed').length} /{' '}
                  {roadmap.milestones.length} Modules Finished
                </span>
              </div>

              <RoadmapView
                roadmap={roadmap}
                hideHeader={true}
                onSelectLesson={(lessonId, milestoneId) =>
                  router.push(`/lesson?id=${lessonId}&milestone=${milestoneId}`)
                }
              />
            </div>

            {/* ── 8. Recent Activity ─────────────────────────────────────── */}
            <RecentActivityWidget activities={recentActivity} />
          </>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-navy-900">Curriculum Roadmap</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Step-by-step sequential learning modules tailored to your {profile.skill} goal.
                </p>
              </div>
            </div>

            <RoadmapView
              roadmap={roadmap}
              onSelectLesson={(lessonId, milestoneId) =>
                router.push(`/lesson?id=${lessonId}&milestone=${milestoneId}`)
              }
            />
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-6">
            <BadgesWidget badges={badges} />
            <RecentActivityWidget activities={recentActivity} />
            <DailyTasksWidget
              tasks={dailyTasks}
              onTaskCompleted={handleTaskCompleted}
            />
          </div>
        )}

        {/* ── Footer nudge ─────────────────────────────────────────────── */}
        <div className="text-center py-6 text-xs text-slate-400">
          <Target className="w-3.5 h-3.5 inline mr-1 text-brand-500" />
          Study {profile.dailyMinutes} minutes today to keep your streak alive 🎯
        </div>
      </main>
    </div>
  );
}

// ─── Dashboard header ─────────────────────────────────────────────────────────
function DashboardHeader({
  profile,
  onReset,
  activeTab,
  setActiveTab,
}: {
  profile?: LearnerProfile;
  onReset?: () => void;
  activeTab?: 'overview' | 'roadmap' | 'badges';
  setActiveTab?: (tab: 'overview' | 'roadmap' | 'badges') => void;
}) {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center group-hover:bg-brand-700 transition-colors shadow-sm">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-navy-900 text-lg tracking-tight">
            SkillPath <span className="text-brand-600">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/assessment"
            className="text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors hidden sm:block"
          >
            Diagnostic Test
          </Link>

          {profile && (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200 text-xs text-slate-500">
              <span>Goal:</span>
              <strong className="text-navy-800 font-bold">{profile.skill}</strong>
            </div>
          )}

          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-navy-800 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Start over with a new roadmap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Roadmap</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
