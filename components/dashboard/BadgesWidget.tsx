'use client';

import { Badge } from '@/lib/types';
import {
  Sparkles,
  Flame,
  Zap,
  Code,
  Award,
  GraduationCap,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgesWidgetProps {
  badges: Badge[];
}

const BADGE_ICONS: Record<string, any> = {
  Sparkles,
  Flame,
  Zap,
  Code,
  Award,
  GraduationCap,
};

export default function BadgesWidget({ badges }: BadgesWidgetProps) {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-navy-900 text-sm">Achievements & Badges</h3>
            <p className="text-[11px] text-slate-400">Unlock by hitting milestones and consistency</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
          {unlockedCount} / {badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
        {badges.map((badge) => {
          const Icon = BADGE_ICONS[badge.icon] || Award;

          return (
            <div
              key={badge.id}
              className={cn(
                'group relative rounded-xl border p-3 flex flex-col items-center text-center transition-all duration-200',
                badge.unlocked
                  ? 'bg-amber-50/40 border-amber-200/80 hover:shadow-sm hover:border-amber-300'
                  : 'bg-slate-50/60 border-slate-200 opacity-60 hover:opacity-80'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm transition-transform group-hover:scale-105',
                  badge.unlocked
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
                    : 'bg-slate-200 text-slate-400'
                )}
              >
                {badge.unlocked ? (
                  <Icon className="w-5 h-5" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <h4 className="font-bold text-xs text-navy-900 leading-snug line-clamp-1">
                {badge.title}
              </h4>

              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                {badge.description}
              </p>

              {badge.unlocked && badge.unlockedAt && (
                <span className="mt-2 text-[9px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                  {badge.unlockedAt}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
