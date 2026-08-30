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
      `AI Software Engineer — 2 years architecting and deploying production AI`,
      `systems across cloud backends and edge devices, from hallucination-`,
      `resistant agentic workflows (MCP, RAG, guarded tool-calling) to real-`,
      `time perception and computer vision on foundational models (YOLO, SAM 2.1,`,
      `OCR/VLM). The common thread: untrusted model output never touches`,
      `production data or a moving vehicle without a validated, deterministic`,
      `layer in between.`,
      ``,
      `Two flagship systems shipped into compliance-critical production:`,
      `<span class="out-bullet">Agentic Inventory Intelligence Platform</span>`,
      `  — read-only LLM agents over live railcar inventory, domain-grounded`,
      `  RAG, Redis-cached skill discovery. Passed U.S. rail safety approval.`,
      `<span class="out-bullet">Real-Time Perception &amp; Collision Warning System</span>`,
      `  — camera + radar + GPS sensor fusion, TwinLiteNetPlus on Jetson,`,
      `  trained regression model for track occupancy prediction. Achieved`,
      `  U.S. safety certification for production deployment.`,
      ``,
      `Based in Kerala, India. MCA, Cochin University of Science &amp;`,
      `Technology. AWS Certified AI Practitioner.`,
      ``,
      `<span class="out-dim">try:</span> <span class="out-ok">cat experience.log</span>, <span class="out-ok">ls projects</span>, <span class="out-ok">cat skills.json</span>`,
    ].join("\n"),

    "experience.log": [
      `<span class="out-heading">Tata Elxsi — AI Software Engineer</span>  <span class="out-dim">Dec 2024 – Present · Kerala, India</span>`,
      ``,
      `<span class="out-sub">[sub-project: agentic inventory intelligence]</span>`,
      `<span class="out-bullet">Architected a production LLM agent enforcing read-only access,</span>`,
      `  validated queries, and Pydantic schemas — no hallucinated responses`,
      `  on live operational data.`,
      `<span class="out-bullet">Engineered a domain-grounded RAG layer fusing real-time DB state</span>`,
      `  with operating-procedure documentation for reliable, auditable agent`,
      `  reasoning.`,
      `<span class="out-bullet">Implemented Redis caching and an async skill-discovery agent that</span>`,
      `  mines usage patterns for reusable query skills without adding`,
      `  user-facing latency.`,
      `<span class="out-bullet">Engineered the data layer (RFID, track-switch telegrams, PostgreSQL,</span>`,
      `  Redis) to reconstruct real-time inventory location and movement state`,
      `  from fused sensor input.`,
      `<span class="out-bullet">Owned migration of the core data layer from SQLite to PostgreSQL</span>`,
      `  and Azure PostgreSQL for concurrent, high-throughput workloads.`,
      ``,
      `<span class="out-sub">[sub-project: real-time perception &amp; collision prediction]</span>`,
      `<span class="out-bullet">Developed perception inference pipelines with TensorRT, CUDA, and NVIDIA</span>`,
      `  Jetson — reducing model inference latency by ~25%.`,
      `<span class="out-bullet">Built sensor-fusion pipeline combining radar, camera, GPS, and</span>`,
      `  vehicle-state signals for real-time collision-risk analysis.`,
      `<span class="out-bullet">Trained and optimized a regression model for track occupancy and</span>`,
      `  future railcar position prediction (classical ML + deep learning).`,
      `<span class="out-bullet">Delivered a collision-warning system that achieved U.S. safety</span>`,
      `  certification for production deployment.`,
      `<span class="out-bullet">Optimized RTSP streaming (FFMPEG, GStreamer) — ~30% more</span>`,
      `  stable under degraded network conditions.`,
      `<span class="out-bullet">Reduced end-to-end processing latency by ~20% through</span>`,
      `  debugging, profiling, and system-level optimization.`,
      ``,
      `<span class="out-sub">[sub-project: computer vision &amp; edge deployment]</span>`,
      `<span class="out-bullet">Deployed and optimized CV workloads (YOLO, SAM 2.1 zero-shot,</span>`,
      `  OCR/VLM, multi-camera tracking, camera calibration) on NVIDIA Jetson`,
      `  for constrained compute, memory, and power budgets.`,
      ``,
      `<span class="out-heading">Tata Elxsi — AI Software Developer Intern</span>  <span class="out-dim">Jan 2024 – Jun 2024 · Kerala, India</span>`,
      `<span class="out-bullet">Developed modified YOLO architectures with dual detection heads</span>`,
      `  for extended detection capabilities on pretrained models.`,
      `<span class="out-bullet">Built radar point-cloud processing pipelines using ROS for</span>`,
      `  real-time perception systems.`,
      `<span class="out-bullet">Developed a multi-camera streaming backend with sockets and</span>`,
      `  multithreading for real-time inference systems.`,
    ].join("\n"),

    "skills.json": [
      `{`,
      `  <span class="out-sub">"ai_ml_cv"</span>: [<span class="out-ok">"YOLO"</span>, "SAM 2.1", "TwinLiteNetPlus", "OCR/VLM",`,
      `                    "OpenCV", "Camera Calibration", "Multi-Camera Tracking",`,
      `                    "Deep Learning", "Model Optimization", "QLoRA", "MLflow"],`,
      `  <span class="out-sub">"genai_agentic"</span>: ["LLM Agents", "LLM Engineering", "RAG",`,
      `                         "Agentic Workflows", "LLM Tool Calling", "MCP",`,
      `                         "LangChain", "LlamaIndex", "Pydantic Schema Validation"],`,
      `  <span class="out-sub">"edge_sensor"</span>: ["NVIDIA Jetson", "Edge Inference", "ROS",`,
      `                        "Radar Point Clouds", "Sensor Fusion",`,
      `                        "Low-Latency Pipeline", "Multithreading"],`,
      `  <span class="out-sub">"inference_opt"</span>: ["TensorRT", "CUDA", "ONNX", "Model Optimization"],`,
      `  <span class="out-sub">"backend_apis"</span>: ["Python", "C++", "FastAPI", "Flask", "REST APIs",`,
      `                          "Microservices", "Pydantic", "Celery"],`,
      `  <span class="out-sub">"databases"</span>: ["PostgreSQL", "SQLite", "Redis"],`,
      `  <span class="out-sub">"cloud_devops"</span>: ["Docker", "Kubernetes", "AWS EC2", "AWS Bedrock",`,
      `                          "SageMaker", "Azure", "Google Cloud", "Nginx", "Git"],`,
      `  <span class="out-sub">"networking"</span>: ["RTSP", "FFMPEG", "GStreamer", "TCP/IP",`,
      `                        "Socket Programming", "Linux"],`,
      `  <span class="out-sub">"languages"</span>: ["Python", "C++", "C", "SQL", "TypeScript"]`,
      `}`,
    ].join("\n"),

    "certifications.txt": [
      `<span class="out-heading">AWS Certified AI Practitioner</span>`,
      `  issued  : 10 Aug 2026`,
      `  expires : 10 Aug 2029`,
      `  verify  : <a class="out-link" href="https://aws.amazon.com/verification" target="_blank" rel="noopener">aws.amazon.com/verification</a>`,
      ``,
      `<span class="out-heading">AI Engineer Core Track</span>`,
      `<span class="out-bullet">LLM Engineering, RAG, Agents, QLoRA</span>`,
      `<span class="out-bullet">Deep Learning A–Z: Neural Networks and AI</span>`,
      `<span class="out-bullet">OpenCV Bootcamp</span>`,
      `<span class="out-bullet">Google Cloud Skill Badges</span>`,
      `<span class="out-bullet">C Programming for Embedded Applications</span>`,
      ``,
      `<span class="out-heading">Recognition</span>`,
      `<span class="out-bullet">Rising Star Award — Tata Elxsi, for contributions to production</span>`,
      `  automotive and edge AI platforms.`,
    ].join("\n"),

    "education.txt": [
      `<span class="out-heading">Cochin University of Science and Technology</span>  <span class="out-dim">Kerala, India</span>`,
      `  Master of Computer Applications (MCA)             2022 – 2024`,
      ``,
      `<span class="out-heading">Mary Matha Arts and Science College</span>  <span class="out-dim">Kerala, India</span>`,
      `  Bachelor of Science in Physics                   2018 – 2021`,
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
      `backends and edge devices — from hallucination-resistant agentic workflows`,
      `(MCP, RAG) to real-time computer vision pipelines on foundational models`,
      `(YOLO, SAM 2.1, OCR/VLM), including a collision-warning system that`,
      `achieved U.S. safety certification for production deployment.`,
      ``,
      `<span class="out-sub">EXPERIENCE</span>`,
      `Tata Elxsi — AI Software Engineer                    Dec 2024 – Present`,
      `  Agentic AI & Compliance Platform: read-only LLM agent, RAG layer,`,
      `  Redis-cached async skill-discovery, Pydantic validation.`,
      `  Computer Vision & Edge: YOLO/SAM 2.1/OCR-VLM on Jetson (~25%`,
      `  lower latency via TensorRT/CUDA), collision-warning system that`,
      `  achieved U.S. safety certification, SQLite→Postgres migration,`,
      `  trained and optimized regression model for track occupancy`,
      `  and future railcar position (classical ML + deep learning).`,
      `Tata Elxsi — AI Software Developer Intern             Jan 2024 – Jun 2024`,
      `  ROS radar point-cloud pipelines; dual-head YOLO extensions;`,
      `  multi-camera streaming backend.`,
      ``,
      `<span class="out-sub">PROJECTS</span>`,
      `  Agentic Inventory Intelligence Platform — FastAPI, MCP, RAG, Redis, PostgreSQL`,
      `  Real-Time Edge Perception & Collision Warning — ONNX, TensorRT, Jetson, Regression`,
      `  Agentic AI Clinical Fall Intelligence Platform — FastAPI, MCP, Docker, AWS EC2`,
      `  Goal Progress & Rehabilitation Intelligence — FastAPI, Pydantic, LLMs`,
      ``,
      `<span class="out-sub">SKILLS</span>`,
      `  Agentic AI: LLM Agents, MCP, LLM Tool Calling, RAG, LangChain,`,
      `              LlamaIndex, Pydantic, Agentic Workflows`,
      `  CV/Edge: YOLO, SAM 2.1, OCR/VLM, NVIDIA Jetson, TensorRT, CUDA,`,
      `           ONNX, Model Optimization`,
      `  Backend: Python, C++, FastAPI, PostgreSQL, Redis, Docker, AWS EC2,`,
      `           AWS Bedrock, SageMaker, Kubernetes, Celery, Nginx, Git`,
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
    "01-agentic-inventory.md": {
      title: "Agentic AI Inventory Intelligence Platform",
      year: "2024–25",
      tags: ["FastAPI", "MCP", "RAG", "Pydantic", "Redis", "PostgreSQL"],
      body: [
        `A production LLM agent sitting in front of live railcar-inventory`,
        `data — built on the assumption that a model will eventually try to`,
        `say something untrue, so the architecture is designed to make that`,
        `harmless. Used as a reference platform for the rail safety case.`,
        ``,
        `<span class="out-bullet">Read-only access, validated queries, and Pydantic schemas</span>`,
        `  around every model output — no hallucinated writes reach`,
        `  production data.`,
        `<span class="out-bullet">A RAG layer grounds the agent's reasoning in real-time database</span>`,
        `  state fused with operating-procedure documentation.`,
        `<span class="out-bullet">Redis caching + an async skill-discovery agent mines usage</span>`,
        `  patterns into reusable query skills with zero user-facing latency.`,
        `<span class="out-bullet">Sensor-data layer (RFID, track-switch telegrams, PostgreSQL,</span>`,
        `  Redis) reconstructs real-time inventory location and movement state`,
        `  from fused sensor input.`,
        ``,
        `<span class="out-dim">Outcome:</span> Platform design and architecture contributed to`,
        `U.S. rail safety compliance approval for live yard operations.`,
      ].join("\n"),
    },
    "02-edge-perception.md": {
      title: "Real-Time Edge Perception & Collision Warning System",
      year: "2026",
      tags: ["ONNX", "TensorRT", "CUDA", "Jetson", "Sensor Fusion", "Regression"],
      body: [
        `An edge-deployed perception pipeline integrating camera ego-path`,
        `detection with radar and GPS telemetry for real-time vehicle-risk`,
        `analysis, running on hardware that doesn't get to phone home for`,
        `more compute. Includes a trained and optimized regression model that`,
        `predicts track occupancy and future railcar position to anticipate`,
        `collision risk before it shows up in the sensor stream.`,
        ``,
        `<span class="out-bullet">Object detection (TwinLiteNetPlus) optimized via ONNX and</span>`,
        `  TensorRT/CUDA for low-latency execution on NVIDIA Jetson edge`,
        `  hardware.`,
        `<span class="out-bullet">Sensor-fusion pipeline combining camera ego-path detection with</span>`,
        `  radar and GPS telemetry for more robust risk analysis.`,
        `<span class="out-bullet">Trained and optimized a regression model for track occupancy</span>`,
        `  and future railcar position prediction, comparing classical`,
        `  estimators (XGBoost / LightGBM on engineered features)`,
        `  against deep learning approaches.`,
        `<span class="out-bullet">Built multithreaded, low-latency pipelines for embedded</span>`,
        `  automotive compute, memory and power budgets.`,
        ``,
        `<span class="out-dim">Outcome:</span> the collision-warning system achieved U.S. safety`,
        `certification for production deployment.`,
      ].join("\n"),
    },
    "03-fall-intelligence.md": {
      title: "Agentic AI Clinical Fall Intelligence Platform",
      year: "2025",
      tags: ["FastAPI", "MCP", "LLM Tool Calling", "Docker", "AWS EC2"],
      body: [
        `An agentic platform executing LLM-driven analysis on clinical fall-`,
        `risk data via controlled, tool-based function calling (MCP) rather`,
        `than unrestricted model access.`,
        ``,
        `<span class="out-bullet">LLM-driven analysis runs through typed function-calling</span>`,
        `  contracts, never against clinical records directly.`,
        `<span class="out-bullet">Automated containerized production deployment on AWS EC2</span>`,
        `  with Nginx reverse proxying for isolated API routing.`,
      ].join("\n"),
    },
    "04-goal-rehab.md": {
      title: "Goal Progress & Rehabilitation Intelligence Platform",
      year: "2026",
      tags: ["Python", "FastAPI", "Pydantic", "LLMs"],
      body: [
        `A rehabilitation-tracking platform where the numbers you can trust`,
        `and the interpretation an LLM offers are kept deliberately apart.`,
        ``,
        `<span class="out-bullet">Care staff define weighted patient goals, tasks, and milestones;</span>`,
        `  progress is computed deterministically from structured activity`,
        `  logs — no LLM in that path.`,
        `<span class="out-bullet">A separate LLM review layer reads that ground truth to surface</span>`,
        `  strengths, blockers, and timeline risk in plain language.`,
        `<span class="out-bullet">Validated Pydantic data contracts are the only interface between</span>`,
        `  the analytics engine and the AI review layer — the analytics`,
        `  engine cannot be talked out of the truth.`,
      ].join("\n"),
    },
  };

  const PROJECT_ORDER = [
    "01-agentic-inventory.md",
    "02-edge-perception.md",
    "03-fall-intelligence.md",
    "04-goal-rehab.md",
  ];

  const PROJECT_READABLE = {
    "01-agentic-inventory.md": {
      short: "Production LLM agent for live railcar inventory with read-only access, domain-grounded RAG, and a skill-discovery layer.",
      highlights: [
        "Architected read-only LLM agent with Pydantic schema validation — no hallucinated writes reach production data.",
        "Built RAG grounding agent reasoning in live database state and operating-procedure documentation.",
        "Added Redis caching and async skill-discovery that learns reusable query patterns without added latency.",
        "Engineered the sensor data layer (RFID, track-switch telegrams, PostgreSQL, Redis) for real-time inventory tracking.",
      ],
      impact: "Platform design contributed to U.S. rail safety compliance approval for live yard operations.",
    },
    "02-edge-perception.md": {
      short: "Real-time edge perception and collision warning on NVIDIA Jetson, fusing camera, radar, GPS, and a track-occupancy regression model.",
      highlights: [
        "Optimized TwinLiteNetPlus object detection through ONNX, TensorRT, and CUDA for low-latency Jetson inference.",
        "Fused camera ego-path detection with radar and GPS telemetry for robust risk analysis.",
        "Trained and optimized a regression model for track occupancy and future railcar position (classical ML + deep learning).",
        "Built multithreaded pipelines for embedded automotive compute, memory, and power limits.",
      ],
      impact: "The collision-warning system achieved U.S. safety certification for production deployment.",
    },
    "03-fall-intelligence.md": {
      short: "Clinical fall-risk analysis agent where the model works through controlled tools, not raw patient data.",
      highlights: [
        "Built typed function-calling contracts (MCP) for safe clinical data access.",
        "Kept model reasoning separate from sensitive records via deterministic APIs.",
        "Containerized the backend on AWS EC2 with Nginx reverse proxying.",
      ],
      impact: "A production-style agent pattern for high-trust healthcare analytics.",
    },
    "04-goal-rehab.md": {
      short: "Rehabilitation progress intelligence with deterministic metrics and a separate LLM review layer.",
      highlights: [
        "Computed completion, velocity, and timeline deviation from structured activity logs — no LLM in that path.",
        "Used LLMs only to explain trusted metrics in plain language.",
        "Validated the interface between analytics and language generation with Pydantic.",
      ],
      impact: "Readable progress summaries without letting the LLM rewrite the truth.",
    },
  };

  const RESUME_LINES = [
    "ARAVIND E S",
    "AI Software Engineer",
    "Kerala, India | +91 9496915905 | mail4aravindes@gmail.com | linkedin.com/in/aravind-es",
    "",
    "SUMMARY",
    "AI Software Engineer with 2 years architecting and deploying production AI",
    "systems across cloud backends and edge devices, from hallucination-resistant",
    "agentic workflows (MCP, RAG) to real-time perception and computer vision on",
    "foundational models (YOLO, SAM 2.1, OCR/VLM), including a collision-warning",
    "system that achieved U.S. safety certification for production deployment.",
    "",
    "EXPERIENCE",
    "Tata Elxsi - AI Software Engineer | Dec 2024 - Present",
    "- Architected a production LLM agent enforcing read-only access, validated queries, and Pydantic schemas.",
    "- Engineered a domain-grounded RAG layer fusing real-time DB state with operating-procedure documentation.",
    "- Implemented Redis caching and an async skill-discovery agent that mines usage patterns for reusable query skills.",
    "- Engineered the sensor-data layer (RFID, track-switch telegrams, PostgreSQL, Redis) for real-time inventory tracking.",
    "- Deployed CV workloads (YOLO, SAM 2.1, OCR/VLM, multi-camera tracking) on NVIDIA Jetson — ~25% lower inference latency.",
    "- Developed sensor-fusion pipelines (radar, camera, GPS, vehicle-state) for real-time collision-risk analysis.",
    "- Trained and optimized a regression model for track occupancy and future railcar position (classical ML + DL).",
    "- Delivered a collision-warning system that achieved U.S. safety certification for production deployment.",
    "- Stabilized RTSP streaming (FFMPEG, GStreamer) — ~30% more stable under degraded network conditions.",
    "- Reduced end-to-end processing latency by ~20% through debugging, profiling, and system-level optimization.",
    "- Owned SQLite -> PostgreSQL / Azure PostgreSQL migration for concurrent, high-throughput production workloads.",
    "",
    "Tata Elxsi - AI Software Developer Intern | Jan 2024 - Jun 2024",
    "- Developed modified YOLO architectures with dual detection heads for extended detection on pretrained models.",
    "- Built radar point-cloud processing pipelines using ROS for real-time perception systems.",
    "- Developed multi-camera streaming backend with sockets and multithreading for real-time inference systems.",
    "",
    "PROJECTS",
    "- Agentic AI Inventory Intelligence Platform: FastAPI, MCP, RAG, Redis, PostgreSQL (2024-25).",
    "- Real-Time Edge Perception & Collision Warning System: ONNX, TensorRT, Jetson, Sensor Fusion, Regression (2026).",
    "- Agentic AI Clinical Fall Intelligence Platform: FastAPI, MCP, LLM Tool Calling, Docker, AWS EC2 (2025).",
    "- Goal Progress & Rehabilitation Intelligence Platform: Python, FastAPI, Pydantic, LLMs (2026).",
    "",
    "TECHNICAL SKILLS",
    "AI/ML & CV: YOLO, SAM 2.1, TwinLiteNetPlus, OCR/VLM, OpenCV, Deep Learning, Model Optimization, QLoRA, MLflow",
    "GenAI & Agentic: LLM Agents, LLM Engineering, RAG, Agentic Workflows, LLM Tool Calling, MCP, LangChain, LlamaIndex",
    "Edge & Sensors: NVIDIA Jetson, Edge Inference, ROS, Radar Point Clouds, Sensor Fusion, Low-Latency Pipeline Design",
    "Inference Opt: TensorRT, CUDA, ONNX, Model Optimization",
    "Backend & APIs: Python, C++, FastAPI, Flask, REST APIs, Microservices, Pydantic, Celery",
    "Databases: PostgreSQL, SQLite, Redis",
    "Cloud & DevOps: Docker, Kubernetes, AWS EC2, AWS Bedrock, SageMaker, Azure, Google Cloud, Nginx, Git",
    "Networking: RTSP, FFMPEG, GStreamer, TCP/IP, Socket Programming, Linux",
    "",
    "EDUCATION",
    "MCA - Cochin University of Science and Technology | 2022 - 2024",
    "B.Sc. Physics - Mary Matha Arts and Science College | 2018 - 2021",
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

  /* ========================================================================
     RAG MODULE
     ======================================================================== */

  // ---- Config ----
  const RAG_CONFIG = {
    topK: 3,               // how many chunks to retrieve
    minScore: 0.05,        // discard chunks below this similarity threshold
    useHybrid: true,       // enable hybrid BM25 + cosine retrieval
  };

  // ---- BM25 hyperparameters (standard defaults for technical documents) ----
  const BM25_K1 = 1.5;  // term frequency saturation (1.0-2.0, higher = more saturation)
  const BM25_B = 0.75;  // document length normalization (0.0-1.0, higher = longer docs normalized more)

  // ---- Persona / system prompt ----
  const PERSONA = {
    name: "Aravind's Assistant",
    about: "Aravind E S — AI Software Engineer at Tata Elxsi, Kerala, India. Specializes in guarded LLM agents (MCP, RAG), real-time computer vision on edge hardware (YOLO, SAM 2.1, Jetson, TensorRT), and sensor fusion. 2 years of production experience including a U.S. safety-certified collision-warning system and a rail-safety-approved agentic platform. MCA from Cochin University. AWS Certified AI Practitioner.",
    greeting: "Hi! I'm Aravind's AI assistant — I have access to details about Aravind's work, skills, projects, and experience. What would you like to know?",
    outOfScope: [
      "I can only answer questions about Aravind E S — his experience, skills, projects, education, certifications, or contact details. For everything else, you'll need to reach him directly.",
      "I'm specifically scoped to Aravind E S's professional profile. If your question is about something else, please reach out to him at mail4aravindes@gmail.com.",
      "This assistant is designed to answer questions about Aravind E S's background only. For general knowledge, technical help, or other topics, Aravind is reachable at mail4aravindes@gmail.com.",
    ],
  };

  // ---- Knowledge base: loaded from assets/aravind.md ----
  let KNOWLEDGE_BASE = null; // [{text, tokens, ...}]

  // ---- Multi-word phrase dictionary ----
  // Preserves entity meaning like "Tata Elxsi", "computer vision", etc.
  // Extract key phrases from the profile markdown to prevent tokenization
  // from splitting them into meaningless single tokens.
  const PHRASE_DICTIONARY = new Set([
    "tata elxsi", "computer vision", "artificial intelligence", "machine learning",
    "deep learning", "sensor fusion", "edge deployment", "collision warning",
    "rtsp streaming", "gstreamer pipeline", "redis caching", "postgresql",
    "azure postgresql", "fastapi flask", "mlflow", "qlora", "pyndantic",
    "nvidia jetson", "nvidia tensorrt", "cuda kernel", "twinlitenetplus",
    "you only look once", "segment anything", "robot operating system",
    "optical character recognition", "vision language model", "tata elxsi",
    "collision warning system", "sensor fusion pipeline", "real-time perception",
    "model context protocol", "retrieval augmented generation", "quantized low-rank",
  ]);

  // ---- Chunk builder ----
  // Splits markdown into semantic chunks on heading boundaries
  function buildChunks(markdown) {
    const rawSections = markdown.split(/(?=^#{1,3} |^---$)/m);
    let parentSection = null;
    const chunks = [];

    rawSections.forEach(rawText => {
      if (!rawText.trim()) return;
      const headingMatch = rawText.match(/^(#{1,3})\s+(.+?)$/m);
      if (!headingMatch) return;

      const level = headingMatch[1].length;
      const heading = headingMatch[2].trim();

      if (level === 2) {
        parentSection = heading;
      }

      const body = rawText
        .replace(/^#.*$/mg, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      if (body.length <= 30) return;

      // Build searchable text: include parent heading for sub-sections
      const parentPrefix = parentSection && level >= 3 ? `${parentSection} > ` : "";
      const searchText = `${parentPrefix}${heading}\n\n${body}`;

      chunks.push({
        heading,
        headingLevel: level,
        parentSection,
        text: body,
        searchText,
      });
    });

    return chunks;
  }

  // ---- Acronym & Synonym Dictionary ----
  // Expands common AI/ML acronyms and terms for broader matching
  const SYNONYM_DICT = {
    // Acronym expansions
    "ml": ["machine learning"],
    "ai": ["artificial intelligence"],
    "cv": ["computer vision"],
    "nlp": ["natural language processing"],
    "rl": ["reinforcement learning"],
    "qlora": ["quantized low-rank adaptation"],
    "tfidf": ["term frequency inverse document frequency"],
    "rag": ["retrieval augmented generation"],
    "mcp": ["model context protocol"],
    "llm": ["large language model"],
    "gpu": ["graphics processing unit"],
    "cpu": ["central processing unit"],
    "api": ["application programming interface"],

    // Domain synonyms
    "yolo": ["you only look once", "object detection"],
    "sam": ["segment anything model"],
    "tensorrt": ["nvidia tensorrt"],
    "onnx": ["open neural network exchange"],
    "fastapi": ["fast api"],
    "flask": ["flask framework"],
    "ros": ["robot operating system"],
    "postgres": ["postgresql"],
    "sqlite": ["sqlite3"],
    "rfid": ["radio frequency identification"],
    "gps": ["global positioning system"],
    "iot": ["internet of things"],
  };

  // ---- Enhanced tokenizer with phrase preservation ----
  // Tokenizes text while preserving multi-word phrases as single tokens
  // This prevents "Tata Elxsi" from becoming ["tata", "elxsi"]
  function phraseAwareTokenize(str) {
    const lower = str.toLowerCase();
    const tokens = [];
    let i = 0;

    while (i < lower.length) {
      let matched = false;

      // Try to match longest multi-word phrase first
      const sortedPhrases = Array.from(PHRASE_DICTIONARY).sort(
        (a, b) => b.length - a.length
      );

      for (const phrase of sortedPhrases) {
        const phraseLen = phrase.length;
        // Check if phrase matches at current position
        if (lower.slice(i, i + phraseLen) === phrase) {
          tokens.push(phrase);
          i += phraseLen;
          matched = true;
          break;
        }
      }

      if (matched) continue;

      // Fallback: extract single alphanumeric word
      const match = lower.slice(i).match(/[a-z0-9]+/);
      if (match) {
        tokens.push(match[0]);
        i += match[0].length;
      } else {
        i++;
      }
    }

    return tokens;
  }

  // ---- Expand query terms with synonyms/acronyms ----
  // Adds semantic expansions so "ml" searches also match "machine learning"
  function expandQueryTerms(terms) {
    const expanded = new Set();

    for (const term of terms) {
      // Always include the original term
      expanded.add(term);

      // Check for acronym expansion (lowercase lookup)
      const lower = term.toLowerCase();
      if (SYNONYM_DICT[lower]) {
        for (const syn of SYNONYM_DICT[lower]) {
          expanded.add(syn);
        }
      }

      // Reverse lookup: if term is a value, add the key
      for (const [key, values] of Object.entries(SYNONYM_DICT)) {
        if (values.includes(term) && !expanded.has(key)) {
          expanded.add(key);
        }
      }
    }

    return Array.from(expanded);
  }

  // ---- BM25 Scoring Function ----
  // Better than TF-IDF at handling term frequency saturation
  // k1=1.5: term frequency saturation (default)
  // b=0.75: document length normalization (default)
  function bm25Score(queryTokens, chunkText, idf, k1 = BM25_K1, b = BM25_B) {
    const tokens = phraseAwareTokenize(chunkText);
    const docLen = tokens.length;

    // Build term frequency map
    const termFreq = {};
    for (const token of tokens) {
      termFreq[token] = (termFreq[token] || 0) + 1;
    }

    let score = 0;
    const seen = new Set();

    for (const term of queryTokens) {
      // Avoid double-counting same term in query
      if (seen.has(term)) continue;
      seen.add(term);

      if (!idf[term]) continue; // term not in corpus

      const tf = termFreq[term] || 0;
      const idfVal = idf[term];

      // BM25: idf * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * docLen/avgDocLen))
      const saturation = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * docLen / 50)); // avgDocLen ~50
      score += idfVal * saturation;
    }

    return score;
  }

  // ---- Enrich chunks with semantic tags for better matching ----
  // Adds derived content that improves both BM25 and cosine similarity
  function enrichChunksForSearch(chunks) {
    return chunks.map(chunk => {
      const text = chunk.searchText || chunk.text;
      const lowerText = text.toLowerCase();

      const semanticTags = [];

      // Extract skill-based tags
      const skillKeywords = [
        "yolo", "sam", "tensorrt", "cuda", "onnx", "fastapi",
        "postgresql", "redis", "docker", "kubernetes", "jetson",
        "python", "c++", "sql", "ml", "ai", "computer vision",
        "deep learning", "nlp", "mcp", "rag", "qlora", "pyndantic",
        "twinlitenetplus", "ros", "rfid", "gps", "iot",
      ];

      skillKeywords.forEach((skill) => {
        if (lowerText.includes(skill)) {
          semanticTags.push(`skill:${skill}`);
        }
      });

      // Entity/location tags
      if (lowerText.includes("tata elxsi")) {
        semanticTags.push("company:tata-elxsi");
        semanticTags.push("experience:enterprise-ai");
      }
      if (lowerText.includes("kerala")) {
        semanticTags.push("location:kerala");
      }
      if (lowerText.includes("rail") || lowerText.includes("safety")) {
        semanticTags.push("domain:rail-safety");
        semanticTags.push("application:safety-critical");
      }

      // Platform/cloud tags
      if (lowerText.includes("aws")) semanticTags.push("cloud:aws");
      if (lowerText.includes("azure")) semanticTags.push("cloud:azure");
      if (lowerText.includes("docker")) semanticTags.push("deployment:docker");
      if (lowerText.includes("kubernetes")) semanticTags.push("deployment:kubernetes");

      // Project type tags
      if (lowerText.includes("perception")) semanticTags.push("project:perception");
      if (lowerText.includes("collision")) semanticTags.push("project:collision-warning");
      if (lowerText.includes("sensor")) semanticTags.push("project:sensor-fusion");
      if (lowerText.includes("agentic")) semanticTags.push("project:agentic-ai");

      return {
        ...chunk,
        semanticTags,
        // Enhanced search text combining original with semantic tags
        searchTextEnhanced: `${text} ${semanticTags.join(" ")}`,
      };
    });
  }

  // ---- TF-IDF + Cosine functions (updated for hybrid retrieval) ----
  function buildIdf(chunks) {
    const docFreq = {};
    chunks.forEach(chunk => {
      const uniqueTerms = new Set(
        phraseAwareTokenize(chunk.searchTextEnhanced || chunk.searchText || chunk.text)
      );
      uniqueTerms.forEach(t => { docFreq[t] = (docFreq[t] || 0) + 1; });
    });
    const N = chunks.length;
    return Object.fromEntries(
      Object.entries(docFreq).map(([t, df]) => [t, Math.log((N + 1) / (df + 1))])
    );
  }

  function buildTfIdfVec(tokens, idf) {
    const tf = {};
    tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
    const maxTf = Math.max(...Object.values(tf), 1);
    return Object.fromEntries(
      Object.entries(tf).map(([t, f]) => [t, (f / maxTf) * (idf[t] || 0)])
    );
  }

  function cosineSim(a, b) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    let dot = 0, magA = 0, magB = 0;
    keys.forEach(k => {
      dot += (a[k] || 0) * (b[k] || 0);
      magA += (a[k] || 0) ** 2;
      magB += (b[k] || 0) ** 2;
    });
    return dot / (Math.sqrt(magA) * Math.sqrt(magB) + 1e-9);
  }

  // ---- Hybrid Retrieval: BM25 Keyword + Cosine Semantic ----
  // Combines keyword matching strength (BM25) with semantic similarity (cosine)
  // This fixes both the "Tata Elxsi" problem (BM25 phrase matching) AND
  // the "computer vision" semantic problem (cosine similarity)
  function hybridRetrieveChunks(query, chunks, idf, k = 3, minScore = 0.05) {
    // Phase 1: Preprocess query - expand with synonyms + phrase tokenize
    const rawTokens = phraseAwareTokenize(query);
    const expandedTokens = expandQueryTerms(rawTokens);
    const qTokens = phraseAwareTokenize(expandedTokens.join(" "));

    // Phase 2: BM25 keyword scoring (excellent for exact phrases, acronyms)
    const bm25Results = chunks
      .map(chunk => ({
        chunk,
        score: bm25Score(qTokens, chunk.searchTextEnhanced || chunk.searchText || chunk.text, idf),
      }))
      .filter(r => r.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, k);

    // Phase 3: Cosine similarity on enriched text (excellent for semantic meaning)
    // Use the enhanced search text that includes semantic tags
    const enrichedChunks = enrichChunksForSearch(chunks);
    const queryForCosine = phraseAwareTokenize(expandedTokens.join(" "));

    const cosineResults = enrichedChunks
      .map(chunk => ({
        chunk,
        score: cosineSim(
          buildTfIdfVec(qTokens, idf),
          buildTfIdfVec(phraseAwareTokenize(chunk.searchTextEnhanced), idf)
        ),
      }))
      .filter(r => r.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, k);

    // Phase 4: Hybrid scoring - combine both methods
    // Weighted: 50% BM25 + 30% Cosine + 20% phrase match count
    const scoredResults = new Map();

    // Seed with BM25 results
    bm25Results.forEach((result, idx) => {
      const key = JSON.stringify(result.chunk);
      scoredResults.set(key, {
        chunk: result.chunk,
        bm25Score: result.score,
        cosineScore: 0,
        phraseMatchCount: 0,
        rankSum: idx + 1,
      });
    });

    // Add/boost with cosine results
    cosineResults.forEach((result, idx) => {
      const key = JSON.stringify(result.chunk);
      if (!scoredResults.has(key)) {
        scoredResults.set(key, {
          chunk: result.chunk,
          bm25Score: 0,
          cosineScore: result.score,
          phraseMatchCount: 0,
          rankSum: idx + k + 1, // offset rank
        });
      } else {
        scoredResults.get(key).cosineScore = result.score;
        scoredResults.get(key).rankSum += idx + k + 1;
      }
    });

    // Count phrase matches for additional boosting
    const queryLower = query.toLowerCase();
    chunks.forEach(chunk => {
      const textLower = (chunk.searchText || chunk.text).toLowerCase();
      const matches = qTokens.filter(term => textLower.includes(term)).length;
      if (matches > 0) {
        const key = JSON.stringify(chunk);
        if (scoredResults.has(key)) {
          scoredResults.get(key).phraseMatchCount = matches;
        } else {
          scoredResults.set(key, {
            chunk,
            bm25Score: 0,
            cosineScore: 0,
            phraseMatchCount: matches,
            rankSum: chunks.length + 1,
          });
        }
      }
    });

    // Compute final hybrid score: weighted combination
    const hybridResults = Array.from(scoredResults.values())
      .map(result => {
        // Hybrid formula: BM25(0.5) + Cosine(0.3) + Phrase(0.2)
        const hybridScore = (
          result.bm25Score * 0.5 +
          result.cosineScore * 0.3 +
          result.phraseMatchCount * 0.2
        );

        return {
          ...result,
          finalScore: hybridScore,
          // Normalize: ensure we have at least some score
          displayScore: hybridScore > 0 ? hybridScore : 0.01,
        };
      })
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, k);

    // Return chunks sorted by hybrid score, with chunk fields flattened so
    // downstream callers (ragGenerate) can read heading / parentSection /
    // text directly instead of going through .chunk.
    return hybridResults.map(r => ({
      ...r.chunk,
      bm25Score: r.bm25Score,
      cosineScore: r.cosineScore,
      phraseMatchCount: r.phraseMatchCount,
      finalScore: r.finalScore,
      relevanceScore: r.finalScore,
    }));
  }

  // Out-of-scope detection (unchanged)

  // Out-of-scope detection: check if query is about Aravind at all
  function isOutOfScope(query) {
    const aravindTerms = [
      "aravind", "es", "tata elxsi", "ai engineer", "ml", "llm", "rag", "mcp",
      "jetson", "yolo", "sam", "tensorrt", "cuda", "onnx", "fastapi", "docker",
      "postgresql", "redis", "python", "c++", "resume", "cv", "experience",
      "project", "skill", "certification", "education", "portfolio", "contact",
      "linkedin", "rail", "sensor", "fusion", "edge", "computer vision",
      "collision", "warning", "rehabilitation", "healthcare", "agentic", "aws",
    ];
    const queryLower = query.toLowerCase();
    const hits = aravindTerms.filter(t => queryLower.includes(t)).length;
    return hits === 0;
  }

  // Load knowledge base from assets/aravind.md (fetched once, cached in memory)
  let _kbFetchPromise = null;
  function loadKnowledgeBase() {
    if (KNOWLEDGE_BASE) return Promise.resolve(KNOWLEDGE_BASE);
    if (_kbFetchPromise) return _kbFetchPromise;
    _kbFetchPromise = fetch("assets/aravind.md")
      .then(r => r.ok ? r.text() : null)
      .then(text => {
        if (!text) { KNOWLEDGE_BASE = []; return []; }
        KNOWLEDGE_BASE = buildChunks(text);
        return KNOWLEDGE_BASE;
      })
      .catch(() => { KNOWLEDGE_BASE = []; return []; });
    return _kbFetchPromise;
  }

  // Build IDF once knowledge base is loaded
  let _idf = null;
  function ensureIdf() {
    if (!_idf && KNOWLEDGE_BASE && KNOWLEDGE_BASE.length > 0) {
      _idf = buildIdf(KNOWLEDGE_BASE);
    }
    return _idf;
  }

  // ---- RAG generator (extractive — no external API required) ----

  // Greeting / small-talk patterns — answered with a short identity line,
  // not a KB lookup. Keeps the chat feeling responsive.
  const GREETING_PATTERNS = /^(hi|hello|hey|hiya|yo|sup|hola|howdy|greetings|good\s+(morning|afternoon|evening))\b[!.?]*\s*$/i;
  const IDENTITY_PATTERNS = /^(who\s+are\s+you|what\s+are\s+you|are\s+you\s+(real|an?\s+ai|a\s+bot|human)|what\s+is\s+this)\b[?!.]*\s*$/i;
  const THANKS_PATTERNS = /^(thanks|thank\s+you|ty|thx|appreciate\s+it|cheers)\b[!.]*\s*$/i;

  function isGreeting(q) {
    return GREETING_PATTERNS.test(q.trim());
  }

  function isIdentityQuestion(q) {
    return IDENTITY_PATTERNS.test(q.trim());
  }

  function isThanks(q) {
    return THANKS_PATTERNS.test(q.trim());
  }

  // Strip markdown noise from a chunk for display. The KB is trusted, so we
  // also return this text as HTML (no escaping in the bot reply path).
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

  async function ragGenerate(userQuery) {
    const q = (userQuery || "").trim();
    if (!q) return { done: true, text: PERSONA.greeting };

    // Conversational shortcuts
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
    // signal AND isn't a single short word (so casual phrasings like
    // "contact" or "phone" still get a chance to hit the KB).
    if (q.split(/\s+/).length > 1 && isOutOfScope(q)) {
      const reply = PERSONA.outOfScope[Math.floor(Math.random() * PERSONA.outOfScope.length)];
      return { done: true, text: reply };
    }

    await loadKnowledgeBase();
    const idf = ensureIdf();

    // Retrieve relevant context chunks (use a lower threshold so short
    // single-word queries like "skills" still get a hit)
    const threshold = q.split(/\s+/).length === 1 ? 0.0 : RAG_CONFIG.minScore;
    let chunks = [];
    if (idf && KNOWLEDGE_BASE.length > 0) {
      // Use hybrid retrieval: BM25 keyword matching + cosine semantic similarity
      // This combines exact phrase matching ("Tata Elxsi") with semantic similarity
      // ("computer vision" meaning) for maximum accuracy
      chunks = hybridRetrieveChunks(
        q,
        KNOWLEDGE_BASE,
        idf,
        RAG_CONFIG.topK,
        RAG_CONFIG.minScore
      );
    }

    if (chunks.length === 0) {
      return {
        done: true,
        text: `I couldn't find a specific answer to that in Aravind's profile. For anything specific, reach him at <a class="out-link" href="mailto:mail4aravindes@gmail.com">mail4aravindes@gmail.com</a> or <a class="out-link" href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn</a>.`,
      };
    }

    // Build a clean HTML response. Deduplicate chunks that came from the
    // same parent section, and prefer the most relevant representative.
    const seenParents = new Set();
    const deduped = [];
    for (const c of chunks) {
      const key = c.parentSection || c.heading;
      if (seenParents.has(key)) continue;
      seenParents.add(key);
      deduped.push(c);
      if (deduped.length >= 2) break;
    }

    const sections = deduped.map(c => {
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

  /* ========================================================================
     CHAT UI MODULE
     ======================================================================== */

  let chatHistory = []; // [{role:"user"|"assistant", content}]

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
      // First open: show welcome
      appendChatMsg("bot",
        `<strong>${escapeHtmlChat(PERSONA.name)}</strong>\n${escapeHtmlChat(PERSONA.greeting)}`
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
      const result = await ragGenerate(text);
      removeTypingIndicator();
      chatHistory.push({ role: "assistant", content: result.text });
      // ragGenerate returns trusted HTML (built from the local KB) — render
      // it as-is. User input is still escaped via escapeHtmlChat above.
      appendChatMsg("bot", result.text);
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
        row("ask", "open AI assistant (chat with RAG over aravind.md)"),
        row("sudo hire aravind", "..."),
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
        `    A RAG-powered assistant that answers questions about Aravind E S — his work`,
        `    experience, projects, technical skills, education, and certifications.`,
        `    Questions outside this scope are politely declined.`,
        `  </p>`,
        `  <p style="color:var(--text-dim);font-size:13px;line-height:1.6;">`,
        `    The assistant retrieves relevant context from Aravind's profile using`,
        `    <b>hybrid BM25 keyword scoring + cosine semantic similarity</b> with`,
        `    phrase-aware tokenization and acronym expansion. No external API key`,
        `    is required.`,
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
          // Pre-run neofetch so visitors see the system summary immediately.
          printEcho("~", "neofetch"),
          cmd_neofetch_html(),
          agentThread([
            { agent: "router-agent", html: `Session ready. Pick a route and I will run the portfolio terminal for you.` },
            { agent: "profile-agent", html: `Resume, projects, PDF, and details are ready.` },
          ]),
          `<div class="tour-actions">${actionButton("Start guided tour", "tour", "primary")}${actionButton("Show all projects", "projects")}${actionButton("Read resume", "resume")}${actionButton("Open resume.pdf", "open resume.pdf")}</div>`,
        ].join("\n")
      );
      // Mark the neofetch skill as already used so re-running it doesn't double-count.
      state.skills.add("neofetch");
      renderHud();
      saveState();
      grantAchievement("boot", "Session established", () => {});

      const input = $("#term-input");
      // On mobile, only focus the input when the user explicitly taps the input field.
      // On desktop, auto-focus provides a smoother experience.
      const isTouch = "ontouchstart" in window || (navigator.maxTouchPoints || 0) > 0;
      if (!isTouch) input.focus();

      // Click anywhere in terminal-pane to focus (desktop only - avoids mobile keyboard on load)
      if (!isTouch) {
        document.querySelector(".terminal-pane").addEventListener("click", () => input.focus());
      }

      // Ensure input is visible in viewport when focused (keyboard shown)
      input.addEventListener("focus", () => {
        input.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });

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
        // After content settles, ensure the input stays in view
        requestAnimationFrame(() => {
          input.scrollIntoView({ block: "nearest", behavior: "smooth" });
        });
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

      // ---- Wire up the chat panel form ----
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

  function $$(sel) {
    return Array.from(document.querySelectorAll(sel));
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
