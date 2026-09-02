// js/mode/terminal.js
// Preserves the original terminal experience (boot screen, HUD, prompt,
// gamification, RAG chat panel). Mounted when the URL has ?mode=terminal.
// Injects its own DOM into the document body so it can co-exist with the
// modern portfolio's HTML.
import { LINKS } from "../data/links.js";
import { FILES } from "../data/files.js";
import { PROJECTS, PROJECT_READABLE, PROJECT_ORDER } from "../data/projects.js";
import { RESUME_LINES } from "../data/resume.js";
import { answer } from "../agent/pipeline.js";
import { $, escapeHtml, actionButton, agentThread } from "../ui/dom.js";

const TERMINAL_HTML = `
  <div class="crt-overlay" aria-hidden="true"></div>
  <div class="scanline" aria-hidden="true"></div>

  <div id="boot-screen" class="boot-screen">
    <pre id="boot-log" class="boot-log"></pre>
  </div>

  <div id="app" class="app hidden">
    <header class="topbar">
      <div class="topbar-left">
        <span class="dot dot-a"></span><span class="dot dot-b"></span><span class="dot dot-c"></span>
        <span class="topbar-title">aravind@portfolio: ~</span>
      </div>
      <div class="topbar-right">
        <span id="clock" class="clock">--:--:-- IST</span>
        <a class="terminal-exit" href="./" aria-label="Exit terminal and return to portfolio">exit terminal</a>
      </div>
    </header>
    <main class="layout">
      <section class="terminal-pane" aria-label="Interactive terminal">
        <div id="term-output" class="term-output" role="log" aria-live="polite"></div>
        <div class="term-input-row">
          <span class="prompt-user">aravind</span><span class="prompt-at">@</span><span class="prompt-host">portfolio</span><span class="prompt-colon">:</span><span id="prompt-path" class="prompt-path">~</span><span class="prompt-sym">$</span>
          <input id="term-input" class="term-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal command input" />
          <span class="cursor" aria-hidden="true"></span>
        </div>
      </section>
      <aside class="hud" aria-label="Session status">
        <div class="hud-block radar-block">
          <div class="hud-label"></div>
          <svg class="radar" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="58" class="radar-ring ring-1"/>
            <circle cx="60" cy="60" r="40" class="radar-ring ring-2"/>
            <circle cx="60" cy="60" r="20" class="radar-ring ring-3"/>
            <line x1="60" y1="2" x2="60" y2="118" class="radar-cross"/>
            <line x1="2" y1="60" x2="118" y2="60" class="radar-cross"/>
            <g class="radar-sweep-group">
              <path d="M60,60 L60,2 A58,58 0 0,1 108,32 Z" class="radar-sweep"/>
            </g>
            <circle cx="82" cy="40" r="2.4" class="radar-blip blip-1"/>
            <circle cx="38" cy="80" r="2.4" class="radar-blip blip-2"/>
            <circle cx="90" cy="85" r="2.4" class="radar-blip blip-3"/>
          </svg>
        </div>
        <div class="hud-block">
          <div class="hud-label">SKILLS DISCOVERED <span id="skills-count">(0/12)</span></div>
          <div class="skill-grid" id="skill-grid"></div>
        </div>
        <div class="hud-block">
          <div class="hud-label">RECRUITER ACTIONS</div>
          <div class="quick-links">
            <button class="qlink" data-cmd="tour">guided tour</button>
            <button class="qlink" data-cmd="projects">show projects</button>
            <button class="qlink" data-cmd="resume">read resume</button>
            <button class="qlink" data-cmd="open resume.pdf">resume.pdf</button>
            <button class="qlink" data-cmd="details">details</button>
            <button class="qlink" data-cmd="cat contact.sh">contact</button>
            <button class="qlink" data-cmd="ask">ask assistant</button>
            <button class="qlink" data-cmd="help">help</button>
          </div>
        </div>
        <div class="hud-block hint-block">
          <div class="hud-label">TIP</div>
          <div class="hint-text">Use the action buttons for a readable walkthrough. Typing still works; <span class="kbd">Tab</span> autocompletes.</div>
        </div>
      </aside>
    </main>
    <footer class="statusbar">
      <span>STATUS: <span class="ok">CONNECTED</span></span>
      <span class="sep">·</span>
      <span>ACCESS: <span class="ok">READ-ONLY</span></span>
      <span class="sep">·</span>
      <span>SCHEMA: <span class="ok">VALIDATED</span></span>
      <span class="sep">·</span>
      <span id="loc-status">KERALA, IN</span>
    </footer>
  </div>

  <div id="chat-panel" class="chat-panel hidden" role="dialog" aria-label="Aravind's AI assistant">
    <div class="chat-header">
      <div class="chat-avatar" aria-hidden="true">AE</div>
      <div class="chat-header-text">
        <div class="chat-name">Aravind's Assistant</div>
        <div class="chat-sub" id="chat-sub">Two-step assistant · scoped to Aravind's profile</div>
      </div>
      <button id="chat-close" class="chat-close" type="button" aria-label="Close assistant">×</button>
    </div>
    <div id="chat-thread" class="chat-thread" role="log" aria-live="polite"></div>
    <form id="chat-form" class="chat-form" autocomplete="off">
      <input id="chat-input" class="chat-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ask about Aravind's work, skills, projects…" aria-label="Ask the assistant" />
      <button id="chat-send" class="chat-send" type="submit" aria-label="Send">→</button>
    </form>
  </div>
`;

// All terminal logic preserved from the original script.js. The code below
// is essentially the original IIFE with the IIFE wrapper removed and module
// imports substituted for the previously-inline constants.

const SKILLS = [
  { id: "help", label: "help", xp: 10 },
  { id: "whoami", label: "whoami", xp: 10 },
  { id: "neofetch", label: "neofetch", xp: 15 },
  { id: "ls", label: "ls", xp: 10 },
  { id: "cd", label: "cd", xp: 10 },
  { id: "cat", label: "cat", xp: 15 },
  { id: "resume", label: "resume", xp: 20 },
  { id: "theme", label: "theme", xp: 15 },
  { id: "scan", label: "scan", xp: 20 },
  { id: "sudo", label: "sudo", xp: 25 },
  { id: "contact", label: "open", xp: 20 },
];

const STORAGE_KEY = "aravind_portfolio_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw);
    return {
      xp: parsed.xp || 0,
      skills: new Set(parsed.skills || []),
      achievements: new Set(parsed.achievements || []),
      visitedProjects: new Set(parsed.visitedProjects || []),
      theme: parsed.theme || "green",
    };
  } catch (e) {
    return { xp: 0, skills: new Set(), achievements: new Set(), visitedProjects: new Set(), theme: "green" };
  }
}

const state = loadState();

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      xp: state.xp,
      skills: Array.from(state.skills),
      achievements: Array.from(state.achievements),
      visitedProjects: Array.from(state.visitedProjects),
      theme: state.theme,
    })
  );
}

function renderHud() {
  const grid = $("#skill-grid");
  if (grid) {
    grid.innerHTML = "";
    SKILLS.forEach((s) => {
      const chip = document.createElement("span");
      chip.className = "skill-chip" + (state.skills.has(s.id) ? " unlocked" : "");
      chip.textContent = s.label;
      grid.appendChild(chip);
    });
  }
  const skillsCount = $("#skills-count");
  if (skillsCount) skillsCount.textContent = `(${state.skills.size}/${SKILLS.length})`;
}

function grantSkill(id, printFn) {
  const skill = SKILLS.find((s) => s.id === id);
  if (!skill) return;
  if (!state.skills.has(id)) {
    state.skills.add(id);
    state.xp += skill.xp;
    renderHud();
    saveState();
    if (printFn) {
      printFn(
        `<div class="achievement-msg">[skill-discovery] new skill unlocked: <b>${skill.label}</b></div>`
      );
    }
  }
}

function grantAchievement(id, text, printFn) {
  if (state.achievements.has(id)) return;
  state.achievements.add(id);
  state.xp += 30;
  renderHud();
  saveState();
  if (printFn) {
    printFn(`<div class="achievement-msg">[achievement unlocked] ${text}</div>`);
  }
}

const outputEl = () => $("#term-output");

function print(html) {
  const wrap = document.createElement("div");
  wrap.className = "term-block";
  wrap.innerHTML = html;
  outputEl().appendChild(wrap);
  outputEl().scrollTop = outputEl().scrollHeight;
}

function printPlain(text) {
  const div = document.createElement("div");
  div.className = "term-line";
  div.textContent = text;
  outputEl().appendChild(div);
  outputEl().scrollTop = outputEl().scrollHeight;
}

function printEcho(pathLabel, cmd) {
  const div = document.createElement("div");
  div.className = "term-line echo-row";
  div.innerHTML = `<span class="echo-prompt">aravind@portfolio</span>:<span class="echo-prompt-path">${escapeHtml(pathLabel)}</span>$ ${escapeHtml(cmd)}`;
  outputEl().appendChild(div);
  outputEl().scrollTop = outputEl().scrollHeight;
}

function row(a, b) {
  return `<tr><td class="k out-ok">${a}</td><td>${b}</td></tr>`;
}

function renderProjectCard(name, index) {
  const proj = PROJECTS[name];
  const readable = PROJECT_READABLE[name];
  if (!proj || !readable) return "";
  const tagHtml = proj.tags.map((tag) => `<span class="out-tag">${escapeHtml(tag)}</span>`).join("");
  const highlights = readable.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return [
    `<article class="project-card">`,
    `  <div class="project-kicker">project ${String(index + 1).padStart(2, "0")} / ${PROJECT_ORDER.length}</div>`,
    `  <h3>${escapeHtml(proj.title)}</h3>`,
    `  <div class="project-meta"><span>${escapeHtml(proj.year)}</span>${tagHtml}</div>`,
    `  <p>${escapeHtml(readable.short)}</p>`,
    `  <ul>${highlights}</ul>`,
    `  <div class="project-impact"><span>Impact</span>${escapeHtml(readable.impact)}</div>`,
    `  <div class="project-actions">${actionButton("Open detail", `cat projects/${name}`)}</div>`,
    `</article>`,
  ].join("");
}

function renderProjectsOverview() {
  return [
    agentThread([
      { agent: "router-agent", html: `Routing request to <span class="out-ok">project-index</span>.` },
      { agent: "project-index", html: `Summarized ${PROJECT_ORDER.length} projects for fast scanning.` },
    ]),
    `<section class="readable-view">`,
    `  <div class="readable-head">`,
    `    <span class="out-heading">Selected Projects</span>`,
    `    <span class="out-dim">Readable mode</span>`,
    `  </div>`,
    `  <div class="project-list">${PROJECT_ORDER.map(renderProjectCard).join("")}</div>`,
    `</section>`,
  ].join("");
}

function renderProjectDetail(name) {
  const proj = PROJECTS[name];
  const readable = PROJECT_READABLE[name];
  if (!proj || !readable) return "";
  const tagHtml = proj.tags.map((tag) => `<span class="out-tag">${escapeHtml(tag)}</span>`).join("");
  return [
    agentThread([
      { agent: "project-index", html: `Opening <span class="out-ok">${escapeHtml(proj.title)}</span>.` },
      { agent: "impact-agent", html: `${escapeHtml(readable.impact)}` },
    ]),
    `<section class="readable-view project-detail">`,
    `  <div class="readable-head">`,
    `    <span class="out-heading">${escapeHtml(proj.title)}</span>`,
    `    <span class="out-dim">${escapeHtml(proj.year)}</span>`,
    `  </div>`,
    `  <div class="project-meta">${tagHtml}</div>`,
    `  <p>${escapeHtml(readable.short)}</p>`,
    `  <ul>${readable.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`,
    `  <div class="project-impact"><span>Impact</span>${escapeHtml(readable.impact)}</div>`,
    `  <details class="raw-detail"><summary>terminal notes</summary><div>${proj.body}</div></details>`,
    `  <div class="project-actions">${actionButton("Back to all projects", "projects")}${actionButton("Read resume", "resume")}</div>`,
    `</section>`,
  ].join("");
}

function renderResumeView() {
  return [
    agentThread([
      { agent: "profile-agent", html: `Compressed resume into a recruiter-readable briefing.` },
      { agent: "pdf-agent", html: `Your formatted PDF is at <span class="out-ok">assets/resume.pdf</span>.` },
    ]),
    `<section class="readable-view resume-view">`,
    `  <div class="readable-head">`,
    `    <span class="out-heading">Aravind E S</span>`,
    `    <span class="out-dim">AI Software Engineer</span>`,
    `  </div>`,
    `  <p class="resume-contact">${escapeHtml(LINKS.location)} | ${escapeHtml(LINKS.phone)} | <a class="out-link" href="mailto:${LINKS.email}">${escapeHtml(LINKS.email)}</a> | <a class="out-link" href="${LINKS.linkedin}" target="_blank" rel="noopener">linkedin.com/in/aravind-es</a></p>`,
    `  <div class="resume-grid">`,
    `    <section><h3>Summary</h3><p>2 years architecting and deploying production AI systems across cloud backends and edge devices — from hallucination-resistant agentic workflows (MCP, RAG) to real-time perception and CV on YOLO, SAM 2.1, OCR/VLM, including a collision-warning system that achieved U.S. safety certification.</p></section>`,
    `    <section><h3>Current Work</h3><p>Tata Elxsi AI Software Engineer, Dec 2024 - Present. Agentic inventory platform (read-only LLM agents, RAG, skill discovery), real-time perception &amp; collision warning (sensor fusion, TensorRT/Jetson, regression model, U.S. safety certification), edge CV (YOLO, SAM 2.1, OCR/VLM, RTSP).</p></section>`,
    `    <section><h3>Core Skills</h3><p>YOLO, SAM 2.1, TwinLiteNetPlus, TensorRT, CUDA, ONNX, NVIDIA Jetson, MCP, RAG, LLM Tool Calling, LangChain, LlamaIndex, Pydantic, Python, C++, FastAPI, PostgreSQL, Redis, Docker, Kubernetes, AWS EC2, AWS Bedrock, SageMaker.</p></section>`,
    `    <section><h3>Education</h3><p>MCA, Cochin University of Science and Technology. B.Sc. Physics, Mary Matha Arts and Science College. AWS Certified AI Practitioner. Rising Star Award — Tata Elxsi.</p></section>`,
    `  </div>`,
    `  <div class="resume-actions">${actionButton("Open resume.pdf", "open resume.pdf", "primary")}${actionButton("Show projects", "projects")}${actionButton("Contact", "cat contact.sh")}</div>`,
    `</section>`,
  ].join("");
}

function renderDetailsView() {
  return [
    agentThread([
      { agent: "router-agent", html: `Delegating profile context to specialist agents.` },
      { agent: "experience-agent", html: `Experience loaded: MCP, RAG, LLM Tool Calling, YOLO, SAM 2.1, TwinLiteNetPlus, TensorRT, CUDA, Jetson, sensor fusion, track-occupancy regression, Redis, PostgreSQL, Docker, Kubernetes.` },
      { agent: "fit-agent", html: `Best-fit roles: AI Software Engineer, LLM Engineer, Computer Vision Engineer, Edge AI Engineer, Agentic AI Engineer.` },
    ]),
    `<section class="readable-view">`,
    `  <div class="readable-head"><span class="out-heading">Details</span><span class="out-dim">Profile context</span></div>`,
    `  <div class="detail-grid">`,
    `    <div><span>Location</span>${escapeHtml(LINKS.location)}</div>`,
    `    <div><span>Experience</span>2 years across agentic AI, real-time perception, and edge CV</div>`,
    `    <div><span>Strength</span>Guarded LLM agents + real-time perception &amp; CV on constrained edge hardware</div>`,
    `    <div><span>Signal</span>Collision-warning system with U.S. safety certification, AWS AI Practitioner, Rising Star Award — Tata Elxsi</div>`,
    `  </div>`,
    `  <div class="resume-actions">${actionButton("Read resume", "resume")}${actionButton("Show projects", "projects")}${actionButton("Open LinkedIn", "open linkedin")}</div>`,
    `</section>`,
  ].join("");
}

let cwd = "~";
function promptPathLabel() { return cwd; }
function updatePromptPath() { $("#prompt-path").textContent = promptPathLabel(); }

const ROOT_FILES = Object.keys(FILES).filter((f) => f !== "resume.txt").concat(["resume.txt", "resume.pdf"]);
const ROOT_ENTRIES = [...ROOT_FILES, "projects/"];

function cmd_tour() {
  grantSkill("help", print);
  print(
    [
      agentThread([
        { agent: "router-agent", html: `I can drive the terminal for you. No command memorization needed.` },
        { agent: "profile-agent", html: `Best first read: resume, projects, details, contact.` },
        { agent: "project-agent", html: `Ready to summarize work in readable cards.` },
      ]),
      `<section class="readable-view">`,
      `  <div class="readable-head"><span class="out-heading">Guided Tour</span><span class="out-dim">Choose a route</span></div>`,
      `  <div class="tour-actions">`,
      actionButton("Show all projects", "projects", "primary"),
      actionButton("Read resume", "resume"),
      actionButton("Open resume.pdf", "open resume.pdf"),
      actionButton("View details", "details"),
      actionButton("Contact", "cat contact.sh"),
      `  </div>`,
      `</section>`,
    ].join("")
  );
}

function cmd_projects() {
  grantSkill("ls", print);
  PROJECT_ORDER.forEach((name) => state.visitedProjects.add(name));
  saveState();
  print(renderProjectsOverview());
  maybeCompletionAchievement();
}

function cmd_details() {
  grantSkill("whoami", print);
  print(renderDetailsView());
}

function cmd_help() {
  grantSkill("help", print);
  print(
    [
      agentThread([{ agent: "router-agent", html: `You can click actions or type commands. I understand the friendly aliases too.` }]),
      `<span class="out-heading">FRIENDLY ACTIONS</span>`,
      `<div class="tour-actions">`,
      actionButton("Show all projects", "projects", "primary"),
      actionButton("Read resume", "resume"),
      actionButton("Open resume.pdf", "open resume.pdf"),
      actionButton("Details", "details"),
      `</div>`,
      `<span class="out-heading">TERMINAL COMMANDS</span>`,
      `<table class="tt">`,
      row("tour", "guided walkthrough"),
      row("projects", "show readable project cards"),
      row("details", "show readable profile details"),
      row("help", "show this list"),
      row("whoami", "who you're talking to"),
      row("neofetch", "system summary card"),
      row("ls [dir]", "list files (try: ls, ls projects)"),
      row("cd &lt;dir&gt;", "change directory (cd projects / cd ..)"),
      row("cat &lt;file&gt;", "print a file's contents"),
      row("resume", "show readable resume"),
      row("open &lt;target&gt;", "open linkedin / email / resume.pdf"),
      row("theme &lt;name&gt;", "green (default) / amber / mono"),
      row("scan", "run a sensor sweep (easter egg)"),
      row("ask", "open AI assistant (two-step answer flow)"),
      row("sudo hire aravind", "..."),
      row("history", "your command history"),
      row("clear", "clear the screen"),
      `</table>`,
      `<span class="out-dim">Tab</span> autocompletes commands and filenames. <span class="out-dim">↑/↓</span> cycles history.`,
    ].join("\n")
  );
}

function cmd_whoami() {
  grantSkill("whoami", print);
  print(
    [
      `<span class="out-ok">aravind</span> — Aravind E S`,
      `AI Software Engineer @ Tata Elxsi, Kerala, India`,
      `Agentic AI systems · Computer vision on the edge`,
      `<span class="out-dim">type </span><span class="out-ok">about.txt</span><span class="out-dim">? no — try </span><span class="out-ok">cat about.txt</span>`,
    ].join("\n")
  );
}

function cmd_neofetch_html() {
  const art = [
    `      /\\\\      `,
    `     /  \\\\     `,
    `    / /\\\\ \\\\    `,
    `   /_/  \\\\_\\\\   `,
    `  &lt;&lt; RADAR &gt;&gt;  `,
  ];
  return (
    `<div style="display:flex; gap:22px; flex-wrap:wrap;">
      <pre style="margin:0; color:var(--green); line-height:1.3;">${art.join("\n")}</pre>
      <table class="tt">
        ${row("aravind@portfolio", "")}
        <tr><td colspan="2"><hr class="rule"></td></tr>
        ${row("Role", "AI Software Engineer")}
        ${row("Org", "Tata Elxsi")}
        ${row("Uptime", "~2 years")}
        ${row("Focus", "Agentic AI (MCP/RAG) · Computer Vision (Jetson)")}
        ${row("Cert", "AWS Certified AI Practitioner")}
        ${row("Education", "MCA, Cochin University of Sci. &amp; Tech.")}
        ${row("Location", LINKS.location)}
        ${row("Status", "Open to AI/ML roles")}
      </table>
    </div>`
  );
}

function cmd_neofetch() {
  grantSkill("neofetch", print);
  print(cmd_neofetch_html());
}

function cmd_ls(args) {
  grantSkill("ls", print);
  let target = cwd;
  if (args[0]) {
    target = args[0].replace(/\/$/, "");
    target = target === "projects" || target === "~/projects" ? "~/projects" : target;
  }
  if (target === "~" ) {
    print(
      [
        agentThread([{ agent: "file-agent", html: `Readable shortcuts are also available: <span class="out-ok">projects</span>, <span class="out-ok">resume</span>, <span class="out-ok">details</span>.` }]),
        ROOT_ENTRIES.map((e) =>
          e.endsWith("/") ? `<span class="out-heading">${e}</span>` : `<span class="out-dim">${e}</span>`
        ).join("  "),
      ].join("\n")
    );
  } else if (target === "~/projects") {
    print(
      [
        agentThread([{ agent: "project-index", html: `Use <span class="out-ok">projects</span> for the readable view, or open a file for deep notes.` }]),
        PROJECT_ORDER.map((p) => `<span class="out-dim">${p}</span>`).join("  "),
      ].join("\n")
    );
  } else {
    print(`<span class="out-error">ls: cannot access '${escapeHtml(args[0] || "")}': No such directory</span>`);
  }
}

function cmd_cd(args) {
  grantSkill("cd", print);
  const target = (args[0] || "~").replace(/\/$/, "");
  if (target === "projects" && cwd === "~") {
    cwd = "~/projects";
  } else if (target === ".." || target === "~") {
    cwd = "~";
  } else if (target === "~/projects") {
    cwd = "~/projects";
  } else {
    print(`<span class="out-error">cd: no such directory: ${escapeHtml(args[0] || "")}</span>`);
    return;
  }
  updatePromptPath();
}

function cmd_pwd() {
  print(`<span class="out-dim">/home/${cwd.replace("~", "aravind")}</span>`);
}

function cmd_cat(args) {
  grantSkill("cat", print);
  if (!args[0]) {
    print(`<span class="out-error">cat: missing file operand</span>`);
    return;
  }
  let name = args[0];
  let inProjects = cwd === "~/projects";
  if (name.startsWith("projects/")) {
    inProjects = true;
    name = name.slice("projects/".length);
  }

  if (inProjects) {
    const proj = PROJECTS[name];
    if (!proj) {
      print(`<span class="out-error">cat: ${escapeHtml(args[0])}: No such file (try 'ls' first)</span>`);
      return;
    }
    state.visitedProjects.add(name);
    saveState();
    print(renderProjectDetail(name));
    maybeCompletionAchievement();
    return;
  }

  if (name.toLowerCase() === "resume.pdf") {
    print(
      [
        agentThread([{ agent: "pdf-agent", html: `Your resume is available at <span class="out-ok">assets/resume.pdf</span>`}]),
        `<section class="readable-view"><div class="readable-head"><span class="out-heading">resume.pdf</span><span class="out-dim">Available</span></div><div class="resume-actions">${actionButton("Open resume.pdf", "open assets/resume.pdf", "primary")}${actionButton("Read resume", "resume")}</div></section>`,
      ].join("")
    );
    return;
  }

  if (name === "resume") name = "resume.txt";
  if (name === "resume.txt") {
    grantSkill("resume", print);
    print(renderResumeView());
    maybeCompletionAchievement();
    return;
  }
  const content = FILES[name];
  if (!content) {
    print(`<span class="out-error">cat: ${escapeHtml(args[0])}: No such file or directory</span>`);
    return;
  }
  if (name === "resume.txt") grantSkill("resume", print);
  if (name === "contact.sh") grantSkill("contact", print);
  print(content);
  maybeCompletionAchievement();
}

function cmd_resume() {
  grantSkill("resume", print);
  print(renderResumeView());
}

function cmd_open(args) {
  const target = (args[0] || "").toLowerCase();
  if (target === "linkedin") {
    grantSkill("contact", print);
    print(`<span class="out-dim">opening</span> <a class="out-link" href="${LINKS.linkedin}" target="_blank" rel="noopener">${LINKS.linkedin}</a>`);
    window.open(LINKS.linkedin, "_blank", "noopener");
  } else if (target === "email" || target === "mail") {
    grantSkill("contact", print);
    print(`<span class="out-dim">opening mail client for</span> <a class="out-link" href="mailto:${LINKS.email}">${LINKS.email}</a>`);
    window.location.href = `mailto:${LINKS.email}`;
  } else if (target === "resume.pdf" || target === "resume" || target === "pdf") {
    grantSkill("resume", print);
    print(`<span class="out-dim">opening</span> <a class="out-link" href="assets/resume.pdf" target="_blank" rel="noopener">resume.pdf</a>`);
    window.open("assets/resume.pdf", "_blank", "noopener");
  } else {
    print(`<span class="out-error">open: unknown target. try:</span> <span class="out-ok">open linkedin</span> <span class="out-dim">/</span> <span class="out-ok">open email</span> <span class="out-dim">/</span> <span class="out-ok">open resume.pdf</span>`);
  }
}

function cmd_theme(args) {
  grantSkill("theme", print);
  const name = (args[0] || "").toLowerCase();
  const valid = ["green", "amber", "mono"];
  if (!valid.includes(name)) {
    print(`<span class="out-error">theme: choose one of</span> ${valid.map((v) => `<span class="out-ok">${v}</span>`).join(", ")}`);
    return;
  }
  document.body.classList.remove("theme-amber", "theme-mono");
  if (name === "amber") document.body.classList.add("theme-amber");
  if (name === "mono") document.body.classList.add("theme-mono");
  state.theme = name;
  saveState();
  print(`<span class="out-ok">theme set to ${name}</span>`);
}

function cmd_scan() {
  grantSkill("scan", print);
  print(`<span class="out-dim">running sensor sweep… fusing radar + camera + GPS…</span>`);
  setTimeout(() => {
    print(
      [
        `<span class="out-ok">1 object detected</span>`,
        `  class        : Software Engineer`,
        `  specialty    : Agentic AI · Computer Vision`,
        `  confidence   : 0.98`,
        `  availability : <span class="out-ok">open to opportunities</span>`,
        `<span class="out-dim">next step:</span> <span class="out-ok">open linkedin</span> <span class="out-dim">or</span> <span class="out-ok">open email</span>`,
      ].join("\n")
    );
  }, 650);
}

function cmd_sudo(args) {
  grantSkill("sudo", print);
  const rest = args.join(" ").toLowerCase();
  if (rest === "hire aravind") {
    print(`<span class="out-dim">[sudo] password for recruiter:</span> ********`);
    setTimeout(() => {
      print(
        [
          `<span class="out-ok">✓ permission granted.</span>`,
          `Initiating hiring sequence for <b>Aravind E S</b>…`,
          `  reviewing schema... <span class="out-ok">valid</span>`,
          `  checking availability... <span class="out-ok">open to full-time roles</span>`,
          `  drafting offer letter... <span class="out-error">permission denied (this part's on you)</span>`,
          ``,
          `<span class="out-dim">reach out for real:</span> <span class="out-ok">open email</span> <span class="out-dim">or</span> <span class="out-ok">open linkedin</span>`,
        ].join("\n")
      );
      grantAchievement("hire", "Recruiter Mode: Activated — ran sudo hire aravind", print);
    }, 700);
  } else {
    print(`<span class="out-error">sudo: this session enforces read-only access. nice try.</span>`);
  }
}

let cmdHistory = [];
function cmd_history() {
  if (!cmdHistory.length) {
    print(`<span class="out-dim">no history yet</span>`);
    return;
  }
  print(cmdHistory.map((c, i) => `${String(i + 1).padStart(3, " ")}  ${escapeHtml(c)}`).join("\n"));
}

function cmd_clear() {
  outputEl().innerHTML = "";
}

function cmd_ask() {
  grantSkill("ask", print);
  print(
    [
      agentThread([
        { agent: "assistant-agent", html: `I am <b>Aravind's Assistant</b> — I have memory of Aravind E S built from <span class="out-ok">assets/aravind.md</span>.` },
        { agent: "assistant-agent", html: `I can answer questions about his experience, skills, projects, education, and certifications. Out-of-scope questions are politely declined.` },
      ]),
      `<div class="readable-view">`,
      `  <div class="readable-head">`,
      `    <span class="out-heading">Aravind's Assistant</span>`,
      `    <span class="out-dim">Grounded in assets/aravind.md</span>`,
      `  </div>`,
      `  <p style="color:var(--text-dim);font-size:13px;line-height:1.6;">`,
      `    A two-step assistant that answers questions about Aravind E S — his work`,
      `    experience, projects, technical skills, education, and certifications.`,
      `    Questions outside this scope are politely declined.`,
      `  </p>`,
      `  <p style="color:var(--text-dim);font-size:13px;line-height:1.6;">`,
      `    The first model normalizes and scopes each prompt; a second model`,
      `    answers accepted questions using assets/aravind.md as its context.`,
      `  </p>`,
      `  <div class="tour-actions">`,
      `    ${actionButton("Open Chat", "open-chat", "primary")}`,
      `  </div>`,
      `</div>`,
    ].join("")
  );
}

function cmd_openchat() {
  openChatPanel();
}

function maybeCompletionAchievement() {
  const allProjectsSeen = PROJECT_ORDER.every((p) => state.visitedProjects.has(p));
  if (allProjectsSeen) {
    grantAchievement("all-projects", "Deep Diver — read every project file", print);
  }
}

const COMMANDS = {
  tour: cmd_tour,
  start: cmd_tour,
  projects: cmd_projects,
  details: cmd_details,
  about: cmd_details,
  help: cmd_help,
  whoami: cmd_whoami,
  neofetch: cmd_neofetch,
  ls: cmd_ls,
  cd: cmd_cd,
  pwd: cmd_pwd,
  cat: cmd_cat,
  resume: cmd_resume,
  resumes: cmd_resume,
  cv: cmd_resume,
  open: cmd_open,
  theme: cmd_theme,
  scan: cmd_scan,
  matrix: cmd_scan,
  sudo: cmd_sudo,
  ask: cmd_ask,
  rag: cmd_ask,
  chat: cmd_openchat,
  "open-chat": cmd_openchat,
  history: cmd_history,
  clear: cmd_clear,
  exit: () => print(`<span class="out-dim">there is no spoon. (also: no exit — just close the tab)</span>`),
  logout: () => print(`<span class="out-dim">there is no spoon. (also: no exit — just close the tab)</span>`),
};

function handleCommand(raw) {
  const trimmed = raw.trim();
  printEcho(promptPathLabel(), raw);
  if (!trimmed) return;

  cmdHistory.push(trimmed);
  historyPos = cmdHistory.length;

  const normalized = trimmed.toLowerCase().replace(/\s+/g, " ");
  const friendlyRoutes = {
    "show all projects": cmd_projects,
    "show projects": cmd_projects,
    "all projects": cmd_projects,
    "project details": cmd_projects,
    "read resume": cmd_resume,
    "show resume": cmd_resume,
    "show resumes": cmd_resume,
    "view resume": cmd_resume,
    "view resumes": cmd_resume,
    "show details": cmd_details,
    "view details": cmd_details,
    "who is aravind": cmd_details,
    "open pdf": () => cmd_open(["resume.pdf"]),
    "view pdf": () => cmd_open(["resume.pdf"]),
    "show pdf": () => cmd_open(["resume.pdf"]),
    "show resume pdf": () => cmd_open(["resume.pdf"]),
    "open resume pdf": () => cmd_open(["resume.pdf"]),
  };
  if (friendlyRoutes[normalized]) {
    friendlyRoutes[normalized]([]);
    return;
  }

  const parts = trimmed.split(/\s+/);
  const name = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (name === "sudo") {
    cmd_sudo(args);
    return;
  }

  const handler = COMMANDS[name];
  if (!handler) {
    print(
      `<span class="out-error">command not found: ${escapeHtml(name)}</span>  <span class="out-dim">— try</span> <span class="out-ok">help</span>`
    );
    return;
  }
  handler(args);
}

let historyPos = 0;
function autocomplete(current) {
  const parts = current.split(/\s+/);
  const isFirstWord = parts.length <= 1;
  const fragment = parts[parts.length - 1] || "";
  let pool;
  if (isFirstWord) {
    pool = Object.keys(COMMANDS);
  } else if (cwd === "~/projects") {
    pool = PROJECT_ORDER;
  } else {
    pool = ROOT_ENTRIES.map((e) => e.replace(/\/$/, ""));
  }
  const matches = pool.filter((p) => p.startsWith(fragment));
  if (matches.length === 1) {
    parts[parts.length - 1] = matches[0];
    return parts.join(" ") + (matches[0].endsWith("/") ? "" : "");
  } else if (matches.length > 1) {
    print(matches.map((m) => `<span class="out-dim">${m}</span>`).join("  "));
  }
  return current;
}

const BOOT_LINES = [
  `<span class="dim">booting portfolio-agent v1.0…</span>`,
  `<span class="dim">loading identity index</span>`,
  `<span class="ok">loaded resume.pdf, projects.json, experience.log</span>`,
  `<span class="dim">initializing session — enforcing:</span>`,
  `  <span class="ok">read-only access</span>`,
  `  <span class="ok">validated queries</span>`,
  `  <span class="ok">Pydantic-style schema checks</span>`,
  `<span class="dim">starting async skill-discovery agent…</span>`,
  `<span class="ok">skill-discovery agent online — commands unlock as you explore</span>`,
  ``,
  `<span class="amber">Welcome. This terminal is Aravind E S's portfolio.</span>`,
  `<span class="dim">agent panel is preparing guided options.</span>`,
  ``,
];

function runBoot(done) {
  const bootLog = $("#boot-log");
  let i = 0;
  function next() {
    if (i >= BOOT_LINES.length) {
      setTimeout(done, 260);
      return;
    }
    const line = document.createElement("div");
    line.innerHTML = BOOT_LINES[i];
    bootLog.appendChild(line);
    i += 1;
    setTimeout(next, 110);
  }
  next();
}

function tickClock() {
  const now = new Date();
  const opts = { timeZone: "Asia/Kolkata", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" };
  const t = new Intl.DateTimeFormat("en-GB", opts).format(now);
  $("#clock").textContent = `${t} IST`;
}

// Chat panel (terminal mode)
let chatHistory = [];
function escapeHtmlChat(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function appendChatMsg(role, html) {
  const thread = $("#chat-thread");
  const div = document.createElement("div");
  div.className = `chat-msg ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.innerHTML = html;
  div.appendChild(bubble);
  thread.appendChild(div);
  thread.scrollTop = thread.scrollHeight;
  return div;
}
function appendTypingIndicator() {
  const thread = $("#chat-thread");
  const div = document.createElement("div");
  div.className = "chat-msg bot";
  div.id = "chat-typing";
  div.innerHTML = `<div class="chat-bubble chat-typing"><div class="chat-typing-dot"></div><div class="chat-typing-dot"></div><div class="chat-typing-dot"></div></div>`;
  thread.appendChild(div);
  thread.scrollTop = thread.scrollHeight;
  return div;
}
function removeTypingIndicator() {
  const el = $("#chat-typing");
  if (el) el.remove();
}
function openChatPanel() {
  const panel = $("#chat-panel");
  panel.classList.remove("hidden");
  const thread = $("#chat-thread");
  if (thread.children.length === 0) {
    appendChatMsg("bot",
      `<strong>Aravind's Assistant</strong>\nHi! I'm Aravind's AI assistant — I have access to details about Aravind's work, skills, projects, and experience. What would you like to know?`
    );
  }
  $("#chat-input").focus();
}
function closeChatPanel() {
  $("#chat-panel").classList.add("hidden");
}
async function handleChatSubmit(rawText) {
  const text = rawText.trim();
  if (!text) return;
  appendChatMsg("user", escapeHtmlChat(text));
  chatHistory.push({ role: "user", content: text });
  const typingEl = appendTypingIndicator();
  $("#chat-send").disabled = true;
  try {
    const result = await answer(text);
    removeTypingIndicator();
    const replyHtml = result.ok === false
      ? `<span class="out-error">Refused:</span> ${escapeHtmlChat(result.text || "I can't help with that.")}`
      : result.text;
    chatHistory.push({ role: "assistant", content: replyHtml });
    appendChatMsg("bot", replyHtml);
  } catch (err) {
    removeTypingIndicator();
    appendChatMsg("bot",
      `<span class="out-error">Error:</span> ${escapeHtmlChat(err.message)}`
    );
  } finally {
    $("#chat-send").disabled = false;
    $("#chat-input").focus();
  }
}

function boot() {
  runBoot(() => {
    $("#boot-screen").classList.add("hidden");
    $("#app").classList.remove("hidden");
    if (state.theme === "amber") document.body.classList.add("theme-amber");
    if (state.theme === "mono") document.body.classList.add("theme-mono");
    renderHud();
    tickClock();
    setInterval(tickClock, 1000);
    print(
      [
        printEcho("~", "neofetch"),
        cmd_neofetch_html(),
        agentThread([
          { agent: "router-agent", html: `Session ready. Pick a route and I will run the portfolio terminal for you.` },
          { agent: "profile-agent", html: `Resume, projects, PDF, and details are ready.` },
        ]),
        `<div class="tour-actions">${actionButton("Start guided tour", "tour", "primary")}${actionButton("Show all projects", "projects")}${actionButton("Read resume", "resume")}${actionButton("Open resume.pdf", "open resume.pdf")}</div>`,
      ].join("\n")
    );
    state.skills.add("neofetch");
    renderHud();
    saveState();
    grantAchievement("boot", "Session established", () => {});

    const input = $("#term-input");
    const isTouch = "ontouchstart" in window || (navigator.maxTouchPoints || 0) > 0;
    if (!isTouch && window.innerWidth > 720) input.focus();
    if (!isTouch && window.innerWidth > 720) {
      document.querySelector(".terminal-pane").addEventListener("click", () => input.focus());
    }
    document.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-cmd]");
      if (!btn) return;
      event.preventDefault();
      const c = btn.getAttribute("data-cmd");
      if (c) {
        input.value = c;
        handleSubmit();
      }
    });
    function handleSubmit() {
      const val = input.value;
      input.value = "";
      handleCommand(val);
    }
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleSubmit();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyPos > 0) historyPos -= 1;
        input.value = cmdHistory[historyPos] || "";
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyPos < cmdHistory.length) historyPos += 1;
        input.value = cmdHistory[historyPos] || "";
      } else if (e.key === "Tab") {
        e.preventDefault();
        input.value = autocomplete(input.value);
      }
    });

    const chatForm = $("#chat-form");
    const chatInput = $("#chat-input");
    if (chatForm && chatInput) {
      chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleChatSubmit(chatInput.value);
        chatInput.value = "";
      });
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleChatSubmit(chatInput.value);
          chatInput.value = "";
        }
      });
      $("#chat-close").addEventListener("click", closeChatPanel);
    }
  });
}

export function bootTerminal() {
  // Mount the terminal DOM into the body
  const wrapper = document.createElement("div");
  wrapper.id = "terminal-mode";
  wrapper.innerHTML = TERMINAL_HTML;
  document.body.appendChild(wrapper);

  // Add a body class so terminal-only styles take effect
  document.body.classList.add("mode-terminal");

  requestAnimationFrame(() => window.scrollTo(0, 0));

  boot();
}
