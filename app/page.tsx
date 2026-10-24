import Link from 'next/link';
import {
  Map,
  BookOpen,
  Zap,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  ChevronRight,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FEATURES = [
  {
    id: 'roadmap',
    Icon: Map,
    title: 'Personalized Roadmaps',
    description:
      'Answer a few questions and get a custom learning path built around your level and goals — not a one-size-fits-all course list.',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'lessons',
    Icon: BookOpen,
    title: 'Guided Lessons',
    description:
      'Bite-sized lessons with clear explanations. Each one builds directly on the last so you always know why you\'re learning it.',
    color: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'feedback',
    Icon: Zap,
    title: 'Adaptive Feedback',
    description:
      'Struggle with a concept? The platform spots it in your quiz results and adjusts your next steps automatically.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'progress',
    Icon: TrendingUp,
    title: 'Visible Progress',
    description:
      'Track XP, streaks, and milestone completions. Every lesson is a win you can see — momentum never stops.',
    color: 'bg-emerald-100 text-emerald-700',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Tell us what you want to learn',
    description: 'Share your skill, current level, and goal in under 2 minutes.',
  },
  {
    step: '02',
    title: 'Get your personal roadmap',
    description: 'Receive a structured path with milestones tailored exactly to you.',
  },
  {
    step: '03',
    title: 'Learn one clear step at a time',
    description: 'Follow guided lessons and quizzes. The platform adapts as you go.',
  },
  {
    step: '04',
    title: 'Track and celebrate progress',
    description: 'Earn XP, maintain streaks, and watch your skills compound daily.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    role: 'CS Student, 2nd Year',
    quote: 'I finally understand Python. The roadmap made it feel achievable — not overwhelming.',
    rating: 5,
  },
  {
    name: 'Marcus T.',
    role: 'Career Switcher',
    quote: "I tried 3 other platforms. SkillPath AI is the first one that actually told me what to do next.",
    rating: 5,
  },
  {
    name: 'Aisha K.',
    role: 'Self-Learner',
    quote: 'The adaptive feedback caught exactly where I was getting confused. Game-changer.',
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-cream pt-16 pb-24 px-6">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-100/60 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold mb-6 border border-brand-200">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            AI-Powered Learning Platform · Stage 1
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-navy-900 leading-tight tracking-tight mb-6">
            Learn anything.{' '}
            <span className="relative inline-block">
              <span className="text-gradient">One clear step</span>
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full opacity-40" />
            </span>{' '}
            at a time.
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            SkillPath AI builds a personalized learning roadmap around your skill level and goals.
            No more information overload — just your next clear step, every single day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-600 text-white font-bold text-base hover:bg-brand-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
            >
              Start Learning Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border border-slate-200 text-navy-700 font-semibold text-base hover:border-brand-300 hover:bg-slate-50 transition-all"
            >
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              No account required
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Free for Stage 1
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Works on mobile and desktop
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="section-pad bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
              Why SkillPath AI
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-900">
              Everything you need to actually make progress
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">
              Most learners quit because they feel lost. SkillPath AI solves that with structure,
              guidance, and visible momentum.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ id, Icon, title, description, color }) => (
              <div
                key={id}
                className="card p-6 hover:shadow-card-hover transition-shadow duration-200 group"
              >
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-navy-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="section-pad bg-cream">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-900">
              From zero to momentum in minutes
            </h2>
          </div>

          <div className="space-y-6">
            {HOW_IT_WORKS.map(({ step, title, description }, i) => (
              <div
                key={step}
                className="flex items-start gap-6 card p-6 hover:shadow-card-hover transition-shadow duration-200"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-mono font-bold text-sm">
                  {step}
                </div>
                <div>
                  <h3 className="font-bold text-navy-800 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500">{description}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-slate-300 self-center ml-auto flex-shrink-0 hidden md:block" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-600 text-white font-bold text-base hover:bg-brand-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
            >
              Build My Roadmap Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="section-pad bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-900">
              Learners love the clarity
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, quote, rating }) => (
              <div key={name} className="card p-6">
                <div className="flex mb-3">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">&ldquo;{quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-navy-800">{name}</p>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-br from-brand-700 via-brand-600 to-violet-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Your next step is always clear.
          </h2>
          <p className="text-brand-200 mb-8 text-lg">
            Stop wondering what to learn next. Get your personalized roadmap in under 2 minutes.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-700 font-bold text-base hover:bg-brand-50 active:scale-[0.98] transition-all shadow-lg"
          >
            Start Learning — It&apos;s Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
