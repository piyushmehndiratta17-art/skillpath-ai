import { ExtendedMilestone, ExtendedLesson, PracticeTask, CheckpointQuiz } from '../types';
import { SkillLevel } from '../../types';

/**
 * Generates a deterministic, structured, 5-stage prerequisite-ordered curriculum
 * for any custom or non-core skill (e.g. "Rust", "Go", "Docker", "DevOps", "Machine Learning").
 */
export function generateDeterministicCustomMilestones(
  skill: string,
  proficiency: SkillLevel,
  goal: string
): ExtendedMilestone[] {
  const cleanSkill = skill.trim() || 'Software Engineering';

  const stages = [
    {
      order: 1,
      title: `${cleanSkill} Fundamentals & Environment Setup`,
      desc: `Establish your local development toolchain, runtime environment, and master foundational syntax for ${cleanSkill}.`,
      hours: 4,
      xp: 150,
      prereqs: [] as string[],
      obj: [
        `Install and configure the ${cleanSkill} tooling ecosystem`,
        `Understand core types, execution models, and baseline syntax`,
        `Write and execute your first programs with confidence`,
      ],
      lessons: [
        { title: `Setting Up the ${cleanSkill} Environment & Tooling`, type: 'reading' as const, min: 20 },
        { title: `Core Syntax, Variables & Basic Operations in ${cleanSkill}`, type: 'reading' as const, min: 30 },
        { title: `Control Structures & Execution Flow`, type: 'video' as const, min: 25 },
        { title: `Foundations Checkpoint Quiz`, type: 'quiz' as const, min: 15 },
      ],
      practiceTaskTitle: `First Interactive ${cleanSkill} Program`,
      practiceTaskDesc: `Build a standalone command-line utility in ${cleanSkill} that validates user inputs and computes formatted results.`,
    },
    {
      order: 2,
      title: `Core Architectural Concepts & Idioms`,
      desc: `Dive into modular structure, functions, data flow, and idiomatic design patterns in ${cleanSkill}.`,
      hours: 5,
      xp: 200,
      prereqs: ['custom-m1'],
      obj: [
        `Organize code into clean, reusable modules and packages`,
        `Implement idiomatic error handling and data structures`,
        `Adopt best practices aligned with community guidelines`,
      ],
      lessons: [
        { title: `Modular Code Organization & Packaging`, type: 'reading' as const, min: 30 },
        { title: `Data Structures & Collection Handling in ${cleanSkill}`, type: 'reading' as const, min: 35 },
        { title: `Error Handling & Defensive Coding Strategies`, type: 'video' as const, min: 25 },
        { title: `Core Concepts Assessment`, type: 'quiz' as const, min: 15 },
      ],
      practiceTaskTitle: `Modular Utility Package`,
      practiceTaskDesc: `Implement a reusable library component in ${cleanSkill} demonstrating clean interfaces and comprehensive error handling.`,
    },
    {
      order: 3,
      title: `Intermediate Problem Solving & Integration`,
      desc: `Connect ${cleanSkill} to real-world I/O, external APIs, persistence layers, and concurrency.`,
      hours: 5,
      xp: 250,
      prereqs: ['custom-m2'],
      obj: [
        `Handle asynchronous operations or concurrent execution safely`,
        `Interface with file systems, databases, and network endpoints`,
        `Profile and debug execution flow under realistic conditions`,
      ],
      lessons: [
        { title: `Working with Data Persistence & Storage`, type: 'reading' as const, min: 35 },
        { title: `Network Communication & API Integration`, type: 'reading' as const, min: 30 },
        { title: `Concurrency & Resource Lifecycle Management`, type: 'video' as const, min: 30 },
        { title: `Intermediate Integration Checkpoint`, type: 'quiz' as const, min: 15 },
      ],
      practiceTaskTitle: `Asynchronous Data Fetcher & Processor`,
      practiceTaskDesc: `Build a resilient service in ${cleanSkill} that queries external data, validates schemas, and writes structured records.`,
    },
    {
      order: 4,
      title: `Advanced Architecture, Testing & Optimization`,
      desc: `Optimize performance, write automated test suites, and enforce architectural security and maintainability in ${cleanSkill}.`,
      hours: 5,
      xp: 250,
      prereqs: ['custom-m3'],
      obj: [
        `Construct automated unit and integration test suites`,
        `Profile CPU and memory usage to eliminate bottlenecks`,
        `Refactor code into production-grade design patterns`,
      ],
      lessons: [
        { title: `Automated Testing Frameworks & Mocking in ${cleanSkill}`, type: 'reading' as const, min: 30 },
        { title: `Performance Profiling & Memory Optimization`, type: 'reading' as const, min: 35 },
        { title: `Security Auditing & Defensive Hardening`, type: 'video' as const, min: 25 },
        { title: `Testing & Architecture Checkpoint`, type: 'quiz' as const, min: 15 },
      ],
      practiceTaskTitle: `Optimized Service with Automated Test Suite`,
      practiceTaskDesc: `Refactor an existing component to optimize latency, ensuring 100% test coverage over critical branches.`,
    },
    {
      order: 5,
      title: `Capstone Project: End-to-End Real World Solution`,
      desc: `Apply everything you have learned to build a complete, production-ready solution achieving your goal: "${goal}".`,
      hours: 6,
      xp: 500,
      prereqs: ['custom-m4'],
      obj: [
        `Architect an end-to-end application from scratch`,
        `Deploy or package the project following industry standards`,
        `Achieve your target milestone: ${goal}`,
      ],
      lessons: [
        { title: `Capstone System Architecture & Requirements`, type: 'reading' as const, min: 30 },
        { title: `Implementation: Core Domain Logic & Pipelines`, type: 'project' as const, min: 60 },
        { title: `Integration, Deployment & CI/CD Packaging`, type: 'project' as const, min: 45 },
        { title: `Final Code Review & Portfolio Polish`, type: 'reading' as const, min: 25 },
      ],
      practiceTaskTitle: `Capstone Project Implementation`,
      practiceTaskDesc: `Deliver a fully documented, tested, and functional project demonstrating mastery of ${cleanSkill}.`,
    },
  ];

  return stages.map((s, idx) => {
    const mId = `custom-m${s.order}`;
    const lessons: ExtendedLesson[] = s.lessons.map((les, lIdx) => ({
      id: `${mId}-l${lIdx + 1}`,
      title: les.title,
      durationMinutes: les.min,
      type: les.type,
      completed: false,
      objective: `Master ${les.title} within ${cleanSkill}.`,
      keyTakeaways: [`Key takeaway for ${les.title}`],
    }));

    const practiceTask: PracticeTask = {
      id: `${mId}-pt`,
      title: s.practiceTaskTitle,
      description: s.practiceTaskDesc,
      instructions: [
        `Review the module concepts for ${s.title}`,
        'Implement the specified requirements cleanly',
        'Verify functionality with sample test cases',
      ],
      hints: [`Refer to the lesson notes for ${cleanSkill}`, 'Break down the task into smaller sub-functions'],
    };

    const checkpointQuiz: CheckpointQuiz = {
      id: `${mId}-cq`,
      title: `${s.title} Checkpoint Quiz`,
      questionCount: 5,
      passingPercentage: 75,
      topicsCovered: [s.title],
    };

    return {
      id: mId,
      order: s.order,
      title: s.title,
      description: s.desc,
      estimatedHours: s.hours,
      status: idx === 0 ? 'in_progress' : idx === 1 ? 'available' : 'locked',
      xpReward: s.xp,
      prerequisites: s.prereqs,
      objectives: s.obj,
      lessons,
      practiceTask,
      checkpointQuiz,
    };
  });
}
