'use client';

import Link from 'next/link';
import { BookOpen, Sparkles, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-navy-800 text-lg tracking-tight">
            SkillPath <span className="text-brand-600">AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-navy-600 font-medium">
          <Link href="/dashboard" className="hover:text-navy-900 transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <Link href="/assessment" className="hover:text-navy-900 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Skill Assessment
          </Link>
          <Link href="/#features" className="hover:text-navy-900 transition-colors">Features</Link>
          <Link href="/#how-it-works" className="hover:text-navy-900 transition-colors">How it works</Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Learner View
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
