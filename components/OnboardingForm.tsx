'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingFormData, SkillLevel } from '@/lib/types';
import { generateRoadmap, INITIAL_STATS } from '@/lib/mock-data';
import { saveProfile, saveRoadmap, saveStats } from '@/lib/progress';
import { AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const LEVELS: { value: SkillLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: "I'm just getting started" },
  { value: 'intermediate', label: 'Intermediate', description: 'I know the basics already' },
  { value: 'advanced', label: 'Advanced', description: 'I want to go deeper' },
];

const TIME_OPTIONS = [
  { value: 15, label: '15 min / day' },
  { value: 30, label: '30 min / day' },
  { value: 60, label: '1 hour / day' },
  { value: 90, label: '90 min / day' },
];

interface FieldError {
  skill?: string;
  goal?: string;
}

export default function OnboardingForm() {
  const router = useRouter();
  const [form, setForm] = useState<OnboardingFormData>({
    skill: 'Python',
    level: 'beginner',
    goal: '',
    dailyMinutes: 30,
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const next: FieldError = {};
    if (!form.skill.trim()) next.skill = 'Please enter a skill to learn.';
    else if (form.skill.trim().length < 2) next.skill = 'Skill name must be at least 2 characters.';
    if (!form.goal.trim()) next.goal = 'Please describe your learning goal.';
    else if (form.goal.trim().length < 10) next.goal = 'Tell us a bit more about your goal (at least 10 characters).';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate a brief "generating" delay for UX realism
    await new Promise((r) => setTimeout(r, 1200));

    const profile = { ...form, createdAt: new Date().toISOString() };
    const roadmap = generateRoadmap(form.skill, form.level);

    saveProfile(profile);
    saveRoadmap(roadmap);
    saveStats({ ...INITIAL_STATS });

    router.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      {/* Skill */}
      <div>
        <label htmlFor="skill" className="block text-sm font-semibold text-navy-700 mb-1.5">
          What do you want to learn? <span className="text-red-500">*</span>
        </label>
        <input
          id="skill"
          type="text"
          value={form.skill}
          onChange={(e) => {
            setForm({ ...form, skill: e.target.value });
            if (errors.skill) setErrors({ ...errors, skill: undefined });
          }}
          placeholder="e.g. Python, Web Design, Data Analysis…"
          className={cn(
            'w-full px-4 py-3 rounded-xl border text-sm text-navy-800 placeholder:text-slate-400 bg-white outline-none transition-all',
            'focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            errors.skill ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-300'
          )}
        />
        {errors.skill && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.skill}
          </p>
        )}
      </div>

      {/* Level */}
      <div>
        <label className="block text-sm font-semibold text-navy-700 mb-2">
          What&apos;s your current level?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LEVELS.map(({ value, label, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm({ ...form, level: value })}
              className={cn(
                'px-4 py-3 rounded-xl border text-left transition-all text-sm',
                form.level === value
                  ? 'border-brand-500 bg-brand-50 text-brand-800 ring-2 ring-brand-200'
                  : 'border-slate-200 bg-white text-navy-700 hover:border-brand-300 hover:bg-slate-50'
              )}
            >
              <span className="font-semibold block">{label}</span>
              <span className="text-xs text-slate-500">{description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div>
        <label htmlFor="goal" className="block text-sm font-semibold text-navy-700 mb-1.5">
          What&apos;s your learning goal? <span className="text-red-500">*</span>
        </label>
        <textarea
          id="goal"
          rows={3}
          value={form.goal}
          onChange={(e) => {
            setForm({ ...form, goal: e.target.value });
            if (errors.goal) setErrors({ ...errors, goal: undefined });
          }}
          placeholder="e.g. I want to automate my spreadsheet work and land a junior data analyst job."
          className={cn(
            'w-full px-4 py-3 rounded-xl border text-sm text-navy-800 placeholder:text-slate-400 bg-white outline-none resize-none transition-all',
            'focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            errors.goal ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-300'
          )}
        />
        {errors.goal && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.goal}
          </p>
        )}
      </div>

      {/* Daily time */}
      <div>
        <label className="block text-sm font-semibold text-navy-700 mb-2">
          How much time can you study daily?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIME_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm({ ...form, dailyMinutes: value })}
              className={cn(
                'px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-center',
                form.dailyMinutes === value
                  ? 'border-brand-500 bg-brand-50 text-brand-800 ring-2 ring-brand-200'
                  : 'border-slate-200 bg-white text-navy-700 hover:border-brand-300 hover:bg-slate-50'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={cn(
          'w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2',
          loading
            ? 'bg-brand-400 cursor-not-allowed'
            : 'bg-brand-600 hover:bg-brand-700 active:scale-[0.99] shadow-sm hover:shadow-md'
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating your roadmap…
          </>
        ) : (
          <>
            Generate My Roadmap
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
