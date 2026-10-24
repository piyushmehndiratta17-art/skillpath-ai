'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, Flame, Zap, CheckCircle, ArrowRight, Map, RotateCcw, Clock, Target,
} from 'lucide-react';
import { LearnerProfile, Roadmap, LearnerStats } from '@/lib/types';
import { loadProfile, loadRoadmap, loadStats, overallProgress, nextLesson } from '@/lib/progress';
import MilestoneCard from '@/components/MilestoneCard';
import StatCard from '@/components/StatCard';
import ProgressBar from '@/components/ProgressBar';

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-10 w-48" />
      <div className="space-y-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-28" />)}
      </div>
    </div>
  );
}

// ─── Next-action banner ───────────────────────────────────────────────────────
function NextActionBanner({ roadmap }: { roadmap: Roadmap }) {
  const next = nextLesson(roadmap);
  if (!next) return null;

  return (
    <div className="bg-gradient-to-r from-brand-600 to-violet-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <Zap className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-brand-200 font-medium mb-0.5">Continue where you left off</p>
        <p className="font-bold text-lg leading-tight">{next.lesson.title}</p>
        <p className="text-xs text-brand-200 mt-0.5">
          {next.milestone.title} · {next.lesson.durationMinutes} min · {next.lesson.type}
        </p>
      </div>
      <Link
        href="/lesson"
        className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-brand-50 transition-colors"
      >
        Continue Learning
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [stats, setStats] = useState<LearnerStats | null>(null);
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
  }, [router]);

  if (!mounted || !profile || !roadmap || !stats) {
    return (
      <div className="min-h-screen bg-cream">
        <DashboardHeader />
        <main className="max-w-4xl mx-auto px-6 py-8">
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

  return (
    <div className="min-h-screen bg-cream">
      <DashboardHeader profile={profile} onReset={() => router.push('/onboarding')} />

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* ── Goal summary card ─────────────────────────────────────────── */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
                  {profile.skill}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                  {levelLabel}
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-navy-900 mt-2 leading-tight">
                {profile.goal.length > 80 ? profile.goal.slice(0, 80) + '…' : profile.goal}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                <Clock className="w-3.5 h-3.5 inline mr-1" />
                {profile.dailyMinutes} min/day · ~{estimateWeeks} week{estimateWeeks !== 1 ? 's' : ''} to complete ·{' '}
                {roadmap.totalEstimatedHours}h total
              </p>
            </div>
            <div className="text-center sm:text-right flex-shrink-0">
              <p className="text-4xl font-extrabold text-navy-900">{progress}%</p>
              <p className="text-xs text-slate-500 mb-2">overall progress</p>
              <ProgressBar value={progress} size="lg" />
            </div>
          </div>
        </div>

        {/* ── Stats row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total XP Earned"
            value={stats.xp}
            icon={Zap}
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
            sublabel="Keep completing lessons!"
          />
          <StatCard
            label="Day Streak"
            value={`${stats.streakDays} 🔥`}
            icon={Flame}
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
            sublabel="Don't break the chain"
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

        {/* ── Next action banner ────────────────────────────────────────── */}
        <NextActionBanner roadmap={roadmap} />

        {/* ── Roadmap milestones ────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-5 h-5 text-brand-600" />
            <h2 className="font-bold text-navy-800 text-lg">Your Learning Roadmap</h2>
            <span className="ml-auto text-xs text-slate-400">
              {roadmap.milestones.filter(m => m.status === 'completed').length} /{' '}
              {roadmap.milestones.length} milestones
            </span>
          </div>

          <div className="space-y-4">
            {roadmap.milestones.map((milestone, index) => {
              const isNext =
                milestone.status === 'in_progress' ||
                (milestone.status === 'available' &&
                  !roadmap.milestones.slice(0, index).some(
                    (m) => m.status === 'in_progress'
                  ));
              return (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  isNext={isNext}
                  onClick={() => router.push('/lesson')}
                />
              );
            })}
          </div>
        </div>

        {/* ── Footer nudge ─────────────────────────────────────────────── */}
        <div className="text-center py-6 text-sm text-slate-400">
          <Target className="w-4 h-4 inline mr-1.5" />
          Study {profile.dailyMinutes} minutes today to stay on track 🎯
        </div>
      </main>
    </div>
  );
}

// ─── Dashboard header (extracted for reuse in skeleton state) ────────────────
function DashboardHeader({
  profile,
  onReset,
}: {
  profile?: LearnerProfile;
  onReset?: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center group-hover:bg-brand-700 transition-colors">
            <BookOpen className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-navy-800 text-base hidden sm:block">
            SkillPath <span className="text-brand-600">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {profile && (
            <span className="text-sm text-slate-500 hidden sm:block">
              Learning: <strong className="text-navy-700">{profile.skill}</strong>
            </span>
          )}
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-navy-700 hover:bg-slate-100 transition-colors"
              title="Start over with a new roadmap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Roadmap
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
