'use client';

import { RecentActivity } from '@/lib/types';
import {
  Clock,
  CheckCircle2,
  Award,
  Flame,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentActivityWidgetProps {
  activities: RecentActivity[];
}

export default function RecentActivityWidget({ activities }: RecentActivityWidgetProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-navy-900 text-sm">Recent Activity</h3>
            <p className="text-[11px] text-slate-400">Your latest study logs & milestones</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 5).map((act) => {
          let Icon = CheckCircle2;
          let iconColor = 'text-emerald-600 bg-emerald-100';

          if (act.type === 'badge_unlocked') {
            Icon = Award;
            iconColor = 'text-amber-600 bg-amber-100';
          } else if (act.type === 'streak_milestone') {
            Icon = Flame;
            iconColor = 'text-orange-600 bg-orange-100';
          }

          return (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
            >
              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', iconColor)}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-navy-900 leading-tight truncate">
                    {act.title}
                  </p>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5 leading-snug">
                  {act.description}
                </p>
              </div>

              {act.xpEarned && (
                <span className="flex items-center gap-0.5 font-bold text-amber-600 text-[11px] flex-shrink-0">
                  <Zap className="w-3 h-3" />
                  +{act.xpEarned}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
