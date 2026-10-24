'use client';

import { ActivityDay } from '@/lib/types';
import { Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeeklyActivityWidgetProps {
  activity: ActivityDay[];
  dailyTargetMinutes?: number;
}

export default function WeeklyActivityWidget({
  activity,
  dailyTargetMinutes = 30,
}: WeeklyActivityWidgetProps) {
  const totalMinutes = activity.reduce((acc, d) => acc + d.minutes, 0);
  const activeDays = activity.filter((d) => d.completed || d.minutes > 0).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-sm">Weekly Activity</h3>
              <p className="text-[11px] text-slate-400">Target: {dailyTargetMinutes}m / day</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            <TrendingUp className="w-3 h-3" />
            {totalMinutes} min total
          </span>
        </div>

        {/* 7-day Bar / Heatmap Visualization */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {activity.map((item) => {
            const heightPercent = Math.min(100, Math.max(12, Math.round((item.minutes / (dailyTargetMinutes * 1.5)) * 100)));
            const isTargetMet = item.minutes >= dailyTargetMinutes;

            return (
              <div key={item.day} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-medium">
                  {item.minutes > 0 ? `${item.minutes}m` : '-'}
                </span>

                {/* Vertical Bar Container */}
                <div className="w-full h-20 bg-slate-100 rounded-lg flex items-end p-1 relative group">
                  <div
                    style={{ height: `${item.minutes > 0 ? heightPercent : 6}%` }}
                    className={cn(
                      'w-full rounded-md transition-all duration-300',
                      item.isToday
                        ? 'bg-brand-600 ring-2 ring-brand-300'
                        : isTargetMet
                        ? 'bg-emerald-500'
                        : item.minutes > 0
                        ? 'bg-sky-400'
                        : 'bg-slate-200'
                    )}
                  />

                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 bg-navy-900 text-white text-[10px] py-1 px-1.5 rounded whitespace-nowrap z-10 transition-opacity">
                    {item.date}: {item.minutes} min
                  </div>
                </div>

                <span
                  className={cn(
                    'text-[11px] font-semibold mt-0.5',
                    item.isToday ? 'text-brand-600 underline font-extrabold' : 'text-slate-500'
                  )}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Active {activeDays} of 7 days</span>
        <span className="font-semibold text-emerald-600">
          {Math.round((activeDays / 7) * 100)}% Consistency
        </span>
      </div>
    </div>
  );
}
