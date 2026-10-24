import { ExtendedMilestone } from './types';
import { JS_MILESTONES } from './tracks/javascript';
import { PYTHON_MILESTONES } from './tracks/python';
import { JAVA_MILESTONES } from './tracks/java';
import { DSA_MILESTONES } from './tracks/dsa';
import { generateDeterministicCustomMilestones } from './tracks/custom';
import { SkillLevel } from '../types';

export { JS_MILESTONES, PYTHON_MILESTONES, JAVA_MILESTONES, DSA_MILESTONES, generateDeterministicCustomMilestones };

/**
 * Returns tailored milestones for core skills, or null if custom skill.
 */
export function getCoreSkillMilestones(skill: string): ExtendedMilestone[] | null {
  if (!skill || typeof skill !== 'string') return null;
  const s = skill.toLowerCase().trim();
  if (s.includes('js') || s.includes('javascript') || s.includes('ecmascript')) {
    return JSON.parse(JSON.stringify(JS_MILESTONES));
  }
  if (s.includes('python') || s.includes('py')) {
    return JSON.parse(JSON.stringify(PYTHON_MILESTONES));
  }
  if (s.includes('java') && !s.includes('script')) {
    return JSON.parse(JSON.stringify(JAVA_MILESTONES));
  }
  if (s.includes('dsa') || s.includes('algorithm') || s.includes('data structure')) {
    return JSON.parse(JSON.stringify(DSA_MILESTONES));
  }
  return null;
}

/**
 * Returns milestones for any skill: either a rich core track or a deterministic custom track.
 */
export function getMilestonesForSkill(
  skill: string,
  proficiency: SkillLevel,
  goal: string
): ExtendedMilestone[] {
  const core = getCoreSkillMilestones(skill);
  if (core) {
    return core;
  }
  return generateDeterministicCustomMilestones(skill, proficiency, goal);
}
