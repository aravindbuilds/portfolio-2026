// js/agent/workingSet.js
// Assembles a bounded working set from the plan + evidence report.
// Caps context size so the LLM doesn't get flooded.

const MAX_TOKENS = 1800; // rough char/4 approximation
const EVIDENCE_CAP = 4;

function approxTokens(text) {
  if (typeof text !== "string") return 0;
  return Math.ceil(text.length / 4);
}

function stripUntrusted(text) {
  if (typeof text !== "string") return "";
  // Strip system-prompt fragments that could leak into context
  return text
    .replace(/system\s*:\s*.*$/i, "")
    .replace(/<\|.*?\|>/g, "")
    .replace(/ignore\s+(previous|prior|above)\s+instructions/gi, "")
    .replace(/assistant\s*:/gi, "")
    .replace(/user\s*:/gi, "")
    .trim();
}

export function build(plan, report) {
  const evidence = report.evidence_found || [];

  // Sort evidence by skill priority: profile, contact, experience, projects, skills, evidence
  const priority = [
    "get_profile", "get_contact", "get_experience", "get_projects",
    "get_skills", "get_education", "get_certifications", "find_evidence",
  ];
  evidence.sort((a, b) => {
    const ai = priority.indexOf(a.skill);
    const bi = priority.indexOf(b.skill);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  // Build citations map
  const citations = [];
  const citationMap = {};
  let citationIdx = 1;

  // Group evidence by skill
  const grouped = {};
  evidence.forEach((ev) => {
    if (!grouped[ev.skill]) grouped[ev.skill] = [];
    grouped[ev.skill].push(ev);
  });

  // Build the context payload (JSON-serializable)
  const context = {};
  for (const [skill, evs] of Object.entries(grouped)) {
    evs.forEach((ev) => {
      const citation = `[${citationIdx}] ${ev.skill}`;
      citations.push(citation);
      citationMap[ev.id] = citation;
      ev.citations = [citation];
    });

    // Single-evidence skills → store under their key
    // Multi-evidence skills → store as array
    const isArray = ["get_projects", "get_experience", "get_skills", "get_education", "get_certifications", "find_evidence"].includes(skill);
    if (isArray) {
      context[skill] = evs.map((ev) => ev.data);
    } else {
      context[skill] = evs[0].data;
    }
  }

  // Build the system prompt
  const systemPrompt = buildSystemPrompt(plan, context, citations, report);

  // Token estimate
  const systemTokens = approxTokens(systemPrompt);
  const contextJson = JSON.stringify(context, null, 2);
  const contextTokens = approxTokens(contextJson);

  // If over budget, drop low-confidence evidence
  let finalEvidence = evidence;
  if (systemTokens + contextTokens > MAX_TOKENS) {
    // Drop the lowest-priority evidence (find_evidence last) until under budget
    const dropOrder = ["find_evidence", "get_certifications", "get_education", "get_skills", "get_projects", "get_experience", "get_contact", "get_profile"];
    for (const skill of dropOrder) {
      if (systemTokens + approxTokens(JSON.stringify(context, null, 2)) <= MAX_TOKENS) break;
      if (context[skill] != null) {
        if (Array.isArray(context[skill])) {
          context[skill] = context[skill].slice(0, Math.max(1, Math.floor(context[skill].length / 2)));
        }
      }
    }
  }

  return {
    system_prompt: systemPrompt,
    context,
    citations,
    token_estimate: Math.min(systemTokens + contextTokens, MAX_TOKENS),
    instructions:
      "You are answering questions about Aravind E S using ONLY the structured context provided. Every factual claim MUST be cited using the [n] notation from the citations list. Do not invent, do not extrapolate beyond the context. If the context does not contain the answer, say 'I don't have that information in Aravind's profile.'",
    intent: plan.intent,
    plan,
    evidence_report: report,
  };
}

function buildSystemPrompt(plan, context, citations, report) {
  const ctxJson = JSON.stringify(context, null, 2);
  const cit = citations.length > 0 ? `\n\nAVAILABLE CITATIONS:\n${citations.join("\n")}` : "";
  const grounded = report.grounded
    ? ""
    : `\n\nWARNING: Some claims have no evidence. Do not fabricate — say so.`;
  return `You are Aravind's Assistant — a grounded RAG assistant that answers questions about Aravind E S using ONLY the structured context below. You MUST cite all factual claims using [n] notation from AVAILABLE CITATIONS. Do not invent resume facts.

CONTEXT:
${ctxJson}${cit}${grounded}`;
}
