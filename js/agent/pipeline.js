// js/agent/pipeline.js
// Browser-facing adapter for the server-owned two-step LLM flow.

import { PERSONA } from "./intentGate.js";

const API_ENDPOINT = "/api/chat";
const OUT_OF_SCOPE = "I can only answer questions about Aravind E S's professional profile, including his projects, skills, experience, education, certifications, and contact details.";

const RETRY_DELAYS = [500];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function answer(rawQuery) {
  let data;
  let lastError;
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt += 1) {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: String(rawQuery || "").slice(0, 1200) }),
      });
      if (!response.ok) throw new Error(`Assistant endpoint returned ${response.status}`);
      data = await response.json();
      break;
    } catch (error) {
      lastError = error;
      if (attempt === RETRY_DELAYS.length) throw lastError;
      await wait(RETRY_DELAYS[attempt]);
    }
  }
  if (data.in_scope === false || data.answer === "NONE") {
    return { ok: false, intent: "off_topic", text: OUT_OF_SCOPE, source: "normalizer", warnings: [] };
  }
  if (data.intent === "greeting" || data.answer === "GREETING") {
    return { ok: true, intent: "greeting", text: "", source: "normalizer", warnings: [] };
  }
  return { ok: true, intent: "portfolio", text: String(data.answer || "No answer received."), source: "two-step-llm", warnings: [], normalized: data.normalized };
}

export { PERSONA };
