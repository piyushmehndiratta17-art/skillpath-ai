'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Clock,
  Star,
  CheckCircle,
  ChevronRight,
  Lightbulb,
  Code,
  FileText,
  AlertTriangle,
  Copy,
  Check,
  HelpCircle,
  Sparkles,
  Award,
  RotateCcw,
} from 'lucide-react';

import {
  loadRoadmap,
  loadProfile,
  loadStats,
  nextLesson,
  completeLesson,
  CompleteLessonResult,
} from '@/lib/progress';
import { Roadmap, LearnerProfile, LearnerStats, DetailedLessonContent, LessonPracticeQuestion } from '@/lib/types';
import { getLessonContent } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

// ─── Code Snippet with Copy Feature ───────────────────────────────────────────
function CodeSnippet({
  code,
  language = 'python',
  output,
}: {
  code: string;
  language?: string;
  output?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="relative rounded-xl overflow-hidden bg-navy-900 border border-navy-800 shadow-inner">
        <div className="flex items-center justify-between px-4 py-2 bg-navy-800/80 border-b border-navy-700/60 text-xs text-slate-400 font-mono">
          <span>{language.toUpperCase()}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-4 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>

      {output && (
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 text-xs font-mono">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
            Console Output
          </p>
          <pre className="text-slate-300 overflow-x-auto whitespace-pre">{output}</pre>
        </div>
      )}
    </div>
  );
}

// ─── Practice Question Interactive Component ──────────────────────────────────
function PracticeQuestionCard({
  question,
  onAnswerCorrect,
}: {
  question: LessonPracticeQuestion;
  onAnswerCorrect?: () => void;
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = selectedOption === question.correctIndex;

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    if (selectedOption === question.correctIndex && onAnswerCorrect) {
      onAnswerCorrect();
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
    setSelectedOption(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-navy-900 text-sm">Interactive Practice Question</h4>
        </div>
        {question.hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
          >
            {showHint ? 'Hide Hint' : '💡 Need a Hint?'}
          </button>
        )}
      </div>

      <p className="text-sm text-navy-800 font-medium leading-relaxed">{question.prompt}</p>

      {showHint && question.hint && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <strong>Hint:</strong> {question.hint}
        </div>
      )}

      {/* Multiple Choice Options */}
      <div className="space-y-2 pt-1">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          let optionStyle = 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 text-navy-800';

          if (submitted) {
            if (idx === question.correctIndex) {
              optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
            } else if (isSelected && !isCorrect) {
              optionStyle = 'border-red-400 bg-red-50 text-red-900';
            } else {
              optionStyle = 'border-slate-200 opacity-60 text-slate-500';
            }
          } else if (isSelected) {
            optionStyle = 'border-brand-500 bg-brand-50 text-brand-800 ring-2 ring-brand-200';
          }

          return (
            <label
              key={idx}
              className={cn(
                'flex items-center gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all',
                optionStyle
              )}
            >
              <input
                type="radio"
                name={`quiz-${question.id}`}
                checked={isSelected}
                disabled={submitted}
                onChange={() => setSelectedOption(idx)}
                className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span className="flex-1">{opt}</span>
              {submitted && idx === question.correctIndex && (
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              )}
            </label>
          );
        })}
      </div>

      {/* Action / Feedback Banner */}
      {!submitted ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className={cn(
            'px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm',
            selectedOption === null
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-95'
          )}
        >
          Check Answer
        </button>
      ) : (
        <div
          className={cn(
            'p-4 rounded-xl border text-xs space-y-2',
            isCorrect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              {isCorrect ? '🎉 Correct!' : '⚠️ Not quite right'}
            </span>
            {!isCorrect && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 underline hover:text-amber-900"
              >
                <RotateCcw className="w-3 h-3" />
                Try Again
              </button>
            )}
          </div>
          <p className="leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

// ─── Lesson Content View ──────────────────────────────────────────────────────
function LessonContentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [stats, setStats] = useState<LearnerStats | null>(null);
  const [completedState, setCompletedState] = useState<CompleteLessonResult | null>(null);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(loadProfile());
    setRoadmap(loadRoadmap());
    setStats(loadStats());
  }, []);

  const paramLessonId = searchParams.get('id');
  const paramMilestoneId = searchParams.get('milestone');

  // Reset completed banner when navigating to a new lesson
  useEffect(() => {
    setCompletedState(null);
  }, [paramLessonId]);

  if (!mounted) return null;

  // Determine current lesson id
  const next = roadmap ? nextLesson(roadmap) : null;
  const activeLessonId = paramLessonId || next?.lesson.id || 'l1-3';
  const content: DetailedLessonContent = getLessonContent(activeLessonId, roadmap);

  // Find where this lesson sits in the roadmap
  let currentMilestone = null;
  let lessonIndexInMilestone = 1;
  let totalLessonsInMilestone = 1;
  let isAlreadyCompleted = false;

  let previousLesson = null;
  let followingLesson = null;

  if (roadmap) {
    const flatLessons: { lessonId: string; milestoneId: string }[] = [];
    for (const m of roadmap.milestones) {
      const idx = m.lessons.findIndex((l) => l.id === activeLessonId);
      if (idx !== -1) {
        currentMilestone = m;
        totalLessonsInMilestone = m.lessons.length;
        lessonIndexInMilestone = idx + 1;
        isAlreadyCompleted = m.lessons[idx].completed;
      }
      m.lessons.forEach((l) => {
        flatLessons.push({ lessonId: l.id, milestoneId: m.id });
      });
    }

    const currentFlatIdx = flatLessons.findIndex((item) => item.lessonId === activeLessonId);
    if (currentFlatIdx > 0) {
      previousLesson = flatLessons[currentFlatIdx - 1];
    }
    if (currentFlatIdx >= 0 && currentFlatIdx < flatLessons.length - 1) {
      followingLesson = flatLessons[currentFlatIdx + 1];
    }
  }

  const milestoneName = currentMilestone?.title ?? content.milestoneTitle;

  const handleMarkAsComplete = () => {
    setIsMarkingComplete(true);
    setTimeout(() => {
      const result = completeLesson(activeLessonId, currentMilestone?.id);
      if (result) {
        setCompletedState(result);
        setRoadmap(result.updatedRoadmap);
        setStats(result.updatedStats);
      }
      setIsMarkingComplete(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-navy-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-navy-900 hidden sm:block">
              SkillPath <span className="text-brand-600">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {previousLesson && (
              <Link
                href={`/lesson?id=${previousLesson.lessonId}&milestone=${previousLesson.milestoneId}`}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1"
                title="Previous Lesson"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </Link>
            )}
            {followingLesson && (
              <Link
                href={`/lesson?id=${followingLesson.lessonId}&milestone=${followingLesson.milestoneId}`}
                className="px-2.5 py-1.5 rounded-lg bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors flex items-center gap-1"
                title="Next Lesson"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
          <Link href="/dashboard" className="hover:text-navy-700 transition-colors">
            {profile?.skill ?? 'Skill'}
          </Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href="/dashboard#roadmap" className="hover:text-navy-700 transition-colors">
            {milestoneName}
          </Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-navy-800 font-semibold">{content.title}</span>
        </nav>

        {/* Lesson Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
              {content.type}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {content.durationMinutes} min read
            </span>
            <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold border border-amber-200">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              +{content.xpReward} XP Reward
            </span>
            {(isAlreadyCompleted || completedState) && (
              <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Completed
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-tight mb-3">
            {content.title}
          </h1>

          {/* Objective Callout */}
          <div className="bg-brand-50/70 border border-brand-200 rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-bold text-brand-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Learning Objective
            </p>
            <p className="text-sm text-navy-800 font-medium leading-relaxed">
              {content.objective}
            </p>
          </div>
        </div>

        {/* Progress Indicator for current milestone */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-1.5 flex-1 max-w-xs">
            {Array.from({ length: totalLessonsInMilestone }).map((_, step) => (
              <div
                key={step}
                className={cn(
                  'h-2 flex-1 rounded-full transition-colors',
                  step < lessonIndexInMilestone ? 'bg-brand-600' : 'bg-slate-200'
                )}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Lesson {lessonIndexInMilestone} of {totalLessonsInMilestone} in {milestoneName}
          </span>
        </div>

        {/* Lesson Sections */}
        <div className="space-y-6 mb-8">
          {content.sections.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-3">
              <div className="flex items-center gap-2">
                {section.type === 'concept' && <FileText className="w-4 h-4 text-brand-600" />}
                {section.type === 'code' && <Code className="w-4 h-4 text-emerald-600" />}
                {section.type === 'tip' && <Lightbulb className="w-4 h-4 text-amber-500" />}
                {section.type === 'warning' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                <h3 className="font-bold text-navy-900 text-base">{section.title}</h3>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {section.body}
              </p>

              {section.code && (
                <div className="pt-2">
                  <CodeSnippet code={section.code} language={section.language} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Key Takeaways */}
        <div className="bg-gradient-to-br from-brand-50 to-indigo-50 rounded-2xl border border-brand-200 p-6 mb-8 shadow-sm">
          <h3 className="font-bold text-brand-900 text-base mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-brand-600" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {content.keyTakeaways.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-navy-800">
                <span className="w-5 h-5 rounded-full bg-brand-200 text-brand-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Practice Questions (Interactive Quiz within lesson) */}
        {content.practiceQuestions && content.practiceQuestions.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-navy-900 text-base">Knowledge Check</h3>
            </div>
            {content.practiceQuestions.map((q) => (
              <PracticeQuestionCard key={q.id} question={q} />
            ))}
          </div>
        )}

        {/* Completion Action Banner / State */}
        {!completedState ? (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleMarkAsComplete}
              disabled={isMarkingComplete}
              className={cn(
                'flex-1 py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-98',
                isMarkingComplete
                  ? 'bg-brand-400 cursor-wait'
                  : 'bg-brand-600 hover:bg-brand-700 hover:shadow-lg'
              )}
            >
              <CheckCircle className="w-4 h-4" />
              {isMarkingComplete
                ? 'Saving Progress…'
                : isAlreadyCompleted
                ? 'Mark Completed Again (+XP)'
                : `Mark as Complete (+${content.xpReward} XP)`}
            </button>

            <Link
              href="/dashboard"
              className="py-4 px-6 rounded-2xl bg-white border border-slate-200 text-navy-800 font-semibold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Roadmap
            </Link>
          </div>
        ) : (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-md animate-fadeUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-900">
                Lesson Completed! 🎉
              </h3>
              <p className="text-sm text-emerald-800 mt-1">
                You earned <strong>+{completedState.xpEarned} XP</strong>! Your roadmap and stats
                are updated.
              </p>
            </div>

            {completedState.newBadgesUnlocked.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Badge Unlocked: {completedState.newBadgesUnlocked[0].title}!
              </div>
            )}

            {completedState.isMilestoneCompleted && (
              <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-xs text-brand-900 font-bold">
                🏆 Milestone Finished: {completedState.completedMilestoneTitle}! Next module is now
                unlocked!
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {followingLesson ? (
                <Link
                  href={`/lesson?id=${followingLesson.lessonId}&milestone=${followingLesson.milestoneId}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition-colors shadow-md"
                >
                  Continue to Next Lesson
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : null}

              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-navy-800 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading Lesson Content…</p>
        </div>
      }
    >
      <LessonContentInner />
    </Suspense>
  );
}
