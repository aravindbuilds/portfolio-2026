// js/agent/intentGate.js
// Classifies a normalized query into an intent.
//
// Classification uses an LLM call to handle the full range of natural-language
// queries. Trivial patterns (greeting/identity/thanks/injection) are handled
// by fast regex so they never hit the LLM or count against the rate limit.
//
// Intents:
//   greeting    → canned response, no retrieval
//   identity    → canned response, no retrieval
//   thanks      → canned response, no retrieval
//   fact        → deterministic lookup (no LLM)
//   list        → deterministic aggregation (no LLM)
//   evaluation  → LLM required (counts toward rate limit)
//   off_topic   → polite refusal
//   injection   → hard block

import { classifyWithLLM } from "./llmClassifier.js";

const PERSONA = {
  name: "Aravind's Assistant",
};

// ── Fast-path: trivial patterns that never need the LLM ─────────────────

const GREETING_RE = /^(hi|hello|hey|hiya|yo|sup|hola|howdy|greetings|good\s+(morning|afternoon|evening))\b/i;
const IDENTITY_RE = /^(who\s+are\s+you|what\s+are\s+you|are\s+you\s+(real|an?\s+ai|a\s+bot|human)|what\s+is\s+this)\b[?!.]*\s*$/i;
const THANKS_RE = /^(thanks|thank\s+you|ty|thx|appreciate\s+it|cheers)\b[!.]*\s*$/i;

// Synchronous — does not hit LLM. Use to pre-check before `answer()` so the
// chat UI can decide whether to count against the rate limit.
export function isFastPath(rawText) {
  const t = String(rawText || "").trim();
  return !!(GREETING_RE.test(t) || IDENTITY_RE.test(t) || THANKS_RE.test(t));
}

const INJECTION_PATTERNS = [
  /system\s*:/i,
  /<\|.*?\|>/i,
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /forget\s+(everything|all|your|above)/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /new\s+instructions?:/i,
  /reveal\s+(your|the)\s+(system|instructions?|prompt)/i,
];

const INJECTION_REFUSAL =
  "That looks like an attempt to bypass my instructions. I can only answer questions about Aravind E S's professional profile.";

function isInjection(rawText) {
  return INJECTION_PATTERNS.some((re) => re.test(rawText));
}

function fastClassify(rawText) {
  const t = rawText.trim();
  if (GREETING_RE.test(t)) return { intent: "greeting", reason: "greeting-fast" };
  if (IDENTITY_RE.test(t)) return { intent: "identity", reason: "identity-fast" };
  if (THANKS_RE.test(t)) return { intent: "thanks", reason: "thanks-fast" };
  return null;
}

// ── Evaluate ────────────────────────────────────────────────────────────

export async function evaluate(normalized) {
  const rawText = normalized.rawText;
  const normalizedText = normalized.normalizedText;

  // 1. Injection — always block, never LLM
  if (isInjection(rawText)) {
    return {
      allowed: false,
      intent: "injection",
      reason: "injection-detected",
      refusal: INJECTION_REFUSAL,
    };
  }

  // 2. Trivial fast-path
  const fast = fastClassify(rawText);
  if (fast) {
    return { allowed: true, ...fast };
  }

  // 3. LLM classification for everything else
  const llmResult = await classifyWithLLM(normalizedText);
  return llmResult;
}

export { PERSONA };
