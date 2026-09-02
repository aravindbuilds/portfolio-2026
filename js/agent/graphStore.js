// js/agent/graphStore.js
// In-memory semantic graph of Aravind's profile.
// Built once at startup from the data modules. Provides:
//   - typed node/edge storage
//   - graph traversal (neighbors, multi-hop)
//   - fast lookup by type
//   - semantic search via embedded BM25 retriever
import { LINKS } from "../data/links.js";
import { PROJECTS, PROJECT_READABLE, PROJECT_ORDER } from "../data/projects.js";
import { FILES } from "../data/files.js";
import { phraseAwareTokenize } from "../rag/tokenizer.js";

// ---- Edge relationship types ----
export const REL = {
  DID: "DID",
  WORKED_ON: "WORKED_ON",
  DEMONSTRATES: "DEMONSTRATES",
  ACHIEVED: "ACHIEVED",
  USES: "USES",
  HAS_SKILL: "HAS_SKILL",
  HAS_CERTIFICATION: "HAS_CERTIFICATION",
  HAS_EDUCATION: "HAS_EDUCATION",
  CONTACT: "CONTACT",
};

// ---- Node IDs ----
const ID = {
  CANDIDATE: "candidate:aravind",
  EXP_AI_ENG: "exp:ai-engineer",
  EXP_INTERN: "exp:intern",
  PROJ_AGENTIC: "proj:agentic-inventory",
  PROJ_EDGE: "proj:edge-perception",
  PROJ_FALL: "proj:clinical-fall",
  PROJ_REHAB: "proj:goal-rehab",
  CAP_RAG: "cap:rag",
  CAP_CV: "cap:computer-vision",
  CAP_AGENTIC: "cap:agentic",
  CAP_SENSOR: "cap:sensor-fusion",
  CAP_PROD: "cap:production-engineering",
  CAP_SAFETY: "cap:safety",
  CAP_EDGE: "cap:edge-inference",
  CAP_GUARDRAILS: "cap:guardrails",
  CAP_PERCEPTION: "cap:perception",
};

// Skill nodes keyed by normalized skill name
const skillNodes = {};
function skillId(name) { return `skill:${name.toLowerCase().replace(/\s+/g, "-")}`; }
function certId(name) { return `cert:${name.toLowerCase().replace(/\s+/g, "-")}`; }

// ---- Build nodes ----
const nodes = {
  [ID.CANDIDATE]: {
    id: ID.CANDIDATE,
    type: "candidate",
    attrs: {
      name: "Aravind E S",
      role: "AI Software Engineer",
      org: "Tata Elxsi",
      location: LINKS.location,
      email: LINKS.email,
      phone: LINKS.phone,
      linkedin: LINKS.linkedin,
      status: "Open to full-time AI/ML roles",
    },
  },
  [ID.EXP_AI_ENG]: {
    id: ID.EXP_AI_ENG,
    type: "experience",
    attrs: {
      role: "AI Software Engineer",
      company: "Tata Elxsi",
      period: "Dec 2024 – Present",
      location: "Kerala, India",
      level: "senior",
    },
  },
  [ID.EXP_INTERN]: {
    id: ID.EXP_INTERN,
    type: "experience",
    attrs: {
      role: "AI Software Developer Intern",
      company: "Tata Elxsi",
      period: "Jan 2024 – Jun 2024",
      location: "Kerala, India",
      level: "intern",
    },
  },
};

// Projects
const projectMap = {
  "01-agentic-inventory.md": ID.PROJ_AGENTIC,
  "02-edge-perception.md": ID.PROJ_EDGE,
  "03-fall-intelligence.md": ID.PROJ_FALL,
  "04-goal-rehab.md": ID.PROJ_REHAB,
};

PROJECT_ORDER.forEach((name) => {
  const proj = PROJECTS[name];
  const readable = PROJECT_READABLE[name];
  const pid = projectMap[name];
  if (!pid || !proj) return;
  nodes[pid] = {
    id: pid,
    type: "project",
    attrs: {
      name: proj.title,
      year: proj.year,
      tags: proj.tags,
      short: readable?.short || "",
      highlights: readable?.highlights || [],
      impact: readable?.impact || "",
    },
  };
});

// Capability nodes
[
  [ID.CAP_RAG, "RAG", "retrieval augmented generation"],
  [ID.CAP_CV, "Computer Vision", "computer vision"],
  [ID.CAP_AGENTIC, "Agentic AI", "agentic workflows and guarded LLM agents"],
  [ID.CAP_SENSOR, "Sensor Fusion", "camera + radar + GPS sensor fusion"],
  [ID.CAP_PROD, "Production Engineering", "production AI systems"],
  [ID.CAP_SAFETY, "Safety-Critical AI", "U.S. safety-certified systems"],
  [ID.CAP_EDGE, "Edge Inference", "NVIDIA Jetson and edge deployment"],
  [ID.CAP_GUARDRAILS, "LLM Guardrails", "hallucination-resistant agentic workflows"],
  [ID.CAP_PERCEPTION, "Real-Time Perception", "real-time perception pipelines"],
].forEach(([id, name, description]) => {
  nodes[id] = { id, type: "capability", attrs: { name, description } };
});

// Skills — parse from FILES["skills.json"]
const SKILLS_RAW = [
  { group: "ai_ml_cv", items: ["YOLO", "SAM 2.1", "TwinLiteNetPlus", "OCR/VLM", "OpenCV", "Camera Calibration", "Multi-Camera Tracking", "Deep Learning", "Model Optimization", "QLoRA", "MLflow"] },
  { group: "genai_agentic", items: ["LLM Agents", "LLM Engineering", "RAG", "Agentic Workflows", "LLM Tool Calling", "MCP", "LangChain", "LlamaIndex", "Pydantic Schema Validation"] },
  { group: "edge_sensor", items: ["NVIDIA Jetson", "Edge Inference", "ROS", "Radar Point Clouds", "Sensor Fusion", "Low-Latency Pipeline", "Multithreading"] },
  { group: "inference_opt", items: ["TensorRT", "CUDA", "ONNX", "Model Optimization"] },
  { group: "backend_apis", items: ["Python", "C++", "FastAPI", "Flask", "REST APIs", "Microservices", "Pydantic", "Celery"] },
  { group: "databases", items: ["PostgreSQL", "SQLite", "Redis"] },
  { group: "cloud_devops", items: ["Docker", "Kubernetes", "AWS EC2", "AWS Bedrock", "SageMaker", "Azure", "Google Cloud", "Nginx", "Git"] },
  { group: "languages", items: ["Python", "C++", "C", "SQL", "TypeScript"] },
];

SKILLS_RAW.forEach(({ group, items }) => {
  items.forEach((item) => {
    const sid = skillId(item);
    nodes[sid] = { id: sid, type: "skill", attrs: { name: item, group } };
    skillNodes[item.toLowerCase()] = sid;
  });
});

// Certifications
const certs = [
  "AWS Certified AI Practitioner",
  "AI Engineer Core Track",
  "Rising Star Award — Tata Elxsi",
];
certs.forEach((name) => {
  const cid = certId(name);
  nodes[cid] = { id: cid, type: "certification", attrs: { name } };
});

// Education
nodes["edu:mca"] = {
  id: "edu:mca",
  type: "education",
  attrs: { degree: "MCA", institution: "Cochin University of Science and Technology", period: "2022 – 2024" },
};
nodes["edu:bsc"] = {
  id: "edu:bsc",
  type: "education",
  attrs: { degree: "B.Sc. Physics", institution: "Mary Matha Arts and Science College", period: "2018 – 2021" },
};

// ---- Build edges ----
const edges = [];

// Candidate → Experience
edges.push({ from: ID.CANDIDATE, to: ID.EXP_AI_ENG, rel: REL.DID });
edges.push({ from: ID.CANDIDATE, to: ID.EXP_INTERN, rel: REL.DID });

// Experience → Projects
[
  [ID.EXP_AI_ENG, ID.PROJ_AGENTIC],
  [ID.EXP_AI_ENG, ID.PROJ_EDGE],
  [ID.EXP_AI_ENG, ID.PROJ_FALL],
  [ID.EXP_AI_ENG, ID.PROJ_REHAB],
  [ID.EXP_INTERN, ID.PROJ_EDGE], // intern work informed later perception project
].forEach(([from, to]) => {
  edges.push({ from, to, rel: REL.WORKED_ON });
});

// Projects → Capabilities
[
  [ID.PROJ_AGENTIC, ID.CAP_RAG],
  [ID.PROJ_AGENTIC, ID.CAP_AGENTIC],
  [ID.PROJ_AGENTIC, ID.CAP_GUARDRAILS],
  [ID.PROJ_AGENTIC, ID.CAP_PROD],
  [ID.PROJ_EDGE, ID.CAP_CV],
  [ID.PROJ_EDGE, ID.CAP_SENSOR],
  [ID.PROJ_EDGE, ID.CAP_EDGE],
  [ID.PROJ_EDGE, ID.CAP_PERCEPTION],
  [ID.PROJ_EDGE, ID.CAP_SAFETY],
].forEach(([from, to]) => {
  edges.push({ from, to, rel: REL.DEMONSTRATES });
});

// Projects → Skills (by tag)
[
  [ID.PROJ_AGENTIC, "Redis"],
  [ID.PROJ_AGENTIC, "PostgreSQL"],
  [ID.PROJ_EDGE, "TensorRT"],
  [ID.PROJ_EDGE, "CUDA"],
  [ID.PROJ_EDGE, "ONNX"],
  [ID.PROJ_EDGE, "YOLO"],
  [ID.PROJ_EDGE, "SAM 2.1"],
  [ID.PROJ_EDGE, "OCR/VLM"],
].forEach(([projId, skillName]) => {
  const sid = skillNodes[skillName.toLowerCase()];
  if (sid) edges.push({ from: projId, to: sid, rel: REL.DEMONSTRATES });
});

// Capabilities → Skills
[
  [ID.CAP_RAG, "RAG"],
  [ID.CAP_CV, "YOLO"],
  [ID.CAP_CV, "OpenCV"],
  [ID.CAP_EDGE, "NVIDIA Jetson"],
  [ID.CAP_EDGE, "TensorRT"],
  [ID.CAP_SENSOR, "Sensor Fusion"],
].forEach(([capId, skillName]) => {
  const sid = skillNodes[skillName.toLowerCase()];
  if (sid) edges.push({ from: capId, to: sid, rel: REL.USES });
});

// Candidate → Certifications
certs.forEach((name) => {
  edges.push({ from: ID.CANDIDATE, to: certId(name), rel: REL.HAS_CERTIFICATION });
});

// Candidate → Education
edges.push({ from: ID.CANDIDATE, to: "edu:mca", rel: REL.HAS_EDUCATION });
edges.push({ from: ID.CANDIDATE, to: "edu:bsc", rel: REL.HAS_EDUCATION });

// Candidate → Contact (virtual)
edges.push({ from: ID.CANDIDATE, to: ID.CANDIDATE, rel: REL.CONTACT }); // self-ref for contact lookup

// ---- Graph API ----

export function getNode(id) {
  return nodes[id] || null;
}

export function getNeighbors(nodeId, rel = null) {
  return edges
    .filter((e) => e.from === nodeId && (rel == null || e.rel === rel))
    .map((e) => ({ node: nodes[e.to], rel: e.rel }));
}

export function getByType(type) {
  return Object.values(nodes).filter((n) => n.type === type);
}

export function traverse(startId, rel = null, maxDepth = 2) {
  const visited = new Set();
  const results = [];
  const queue = [{ id: startId, depth: 0 }];

  while (queue.length) {
    const { id, depth } = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    const node = nodes[id];
    if (node) results.push({ node, depth });
    if (depth >= maxDepth) continue;
    getNeighbors(id, rel).forEach(({ node: n, rel: r }) => {
      if (!visited.has(n.id)) queue.push({ id: n.id, depth: depth + 1 });
    });
  }

  return results;
}

// Find all skills that a project or capability demonstrates
export function getEvidenceForTopic(topic) {
  const topicLower = topic.toLowerCase();
  const results = [];
  const visited = new Set();

  // Search across all nodes for topic matches
  Object.values(nodes).forEach((node) => {
    const text = JSON.stringify(node.attrs).toLowerCase();
    if (text.includes(topicLower)) {
      results.push({ node, depth: 0 });
      visited.add(node.id);
    }
  });

  // Also traverse from capability nodes matching the topic
  Object.values(nodes).forEach((node) => {
    if (
      (node.type === "capability" || node.type === "skill") &&
      node.attrs.name.toLowerCase().includes(topicLower)
    ) {
      traverse(node.id, null, 1).forEach(({ node: n }) => {
        if (!visited.has(n.id)) {
          results.push({ node: n, depth: 1 });
          visited.add(n.id);
        }
      });
    }
  });

  return results;
}

export const graph = { nodes, edges };
export { skillId, certId };
