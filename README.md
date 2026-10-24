# SkillPath AI 🎯

> **"Your next step is always clear."**

An AI-powered personalized learning platform for students and self-learners.  
Built for the hackathon — Member 1 has implemented the complete frontend, interactive user experience, diagnostic assessment wizard, and integration readiness.

---

## ✨ Features

| Page | Route | What it does |
|------|-------|-------------|
| **Landing** | `/` | Hero, feature highlights, how-it-works, testimonials, fast CTAs |
| **Onboarding** | `/onboarding` | Skill, level, goal & daily study time form with validation |
| **Diagnostic Assessment** | `/assessment` | 5-step wizard with skill selection, goals, proficiency, interactive diagnostic quiz, instant readiness score, and identified weak topics breakdown |
| **Dashboard** | `/dashboard` | Learner profile, goal overview, overall progress, Continue Learning hero, daily quests, weekly heatmap, XP/streak stats, badges showcase, reusable roadmap view, and recent activity timeline |
| **Interactive Lesson** | `/lesson` | Learning objectives, concept explanations, formatted code snippets with copy button & output preview, interactive practice questions with instant explanation/hint feedback, and "Mark as Complete" progression flow with XP/badge awarding |

### Key Capabilities
- ✅ **Personalized Python & Multi-Skill Curriculum**: 5 modular milestones with sequential prerequisites.
- ✅ **Diagnostic Assessment Engine Readiness**: Interactive assessment with multiple-choice questions, scored readiness percent, strengths identification, and prioritized weak topic recommendations.
- ✅ **Full Progression & Gamification**: XP earning, day streaks, daily tasks checklist, weekly study minutes tracker, and unlockable achievement badges.
- ✅ **Client-side Persistence**: Full localStorage state management (`lib/progress.ts`) with zero sensitive data or secrets stored.
- ✅ **Reusable Roadmap Component**: `RoadmapView` with module accordions, lesson status indicators, prerequisites, and "Up Next" spotlights.
- ✅ **Member 2 Integration Ready**: Documented data contracts in `docs/data-interfaces.md` and decoupled scoring adapter in `lib/assessment.ts`.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **npm** (bundled with Node.js)

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start
```

---

## 🗂 Project Structure

```
skillpath-ai/
├── app/
│   ├── layout.tsx          # Root layout with Inter font & metadata
│   ├── globals.css         # Tailwind directives + design system tokens
│   ├── page.tsx            # Marketing landing page with assessment & onboarding CTAs
│   ├── onboarding/
│   │   └── page.tsx        # Quick start onboarding form
│   ├── assessment/
│   │   └── page.tsx        # 5-step diagnostic assessment & weak topics wizard
│   ├── dashboard/
│   │   └── page.tsx        # Complete learner dashboard with profile, stats, tabs & feed
│   └── lesson/
│       └── page.tsx        # Interactive lesson screen with code, quiz & completion
│
├── components/
│   ├── Navbar.tsx          # Responsive sticky navigation with dashboard & assessment links
│   ├── Footer.tsx          # Hackathon footer
│   ├── OnboardingForm.tsx  # Multi-field form with validation
│   ├── MilestoneCard.tsx   # Legacy single milestone card component
│   ├── StatCard.tsx        # Reusable metric card (XP, Streak, Lessons)
│   ├── ProgressBar.tsx     # Accessible progress bar
│   ├── roadmap/
│   │   └── RoadmapView.tsx # Reusable curriculum roadmap component with lesson details
│   └── dashboard/
│       ├── LearnerProfileCard.tsx  # Profile header with active target & level
│       ├── DailyTasksWidget.tsx    # Daily quests with XP incentives
│       ├── WeeklyActivityWidget.tsx# 7-day study time heatmap
│       ├── BadgesWidget.tsx        # Achievement badges in unlocked/locked states
│       └── RecentActivityWidget.tsx# Study event timeline
│
├── docs/
│   └── data-interfaces.md  # Shared JSON data contracts & integration instructions for Member 2
│
├── lib/
│   ├── types.ts            # TypeScript definitions (Profile, Roadmap, Assessment, Gamification)
│   ├── mock-data.ts        # Curriculum milestones, diagnostic questions, & detailed lessons
│   ├── assessment.ts       # Decoupled assessment evaluation adapter for Member 2
│   ├── progress.ts         # localStorage persistence, lesson completion engine, & calculations
│   └── utils.ts            # cn() class utility
│
├── tailwind.config.js      # Brand colors, typography, and shadow tokens
└── package.json
```

---

## 🤝 Integration Instructions for Member 2

1. **Diagnostic Scoring Engine:**
   - Plug your algorithmic or ML diagnostic evaluator directly into `evaluateAssessment` in `lib/assessment.ts` (or point it to an API route `POST /api/assessment/evaluate`).
   - The UI automatically renders your evaluated level, score, strengths, and weak topics without needing UI changes.

2. **Personalized Roadmap Generator:**
   - Plug your roadmap generation engine into `generateRoadmap` in `lib/mock-data.ts` (or point to `POST /api/roadmap/generate`).
   - The UI consumes the `Roadmap` and `Milestone` schemas documented in `docs/data-interfaces.md`.

---

MIT License · Built with ❤️ for the hackathon
