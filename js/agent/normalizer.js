// js/agent/normalizer.js
// First stage of the pipeline. Normalizes a raw user query into a
// structured form and strips obvious prompt-injection patterns.
//
// Pure function. No side effects, no I/O.

const INJECTION_PATTERNS = [
  { re: /system\s*:/i, name: "system-prompt-marker" },
  { re: /<\|.*?\|>/g, name: "special-tokens" },
  { re: /endofturn|endofprompt|endofturn|ENDOFSYSTEM|ENDOF/i, name: "end-marker" },
  { re: /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?|rules?)/i, name: "ignore-instructions" },
  { re: /forget\s+(everything|all|your|above)\b/i, name: "forget-instructions" },
  { re: /you\s+are\s+now\s+(a|an)\s+/i, name: "persona-replacement" },
  { re: /new\s+instructions?:/i, name: "new-instructions" },
  { re: /\bassistant\s*:\s*/i, name: "assistant-marker" },
  { re: /\buser\s*:\s*/i, name: "user-marker" },
  { re: /reveal\s+(your|the)\s+(system|instructions?|prompt)/i, name: "prompt-extraction" },
  { re: /what\s+(is|are)\s+in\s+your\s+(system|context|prompt)/i, name: "prompt-extraction" },
];

const ALLOWED_CHARS = /[^a-z0-9\s\-+_./@?,'"\(\)]/g;

function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+\-]+/i)
    .filter((t) => t.length > 0);
}

export function normalize(rawText) {
  if (typeof rawText !== "string") {
    return {
      rawText: String(rawText || ""),
      tokens: [],
      normalizedText: "",
      strippedPatterns: ["non-string-input"],
      isInjection: false,
    };
  }

  const stripped = [];
  let text = rawText;
  for (const { re, name } of INJECTION_PATTERNS) {
    if (re.test(text)) {
      stripped.push(name);
      text = text.replace(re, " ");
    }
  }

  const normalized = text
    .toLowerCase()
    .replace(ALLOWED_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = tokenize(normalized);

  return {
    rawText,
    tokens,
    normalizedText: normalized,
    strippedPatterns: stripped,
    isInjection: stripped.length > 0,
  };
}

export const _INTERNAL = { INJECTION_PATTERNS, ALLOWED_CHARS };
