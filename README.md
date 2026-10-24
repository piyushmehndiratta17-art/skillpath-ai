# SkillPath AI 🚀

> **"Your next step is always clear."**

An AI-powered personalized learning platform for students and self-learners.  
Built as a hackathon project — Stage 1 shipped the frontend foundation; Stage 2 implements the **Skill Assessment Engine** and **Personalized Roadmap Generator**.

---

## 🎯 Features

| Page / Module | What it does |
|---------------|-------------|
| **Landing** `/` | Hero, feature highlights, how-it-works, testimonials, CTA |
| **Onboarding** `/onboarding` | Skill, level, goal & time form with validation |
| **Dashboard** `/dashboard` | Progress overview, stats, roadmap milestones, next-action banner |
| **Lesson** `/lesson` | Sample lesson content, code blocks, completion flow |
| **Assessment Engine** (`lib/assessment/`) | Multi-choice diagnostic assessments for JavaScript, Python, Java & DSA; scoring, weak-topic detection, proficiency estimation |
| **Roadmap Generator** (`lib/roadmap/`) | Deterministic personalized curriculum generation strictly organized in prerequisite order with practice tasks, checkpoint quizzes, and reinforcement for weak topics |

- ⚡ 100% deterministic fallback behavior without requiring paid AI API tokens
- 🧭 Strict prerequisite verification, cycle detection, and topological sorting
- 🎯 Automatic weak-topic reinforcement tagging (🎯) and boosted XP
- 📊 Topic-by-topic diagnostic breakdown and proficiency estimation
- 💾 localStorage persistence (refresh-safe, SSR-safe)
- 🧪 Fully tested with automated test suites (`npm test`)

---

## ⚡ Quick Start

### Prerequisites

- **Node.js 18+** — download from [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)

### Setup & Run

```bash
# 1. Navigate to the project directory
cd skillpath-ai

# 2. Install dependencies
npm install

# 3. Run automated tests
npm test

# 4. Start the development server
npm run dev

# 5. Open in browser
open http://localhost:3000
```

### Production Build & Linting

```bash
npm run lint
npm run build
npm run start
```

---

## 📁 Project Structure

```
skillpath-ai/
├── app/
│   ├── layout.tsx              # Root layout with font & metadata
│   ├── globals.css             # Tailwind directives + design utilities
│   ├── page.tsx                # Landing page
│   ├── onboarding/page.tsx     # Onboarding form page
│   ├── dashboard/page.tsx      # Learner dashboard
│   └── lesson/page.tsx         # Lesson page
│
├── components/
│   ├── Navbar.tsx              # Sticky navigation
│   ├── Footer.tsx              # Professional footer
│   ├── OnboardingForm.tsx      # Multi-field form with validation
│   ├── MilestoneCard.tsx       # Roadmap milestone with status states
│   ├── StatCard.tsx            # XP / streak / lesson stat widget
│   └── ProgressBar.tsx         # Accessible progress bar
│
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── mock-data.ts            # Base roadmap & feature data
│   ├── progress.ts             # localStorage persistence & calculations
│   ├── utils.ts                # cn() className utility
│   ├── assessment/             # 🧠 Skill Assessment Engine
│   │   ├── types.ts            # Assessment schemas & scoring interfaces
│   │   ├── questions.ts        # 40+ MCQ bank (JS, Python, Java, DSA)
│   │   ├── scoring.ts          # Scoring, weak topics & proficiency calculation
│   │   └── index.ts
│   └── roadmap/                # 🗺️ Personalized Roadmap Generator
│       ├── types.ts            # Extended milestone & lesson interfaces
│       ├── prerequisites.ts    # Prerequisite validation & topological sort
│       ├── catalog.ts          # Curated tracks & custom skill fallback dispatcher
│       ├── generator.ts        # Deterministic personalized roadmap generator
│       ├── recommendation.ts   # Next-lesson recommendation engine
│       ├── index.ts
│       └── tracks/             # Curated tracks (JS, Python, Java, DSA, custom)
│
├── docs/examples/              # 📋 Documented JSON Schemas & Fixtures
│   ├── README.md               # Schema explanation guide
│   ├── questions.example.json  # Diagnostic question bank fixtures
│   ├── answers.example.json    # Map & array student answer submissions
│   ├── results.example.json    # Scoring & weak topic breakdown output
│   ├── roadmap.example.json    # Complete personalized roadmap payload
│   ├── progress.example.json   # Learner progress & stats snapshot
│   └── recommendations.example.json # Recommended next lesson payload
│
├── tests/                      # 🧪 Automated Test Suite
│   ├── assessment-scoring.test.ts  # Scoring, weak topics, missing answers, edge cases
│   ├── roadmap-generator.test.ts   # Roadmap generation, prerequisites, pacing
│   └── recommendation.test.ts      # Recommendation engine & weak topic priority
│
├── MEMBER1_INTEGRATION_GUIDE.md # 🤝 Integration instructions for Member 1
├── package.json
└── tsconfig.json
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#faf9f6` (warm off-white) |
| Primary text | Navy (`#1e2d4a`) |
| Accent | Violet-600 (`#7c3aed`) |
| Border radius | `rounded-2xl` (1rem) |
| Card shadow | `0 1px 3px rgba(0,0,0,0.06)` |

---

## 🗺️ Roadmap & Progress

### Stage 1 — Frontend Foundation
- [x] Landing page with full marketing sections
- [x] Onboarding form with validation
- [x] Dashboard with roadmap milestones
- [x] Lesson placeholder page
- [x] localStorage persistence

### Stage 2 — Assessment & Deterministic Roadmap Engine (Current)
- [x] Skill assessment engine for JavaScript, Python, Java, and DSA
- [x] MCQ question bank with explanations and difficulty tiers
- [x] Resilient scoring with weak-topic detection and proficiency estimation
- [x] Deterministic roadmap generator organized in strict prerequisite order
- [x] Practice tasks with starter code and checkpoint quizzes per milestone
- [x] Weak-topic reinforcement curriculum injection
- [x] Intelligent next-lesson recommendation engine
- [x] Documented JSON examples and fixtures (`docs/examples/`)
- [x] Comprehensive automated test suites (19 tests passing in <500ms)
- [x] Member 1 frontend integration guide (`MEMBER1_INTEGRATION_GUIDE.md`)

### Stage 3 — Advanced Features & AI Cloud Integration
- [ ] Gemini API integration for dynamic conversational feedback
- [ ] Adaptive in-lesson hints
- [ ] User accounts & cloud sync
- [ ] Spaced repetition reminders
- [ ] Progress analytics

---

## ⚖️ Notes for Judges & Evaluators

- **Zero API Key Dependency**: Runs 100% offline and reliably with deterministic fallback algorithms.
- **Topological Prerequisite Soundness**: Guaranteed prerequisite ordering with automated cycle detection.
- **Modular & Tested**: Fully decoupled from UI layer, tested with 19 comprehensive unit tests via `npm test`.
- **Plug-and-Play Frontend Compatibility**: Generated roadmaps seamlessly conform to existing frontend data types.

---

MIT License • Built with ❤️ for the hackathon