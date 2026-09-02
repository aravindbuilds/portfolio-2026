// js/agent/retriever.js
// Executes a list of SkillCalls. Each call invokes a typed skill function
// from the registry. Deduplicates by evidence id.

import { SKILL_MAP, hasSkill } from "./skills.js";

export async function execute(skillCalls) {
  const results = [];
  const seen = new Set();

  for (const call of skillCalls) {
    const { skill, args = {} } = call;
    if (!hasSkill(skill)) {
      // Unknown skill — silently skip (defense in depth)
      continue;
    }
    try {
      const evidence = await SKILL_MAP[skill].fn(args);
      if (evidence && !seen.has(evidence.id)) {
        seen.add(evidence.id);
        results.push(evidence);
      }
    } catch (err) {
      // Skill failed — skip, don't poison the working set
      // (No raw error message leaks to the user; pipeline handles)
      continue;
    }
  }

  return results;
}
