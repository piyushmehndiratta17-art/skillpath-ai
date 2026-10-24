import { ExtendedMilestone } from './types';

export interface PrerequisiteValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates that milestones strictly follow prerequisite ordering rules:
 * 1. Every prerequisite must exist in the roadmap.
 * 2. No milestone may depend on itself.
 * 3. Every prerequisite must appear prior to the dependent milestone in sequence.
 * 4. No circular dependencies exist.
 */
export function validatePrerequisiteOrder(
  milestones: ExtendedMilestone[]
): PrerequisiteValidationResult {
  const errors: string[] = [];
  const idToIndex = new Map<string, number>();

  milestones.forEach((m, idx) => {
    idToIndex.set(m.id, idx);
  });

  // Check existence, self-dependency, and index sequence
  for (let i = 0; i < milestones.length; i++) {
    const current = milestones[i];
    for (const prereqId of current.prerequisites) {
      if (prereqId === current.id) {
        errors.push(`Milestone "${current.title}" (${current.id}) cannot depend on itself.`);
        continue;
      }

      if (!idToIndex.has(prereqId)) {
        errors.push(
          `Milestone "${current.title}" (${current.id}) references non-existent prerequisite "${prereqId}".`
        );
        continue;
      }

      const prereqIdx = idToIndex.get(prereqId)!;
      if (prereqIdx >= i) {
        errors.push(
          `Prerequisite violation: Milestone "${current.title}" (order ${current.order}) appears before or at the same position as its prerequisite "${milestones[prereqIdx].title}" (order ${milestones[prereqIdx].order}).`
        );
      }
    }
  }

  // Cycle detection via DFS
  const visited = new Map<string, 'unvisited' | 'visiting' | 'visited'>();
  for (const m of milestones) {
    visited.set(m.id, 'unvisited');
  }

  const adj = new Map<string, string[]>();
  for (const m of milestones) {
    adj.set(m.id, m.prerequisites);
  }

  function hasCycle(nodeId: string, path: string[]): boolean {
    const state = visited.get(nodeId);
    if (state === 'visiting') {
      errors.push(`Circular prerequisite dependency detected: ${[...path, nodeId].join(' -> ')}`);
      return true;
    }
    if (state === 'visited') return false;

    visited.set(nodeId, 'visiting');
    const neighbors = adj.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (adj.has(neighbor)) {
        if (hasCycle(neighbor, [...path, nodeId])) {
          return true;
        }
      }
    }

    visited.set(nodeId, 'visited');
    return false;
  }

  for (const m of milestones) {
    if (visited.get(m.id) === 'unvisited') {
      hasCycle(m.id, []);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Topologically sorts an array of milestones according to prerequisite dependencies.
 * Uses Kahn's algorithm. Preserves original order as a tie-breaker.
 */
export function topologicalSortMilestones(
  milestones: ExtendedMilestone[]
): ExtendedMilestone[] {
  const milestoneMap = new Map<string, ExtendedMilestone>();
  const inDegree = new Map<string, number>();
  const outgoing = new Map<string, string[]>(); // prereq -> dependents

  for (const m of milestones) {
    milestoneMap.set(m.id, m);
    inDegree.set(m.id, 0);
    outgoing.set(m.id, []);
  }

  for (const m of milestones) {
    for (const prereqId of m.prerequisites) {
      if (milestoneMap.has(prereqId)) {
        inDegree.set(m.id, (inDegree.get(m.id) || 0) + 1);
        outgoing.get(prereqId)!.push(m.id);
      }
    }
  }

  // Queue nodes with in-degree 0 (no prerequisites)
  const queue: string[] = [];
  for (const m of milestones) {
    if (inDegree.get(m.id) === 0) {
      queue.push(m.id);
    }
  }

  const sorted: ExtendedMilestone[] = [];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const milestone = milestoneMap.get(currentId)!;
    sorted.push(milestone);

    const dependents = outgoing.get(currentId) || [];
    for (const depId of dependents) {
      const newDegree = (inDegree.get(depId) || 0) - 1;
      inDegree.set(depId, newDegree);
      if (newDegree === 0) {
        queue.push(depId);
      }
    }
  }

  // If sorted doesn't include all milestones, a cycle exists; return original
  if (sorted.length !== milestones.length) {
    return milestones;
  }

  // Re-number order 1..N
  return sorted.map((m, idx) => ({
    ...m,
    order: idx + 1,
  }));
}

/**
 * Checks if a milestone's prerequisites are all completed.
 */
export function arePrerequisitesMet(
  milestone: ExtendedMilestone,
  completedMilestoneIds: Set<string>
): boolean {
  return milestone.prerequisites.every((prereqId) =>
    completedMilestoneIds.has(prereqId)
  );
}
