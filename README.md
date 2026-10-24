# SkillPath AI 🎯

> **"Your next step is always clear."**

An AI-powered personalized learning platform for students and self-learners.  
Built as a hackathon project — Stage 1 ships the complete frontend foundation with sample data.

---

## ✨ Features (Stage 1)

| Page | What it does |
|------|-------------|
| **Landing** `/` | Hero, feature highlights, how-it-works, testimonials, CTA |
| **Onboarding** `/onboarding` | Skill, level, goal & time form with validation |
| **Dashboard** `/dashboard` | Progress overview, stats, roadmap milestones, next-action |
| **Lesson** `/lesson` | Sample lesson content, code blocks, completion flow |

- ✅ Personalized Python learning roadmap (5 milestones)
- ✅ Locked / available / in-progress / completed milestone states
- ✅ XP, streak, and lesson-count stats
- ✅ localStorage persistence (refresh-safe)
- ✅ Fully responsive (mobile + desktop)
- ✅ No authentication, no database, no API keys required

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** — download from [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)

### Setup & Run

```bash
# 1. Navigate to the project directory
cd skillpath-ai

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
open http://localhost:3000
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
│   ├── layout.tsx          # Root layout with font & metadata
│   ├── globals.css         # Tailwind directives + design utilities
│   ├── page.tsx            # Landing page
│   ├── onboarding/
│   │   └── page.tsx        # Onboarding form page
│   ├── dashboard/
│   │   └── page.tsx        # Learner dashboard
│   └── lesson/
│       └── page.tsx        # Placeholder lesson page
│
├── components/
│   ├── Navbar.tsx          # Sticky navigation
│   ├── Footer.tsx          # Professional footer
│   ├── OnboardingForm.tsx  # Multi-field form with validation
│   ├── MilestoneCard.tsx   # Roadmap milestone with status states
│   ├── StatCard.tsx        # XP / streak / lesson stat widget
│   └── ProgressBar.tsx     # Accessible progress bar
│
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── mock-data.ts        # Sample Python roadmap + feature data
│   ├── progress.ts         # localStorage persistence + calculations
│   └── utils.ts            # cn() className utility
│
├── tailwind.config.js      # Brand color palette + design tokens
├── next.config.js
├── tsconfig.json
└── package.json
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

## 🗺 Roadmap

### Stage 1 (current) — Frontend Foundation
- [x] Landing page with full marketing sections
- [x] Onboarding form with validation
- [x] Dashboard with roadmap milestones
- [x] Lesson placeholder page
- [x] localStorage persistence

### Stage 2 — AI Integration
- [ ] Gemini API for roadmap generation
- [ ] AI-powered lesson content
- [ ] Quiz with adaptive feedback
- [ ] Personalized difficulty adjustment

### Stage 3 — Advanced Features
- [ ] User accounts & cloud sync
- [ ] Spaced repetition reminders
- [ ] Progress analytics
- [ ] Community features

---

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript 5**
- **Tailwind CSS 3**
- **Lucide React** (icons)
- **No external state management** — React `useState` + localStorage

---

## 📝 Notes for Judges

- Stage 1 uses **entirely static/sample data** — no AI API calls
- The codebase is **structured for easy Gemini integration** in Stage 2
- All components are **reusable and typed** — ready to wire up to real data
- localStorage is accessed **only on the client** (SSR-safe)

---

MIT License · Built with ❤️ for the hackathon
