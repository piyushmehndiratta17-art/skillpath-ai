import { cn } from '@/lib/utils';
import { Milestone as MilestoneType } from '@/lib/types';
import { Lock, CheckCircle, PlayCircle, Circle, Clock, Star } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface MilestoneCardProps {
  milestone: MilestoneType;
  isNext: boolean;
  onClick?: () => void;
}

const STATUS_CONFIG = {
  locked: {
    icon: Lock,
    iconClass: 'text-slate-400',
    containerClass: 'bg-white border-slate-200 opacity-60',
    badge: null,
  },
  available: {
    icon: Circle,
    iconClass: 'text-brand-400',
    containerClass: 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-card-hover cursor-pointer',
    badge: null,
  },
  in_progress: {
    icon: PlayCircle,
    iconClass: 'text-brand-600',
    containerClass: 'bg-white border-brand-300 shadow-card hover:shadow-card-hover cursor-pointer',
    badge: 'In Progress',
  },
  completed: {
    icon: CheckCircle,
    iconClass: 'text-emerald-500',
    containerClass: 'bg-emerald-50 border-emerald-200',
    badge: 'Completed',
  },
};

export default function MilestoneCard({ milestone, isNext, onClick }: MilestoneCardProps) {
  const config = STATUS_CONFIG[milestone.status];
  const Icon = config.icon;
  const completedLessons = milestone.lessons.filter((l) => l.completed).length;
  const progress = Math.round((completedLessons / milestone.lessons.length) * 100);

  return (
    <div
      className={cn(
        'relative rounded-2xl border p-5 transition-all duration-200',
        config.containerClass,
        isNext && 'ring-2 ring-brand-500 ring-offset-2'
      )}
      onClick={milestone.status !== 'locked' ? onClick : undefined}
      role={milestone.status !== 'locked' ? 'button' : undefined}
      tabIndex={milestone.status !== 'locked' ? 0 : undefined}
    >
      {/* Next badge */}
      {isNext && (
        <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-brand-600 text-white text-xs font-bold shadow-sm">
          ▶ Up Next
        </span>
      )}

      <div className="flex items-start gap-4">
        {/* Order + icon */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
            milestone.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
            milestone.status === 'in_progress' ? 'bg-brand-100 text-brand-700' :
            'bg-slate-100 text-slate-500'
          )}>
            {milestone.order}
          </div>
          <Icon className={cn('w-4 h-4', config.iconClass)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-navy-800 text-sm leading-tight">{milestone.title}</h3>
            {config.badge && (
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0',
                milestone.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-100 text-brand-700'
              )}>
                {config.badge}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed mb-3">{milestone.description}</p>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {milestone.estimatedHours}h estimated
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400" />
              {milestone.xpReward} XP
            </span>
            <span>{milestone.lessons.length} lessons</span>
          </div>

          {/* Progress bar for active milestones */}
          {(milestone.status === 'in_progress' || milestone.status === 'completed') && (
            <div className="mt-3">
              <ProgressBar
                value={progress}
                size="sm"
                color={milestone.status === 'completed' ? 'green' : 'brand'}
              />
              <p className="text-xs text-slate-400 mt-1">
                {completedLessons} / {milestone.lessons.length} lessons done
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
