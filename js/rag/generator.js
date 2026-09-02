// js/rag/generator.js
// High-level RAG generator. Loads the KB from assets/aravind.md, runs
// hybrid retrieval, and renders a clean HTML answer.
import { buildChunks } from "./chunker.js";
import { hybridRetrieveChunks, buildIdf } from "./retriever.js";

export const PERSONA = {
  name: "Aravind's Assistant",
  about: "Aravind E S — AI Software Engineer at Tata Elxsi, Kerala, India. Specializes in guarded LLM agents (MCP, RAG), real-time computer vision on edge hardware (YOLO, SAM 2.1, Jetson, TensorRT), and sensor fusion. 2 years of production experience including a U.S. safety-certified collision-warning system and a rail-safety-approved agentic platform. MCA from Cochin University. AWS Certified AI Practitioner.",
  greeting: "Hi! I'm Aravind's AI assistant — I have access to details about Aravind's work, skills, projects, and experience. What would you like to know?",
  outOfScope: [
    "I can only answer questions about Aravind E S — his experience, skills, projects, education, certifications, or contact details. For everything else, you'll need to reach him directly.",
    "I'm specifically scoped to Aravind E S's professional profile. If your question is about something else, please reach out to him at mail4aravindes@gmail.com.",
    "This assistant is designed to answer questions about Aravind E S's background only. For general knowledge, technical help, or other topics, Aravind is reachable at mail4aravindes@gmail.com.",
  ],
};

const RAG_CONFIG = {
  topK: 3,
  minScore: 0.05,
  listTopK: 6,    // higher cap for "list all" queries
  useHybrid: true,
};

// Patterns that signal a list-style query — these need a higher topK and
// section-based dedup so we get one chunk per item, not 2 paragraphs of
// the same thing.
const LIST_PATTERNS = /\b(what\s+are|list\s+(all|his|the)|show\s+(me\s+)?(all\s+)?(his\s+)?(projects|skills|experience|certifications|achievements|work|roles?))\b/i;
const SECTION_DEDUP_LIST = /\b(projects?|skills?|experience|certifications?|achievements?|work|roles?)\b/i;

const GREETING_PATTERNS = /^(hi|hello|hey|hiya|yo|sup|hola|howdy|greetings|good\s+(morning|afternoon|evening))\b[!.?]*\s*$/i;
const IDENTITY_PATTERNS = /^(who\s+are\s+you|what\s+are\s+you|are\s+you\s+(real|an?\s+ai|a\s+bot|human)|what\s+is\s+this)\b[?!.]*\s*$/i;
const THANKS_PATTERNS = /^(thanks|thank\s+you|ty|thx|appreciate\s+it|cheers)\b[!.]*\s*$/i;

// ---- Knowledge base loader ----
let KNOWLEDGE_BASE = null;
let _idf = null;
let _kbFetchPromise = null;

function loadKnowledgeBase() {
  if (KNOWLEDGE_BASE) return Promise.resolve(KNOWLEDGE_BASE);
  if (_kbFetchPromise) return _kbFetchPromise;
  _kbFetchPromise = fetch("assets/aravind.md")
    .then((r) => (r.ok ? r.text() : null))
    .then((text) => {
      if (!text) { KNOWLEDGE_BASE = []; return []; }
      KNOWLEDGE_BASE = buildChunks(text);
      return KNOWLEDGE_BASE;
    })
    .catch(() => { KNOWLEDGE_BASE = []; return []; });
  return _kbFetchPromise;
}

function ensureIdf() {
  if (!_idf && KNOWLEDGE_BASE && KNOWLEDGE_BASE.length > 0) {
    _idf = buildIdf(KNOWLEDGE_BASE);
  }
  return _idf;
}

// Strip markdown noise from a chunk for display.
function cleanChunkText(text) {
  return text
    .replace(/^#+\s*/gm, "")
    .replace(/^---+\s*$/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isOutOfScope(query) {
  const aravindTerms = [
    "aravind", "es", "tata elxsi", "ai engineer", "ml", "llm", "rag", "mcp",
    "jetson", "yolo", "sam", "tensorrt", "cuda", "onnx", "fastapi", "docker",
    "postgresql", "redis", "python", "c++", "resume", "cv", "experience",
    "project", "skill", "certification", "education", "portfolio", "contact",
    "linkedin", "rail", "sensor", "fusion", "edge", "computer vision",
    "collision", "warning", "rehabilitation", "healthcare", "agentic", "aws",
    "email", "phone", "location", "address", "github", "gitlab",
    "hire", "available", "open to", "reach", "connect",
  ];
  const queryLower = query.toLowerCase();
  const hits = aravindTerms.filter((t) => queryLower.includes(t)).length;
  return hits === 0;
}

function isGreeting(q) { return GREETING_PATTERNS.test(q.trim()); }
function isIdentityQuestion(q) { return IDENTITY_PATTERNS.test(q.trim()); }
function isThanks(q) { return THANKS_PATTERNS.test(q.trim()); }

function isListQuery(q) { return LIST_PATTERNS.test(q); }

// ---- Public generator ----
export async function ragGenerate(userQuery) {
  const q = (userQuery || "").trim();
  if (!q) return { done: true, text: PERSONA.greeting };

  if (isGreeting(q)) {
    return {
      done: true,
      text: `Hi! 👋 I'm <b>${PERSONA.name}</b> — Aravind's AI assistant. Ask me anything about his work, skills, projects, or experience.`,
    };
  }
  if (isIdentityQuestion(q)) {
    return {
      done: true,
      text: `I'm <b>${PERSONA.name}</b>, a small RAG assistant that answers questions about Aravind E S using his profile (<span class="out-ok">assets/aravind.md</span>). I'm grounded in the same content the terminal displays — no external LLM calls, no fabricated details.`,
    };
  }
  if (isThanks(q)) {
    return {
      done: true,
      text: `You're welcome! If you'd like to get in touch, Aravind is at <a class="out-link" href="mailto:mail4aravindes@gmail.com">mail4aravindes@gmail.com</a>.`,
    };
  }

  // Out-of-scope: only redirect if the query has zero Aravind-related
  // signal AND isn't a single short word.
  if (q.split(/\s+/).length > 1 && isOutOfScope(q)) {
    const reply = PERSONA.outOfScope[Math.floor(Math.random() * PERSONA.outOfScope.length)];
    return { done: true, text: reply };
  }

  await loadKnowledgeBase();
  const idf = ensureIdf();

  const isList = isListQuery(q);
  const topK = isList ? RAG_CONFIG.listTopK : RAG_CONFIG.topK;
  const threshold = q.split(/\s+/).length === 1 ? 0.0 : RAG_CONFIG.minScore;

  let chunks = [];
  if (idf && KNOWLEDGE_BASE.length > 0) {
    chunks = hybridRetrieveChunks(q, KNOWLEDGE_BASE, idf, topK, threshold);
  }

  if (chunks.length === 0) {
    return {
      done: true,
      text: `I couldn't find a specific answer to that in Aravind's profile. For anything specific, reach him at <a class="out-link" href="mailto:mail4aravindes@gmail.com">mail4aravindes@gmail.com</a> or <a class="out-link" href="https://linkedin.com/in/aravind-es" target="_blank" rel="noopener">LinkedIn</a>.`,
    };
  }

  // Dedup: for list queries, one chunk per parent section so each
  // project / skill group / experience entry appears once.
  // For fact queries, cap at 2 by relevance.
  const seenKeys = new Set();
  const deduped = [];
  for (const c of chunks) {
    const key = isList
      ? (c.parentSection || c.heading)
      : c.heading;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    deduped.push(c);
    const cap = isList ? topK : 2;
    if (deduped.length >= cap) break;
  }

  const sections = deduped.map((c) => {
    const headingLabel = c.parentSection && c.headingLevel >= 3
      ? `${escapeHtml(c.parentSection)} — ${escapeHtml(c.heading)}`
      : escapeHtml(c.heading);
    const body = escapeHtml(cleanChunkText(c.text))
      .replace(/\n\n/g, "</p><p>")
      .replace(/^/, "<p>")
      .replace(/$/, "</p>")
      .replace(/<p><\/p>/g, "");
    return `<div class="rag-section"><div class="rag-heading">${headingLabel}</div>${body}</div>`;
  });

  return {
    done: true,
    text: `<div class="rag-answer">${sections.join("")}</div><div class="rag-footer"><span class="out-dim">Sourced from Aravind's profile · for anything else, reach him at <a class="out-link" href="mailto:mail4aravindes@gmail.com">mail4aravindes@gmail.com</a></span></div>`,
  };
}

// Tiny inline HTML escape (assistant output is built from KB text, but we
// still escape to keep the assistant response safe).
function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}
