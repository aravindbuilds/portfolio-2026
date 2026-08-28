/* =========================================================================
   ARAVIND E S — TERMINAL PORTFOLIO
   A small "agent" you talk to via commands. Framed the way the author's own
   production systems are: read-only access, validated inputs, and a
   skill-discovery layer that unlocks as you explore (a wink at the async
   skill-discovery agent from his rail-compliance platform).
   ========================================================================= */

(function () {
  "use strict";

  /* -----------------------------------------------------------------------
     CONTENT
     ----------------------------------------------------------------------- */

  const LINKS = {
    email: "mail4aravindes@gmail.com",
    phone: "+91 9496915905",
    linkedin: "https://linkedin.com/in/aravind-es",
    location: "Kerala, India",
  };

  const FILES = {
    "about.txt": [
      `AI Software Engineer — agentic systems &amp; real-time perception.`,
      ``,
      `Two years at Tata Elxsi, split across two worlds that don't usually`,
      `share an engineer: cloud-side LLM agents (MCP, RAG, guarded tool-`,
      `calling) and edge-side computer vision (YOLO, SAM 2.1, Jetson +`,
      `TensorRT). The common thread is the same in both — untrusted model`,
      `output does not get to touch production data or a moving vehicle`,
      `without a validated, deterministic layer in between.`,
      ``,
      `Shipped into compliance-critical environments, including a platform`,
      `that passed U.S. rail safety approval for live yard operations.`,
      ``,
      `Based in Kerala, India. MCA, Cochin University of Science &amp;`,
      `Technology. AWS Certified AI Practitioner.`,
      ``,
      `<span class="out-dim">try:</span> <span class="out-ok">cat experience.log</span>, <span class="out-ok">ls projects</span>, <span class="out-ok">cat skills.json</span>`,
    ].join("\n"),

    "experience.log": [
      `<span class="out-heading">Tata Elxsi — AI Software Engineer</span>  <span class="out-dim">Dec 2024 – Present · Kerala, IN</span>`,
      ``,
      `<span class="out-sub">[agentic ai / compliance]</span>`,
      `<span class="out-bullet">Architected a production LLM agent enforcing read-only access,</span>`,
      `  validated queries and Pydantic schemas — no hallucinated writes`,
      `  against live operational data.`,
      `<span class="out-bullet">Built a domain-grounded RAG layer fusing real-time DB state with</span>`,
      `  operating-procedure docs. Platform passed U.S. rail safety`,
      `  compliance approval for live yard operations.`,
      `<span class="out-bullet">Added Redis caching + an async skill-discovery agent that mines</span>`,
      `  usage patterns into reusable query skills, with zero added`,
      `  user-facing latency.`,
      ``,
      `<span class="out-sub">[computer vision / edge]</span>`,
      `<span class="out-bullet">Deployed YOLO, SAM 2.1 (zero-shot) and OCR/VLM on NVIDIA Jetson;</span>`,
      `  ~25% lower inference latency via TensorRT + CUDA.`,
      `<span class="out-bullet">Fused radar, camera and GPS for real-time vehicle collision-risk</span>`,
      `  analysis in multithreaded, low-latency pipelines.`,
      `<span class="out-bullet">Reconstructed live railcar inventory state from RFID, track-switch</span>`,
      `  telegrams and multi-camera detection.`,
      `<span class="out-bullet">Stabilized RTSP video (FFMPEG, GStreamer) — ~30% more stable under</span>`,
      `  degraded network conditions.`,
      `<span class="out-bullet">Owned the SQLite → PostgreSQL / Azure PostgreSQL migration for</span>`,
      `  concurrent, high-throughput workloads.`,
      ``,
      `<span class="out-heading">Tata Elxsi — AI Software Developer Intern</span>  <span class="out-dim">Jan 2024 – Jun 2024 · Kerala, IN</span>`,
      `<span class="out-bullet">Built radar point-cloud pipelines in ROS for object detection.</span>`,
      `<span class="out-bullet">Extended pretrained YOLO with dual detection heads for better recall.</span>`,
      `<span class="out-bullet">Built a multi-camera streaming backend with sockets + multithreading.</span>`,
    ].join("\n"),

    "skills.json": [
      `{`,
      `  <span class="out-sub">"agentic_ai"</span>: [<span class="out-ok">"LLM Agents"</span>, "MCP", "RAG", "LangChain", "LlamaIndex",`,
      `                  "Pydantic Schema Validation", "Gemini Function Calling"],`,
      `  <span class="out-sub">"computer_vision"</span>: ["YOLO", "SAM 2.1 (zero-shot)", "OCR/VLM", "OpenCV",`,
      `                      "TwinLiteNetPlus", "Multi-Camera Tracking", "Camera Calibration"],`,
      `  <span class="out-sub">"edge_and_inference"</span>: ["NVIDIA Jetson", "TensorRT", "CUDA", "ONNX",`,
      `                        "Model Optimization"],`,
      `  <span class="out-sub">"backend_and_infra"</span>: ["Python", "C++", "FastAPI", "PostgreSQL", "Redis",`,
      `                      "Docker", "Kubernetes", "Celery", "AWS EC2", "Nginx",`,
      `                      "GitHub Actions"],`,
      `  <span class="out-sub">"systems_and_networking"</span>: ["RTSP", "FFMPEG", "GStreamer", "TCP/IP",`,
      `                          "Socket Programming", "ROS"],`,
      `  <span class="out-sub">"languages"</span>: ["Python", "C++", "C", "SQL", "TypeScript"]`,
      `}`,
    ].join("\n"),

    "certifications.txt": [
      `<span class="out-heading">AWS Certified AI Practitioner</span>`,
      `  issued  : 10 Aug 2026`,
      `  expires : 10 Aug 2029`,
      `  verify  : <a class="out-link" href="https://aws.amazon.com/verification" target="_blank" rel="noopener">aws.amazon.com/verification</a>`,
      ``,
      `<span class="out-heading">Also completed</span>`,
      `<span class="out-bullet">AI Engineer Core Track — LLM Engineering, RAG, Agents, QLoRA</span>`,
      `<span class="out-bullet">Deep Learning A–Z: Neural Networks and AI</span>`,
      `<span class="out-bullet">OpenCV Bootcamp</span>`,
      `<span class="out-bullet">C Programming for Embedded Applications</span>`,
      `<span class="out-bullet">Google Cloud Skill Badges</span>`,
      ``,
      `<span class="out-heading">Recognition</span>`,
      `<span class="out-bullet">Rising Star Award — Tata Elxsi, for contributions to production</span>`,
      `  automotive and edge AI platforms.`,
    ].join("\n"),

    "education.txt": [
      `<span class="out-heading">Cochin University of Science and Technology</span>  <span class="out-dim">Kerala, IN</span>`,
      `  Master of Computer Applications (MCA)         2022 – 2024`,
      ``,
      `<span class="out-heading">Mary Matha Arts and Science College</span>  <span class="out-dim">Kerala, IN</span>`,
      `  B.Sc. Physics                                 2018 – 2021`,
    ].join("\n"),

    "contact.sh": [
      `<span class="out-dim">#!/bin/reach-out</span>`,
      `EMAIL="<a class="out-link" href="mailto:${LINKS.email}">${LINKS.email}</a>"`,
      `PHONE="${LINKS.phone}"`,
      `LINKEDIN="<a class="out-link" href="${LINKS.linkedin}" target="_blank" rel="noopener">linkedin.com/in/aravind-es</a>"`,
      `LOCATION="${LINKS.location}"`,
      ``,
      `<span class="out-dim"># fastest path: email or LinkedIn. open to full-time AI/ML roles.</span>`,
      `<span class="out-dim">$ echo "run"</span> <span class="out-ok">open linkedin</span> <span class="out-dim">or</span> <span class="out-ok">open email</span> <span class="out-dim">to jump straight there</span>`,
    ].join("\n"),

    "resume.txt": [
      `<span class="out-heading">ARAVIND E S</span>  —  AI Software Engineer`,
      `${LINKS.location} · ${LINKS.phone} · ${LINKS.email} · linkedin.com/in/aravind-es`,
      `<span class="rule-line"></span>`,
      `2 years architecting and deploying production AI systems across cloud`,
      `backends and edge devices — hallucination-resistant agentic workflows`,
      `(MCP, RAG) to real-time computer vision on Jetson — shipped into`,
      `compliance-critical production, including a platform that passed`,
      `U.S. rail safety approval.`,
      ``,
      `<span class="out-sub">EXPERIENCE</span>`,
      `Tata Elxsi — AI Software Engineer                    Dec 2024 – Present`,
      `  Agentic AI & Compliance Platform: read-only LLM agent, RAG layer,`,
      `  Redis-cached async skill-discovery. Passed U.S. rail safety approval.`,
      `  Computer Vision & Edge: YOLO/SAM2.1/OCR-VLM on Jetson (-25% latency`,
      `  via TensorRT/CUDA), RTSP hardening (+30% stability), SQLite→Postgres`,
      `  migration, radar+camera+GPS sensor fusion.`,
      `Tata Elxsi — AI Software Developer Intern             Jan 2024 – Jun 2024`,
      `  ROS radar point-cloud pipelines; dual-head YOLO extensions.`,
      ``,
      `<span class="out-sub">PROJECTS</span>`,
      `  Agentic AI Clinical Fall Intelligence Platform — FastAPI, MCP, Docker`,
      `  Real-Time Edge Perception & Collision Warning — ONNX, TensorRT, Jetson`,
      `  Goal Progress & Rehabilitation Intelligence — FastAPI, Pydantic, LLMs`,
      `  Recall — full-stack spaced-repetition app — FastAPI, React, Gemini`,
      ``,
      `<span class="out-sub">SKILLS</span>`,
      `  Agentic AI: LLM Agents, MCP, RAG, LangChain, LlamaIndex, Pydantic`,
      `  CV/Edge: YOLO, SAM 2.1, OCR/VLM, NVIDIA Jetson, TensorRT, CUDA, ONNX`,
      `  Backend: Python, C++, FastAPI, PostgreSQL, Redis, Docker, AWS EC2`,
      ``,
      `<span class="out-sub">EDUCATION</span>`,
      `  MCA, Cochin University of Science and Technology        2022 – 2024`,
      `  B.Sc. Physics, Mary Matha Arts and Science College      2018 – 2021`,
      ``,
      `<span class="out-sub">CERTIFICATIONS</span>  AWS Certified AI Practitioner · Rising Star Award — Tata Elxsi`,
      `<span class="rule-line"></span>`,
      `<span class="out-dim">this is the plain-text cut — for the formatted one, </span><span class="out-ok">open email</span><span class="out-dim"> or </span><span class="out-ok">open linkedin</span><span class="out-dim"> and ask.</span>`,
    ].join("\n"),
  };

  const PROJECTS = {
    "01-agentic-compliance.md": {
      title: "Agentic AI & Rail-Compliance Platform",
      year: "2024–25",
      tags: ["FastAPI", "MCP", "RAG", "Pydantic", "Redis", "PostgreSQL"],
      body: [
        `A production LLM agent sitting in front of live railcar-inventory`,
        `data — built on the assumption that a model will eventually try to`,
        `say something untrue, so the architecture is designed to make that`,
        `harmless.`,
        ``,
        `<span class="out-bullet">Read-only access, validated queries, and Pydantic schemas around</span>`,
        `  every model output — no hallucinated writes reach production data.`,
        `<span class="out-bullet">A RAG layer grounds the agent's reasoning in real-time database</span>`,
        `  state fused with operating-procedure documentation.`,
        `<span class="out-bullet">An async skill-discovery agent mines usage patterns into reusable</span>`,
        `  query "skills" in the background, with zero added user latency.`,
        ``,
        `<span class="out-dim">Outcome:</span> the platform passed U.S. rail safety compliance`,
        `approval for live yard operations — the constraint that shaped every`,
        `design decision above.`,
      ].join("\n"),
    },
    "02-edge-perception.md": {
      title: "Real-Time Edge Perception & Collision Warning",
      year: "2026",
      tags: ["ONNX", "TensorRT", "CUDA", "Jetson", "Sensor Fusion"],
      body: [
        `An edge-deployed perception pipeline for real-time vehicle-risk`,
        `analysis — camera ego-path detection fused with radar and GPS`,
        `telemetry, running on hardware that doesn't get to phone home for`,
        `more compute.`,
        ``,
        `<span class="out-bullet">TwinLiteNetPlus inference optimized through ONNX and</span>`,
        `  TensorRT/CUDA for low-latency execution on NVIDIA Jetson.`,
        `<span class="out-bullet">Sensor-fusion pipeline combining radar, camera and GPS/vehicle-state</span>`,
        `  data — more robust than any single-sensor approach.`,
        `<span class="out-bullet">Multithreaded, low-latency design built for embedded automotive</span>`,
        `  compute, memory and power budgets.`,
      ].join("\n"),
    },
    "03-fall-intelligence.md": {
      title: "Agentic AI Clinical Fall Intelligence Platform",
      year: "2025",
      tags: ["FastAPI", "MCP", "Tool Calling", "Docker", "AWS EC2"],
      body: [
        `LLM-driven analysis of clinical fall-risk data — deliberately built`,
        `so the model never touches patient data directly.`,
        ``,
        `<span class="out-bullet">Controlled, tool-based function calling (MCP / Gemini function</span>`,
        `  calling) instead of unrestricted model access to clinical records.`,
        `<span class="out-bullet">Typed API contracts define exactly what the agent can ask for and</span>`,
        `  what it gets back.`,
        `<span class="out-bullet">Containerized and deployed on AWS EC2 with Nginx reverse proxying</span>`,
        `  for isolated, production-style API routing.`,
      ].join("\n"),
    },
    "04-goal-rehab.md": {
      title: "Goal Progress & Rehabilitation Intelligence",
      year: "2026",
      tags: ["Python", "FastAPI", "Pydantic", "LLMs"],
      body: [
        `A rehabilitation-tracking platform where the numbers you can trust`,
        `and the interpretation an LLM offers are kept deliberately apart.`,
        ``,
        `<span class="out-bullet">A deterministic progress engine computes completion, velocity and</span>`,
        `  deviation from structured activity logs — no LLM in that path.`,
        `<span class="out-bullet">A separate LLM review layer reads that ground truth to surface</span>`,
        `  strengths, blockers and timeline risk in plain language.`,
        `<span class="out-bullet">Validated Pydantic contracts are the only interface between the two</span>`,
        `  layers — the analytics engine can't be talked out of the truth.`,
        ``,
        `<span class="out-dim">Ownership:</span> built and maintained the full AI/LLM backend layer`,
        `on a small team, across several iterative build sessions.`,
      ].join("\n"),
    },
    "05-recall.md": {
      title: "Recall — Spaced-Repetition Study App",
      year: "Personal",
      tags: ["FastAPI", "React", "TypeScript", "Vite", "Gemini API"],
      body: [
        `A full-stack spaced-repetition app, built for the same reason most`,
        `good side projects get built: to actually use it.`,
        ``,
        `<span class="out-bullet">FastAPI backend, React/TypeScript/Vite frontend, dark terminal-style</span>`,
        `  UI (you're looking at a descendant of that aesthetic right now).`,
        `<span class="out-bullet">Question generation refactored into a standalone importable module,</span>`,
        `  decoupled from any CLI or filesystem assumptions.`,
        `<span class="out-bullet">Migrated from the OpenAI API to Gemini mid-build.</span>`,
      ].join("\n"),
    },
  };

  const PROJECT_ORDER = [
    "01-agentic-compliance.md",
    "02-edge-perception.md",
    "03-fall-intelligence.md",
    "04-goal-rehab.md",
    "05-recall.md",
  ];

  const PROJECT_READABLE = {
    "01-agentic-compliance.md": {
      short: "Production LLM agent for live rail operations, built around read-only access and validated outputs.",
      highlights: [
        "Designed MCP-style tool access with Pydantic validation around every model response.",
        "Grounded answers with live database state plus operating procedure documents.",
        "Added an async skill-discovery agent that learns reusable query patterns without user-facing latency.",
      ],
      impact: "Helped the platform pass U.S. rail safety approval for live yard operations.",
    },
    "02-edge-perception.md": {
      short: "Real-time collision-risk perception running on NVIDIA Jetson with camera, radar, and GPS fusion.",
      highlights: [
        "Optimized TwinLiteNetPlus through ONNX, TensorRT, and CUDA for low-latency inference.",
        "Fused radar, camera, GPS, and vehicle-state data for more reliable risk analysis.",
        "Built multithreaded pipelines for embedded compute, memory, and power limits.",
      ],
      impact: "Lower-latency edge inference for automotive safety workflows.",
    },
    "03-fall-intelligence.md": {
      short: "Clinical fall-risk analysis agent where the model works through controlled tools, not raw patient data.",
      highlights: [
        "Built typed function-calling contracts for safe clinical data access.",
        "Kept model reasoning separate from sensitive records and deterministic APIs.",
        "Containerized the backend on AWS EC2 with Nginx routing.",
      ],
      impact: "A production-style agent pattern for high-trust healthcare analytics.",
    },
    "04-goal-rehab.md": {
      short: "Rehabilitation progress intelligence with deterministic metrics and a separate LLM review layer.",
      highlights: [
        "Computed completion, velocity, and timeline deviation from structured logs.",
        "Used LLMs only to explain trusted metrics in plain language.",
        "Validated the interface between analytics and language generation with Pydantic.",
      ],
      impact: "Readable progress summaries without letting the LLM rewrite the truth.",
    },
    "05-recall.md": {
      short: "Full-stack spaced-repetition study app with AI question generation.",
      highlights: [
        "Built a FastAPI backend and React/TypeScript/Vite frontend.",
        "Refactored question generation into a standalone importable module.",
        "Migrated the AI layer from OpenAI API to Gemini during the build.",
      ],
      impact: "A practical personal tool with reusable AI generation plumbing.",
    },
  };

  const RESUME_LINES = [
    "ARAVIND E S",
    "AI Software Engineer",
    "Kerala, India | +91 9496915905 | mail4aravindes@gmail.com | linkedin.com/in/aravind-es",
    "",
    "SUMMARY",
    "2 years building production AI systems across agentic backends and edge computer vision.",
    "Focus areas: MCP-style tool access, RAG, validated LLM outputs, YOLO/SAM/OCR-VLM, Jetson, TensorRT, CUDA.",
    "",
    "EXPERIENCE",
    "Tata Elxsi - AI Software Engineer | Dec 2024 - Present",
    "- Built read-only LLM agents with validated queries and Pydantic schemas for compliance-heavy operations.",
    "- Built RAG over real-time database state and operating procedure docs; platform passed U.S. rail safety approval.",
    "- Added Redis caching and async skill discovery for reusable query skills without added user latency.",
    "- Deployed YOLO, SAM 2.1, OCR/VLM, radar-camera-GPS fusion, and RTSP pipelines on edge hardware.",
    "",
    "Tata Elxsi - AI Software Developer Intern | Jan 2024 - Jun 2024",
    "- Built ROS radar point-cloud pipelines and extended YOLO with dual detection heads.",
    "- Built multi-camera streaming backend with sockets and multithreading.",
    "",
    "PROJECTS",
    "- Agentic AI & Rail-Compliance Platform: FastAPI, MCP, RAG, Pydantic, Redis, PostgreSQL.",
    "- Real-Time Edge Perception & Collision Warning: ONNX, TensorRT, CUDA, Jetson, sensor fusion.",
    "- Clinical Fall Intelligence Platform: FastAPI, MCP, tool calling, Docker, AWS EC2.",
    "- Goal Progress & Rehabilitation Intelligence: FastAPI, Pydantic, LLM review layer.",
    "- Recall Spaced-Repetition App: FastAPI, React, TypeScript, Vite, Gemini API.",
    "",
    "EDUCATION",
    "MCA, Cochin University of Science and Technology | 2022 - 2024",
    "B.Sc. Physics, Mary Matha Arts and Science College | 2018 - 2021",
    "",
    "CERTIFICATIONS",
    "AWS Certified AI Practitioner | Rising Star Award - Tata Elxsi",
  ];

  /* -----------------------------------------------------------------------
     GAMIFICATION
     ----------------------------------------------------------------------- */

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
    { id: "rank", label: "rank", xp: 10 },
    { id: "contact", label: "open", xp: 20 },
  ];

  const RANKS = [
    "Visitor",
    "Browser",
    "Analyst",
    "Recruiter",
    "Talent Scout",
    "Hiring Manager",
    "Ready to Hire",
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

  function levelFromXp(xp) {
    let level = 1;
    let needed = 40;
    let remaining = xp;
    while (remaining >= needed) {
      remaining -= needed;
      level += 1;
      needed = 40 + (level - 1) * 15;
    }
    return { level, current: remaining, needed };
  }

  function rankName(level) {
    return RANKS[Math.min(level - 1, RANKS.length - 1)];
  }

  function renderHud() {
    const { level, current, needed } = levelFromXp(state.xp);
    $("#rank-name").textContent = rankName(level);
    $("#level-num").textContent = String(level);
    $("#xp-current").textContent = String(current);
    $("#xp-needed").textContent = String(needed);
    $("#xp-bar-fill").style.width = Math.min(100, Math.round((current / needed) * 100)) + "%";

    const grid = $("#skill-grid");
    grid.innerHTML = "";
    SKILLS.forEach((s) => {
      const chip = document.createElement("span");
      chip.className = "skill-chip" + (state.skills.has(s.id) ? " unlocked" : "");
      chip.textContent = s.label;
      grid.appendChild(chip);
    });
    $("#skills-count").textContent = `(${state.skills.size}/${SKILLS.length})`;
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
          `<div class="achievement-msg">[skill-discovery] new skill unlocked: <b>${skill.label}</b> (+${skill.xp} xp)</div>`
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
      printFn(`<div class="achievement-msg">[achievement unlocked] ${text} (+30 xp)</div>`);
    }
  }

  /* -----------------------------------------------------------------------
     DOM HELPERS
     ----------------------------------------------------------------------- */

  function $(sel) {
    return document.querySelector(sel);
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
    div.innerHTML = `<span class="echo-prompt">aravind@portfolio</span>:<span class="echo-prompt-path">${escapeHtml(
      pathLabel
    )}</span>$ ${escapeHtml(cmd)}`;
    outputEl().appendChild(div);
    outputEl().scrollTop = outputEl().scrollHeight;
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function actionButton(label, cmd, variant) {
    return `<button class="term-action ${variant || ""}" type="button" data-cmd="${escapeHtml(cmd)}">${escapeHtml(label)}</button>`;
  }

  function agentThread(messages) {
    return `<div class="agent-thread">${messages
      .map(
        (msg) =>
          `<div class="agent-msg"><span class="agent-name">${escapeHtml(msg.agent)}</span><span class="agent-copy">${msg.html}</span></div>`
      )
      .join("")}</div>`;
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
        { agent: "pdf-agent", html: `Formatted PDF is available through <span class="out-ok">open resume.pdf</span>.` },
      ]),
      `<section class="readable-view resume-view">`,
      `  <div class="readable-head">`,
      `    <span class="out-heading">Aravind E S</span>`,
      `    <span class="out-dim">AI Software Engineer</span>`,
      `  </div>`,
      `  <p class="resume-contact">${escapeHtml(LINKS.location)} | ${escapeHtml(LINKS.phone)} | <a class="out-link" href="mailto:${LINKS.email}">${escapeHtml(LINKS.email)}</a> | <a class="out-link" href="${LINKS.linkedin}" target="_blank" rel="noopener">linkedin.com/in/aravind-es</a></p>`,
      `  <div class="resume-grid">`,
      `    <section><h3>Summary</h3><p>2 years building production AI systems across agentic backends and edge computer vision. Strongest in guarded LLM agents, RAG, tool calling, and real-time perception on constrained hardware.</p></section>`,
      `    <section><h3>Current Work</h3><p>Tata Elxsi AI Software Engineer, Dec 2024 - Present. Production LLM agents, compliance-safe RAG, edge CV, sensor fusion, Jetson deployment, and database migration work.</p></section>`,
      `    <section><h3>Core Skills</h3><p>LLM Agents, MCP, RAG, LangChain, LlamaIndex, Pydantic, Python, C++, FastAPI, PostgreSQL, Redis, Docker, YOLO, SAM 2.1, TensorRT, CUDA, ONNX.</p></section>`,
      `    <section><h3>Education</h3><p>MCA, Cochin University of Science and Technology. B.Sc. Physics, Mary Matha Arts and Science College. AWS Certified AI Practitioner.</p></section>`,
      `  </div>`,
      `  <div class="resume-actions">${actionButton("Open resume.pdf", "open resume.pdf", "primary")}${actionButton("Show projects", "projects")}${actionButton("Contact", "cat contact.sh")}</div>`,
      `</section>`,
    ].join("");
  }

  function renderDetailsView() {
    return [
      agentThread([
        { agent: "router-agent", html: `Delegating profile context to specialist agents.` },
        { agent: "experience-agent", html: `Experience loaded: agentic AI, RAG, MCP, edge CV, sensor fusion.` },
        { agent: "fit-agent", html: `Best-fit roles: AI Software Engineer, LLM Engineer, Computer Vision Engineer.` },
      ]),
      `<section class="readable-view">`,
      `  <div class="readable-head"><span class="out-heading">Details</span><span class="out-dim">Profile context</span></div>`,
      `  <div class="detail-grid">`,
      `    <div><span>Location</span>${escapeHtml(LINKS.location)}</div>`,
      `    <div><span>Experience</span>2 years across production AI systems</div>`,
      `    <div><span>Strength</span>Guarded LLM agents plus real-time edge perception</div>`,
      `    <div><span>Signal</span>Rail safety-approved production platform, AWS AI Practitioner, Rising Star Award</div>`,
      `  </div>`,
      `  <div class="resume-actions">${actionButton("Read resume", "resume")}${actionButton("Show projects", "projects")}${actionButton("Open LinkedIn", "open linkedin")}</div>`,
      `</section>`,
    ].join("");
  }

  function createResumePdfUrl() {
    if (createResumePdfUrl.cached) return createResumePdfUrl.cached;
    const escapePdf = (text) => text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    const streamLines = ["BT", "/F1 10 Tf", "50 790 Td", "14 TL"];
    RESUME_LINES.forEach((line, index) => {
      if (index === 0) {
        streamLines.push("/F1 18 Tf");
      } else if (index === 1) {
        streamLines.push("/F1 12 Tf");
      } else if (/^[A-Z ]+$/.test(line) && line) {
        streamLines.push("/F1 11 Tf");
      } else {
        streamLines.push("/F1 9 Tf");
      }
      streamLines.push(`(${escapePdf(line)}) Tj`);
      streamLines.push("T*");
    });
    streamLines.push("ET");
    const stream = streamLines.join("\n");
    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    ];
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((obj, i) => {
      offsets.push(pdf.length);
      pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
    });
    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
    createResumePdfUrl.cached = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
    return createResumePdfUrl.cached;
  }

  /* -----------------------------------------------------------------------
     VIRTUAL FILESYSTEM STATE
     ----------------------------------------------------------------------- */

  let cwd = "~"; // "~" or "~/projects"

  function promptPathLabel() {
    return cwd;
  }

  function updatePromptPath() {
    $("#prompt-path").textContent = promptPathLabel();
  }

  /* -----------------------------------------------------------------------
     COMMANDS
     ----------------------------------------------------------------------- */

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
        agentThread([
          { agent: "router-agent", html: `You can click actions or type commands. I understand the friendly aliases too.` },
        ]),
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
        row("sudo hire aravind", "..."),
        row("rank", "your recruiter rank &amp; unlocked skills"),
        row("history", "your command history"),
        row("clear", "clear the screen"),
        `</table>`,
        `<span class="out-dim">Tab</span> autocompletes commands and filenames. <span class="out-dim">↑/↓</span> cycles history.`,
      ].join("\n")
    );
  }

  function row(a, b) {
    return `<tr><td class="k out-ok">${a}</td><td>${b}</td></tr>`;
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

  function cmd_neofetch() {
    grantSkill("neofetch", print);
    const { level } = levelFromXp(state.xp);
    const art = [
      `      /\\\\      `,
      `     /  \\\\     `,
      `    / /\\\\ \\\\    `,
      `   /_/  \\\\_\\\\   `,
      `  &lt;&lt; RADAR &gt;&gt;  `,
    ];
    print(
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
          ${row("Visitor rank", rankName(level))}
        </table>
      </div>`
    );
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
          agentThread([{ agent: "pdf-agent", html: `The PDF is generated locally in your browser from the resume data.` }]),
          `<section class="readable-view"><div class="readable-head"><span class="out-heading">resume.pdf</span><span class="out-dim">Available</span></div><div class="resume-actions">${actionButton("Open resume.pdf", "open resume.pdf", "primary")}${actionButton("Read resume", "resume")}</div></section>`,
        ].join("")
      );
      return;
    }

    if (name === "resume") name = "resume.txt";
    if (name === "resume.pdf") {
      print(
        `<span class="out-dim">no bundled binary here — </span><span class="out-ok">cat resume.txt</span><span class="out-dim"> for the plain-text cut, or </span><span class="out-ok">open email</span><span class="out-dim"> to request the formatted PDF.</span>`
      );
      return;
    }
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
      const pdfUrl = createResumePdfUrl();
      print(`<span class="out-dim">opening</span> <a class="out-link" href="${pdfUrl}" target="_blank" rel="noopener">resume.pdf</a>`);
      window.open(pdfUrl, "_blank", "noopener");
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

  function cmd_rank() {
    grantSkill("rank", print);
    const { level, current, needed } = levelFromXp(state.xp);
    print(
      [
        `<span class="out-heading">${rankName(level)}</span>  <span class="out-dim">(level ${level})</span>`,
        `xp: ${current} / ${needed}`,
        `skills unlocked: ${state.skills.size} / ${SKILLS.length}`,
        `achievements: ${state.achievements.size}`,
      ].join("\n")
    );
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
    rank: cmd_rank,
    achievements: cmd_rank,
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

  /* -----------------------------------------------------------------------
     AUTOCOMPLETE + HISTORY (input handling)
     ----------------------------------------------------------------------- */

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

  /* -----------------------------------------------------------------------
     BOOT SEQUENCE
     ----------------------------------------------------------------------- */

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

  /* -----------------------------------------------------------------------
     CLOCK
     ----------------------------------------------------------------------- */

  function tickClock() {
    const now = new Date();
    const opts = { timeZone: "Asia/Kolkata", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" };
    const t = new Intl.DateTimeFormat("en-GB", opts).format(now);
    $("#clock").textContent = `${t} IST`;
  }

  /* -----------------------------------------------------------------------
     INIT
     ----------------------------------------------------------------------- */

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
          agentThread([
            { agent: "router-agent", html: `Session ready. Pick a route and I will run the portfolio terminal for you.` },
            { agent: "profile-agent", html: `Resume, projects, PDF, and details are ready.` },
          ]),
          `<div class="tour-actions">${actionButton("Start guided tour", "tour", "primary")}${actionButton("Show all projects", "projects")}${actionButton("Read resume", "resume")}${actionButton("Open resume.pdf", "open resume.pdf")}</div>`,
        ].join("\n")
      );
      grantAchievement("boot", "Session established", () => {});

      const input = $("#term-input");
      input.focus();

      document.querySelector(".terminal-pane").addEventListener("click", () => input.focus());

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
    });
  }

  function $$(sel) {
    return Array.from(document.querySelectorAll(sel));
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
