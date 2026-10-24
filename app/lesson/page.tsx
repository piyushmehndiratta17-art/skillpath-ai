'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, ArrowLeft, ArrowRight, Clock, Star, CheckCircle, ChevronRight, Lightbulb, Code, FileText,
} from 'lucide-react';

import { loadRoadmap, loadProfile, nextLesson } from '@/lib/progress';
import { Roadmap, LearnerProfile } from '@/lib/types';

// ─── Sample lesson content (static for Stage 1) ───────────────────────────────
const SAMPLE_CONTENT = {
  objective: 'Understand how the Python interpreter works and why it matters for writing correct code.',
  sections: [
    {
      id: 's1',
      type: 'concept' as const,
      title: 'What is an Interpreter?',
      body: `Python is an **interpreted** language, which means your code is executed line-by-line rather than compiled into machine code before running.

When you run a Python script, the Python interpreter reads each statement, translates it into bytecode, and executes it immediately. This makes Python great for learning because you can see results instantly.`,
    },
    {
      id: 's2',
      type: 'code' as const,
      title: 'Your First Python Statement',
      body: `# This line tells Python to display text on the screen
print("Hello, World!")

# Python executes this top to bottom
name = "Alex"          # Store a value
greeting = "Hello, " + name  # Combine strings
print(greeting)        # Output: Hello, Alex`,
    },
    {
      id: 's3',
      type: 'tip' as const,
      title: 'Pro Tip: The Interactive Shell',
      body: `Open your terminal and type \`python\` (or \`python3\` on Mac/Linux). You'll enter the **REPL** (Read-Eval-Print Loop) — a live Python interpreter where you can type and run code instantly. It's the fastest way to experiment.

Try typing: \`2 + 2\` and press Enter. Python replies: \`4\`. That's the interpreter in action!`,
    },
  ],
  keyPoints: [
    'Python runs code line by line — no compile step needed',
    'The interpreter translates code to bytecode at runtime',
    'The REPL lets you experiment interactively',
    'Errors stop execution at the problematic line',
  ],
};

// ─── Section renderers ────────────────────────────────────────────────────────
function ConceptSection({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" />
        <h3 className="font-bold text-navy-800">{title}</h3>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{body}</p>
    </div>
  );
}

function CodeSection({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Code className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <h3 className="font-bold text-navy-800">{title}</h3>
      </div>
      <pre className="bg-navy-900 text-emerald-300 rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto">
        <code>{body}</code>
      </pre>
    </div>
  );
}

function TipSection({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-2">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <h3 className="font-bold text-amber-800">{title}</h3>
      </div>
      <p className="text-amber-800 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

// ─── Lesson page ──────────────────────────────────────────────────────────────
export default function LessonPage() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(loadProfile());
    setRoadmap(loadRoadmap());
  }, []);

  const next = roadmap ? nextLesson(roadmap) : null;
  const lessonTitle = next?.lesson.title ?? 'How the Python Interpreter Works';
  const milestoneName = next?.milestone.title ?? 'Python Fundamentals';
  const durationMin = next?.lesson.durationMinutes ?? 15;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Roadmap
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-semibold text-navy-800 hidden sm:block">
              SkillPath <span className="text-brand-600">AI</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <span>{profile?.skill ?? 'Python'}</span>
          <ChevronRight className="w-3 h-3" />
          <span>{milestoneName}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-navy-700 font-medium">{lessonTitle}</span>
        </nav>

        {/* Lesson header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold capitalize">
              {next?.lesson.type ?? 'Reading'}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {durationMin} min
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Star className="w-3 h-3 text-amber-400" />
              +25 XP on completion
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-navy-900 mb-2">
            {lessonTitle}
          </h1>
          <p className="text-slate-500 text-sm">
            <strong>Objective:</strong> {SAMPLE_CONTENT.objective}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 flex items-center gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  step <= 1 ? 'bg-brand-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">Lesson 3 of 4 in this milestone</span>
        </div>

        {/* Lesson content */}
        <div className="space-y-8 mb-10">
          {SAMPLE_CONTENT.sections.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl border border-slate-200 p-6">
              {section.type === 'concept' && (
                <ConceptSection title={section.title} body={section.body} />
              )}
              {section.type === 'code' && (
                <CodeSection title={section.title} body={section.body} />
              )}
              {section.type === 'tip' && (
                <TipSection title={section.title} body={section.body} />
              )}
            </div>
          ))}
        </div>

        {/* Key points */}
        <div className="bg-brand-50 rounded-2xl border border-brand-200 p-6 mb-10">
          <h3 className="font-bold text-brand-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {SAMPLE_CONTENT.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-brand-800">
                <span className="w-5 h-5 rounded-full bg-brand-200 text-brand-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                  {i + 1}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Completion / navigation */}
        {!completed ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setCompleted(true)}
              className="flex-1 py-3.5 rounded-2xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 active:scale-[0.99] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Complete (+25 XP)
            </button>
            <Link
              href="/dashboard"
              className="flex-1 py-3.5 rounded-2xl bg-white border border-slate-200 text-navy-700 font-semibold text-sm hover:border-brand-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Save & Return to Roadmap
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex flex-col items-center gap-3 p-8 bg-emerald-50 rounded-2xl border border-emerald-200 mb-6 w-full">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <p className="font-extrabold text-emerald-800 text-lg">Lesson Complete! 🎉</p>
                <p className="text-emerald-700 text-sm mt-1">You earned +25 XP. Keep the momentum!</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition-all shadow-sm hover:shadow-md"
            >
              Back to Your Roadmap
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Stage 1 notice */}
        <div className="mt-10 p-4 bg-slate-100 rounded-xl text-xs text-slate-500 text-center">
          🚧 <strong>Stage 1:</strong> Lesson content is static sample data. AI-powered adaptive
          lessons with quiz feedback will arrive in Stage 2.
        </div>
      </main>
    </div>
  );
}
