import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowLeft, Sparkles } from 'lucide-react';
import OnboardingForm from '@/components/OnboardingForm';

export const metadata: Metadata = {
  title: 'Get Started — SkillPath AI',
  description: 'Tell us what you want to learn and get your personalized roadmap in under 2 minutes.',
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Minimal header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/60 bg-cream/90 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center group-hover:bg-brand-700 transition-colors">
            <BookOpen className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-navy-800 text-base">
            SkillPath <span className="text-brand-600">AI</span>
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-navy-700 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center py-12 px-6">
        <div className="w-full max-w-xl">
          {/* Page header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Takes less than 2 minutes
            </div>
            <h1 className="text-3xl font-extrabold text-navy-900 mb-2">
              Build your learning roadmap
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Answer a few questions and we&apos;ll generate a step-by-step path
              tailored to your skill level and goal.
            </p>
          </div>

          {/* Form card */}
          <div className="card p-7">
            <OnboardingForm />
          </div>

          {/* Reassurance */}
          <p className="mt-5 text-center text-xs text-slate-400">
            No account required · All data stays on your device · Completely free
          </p>
        </div>
      </main>
    </div>
  );
}
