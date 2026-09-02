// js/agent/rateLimit.js
// 5-query-per-day rate limit for LLM calls. Capped on the client to avoid
// burning OpenRouter credits on infinite sessions.
//
// Counting rules:
//   - Greeting / identity / thanks / off_topic / injection: 0 queries
//     (no LLM call, no decrement)
//   - fact / list: counts 1 query IF the LLM path is taken. Since fact/list
//     use the deterministic template, this only costs on the LLM classify
//     call. We track the classify + the LLM answer as ONE query.
//   - evaluation: counts 1 query
//
// Reset window: rolling 24h, computed from a per-query timestamp stored
// in localStorage. The 5 newest timestamps are kept; older ones are
// discarded on read.

const STORAGE_KEY = "aravind_rag_query_log";
const MAX_QUERIES = 5;
const WINDOW_MS = 24 * 60 * 60 * 1000;

function readLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter((t) => typeof t === "number" && Number.isFinite(t));
  } catch {
    return [];
  }
}

function writeLog(log) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    // Storage full / blocked — fail closed for next call
  }
}

function pruneOld(log) {
  const cutoff = Date.now() - WINDOW_MS;
  return log.filter((t) => t > cutoff);
}

export function getRemaining() {
  return Math.max(0, MAX_QUERIES - readLog().length);
}

export function canQuery() {
  return pruneOld(readLog()).length < MAX_QUERIES;
}

export function recordQuery() {
  const log = pruneOld(readLog());
  log.push(Date.now());
  // Keep only the most recent MAX_QUERIES so storage doesn't grow.
  const trimmed = log.slice(-MAX_QUERIES);
  writeLog(trimmed);
}

export function getResetAt() {
  const log = pruneOld(readLog());
  if (log.length === 0) return null;
  return Math.min(...log) + WINDOW_MS;
}

export const RATE_LIMIT = { MAX_QUERIES, WINDOW_MS };
