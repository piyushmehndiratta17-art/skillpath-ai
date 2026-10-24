'use client';

import { LearnerProfile, LearnerStats } from '@/lib/types';
import { User, Flame, Zap, Award, Target, Calendar } from 'lucide-react';
import Link from 'next/link';

interface LearnerProfileCardProps {
  profile: LearnerProfile;
  stats: LearnerStats;
  onEditGoal?: () => void;
}

export default function LearnerProfileCard({
  profile,
  stats,
  onEditGoal,
}: LearnerProfileCardProps) {
  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recent';

  const levelName = profile.level.charAt(0).toUpperCase() + profile.level.slice(1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'AL'}
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold"
              title="Active Streak"
            >
              ✓
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-navy-900 leading-tight">
                {profile.name ?? 'Alex Morgan'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-700">
                Level {Math.max(1, Math.floor(stats.xp / 100))}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 font-medium text-navy-700">
                <Target className="w-3.5 h-3.5 text-brand-600" />
                Target: {profile.skill} ({levelName})
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Joined {memberSince}
              </span>
            </p>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="flex items-center gap-3 sm:border-l sm:border-slate-100 sm:pl-5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 border border-orange-100">
            <Flame className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Streak</p>
              <p className="text-sm font-extrabold text-orange-900">{stats.streakDays} Days</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100">
            <Zap className="w-4 h-4 text-amber-500" />
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">XP Total</p>
              <p className="text-sm font-extrabold text-amber-900">{stats.xp}</p>
            </div>
          </div>

          <Link
            href="/assessment"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 transition-all"
            title="Retake or adjust skill diagnostic assessment"
          >
            <Award className="w-3.5 h-3.5" />
            Diagnostic
          </Link>
        </div>
      </div>
    </div>
  );
}
