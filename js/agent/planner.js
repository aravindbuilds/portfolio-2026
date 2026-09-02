// js/agent/planner.js
// Maps an intent + normalized query to a Plan. The plan describes what
// evidence the answer needs and which Skills the Retriever must call.
//
// Deterministic. No I/O. No LLM.

const PLAN_TABLE = {
  greeting: {
    claims_needed: ["introduce assistant"],
    skill_calls: [],
  },
  identity: {
    claims_needed: ["describe assistant"],
    skill_calls: [],
  },
  thanks: {
    claims_needed: ["acknowledge; provide contact"],
    skill_calls: [],
  },
  fact: {
    claims_needed: ["answer the specific question from the profile"],
    skill_calls: [
      { skill: "get_profile", args: {} },
      { skill: "get_contact", args: {} },
      { skill: "get_experience", args: {} },
      { skill: "get_education", args: {} },
      { skill: "get_certifications", args: {} },
      { skill: "find_evidence", args: { topic: "__query__" } },
    ],
  },
  list: {
    claims_needed: [
      "list each project with short description and impact",
      "list each skill group",
      "list each experience role",
    ],
    skill_calls: [
      { skill: "get_projects", args: {} },
      { skill: "get_skills", args: {} },
      { skill: "get_experience", args: {} },
    ],
  },
  evaluation: {
    claims_needed: [
      "experience summary with production evidence",
      "flagship projects with impact",
      "core technical skills",
      "differentiation (safety certifications, awards)",
    ],
    skill_calls: [
      { skill: "get_profile", args: {} },
      { skill: "get_experience", args: {} },
      { skill: "get_projects", args: {} },
      { skill: "get_skills", args: {} },
      { skill: "get_certifications", args: {} },
      { skill: "find_evidence", args: { topic: "production engineering" } },
      { skill: "find_evidence", args: { topic: "safety certification" } },
      { skill: "find_evidence", args: { topic: "leadership" } },
    ],
  },
};

export function plan(intent, normalized) {
  const template = PLAN_TABLE[intent] || PLAN_TABLE.evaluation;
  // Inject the actual query text into any "__query__" topic slot
  const skill_calls = template.skill_calls.map((call) => {
    if (call.args && call.args.topic === "__query__") {
      return { skill: call.skill, args: { topic: normalized.normalizedText } };
    }
    return { skill: call.skill, args: { ...call.args } };
  });

  return {
    intent,
    claims_needed: [...template.claims_needed],
    skill_calls,
    normalized_query: normalized.normalizedText,
  };
}

export const _INTERNAL = { PLAN_TABLE };
