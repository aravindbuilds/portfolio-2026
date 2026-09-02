// js/agent/reasoner.js
// Two paths:
//   - Deterministic: uses templates for fact/list/greeting/identity/thanks
//   - LLM: calls /api/chat (Vercel serverless) for evaluation intent

import { greeting, identity, thanks, fact, list } from "./templates.js";

const API_ENDPOINT = "/api/chat";

export async function generate(plan, workingSet) {
  // Deterministic paths
  switch (plan.intent) {
    case "greeting":
      return { text: greeting(), citations: [], source: "deterministic" };
    case "identity":
      return { text: identity(), citations: [], source: "deterministic" };
    case "thanks":
      return { text: thanks(), citations: [], source: "deterministic" };
    case "fact":
      return { text: fact(workingSet), citations: workingSet.citations, source: "deterministic" };
    case "list":
      return { text: list(workingSet), citations: workingSet.citations, source: "deterministic" };
    case "evaluation":
      return await callLLM(workingSet);
    default:
      return { text: fact(workingSet), citations: workingSet.citations, source: "deterministic" };
  }
}

async function callLLM(workingSet) {
  try {
    const resp = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        working_set: workingSet,
        max_tokens: 600,
        temperature: 0.2,
      }),
    });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      return {
        text: `<div class="rag-section">The LLM endpoint returned an error (${resp.status}). Try a simpler question, or reach Aravind at <a class="out-link" href="mailto:mail4aravindes@gmail.com">mail4aravindes@gmail.com</a>.</div>`,
        citations: workingSet.citations,
        source: "llm-error",
        error: errText,
      };
    }
    const data = await resp.json();
    return {
      text: data.answer || `<div class="rag-section">No answer received from the LLM.</div>`,
      citations: data.citations || workingSet.citations,
      source: "llm",
      model: data.model,
    };
  } catch (err) {
    return {
      text: `<div class="rag-section">I couldn't reach the LLM endpoint. Try a simpler question, or reach Aravind at <a class="out-link" href="mailto:mail4aravindes@gmail.com">mail4aravindes@gmail.com</a>.</div>`,
      citations: workingSet.citations,
      source: "llm-network-error",
      error: String(err.message || err),
    };
  }
}
