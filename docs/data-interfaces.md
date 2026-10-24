# SkillPath AI — Data Interfaces & Integration Contract 🎯
**Document Version:** 1.0.0  
**Authors:** Member 1 (Frontend & UX) & Member 2 (Assessment Engine & Roadmap Generator)  

---

## 1. Overview & Architecture

SkillPath AI divides responsibilities between two core tracks:
- **Member 1 (Frontend, UX, & Integration Readiness):** Responsive dashboard, interactive lesson screens, assessment wizard, gamification widgets (XP, streaks, badges, weekly heatmap), and client-side persistence.
- **Member 2 (Skill Assessment Engine & Personalized Roadmap Generator):** Algorithmic diagnosis of learner knowledge gaps, adaptive question selection, and generation of dynamic milestone roadmaps.

To ensure seamless integration without code conflicts, this document specifies the **shared JSON data contracts**, **TypeScript interfaces**, and **mock endpoints**.

---

## 2. Shared Data Contracts

### 2.1 Learner Profile & Onboarding Payload
Captured during onboarding or updated from the learner profile view.

```typescript
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LearnerProfile {
  skill: string;             // e.g. "Python", "JavaScript", "React"
  level: SkillLevel;         // self-reported or assessment-calibrated
  goal: string;              // e.g. "Land a Junior Data Analyst job"
  dailyMinutes: number;      // e.g. 15, 30, 60, 90
  createdAt: string;         // ISO 8601 timestamp
  name?: string;             // e.g. "Alex Morgan"
  avatarUrl?: string;
  targetRole?: string;
}
```

#### Sample JSON:
```json
{
  "skill": "Python",
  "level": "beginner",
  "goal": "Automate spreadsheet workflows and build data tools",
  "dailyMinutes": 30,
  "createdAt": "2026-10-24T06:00:00.000Z",
  "name": "Alex Morgan"
}
```

---

### 2.2 Diagnostic Assessment Contracts

Member 2 powers the question bank and scoring algorithm. The frontend delegates scoring to `lib/assessment.ts`.

#### Question Model
```typescript
export interface DiagnosticQuestion {
  id: string;                    // unique question identifier
  question: string;              // Markdown/plaintext prompt
  codeSnippet?: string;          // optional executable/syntax block
  options: string[];             // 4 multiple-choice choices
  correctOptionIndex: number;    // 0-3
  explanation: string;           // explanation revealed on review/completion
  topic: string;                 // e.g. "Variables & Arithmetic", "Scope", "Loops"
}

export interface DiagnosticQuiz {
  skill: string;
  level: SkillLevel;
  questions: DiagnosticQuestion[];
}
```

#### Assessment Submission Payload (Frontend -> Engine)
```typescript
export interface AssessmentSubmission {
  skill: string;
  goal: string;
  proficiency: SkillLevel;
  dailyMinutes: number;
  answers: Record<string, number>; // questionId -> selectedOptionIndex (0-3)
}
```

#### Assessment Result Payload (Engine -> Frontend)
```typescript
export interface WeakTopic {
  topic: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AssessmentResult {
  id: string;
  skill: string;
  goal: string;
  dailyMinutes: number;
  selfReportedLevel: SkillLevel;
  scorePercent: number;                        // 0 - 100
  evaluatedLevel: SkillLevel;                  // calibrated proficiency
  strengths: string[];                         // validated topics
  weakTopics: WeakTopic[];                     // identified gaps with remediation
  recommendedStartingMilestoneId: string;      // e.g. "m1" or "m2"
  completedAt: string;                         // ISO 8601
}
```

#### Sample Evaluation Result JSON:
```json
{
  "id": "assess-1730000000",
  "skill": "Python",
  "goal": "Career Transition to Backend Engineering",
  "dailyMinutes": 30,
  "selfReportedLevel": "beginner",
  "scorePercent": 75,
  "evaluatedLevel": "intermediate",
  "strengths": [
    "Variables & Arithmetic",
    "Data Types & Mutability",
    "Loops & Control Flow"
  ],
  "weakTopics": [
    {
      "topic": "Functions & Return Values",
      "recommendation": "Review default return behaviors (None) and local variable scope.",
      "priority": "high"
    }
  ],
  "recommendedStartingMilestoneId": "m2",
  "completedAt": "2026-10-24T06:15:00.000Z"
}
```

---

### 2.3 Personalized Roadmap & Milestone Contracts

Member 2 generates the sequence of milestones and lessons.

```typescript
export type MilestoneStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'reading' | 'video' | 'quiz' | 'project';
  completed: boolean;
  xpReward?: number;
  prerequisites?: string[];
  description?: string;
}

export interface Milestone {
  id: string;
  order: number;
  title: string;
  description: string;
  estimatedHours: number;
  status: MilestoneStatus;
  lessons: Lesson[];
  xpReward: number;
  prerequisites?: string[];   // e.g. ["Python Fundamentals"]
}

export interface Roadmap {
  id: string;
  skill: string;
  level: SkillLevel;
  milestones: Milestone[];
  totalEstimatedHours: number;
  generatedAt?: string;
}
```

#### Sample Roadmap JSON:
```json
{
  "id": "roadmap-py-01",
  "skill": "Python",
  "level": "beginner",
  "totalEstimatedHours": 19,
  "milestones": [
    {
      "id": "m1",
      "order": 1,
      "title": "Python Fundamentals",
      "description": "Environment setup, running scripts, interpreter and bytecode.",
      "estimatedHours": 3,
      "status": "in_progress",
      "xpReward": 100,
      "prerequisites": ["None"],
      "lessons": [
        {
          "id": "l1-1",
          "title": "Installing Python & VS Code",
          "durationMinutes": 20,
          "type": "reading",
          "completed": true,
          "xpReward": 25
        },
        {
          "id": "l1-3",
          "title": "How the Python Interpreter Works",
          "durationMinutes": 15,
          "type": "video",
          "completed": false,
          "xpReward": 25
        }
      ]
    }
  ]
}
```

---

### 2.4 Lesson Content & Practice Questions Contract

```typescript
export interface LessonPracticeQuestion {
  id: string;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
}

export interface LessonSection {
  id: string;
  type: 'concept' | 'code' | 'tip' | 'warning';
  title: string;
  body: string;
  code?: string;
  language?: string;
}

export interface DetailedLessonContent {
  id: string;
  title: string;
  milestoneId: string;
  milestoneTitle: string;
  order: number;
  durationMinutes: number;
  xpReward: number;
  type: 'reading' | 'video' | 'quiz' | 'project';
  objective: string;
  sections: LessonSection[];
  keyTakeaways: string[];
  practiceQuestions: LessonPracticeQuestion[];
}
```

---

### 2.5 Gamification, Progress, & Activity Persistence

Stored in `localStorage` under `skillpath_state`.

```typescript
export interface LearnerStats {
  xp: number;
  streakDays: number;
  lessonsCompleted: number;
  hoursLearned: number;
  currentMilestoneIndex: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'xp' | 'milestone' | 'quiz' | 'special';
}

export interface DailyTask {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  icon: string;
}

export interface ActivityDay {
  day: string;             // "Mon", "Tue", etc.
  date: string;            // "Oct 24"
  minutes: number;
  completed: boolean;
  isToday?: boolean;
}

export interface RecentActivity {
  id: string;
  type: 'lesson_completed' | 'badge_unlocked' | 'streak_milestone' | 'assessment_completed';
  title: string;
  description: string;
  timestamp: string;
  xpEarned?: number;
}

export interface AppState {
  profile: LearnerProfile | null;
  roadmap: Roadmap | null;
  stats: LearnerStats;
  badges?: Badge[];
  dailyTasks?: DailyTask[];
  weeklyActivity?: ActivityDay[];
  recentActivity?: RecentActivity[];
  assessmentResult?: AssessmentResult | null;
}
```

---

## 3. Integration Checkpoints for Member 2

1. **Diagnostic Evaluation Function:**
   - Member 1 has provided `evaluateAssessment(submission)` in [lib/assessment.ts](file:///c:/Users/piyus/OneDrive/Documents/skillpath-ai/lib/assessment.ts).
   - Member 2 can replace the mock scoring logic with their own rules engine or backend API endpoint (`POST /api/assessment/evaluate`).

2. **Personalized Roadmap Generation:**
   - Member 1 has provided `generateRoadmap(skill, level)` in [lib/mock-data.ts](file:///c:/Users/piyus/OneDrive/Documents/skillpath-ai/lib/mock-data.ts).
   - Member 2 can plug in their dynamic generator or backend API (`POST /api/roadmap/generate`). The output matches the `Roadmap` interface above.

3. **Storage Security & Hydration:**
   - All state is managed client-side via SSR-safe helper functions in [lib/progress.ts](file:///c:/Users/piyus/OneDrive/Documents/skillpath-ai/lib/progress.ts).
   - **No sensitive secrets, API keys, or personal credentials are ever saved to browser storage.**
