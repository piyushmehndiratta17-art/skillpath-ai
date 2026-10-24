'use client';

import { useState, useEffect } from 'react';
import { DailyTask } from '@/lib/types';
import { CheckCircle2, Circle, Zap, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveDailyTasks } from '@/lib/progress';

interface DailyTasksWidgetProps {
  tasks: DailyTask[];
  onTaskCompleted?: (taskId: string, xp: number) => void;
}

export default function DailyTasksWidget({
  tasks: initialTasks,
  onTaskCompleted,
}: DailyTasksWidgetProps) {
  const [tasks, setTasks] = useState<DailyTask[]>(initialTasks);

  useEffect(() => {
    if (initialTasks && initialTasks.length > 0) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  const toggleTask = (taskId: string) => {
    const nextTasks = tasks.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        if (nextCompleted && onTaskCompleted) {
          onTaskCompleted(t.id, t.xp);
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    });
    setTasks(nextTasks);
    saveDailyTasks(nextTasks);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const allCompleted = tasks.length > 0 && completedCount === tasks.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-sm">Daily Quests</h3>
              <p className="text-[11px] text-slate-400">Resets daily at midnight</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            {completedCount} / {tasks.length}
          </span>
        </div>

        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={cn(
                'group flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all duration-150',
                task.completed
                  ? 'bg-emerald-50/60 border-emerald-200 text-slate-500'
                  : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-sm'
              )}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 group-hover:text-brand-600 transition-colors"
                aria-label={task.completed ? 'Task completed' : 'Mark task complete'}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'font-medium leading-snug',
                    task.completed && 'line-through text-slate-400'
                  )}
                >
                  {task.title}
                </p>
              </div>

              <span
                className={cn(
                  'flex items-center gap-0.5 font-bold flex-shrink-0 text-[11px]',
                  task.completed ? 'text-emerald-700' : 'text-amber-600'
                )}
              >
                <Zap className="w-3 h-3" />
                +{task.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {allCompleted && (
        <div className="mt-4 p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          All daily quests cleared! +20 Bonus XP applied.
        </div>
      )}
    </div>
  );
}
