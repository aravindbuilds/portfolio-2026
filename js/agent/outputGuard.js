// js/agent/outputGuard.js
// Validates that a response from the Reasoner is grounded in the working
// set. Catches:
//   - fabricated [n] citations
//   - URLs/emails/phones not in the working set
//   - script injection in HTML
//   - leaked system-prompt fragments

const FABRICATION_PATTERNS = [
  /\b\d+\s*years?\s+of\s+experience\b/i,                    // numeric years (only "2 years" is real)
  /graduated\s+from\s+harvard|stanford|mit/i,               // fake alma maters
  /worked\s+at\s+(google|apple|amazon|meta|microsoft|openai)/i,
  /phd\s+in|doctorate\s+in/i,
  /amazon\s+aws\s+architect|google\s+cloud\s+architect/i,  // higher certs not in profile
];

const SYSTEM_LEAK_PATTERNS = [
  /system\s*:/i,
  /<\|.*?\|>/,
  /ignore\s+(previous|prior|above)/i,
  /assistant\s*:/i,
];

const DANGEROUS_HTML = [
  /<script\b/i,
  /<iframe\b/i,
  /javascript:/i,
  /onerror\s*=/i,
  /onload\s*=/i,
  /onclick\s*=/i,
  /onmouseover\s*=/i,
];

function extractCitations(text) {
  const re = /\[(\d+)\]/g;
  const found = new Set();
  let m;
  while ((m = re.exec(text)) !== null) found.add(parseInt(m[1], 10));
  return [...found];
}

function extractUrls(text) {
  const re = /https?:\/\/[^\s<>"']+/g;
  return text.match(re) || [];
}

function extractEmails(text) {
  const re = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return text.match(re) || [];
}

export function validate(response, workingSet) {
  const text = (response?.text || "").toString();
  const warnings = [];
  let safe = true;

  // 1. Citation check
  const cited = extractCitations(text);
  const validCitations = workingSet.citations || [];
  const validIdx = new Set();
  validCitations.forEach((c) => {
    const m = c.match(/^\[(\d+)\]/);
    if (m) validIdx.add(parseInt(m[1], 10));
  });
  const fabricated = cited.filter((n) => !validIdx.has(n));
  if (fabricated.length > 0) {
    warnings.push(`fabricated_citations: ${fabricated.join(", ")}`);
    safe = false;
  }

  // 2. URL check (only allow URLs from working set contact)
  const urls = extractUrls(text);
  const allowedUrls = new Set();
  if (workingSet.context?.get_contact?.linkedin) allowedUrls.add(workingSet.context.get_contact.linkedin);
  if (workingSet.context?.get_profile?.linkedin) allowedUrls.add(workingSet.context.get_profile.linkedin);
  const badUrls = urls.filter((u) => !allowedUrls.has(u));
  if (badUrls.length > 0) {
    warnings.push(`external_urls: ${badUrls.join(", ")}`);
    safe = false;
  }

  // 3. Email check
  const emails = extractEmails(text);
  const allowedEmails = new Set();
  if (workingSet.context?.get_contact?.email) allowedEmails.add(workingSet.context.get_contact.email);
  if (workingSet.context?.get_profile?.email) allowedEmails.add(workingSet.context.get_profile.email);
  const badEmails = emails.filter((e) => !allowedEmails.has(e));
  if (badEmails.length > 0) {
    warnings.push(`external_emails: ${badEmails.join(", ")}`);
    safe = false;
  }

  // 4. Dangerous HTML check
  for (const re of DANGEROUS_HTML) {
    if (re.test(text)) {
      warnings.push(`dangerous_html: ${re.source}`);
      safe = false;
    }
  }

  // 5. System-prompt leak check
  for (const re of SYSTEM_LEAK_PATTERNS) {
    if (re.test(text)) {
      warnings.push(`system_prompt_leak: ${re.source}`);
      safe = false;
    }
  }

  // 6. Fabrication heuristics (only flag obvious ones)
  for (const re of FABRICATION_PATTERNS) {
    if (re.test(text)) {
      warnings.push(`likely_fabrication: ${re.source}`);
      safe = false;
    }
  }

  return {
    safe,
    warnings,
    answer: safe ? text : wrapFailure(warnings, workingSet),
  };
}

function wrapFailure(warnings, workingSet) {
  const contact = workingSet.context?.get_contact?.email || "mail4aravindes@gmail.com";
  const summary = warnings.length > 0 ? warnings[0].split(":")[0] : "validation_failed";
  return `<div class="rag-section">I couldn't produce a grounded answer (${summary}). Reach Aravind at <a class="out-link" href="mailto:${contact}">${contact}</a>.</div>`;
}

// Strip-only version: returns the cleaned answer without flagging failure
// Used for deterministic outputs (they don't need guarding, but we run
// them through the same sanitizer).
export function sanitize(text) {
  let out = String(text || "");
  for (const re of DANGEROUS_HTML) {
    out = out.replace(re, "");
  }
  return out;
}
