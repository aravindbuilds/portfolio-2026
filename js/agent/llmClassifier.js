// js/agent/llmClassifier.js
// Classifies a user query into one of {fact, list, evaluation, off_topic}
// using the LLM. This replaces the brittle regex classifier with proper
// natural-language understanding.
//
// The model is told the persona is "Aravind's Assistant" and given a strict
// closed-vocabulary JSON output. The system prompt is a tiny string (~200
// tokens) so this is cheap and fast.

const CLASSIFY_URL = "/api/classify";

const REFUSAL_TEMPLATES = [
  "I can only answer questions about Aravind E S — his experience, skills, projects, education, certifications, or contact details. For anything else, please reach him at mail4aravindes@gmail.com.",
  "This assistant is scoped to Aravind E S's professional profile. If your question is about something else, please reach out directly at mail4aravindes@gmail.com.",
  "I don't have information beyond Aravind E S's resume. For general questions, Aravind is reachable at mail4aravindes@gmail.com.",
];

const SYSTEM_PROMPT = `You are the intent classifier for "Aravind's Assistant" — a chat assistant that ONLY answers questions about Aravind E S (an AI Software Engineer at Tata Elxsi).

Your job: classify the user's message into exactly one of these intents:
  - "fact"         — a question asking for a specific piece of information (email, phone, location, dates, role, company, count, name of one thing)
  - "list"         — a question asking for a collection of things (his skills, projects, certifications, experience roles, education)
  - "evaluation"   — a question asking for judgment, recommendation, comparison, fit, or a synthesized answer that needs reasoning (should I hire him, is he a fit for X, summarize his strengths, what makes him stand out)
  - "off_topic"    — anything NOT about Aravind E S (general knowledge, weather, jokes, math, other people, etc.)

Rules:
- "what are his skills", "tell me his projects", "list certifications" → "list"
- "what is his email", "where does he work", "how many projects" → "fact"
- "should I hire him", "is he a good fit", "evaluate him" → "evaluation"
- "what is the weather", "tell me a joke", "who is the president" → "off_topic"
- Possessive forms ("his skills", "Aravind's projects", "my skills") all map to "list" or "fact" depending on whether a collection or specific value is requested.
- If genuinely ambiguous, prefer "evaluation" over "off_topic" — the LLM can answer richer questions.
- Be permissive: "skills" alone, "projects", "tell me about Aravind" are all in-scope.

Output STRICTLY a JSON object on a single line, no other text, no markdown, no commentary:
{"intent": "fact"|"list"|"evaluation"|"off_topic", "reason": "<=10 words"}

No prose. No prefix. Just the JSON line.`;

export async function classifyWithLLM(query) {
  const q = String(query || "").trim();
  if (!q) {
    return {
      allowed: false,
      intent: "off_topic",
      reason: "empty-query",
      refusal: "Please ask a question about Aravind — his skills, projects, experience, or contact details.",
    };
  }

  let resp;
  try {
    resp = await fetch(CLASSIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: q,
        system_prompt: SYSTEM_PROMPT,
        max_tokens: 60,
        temperature: 0.0,
      }),
    });
  } catch (err) {
    // Network error — fall back to permissive evaluation
    return {
      allowed: true,
      intent: "evaluation",
      reason: "classify-network-error-fallback",
    };
  }

  if (!resp.ok) {
    return {
      allowed: true,
      intent: "evaluation",
      reason: `classify-http-${resp.status}-fallback`,
    };
  }

  let data;
  try {
    data = await resp.json();
  } catch {
    return { allowed: true, intent: "evaluation", reason: "classify-parse-fallback" };
  }

  // Parse the raw LLM text (may be in data.intent or data.classification)
  const rawText = (data?.intent || data?.classification || data?.text || "").toLowerCase().trim();
  // Extract a valid intent from the string — handles cases like "fact|list" by
  // picking the first valid one, or falling back to evaluation.
  const valid = ["fact", "list", "evaluation", "off_topic"];
  let intent = valid.find((v) => rawText === v);
  if (!intent) {
    // Try extracting from a compound value like "fact|list" → take the first valid
    const parts = rawText.split(/[|,;\s]+/);
    intent = valid.find((v) => parts.some((p) => p === v));
  }
  if (!intent) intent = "evaluation";
  const reason = data?.reason || "llm-classify";

  if (intent === "off_topic") {
    return {
      allowed: false,
      intent: "off_topic",
      reason,
      refusal: REFUSAL_TEMPLATES[Math.floor(Math.random() * REFUSAL_TEMPLATES.length)],
    };
  }

  return { allowed: true, intent, reason };
}

export { SYSTEM_PROMPT as CLASSIFY_SYSTEM_PROMPT };
