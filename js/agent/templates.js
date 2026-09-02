// js/agent/templates.js
// Deterministic answer templates. Used for fact / list / greeting /
// identity / thanks intents — no LLM call, no API, fully grounded.

function escapeHtml(str) {
  const d = { textContent: String(str || "") };
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function section(title, body) {
  return `<div class="rag-section"><div class="rag-heading">${escapeHtml(title)}</div>${body}</div>`;
}

export function greeting() {
  return `Hi! 👋 I'm <b>Aravind's Assistant</b> - ask me about his work, skills, projects, experience, or contact details.`;
}

export function identity() {
  return `I'm <b>Aravind's Assistant</b>, a grounded agentic RAG system that answers questions about Aravind E S. I retrieve evidence from his profile through typed skill calls, build a bounded working set, and only generate answers I can ground in retrieved facts.`;
}

export function thanks() {
  return `You're welcome! Aravind is reachable at <a class="out-link" href="mailto:mail4aravindes@gmail.com">mail4aravindes@gmail.com</a> or <a class="out-link" href="https://linkedin.com/in/aravind-es" target="_blank" rel="noopener">LinkedIn</a>.`;
}

export function refusal(reason) {
  return `<span class="out-error">Refused:</span> ${escapeHtml(reason)}`;
}

// ---- Fact intent templates ----
export function fact(workingSet) {
  const ctx = workingSet.context;
  const intent = workingSet.intent;
  const sections = [];

  if (ctx.get_contact?.email) {
    const c = ctx.get_contact;
    const list = [
      `<strong>Email:</strong> <a class="out-link" href="mailto:${c.email}">${c.email}</a>`,
      `<strong>Phone:</strong> ${c.phone}`,
      `<strong>LinkedIn:</strong> <a class="out-link" href="${c.linkedin}" target="_blank" rel="noopener">${c.linkedin.replace("https://", "")}</a>`,
      `<strong>Location:</strong> ${c.location}`,
    ];
    sections.push(section("Contact", list.join(" · ")));
  }
  if (ctx.get_profile) {
    const p = ctx.get_profile;
    sections.push(section("Profile", `${p.name} — ${p.role} @ ${p.org}, ${p.location}. ${p.status}.`));
  }
  if (ctx.get_experience && Array.isArray(ctx.get_experience) && ctx.get_experience.length) {
    // workingSet stores array skills as evs.map(ev => ev.data) = [[{...}]]
    const raw = ctx.get_experience[0];
    const exp = Array.isArray(raw) ? raw[0] : (raw?.data || raw);
    if (exp?.role) {
      sections.push(section(
        "Experience",
        `${exp.role} @ ${exp.company} (${exp.period})${exp.location ? `, ${exp.location}` : ""}`
      ));
    }
  }
  if (ctx.get_education && Array.isArray(ctx.get_education) && ctx.get_education.length) {
    const raw = ctx.get_education[0];
    const edu = Array.isArray(raw) ? raw[0] : (raw?.data || raw);
    if (edu?.degree) {
      sections.push(section("Education", `${edu.degree} @ ${edu.institution} (${edu.period})`));
    }
  }
  if (ctx.get_certifications && Array.isArray(ctx.get_certifications) && ctx.get_certifications.length) {
    const raw = ctx.get_certifications[0];
    const arr = Array.isArray(raw) ? raw : (raw?.data || []);
    const certs = arr.map((c) => c.name || c);
    if (certs.length) {
      sections.push(section("Certifications", certs.join(" · ")));
    }
  }
  if (ctx.find_evidence && Array.isArray(ctx.find_evidence) && ctx.find_evidence.length) {
    const raw = ctx.find_evidence[0];
    const evData = Array.isArray(raw) ? raw[0] : (raw?.data || raw);
    if (evData?.results?.length) {
      const items = evData.results
        .slice(0, 3)
        .map((r) => `<li><strong>${escapeHtml(r.name)}</strong>: ${escapeHtml(r.summary || "")}</li>`)
        .join("");
      sections.push(section(`Evidence for "${escapeHtml(evData.topic)}"`, `<ul>${items}</ul>`));
    }
  }

  if (sections.length === 0) {
    return `<div class="rag-section">I don't have that specific information in Aravind's profile. Reach him at <a class="out-link" href="mailto:mail4aravindes@gmail.com">mail4aravindes@gmail.com</a>.</div>`;
  }

  return `<div class="rag-answer">${sections.join("")}</div><div class="rag-footer"><span class="out-dim">Sourced from Aravind's profile.</span></div>`;
}

// ---- List intent templates ----
export function list(workingSet) {
  const ctx = workingSet.context;
  const sections = [];

  if (ctx.get_projects && Array.isArray(ctx.get_projects) && ctx.get_projects[0]?.length) {
    // workingSet stores ev.data directly as [[...]]; ctx.get_X[0] is the array
    const projects = ctx.get_projects[0];
    const items = projects.map((p) => {
      const tags = (p.tags || []).map((t) => `<span class="out-tag">${escapeHtml(t)}</span>`).join("");
      return `<div class="project-item"><strong>${escapeHtml(p.name)}</strong> <span class="out-dim">${escapeHtml(p.year)}</span> ${tags}<br><span class="out-dim">${escapeHtml(p.short || "")}</span></div>`;
    }).join("");
    sections.push(section(`Projects (${projects.length})`, items));
  }

  if (ctx.get_skills && Array.isArray(ctx.get_skills) && ctx.get_skills[0]?.length) {
    const groups = ctx.get_skills[0];
    const items = groups.map((g) => {
      const pills = g.items.map((i) => `<span class="out-tag">${escapeHtml(i)}</span>`).join(" ");
      return `<div class="skill-group"><strong>${escapeHtml(g.group)}</strong>: ${pills}</div>`;
    }).join("");
    sections.push(section(`Skills (${groups.length} groups)`, items));
  }

  if (ctx.get_experience && Array.isArray(ctx.get_experience) && ctx.get_experience[0]?.length) {
    const exps = ctx.get_experience[0];
    const items = exps.map((e) => {
      return `<div><strong>${escapeHtml(e.role)}</strong> @ ${escapeHtml(e.company)} (${escapeHtml(e.period)})<br><span class="out-dim">${escapeHtml(e.location || "")}</span></div>`;
    }).join("");
    sections.push(section(`Experience (${exps.length} roles)`, items));
  }

  if (sections.length === 0) {
    return `<div class="rag-section">No items found for this query.</div>`;
  }

  return `<div class="rag-answer">${sections.join("")}</div><div class="rag-footer"><span class="out-dim">Sourced from Aravind's profile.</span></div>`;
}
