'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award,
  AlertCircle,
  HelpCircle,
  Clock,
  Target,
  BarChart2,
  Check,
  ChevronRight,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { SkillLevel, AssessmentResult, DiagnosticQuestion } from '@/lib/types';
import { getDiagnosticQuestionsForSkill, evaluateAssessment } from '@/lib/assessment';
import { generateRoadmap, INITIAL_STATS } from '@/lib/mock-data';
import { saveProfile, saveRoadmap, saveStats, saveAssessmentResult } from '@/lib/progress';
import { cn } from '@/lib/utils';
import ProgressBar from '@/components/ProgressBar';

const POPULAR_SKILLS = [
  'Python',
  'JavaScript',
  'React',
  'Data Science & Analytics',
  'Machine Learning',
  'Cloud & DevOps',
];

const GOAL_OPTIONS = [
  { id: 'career', label: 'Land a job / Career transition', description: 'Focus on portfolio projects, clean coding, and interview prep' },
  { id: 'projects', label: 'Build my own software projects', description: 'Learn end-to-end practical architecture from scratch' },
  { id: 'automation', label: 'Automate daily workflows & tasks', description: 'Scripts, data manipulation, APIs, and tooling' },
  { id: 'academic', label: 'Excel in academic / coursework', description: 'Master deep concepts, algorithms, and theory' },
];

const PROFICIENCY_OPTIONS: { value: SkillLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Starting fresh with little to no prior coding experience' },
  { value: 'intermediate', label: 'Intermediate', description: 'Comfortable with variables, basic logic, and syntax' },
  { value: 'advanced', label: 'Advanced', description: 'Experienced with functions, projects, and ready for optimization' },
];

const TIME_OPTIONS = [
  { value: 15, label: '15 min / day' },
  { value: 30, label: '30 min / day' },
  { value: 60, label: '1 hour / day' },
  { value: 90, label: '90 min / day' },
];

export default function AssessmentPage() {
  const router = useRouter();

  // Wizard state: 1: Skill, 2: Goal & Time, 3: Proficiency, 4: Diagnostic Quiz, 5: Results
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form selections
  const [skill, setSkill] = useState('Python');
  const [customSkill, setCustomSkill] = useState('');
  const [goal, setGoal] = useState(GOAL_OPTIONS[0].label);
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [proficiency, setProficiency] = useState<SkillLevel>('beginner');

  // Diagnostic Quiz
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // Assessment results
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const selectedSkill = customSkill.trim() ? customSkill.trim() : skill;

  // Handler to start diagnostic questions
  const handleProceedToQuiz = () => {
    const qList = getDiagnosticQuestionsForSkill(selectedSkill, proficiency);
    setQuestions(qList);
    setAnswers({});
    setCurrentQuestionIdx(0);
    setStep(4);
  };

  // Handler for question option select
  const handleSelectAnswer = (qId: string, optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  // Submit diagnostic quiz to adapter
  const handleSubmitQuiz = async () => {
    setIsEvaluating(true);
    try {
      const evalResult = await evaluateAssessment({
        skill: selectedSkill,
        goal,
        proficiency,
        dailyMinutes,
        answers,
      });
      setResult(evalResult);
      saveAssessmentResult(evalResult);
      setStep(5);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Apply Assessment and Generate Roadmap
  const handleApplyRoadmap = () => {
    const profile = {
      skill: selectedSkill,
      level: result?.evaluatedLevel ?? proficiency,
      goal,
      dailyMinutes,
      createdAt: new Date().toISOString(),
    };

    const roadmap = generateRoadmap(selectedSkill, profile.level);

    // If assessment identified strong proficiency, skip milestone 1 or mark it
    if (result && result.recommendedStartingMilestoneId === 'm2' && roadmap.milestones.length > 1) {
      roadmap.milestones[0].status = 'completed';
      roadmap.milestones[0].lessons.forEach((l) => (l.completed = true));
      roadmap.milestones[1].status = 'in_progress';
    }

    saveProfile(profile);
    saveRoadmap(roadmap);
    saveStats({ ...INITIAL_STATS });

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/60 bg-cream/90 backdrop-blur-sm sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-navy-900 text-base">
            SkillPath <span className="text-brand-600">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <span>Step {step} of 5</span>
          <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-start justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-2xl space-y-6">
          {/* STEP 1: Skill Selection */}
          {step === 1 && (
            <div className="card p-6 sm:p-8 space-y-6 shadow-card">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-700">
                  Step 1: Skill Focus
                </span>
                <h1 className="text-2xl font-black text-navy-900 mt-2">
                  What skill or technology do you want to master?
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Choose a popular learning track or enter your own custom domain.
                </p>
              </div>

              {/* Popular Skill Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {POPULAR_SKILLS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setSkill(item);
                      setCustomSkill('');
                    }}
                    className={cn(
                      'p-3.5 rounded-xl border text-xs font-bold text-left transition-all',
                      skill === item && !customSkill
                        ? 'border-brand-500 bg-brand-50 text-brand-800 ring-2 ring-brand-200 shadow-sm'
                        : 'border-slate-200 bg-white text-navy-700 hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Custom skill text box */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Or specify custom topic / framework
                </label>
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="e.g. TypeScript, Flutter, SQL, Next.js…"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-navy-800 placeholder:text-slate-400 bg-white outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!selectedSkill}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition-colors shadow-sm"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Goal & Daily Time */}
          {step === 2 && (
            <div className="card p-6 sm:p-8 space-y-6 shadow-card">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-700">
                  Step 2: Goals & Schedule
                </span>
                <h1 className="text-2xl font-black text-navy-900 mt-2">
                  What is your primary goal and daily commitment?
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  We use this to pace your roadmap and recommend appropriate capstones.
                </p>
              </div>

              {/* Goal options */}
              <div className="space-y-3">
                {GOAL_OPTIONS.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setGoal(g.label)}
                    className={cn(
                      'p-4 rounded-xl border cursor-pointer transition-all',
                      goal === g.label
                        ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    )}
                  >
                    <p className="font-bold text-sm text-navy-900">{g.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{g.description}</p>
                  </div>
                ))}
              </div>

              {/* Daily study time */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Daily study availability
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TIME_OPTIONS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setDailyMinutes(t.value)}
                      className={cn(
                        'p-3 rounded-xl border text-xs font-bold transition-all',
                        dailyMinutes === t.value
                          ? 'border-brand-500 bg-brand-50 text-brand-800 ring-2 ring-brand-200'
                          : 'border-slate-200 bg-white text-navy-700 hover:bg-slate-50'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-navy-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition-colors shadow-sm"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Self-Reported Proficiency */}
          {step === 3 && (
            <div className="card p-6 sm:p-8 space-y-6 shadow-card">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-700">
                  Step 3: Self-Proficiency
                </span>
                <h1 className="text-2xl font-black text-navy-900 mt-2">
                  How would you describe your current experience with {selectedSkill}?
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Next, we&apos;ll run a quick diagnostic check to calibrate your weak spots.
                </p>
              </div>

              <div className="space-y-3">
                {PROFICIENCY_OPTIONS.map((p) => (
                  <div
                    key={p.value}
                    onClick={() => setProficiency(p.value)}
                    className={cn(
                      'p-4 rounded-xl border cursor-pointer transition-all',
                      proficiency === p.value
                        ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-navy-900">{p.label}</p>
                      {proficiency === p.value && (
                        <Check className="w-4 h-4 text-brand-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-navy-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleProceedToQuiz}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition-colors shadow-sm"
                >
                  Start Diagnostic Questions
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Diagnostic Questions */}
          {step === 4 && questions.length > 0 && (
            <div className="card p-6 sm:p-8 space-y-6 shadow-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    Diagnostic Challenge
                  </span>
                  <h2 className="text-lg font-bold text-navy-900 mt-1">
                    Question {currentQuestionIdx + 1} of {questions.length}
                  </h2>
                </div>

                <div className="flex gap-1.5">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentQuestionIdx(i)}
                      title={`Go to question ${i + 1}`}
                      className={cn(
                        'w-7 h-2 rounded-full transition-all cursor-pointer',
                        i === currentQuestionIdx
                          ? 'bg-brand-600 ring-2 ring-brand-300'
                          : answers[questions[i]?.id] !== undefined
                          ? 'bg-emerald-400 hover:bg-emerald-500'
                          : 'bg-slate-200 hover:bg-slate-300'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Current Question */}
              {questions[currentQuestionIdx] && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold">
                      Topic: {questions[currentQuestionIdx].topic}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-navy-900 leading-relaxed">
                    {questions[currentQuestionIdx].question}
                  </p>

                  {questions[currentQuestionIdx].codeSnippet && (
                    <pre className="p-4 rounded-xl bg-navy-900 text-emerald-300 font-mono text-xs overflow-x-auto">
                      <code>{questions[currentQuestionIdx].codeSnippet}</code>
                    </pre>
                  )}

                  {/* Options */}
                  <div className="space-y-2.5 pt-2">
                    {questions[currentQuestionIdx].options.map((opt, optIdx) => {
                      const isSelected =
                        answers[questions[currentQuestionIdx].id] === optIdx;

                      return (
                        <div
                          key={optIdx}
                          onClick={() =>
                            handleSelectAnswer(questions[currentQuestionIdx].id, optIdx)
                          }
                          className={cn(
                            'p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer flex items-center gap-3 transition-all',
                            isSelected
                              ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-200 font-semibold'
                              : 'border-slate-200 bg-white text-navy-800 hover:border-slate-300 hover:bg-slate-50'
                          )}
                        >
                          <div
                            className={cn(
                              'w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 text-[10px] font-bold',
                              isSelected
                                ? 'border-brand-600 bg-brand-600 text-white'
                                : 'border-slate-300 text-slate-500'
                            )}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pagination within questions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 disabled:opacity-40"
                >
                  Previous
                </button>

                {currentQuestionIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                    disabled={answers[questions[currentQuestionIdx]?.id] === undefined}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 disabled:opacity-50"
                  >
                    Next Question
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={isEvaluating || Object.keys(answers).length < questions.length}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 shadow-sm"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Evaluating Responses…
                      </>
                    ) : (
                      <>
                        Submit & View Diagnostic
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Assessment Results & Weak Topics */}
          {step === 5 && result && (
            <div className="card p-6 sm:p-8 space-y-6 shadow-card">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <Award className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-black text-navy-900">Diagnostic Assessment Complete</h1>
                <p className="text-xs text-slate-500">
                  Here is our AI readiness evaluation for your {selectedSkill} learning path.
                </p>
              </div>

              {/* Score & Level Matrix */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-center">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Diagnostic Score</p>
                  <p className="text-3xl font-black text-brand-600 mt-1">{result.scorePercent}%</p>
                </div>
                <div className="text-center border-l border-slate-200 pl-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Calibrated Level</p>
                  <p className="text-xl font-black text-navy-900 mt-1 capitalize">{result.evaluatedLevel}</p>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Identified Strengths
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.strengths.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weak Topics & Recommendations */}
              <div>
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Target Areas & Weak Topics to Reinforce
                </h3>
                <div className="space-y-2.5">
                  {result.weakTopics.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-navy-900">{item.topic}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900">
                          {item.priority} Priority
                        </span>
                      </div>
                      <p className="text-slate-600">{item.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 text-xs text-brand-900 font-medium">
                <strong>Recommended Starting Point:</strong> Based on your diagnostics, your roadmap will start at{' '}
                <strong>Module {result.recommendedStartingMilestoneId === 'm2' ? '2 (Variables & Data Structures)' : '1 (Core Fundamentals)'}</strong>{' '}
                to ensure solid foundations without unnecessary repetition.
              </div>

              {/* CTA */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleApplyRoadmap}
                  className="flex-1 py-3.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  Apply & Launch Personalized Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setAnswers({});
                  }}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retake
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
