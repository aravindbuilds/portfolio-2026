// api/classify.js
// Vercel serverless function. Lightweight LLM call that classifies a user
// query into {fact, list, evaluation, off_topic}. The response is a single
// JSON line. Tokens capped at 60 since we only need a label.
//
// This route holds the OPENROUTER_API_KEY from Vercel Secrets — the key
// never reaches the client.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openrouter/free";
const MAX_TOKENS_CAP = 120;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
    body: JSON.stringify(body),
  };
}

function safeParseIntent(text) {
  const raw = String(text || "").trim();
  let parsed = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Strip markdown code fences
    const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
    try { parsed = JSON.parse(cleaned); } catch { /* fall through */ }
    // Extract a JSON object if embedded
    if (!parsed || !parsed.intent) {
      const m = raw.match(/\{[^{}]*"intent"[^{}]*\}/);
      if (m) {
        try { parsed = JSON.parse(m[0]); } catch { /* keep empty */ }
      }
    }
  }
  const intentRaw = String(parsed?.intent || "").toLowerCase().trim();
  const valid = ["fact", "list", "evaluation", "off_topic"];
  // Handle compound intents like "fact|list" — pick the first valid one
  let intent = valid.find((v) => intentRaw === v);
  if (!intent) {
    const parts = intentRaw.split(/[|,;\s]+/);
    intent = valid.find((v) => parts.some((p) => p === v));
  }
  if (!intent) intent = "evaluation";
  return {
    intent,
    reason: String(parsed?.reason || "").slice(0, 80) || "llm-classify",
  };
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return jsonResponse(204, {});

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "method_not_allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, {
      error: "missing_api_key",
      message: "OPENROUTER_API_KEY is not set in Vercel environment variables.",
    });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  } catch {
    return jsonResponse(400, { error: "invalid_json" });
  }

  const { query, system_prompt, max_tokens, temperature, model } = body;
  if (!query || typeof query !== "string") {
    return jsonResponse(400, { error: "missing_query" });
  }

  const messages = [
    { role: "system", content: String(system_prompt || "").slice(0, 1500) },
    { role: "user", content: String(query).slice(0, 500) },
  ];

  const modelName = model || DEFAULT_MODEL;
  const maxTokens = Math.min(
    Number.isFinite(max_tokens) && max_tokens > 0 ? max_tokens : 60,
    MAX_TOKENS_CAP
  );
  const temp = Number.isFinite(temperature) ? Math.max(0, Math.min(1, temperature)) : 0.0;

  let openRouterResp;
  try {
    openRouterResp = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL || "https://aravindbuilds.dev",
        "X-Title": "Aravind Portfolio Assistant — Classifier",
      },
      body: JSON.stringify({ model: modelName, messages, temperature: temp, max_tokens: maxTokens }),
    });
  } catch (err) {
    return jsonResponse(502, { error: "openrouter_network_error", message: String(err?.message || err) });
  }

  if (!openRouterResp.ok) {
    const errText = await openRouterResp.text().catch(() => "");
    return jsonResponse(openRouterResp.status, { error: "openrouter_error", message: errText.slice(0, 500) });
  }

  let data;
  try { data = await openRouterResp.json(); }
  catch { return jsonResponse(502, { error: "openrouter_invalid_json" }); }

  const raw = data?.choices?.[0]?.message?.content || "";
  const parsed = safeParseIntent(raw);

  return jsonResponse(200, { ...parsed, model: data?.model || modelName });
}
