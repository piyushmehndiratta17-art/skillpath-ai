'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Map,
  CheckCircle,
  PlayCircle,
  Lock,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  BookOpen,
  HelpCircle,
  FolderGit2,
  Video,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Roadmap, Milestone, Lesson } from '@/lib/types';
import { nextLesson, milestoneProgress } from '@/lib/progress';
import { cn } from '@/lib/utils';
import ProgressBar from '@/components/ProgressBar';

interface RoadmapViewProps {
  roadmap: Roadmap;
  onSelectLesson?: (lessonId: string, milestoneId: string) => void;
  className?: string;
  hideHeader?: boolean;
}

const LESSON_ICONS = {
  reading: BookOpen,
  video: Video,
  quiz: HelpCircle,
  project: FolderGit2,
};

export default function RoadmapView({
  roadmap,
  onSelectLesson,
  className,
  hideHeader = false,
}: RoadmapViewProps) {
  // By default, open milestones that are in_progress or available
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    roadmap.milestones.forEach((m, idx) => {
      initial[m.id] = m.status === 'in_progress' || m.status === 'available' || idx === 0;
    });
    return initial;
  });

  const next = nextLesson(roadmap);

  const toggleMilestone = (id: string) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalLessons = roadmap.milestones.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = roadmap.milestones.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  );
  const completionPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Optional Top Summary Header */}
      {!hideHeader && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                <Map className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-navy-900">{roadmap.skill} Roadmap</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 capitalize">
                    {roadmap.level}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {roadmap.milestones.length} Modules · {totalLessons} Lessons · ~{roadmap.totalEstimatedHours}h Estimated
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-2xl font-extrabold text-navy-900">{completionPercent}%</p>
              <p className="text-xs text-slate-400">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ProgressBar value={completionPercent} size="md" color="brand" />
          </div>
        </div>
      )}

      {/* Up Next Spotlight Callout */}
      {next && (
        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-brand-100 text-[11px] font-bold uppercase tracking-wider">
                  Recommended Next Step
                </span>
                <span className="text-xs text-brand-200">
                  {next.milestone.title}
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg mt-0.5">{next.lesson.title}</h3>
              <p className="text-xs text-brand-100 mt-0.5">
                {next.lesson.durationMinutes} min · {next.lesson.type.toUpperCase()} · +{next.lesson.xpReward ?? 25} XP
              </p>
            </div>
          </div>

          <Link
            href={`/lesson?id=${next.lesson.id}&milestone=${next.milestone.id}`}
            onClick={() => onSelectLesson?.(next.lesson.id, next.milestone.id)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-brand-50 transition-colors shadow-sm flex-shrink-0"
          >
            Start Next Lesson
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Milestones / Modules List */}
      <div className="space-y-4">
        {roadmap.milestones.map((milestone, mIndex) => {
          const isExpanded = !!expandedMilestones[milestone.id];
          const isMilestoneLocked = milestone.status === 'locked';
          const isMilestoneCompleted = milestone.status === 'completed';
          const isMilestoneInProgress = milestone.status === 'in_progress';
          const mProgress = milestoneProgress(milestone);
          const milestoneLessonsDone = milestone.lessons.filter((l) => l.completed).length;

          return (
            <div
              key={milestone.id}
              className={cn(
                'rounded-2xl border transition-all duration-200 bg-white overflow-hidden',
                isMilestoneCompleted
                  ? 'border-emerald-200 shadow-sm'
                  : isMilestoneInProgress
                  ? 'border-brand-300 shadow-md ring-1 ring-brand-200'
                  : isMilestoneLocked
                  ? 'border-slate-200 opacity-75'
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              )}
            >
              {/* Module Header Bar */}
              <div
                onClick={() => !isMilestoneLocked && toggleMilestone(milestone.id)}
                className={cn(
                  'p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none',
                  !isMilestoneLocked ? 'cursor-pointer hover:bg-slate-50/70 transition-colors' : 'cursor-not-allowed bg-slate-50/50'
                )}
              >
                <div className="flex items-start gap-3.5">
                  {/* Status Indicator Icon */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5',
                      isMilestoneCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isMilestoneInProgress
                        ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-300'
                        : isMilestoneLocked
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-brand-50 text-brand-600'
                    )}
                  >
                    {isMilestoneCompleted ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : isMilestoneLocked ? (
                      <Lock className="w-4 h-4 text-slate-400" />
                    ) : (
                      <span>{milestone.order}</span>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-400">
                        Module {milestone.order}
                      </span>
                      {isMilestoneCompleted && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                          Completed
                        </span>
                      )}
                      {isMilestoneInProgress && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-100 text-brand-700">
                          In Progress
                        </span>
                      )}
                      {milestone.status === 'available' && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-700">
                          Available
                        </span>
                      )}
                      {isMilestoneLocked && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
                          Locked
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-navy-900 text-base leading-snug">
                      {milestone.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-xl">
                      {milestone.description}
                    </p>

                    {/* Prerequisites & metadata pills */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {milestone.estimatedHours}h
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        +{milestone.xpReward} XP
                      </span>
                      {milestone.prerequisites && milestone.prerequisites.length > 0 && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                          Prerequisite: {milestone.prerequisites[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress & Accordion Trigger */}
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right min-w-[90px]">
                    <div className="text-xs font-semibold text-navy-800">
                      {milestoneLessonsDone} / {milestone.lessons.length} done
                    </div>
                    <div className="w-24 mt-1">
                      <ProgressBar
                        value={mProgress}
                        size="sm"
                        color={isMilestoneCompleted ? 'green' : 'brand'}
                      />
                    </div>
                  </div>

                  {!isMilestoneLocked && (
                    <button
                      type="button"
                      aria-label="Toggle module lessons"
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsible Lessons List */}
              {isExpanded && !isMilestoneLocked && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-2.5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Module Lessons ({milestone.lessons.length})
                  </p>

                  <div className="space-y-2">
                    {milestone.lessons.map((lesson, lIndex) => {
                      const LessonIcon = LESSON_ICONS[lesson.type] || BookOpen;
                      const isNextLesson = next?.lesson.id === lesson.id;

                      return (
                        <div
                          key={lesson.id}
                          className={cn(
                            'rounded-xl border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all',
                            lesson.completed
                              ? 'bg-white border-slate-200 text-slate-600'
                              : isNextLesson
                              ? 'bg-brand-50/80 border-brand-300 shadow-sm ring-1 ring-brand-300'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold',
                                lesson.completed
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : isNextLesson
                                  ? 'bg-brand-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600'
                              )}
                            >
                              {lesson.completed ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <LessonIcon className="w-4 h-4" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4
                                  className={cn(
                                    'text-sm font-semibold leading-tight',
                                    lesson.completed ? 'text-slate-600' : 'text-navy-900'
                                  )}
                                >
                                  {lesson.title}
                                </h4>
                                {isNextLesson && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-600 text-white">
                                    Next
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                <span className="capitalize">{lesson.type}</span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {lesson.durationMinutes} min
                                </span>
                                <span>·</span>
                                <span>+{lesson.xpReward ?? 25} XP</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            {lesson.completed ? (
                              <Link
                                href={`/lesson?id=${lesson.id}&milestone=${milestone.id}`}
                                onClick={() => onSelectLesson?.(lesson.id, milestone.id)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                              >
                                Review
                              </Link>
                            ) : (
                              <Link
                                href={`/lesson?id=${lesson.id}&milestone=${milestone.id}`}
                                onClick={() => onSelectLesson?.(lesson.id, milestone.id)}
                                className={cn(
                                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm',
                                  isNextLesson
                                    ? 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow'
                                    : 'bg-slate-100 text-navy-800 hover:bg-brand-600 hover:text-white'
                                )}
                              >
                                {isNextLesson ? 'Start' : 'Learn'}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
