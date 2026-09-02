// tests/multi-hop.js
// Tests for the graph store — node lookup, edge traversal, type queries.
import {
  getNode,
  getNeighbors,
  getByType,
  traverse,
  getEvidenceForTopic,
} from "../js/agent/graphStore.js";
import { makeSuite } from "./shared.js";
const { suite, test } = makeSuite("Graph store & multi-hop");

// ── Node access ─────────────────────────────────────────────────────────
test("graphStore: candidate node exists", ({ assert }) => {
  const node = getNode("candidate:aravind");
  assert(node !== null, "candidate node must exist");
  assert(node.type === "candidate", `got type: ${node.type}`);
  assert(node.attrs.name === "Aravind E S", `got: ${node.attrs.name}`);
});

test("graphStore: experience nodes exist", ({ assert }) => {
  const exps = getByType("experience");
  assert(exps.length >= 2, `expected >= 2 experience nodes, got ${exps.length}`);
});

test("graphStore: project nodes exist", ({ assert }) => {
  const projs = getByType("project");
  assert(projs.length >= 4, `expected >= 4 project nodes, got ${projs.length}`);
});

test("graphStore: skill nodes exist", ({ assert }) => {
  const skills = getByType("skill");
  assert(skills.length >= 3, `expected >= 3 skill nodes, got ${skills.length}`);
});

test("graphStore: certification nodes exist", ({ assert }) => {
  const certs = getByType("certification");
  assert(certs.length >= 1, `expected >= 1 certification, got ${certs.length}`);
});

// ── Edge traversal ──────────────────────────────────────────────────────
test("graphStore: candidate has DID edges to experience nodes", ({ assert }) => {
  const candidate = getNode("candidate:aravind");
  const neighbors = getNeighbors(candidate.id);
  const didEdges = neighbors.filter((n) => n.rel === "DID");
  assert(didEdges.length >= 1, `expected >= 1 DID edges, got ${didEdges.length}`);
});

test("graphStore: experience has WORKED_ON edges to projects", ({ assert }) => {
  const exps = getByType("experience");
  const aiEng = exps.find((e) => e.attrs.role && e.attrs.role.includes("AI Software Engineer"));
  assert(aiEng, "AI Software Engineer node should exist");
  const neighbors = getNeighbors(aiEng.id);
  const workedOn = neighbors.filter((n) => n.rel === "WORKED_ON");
  assert(workedOn.length >= 1, `expected >= 1 WORKED_ON edge, got ${workedOn.length}`);
});

test("graphStore: project has DEMONSTRATES edges to skills", ({ assert }) => {
  const projs = getByType("project");
  const agentic = projs.find((p) => p.attrs.name && p.attrs.name.includes("Agentic"));
  if (!agentic) throw new Error("agentic inventory project node not found");
  const neighbors = getNeighbors(agentic.id);
  const demonstrates = neighbors.filter((n) => n.rel === "DEMONSTRATES");
  assert(demonstrates.length >= 1, `expected >= 1 DEMONSTRATES edge, got ${demonstrates.length}`);
});

// ── Multi-hop traversal ─────────────────────────────────────────────────
test("graphStore: traverse candidate → experience → project (2 hops)", ({ assert }) => {
  // Traverse with null rel (no filter) to get all hops
  const candidate = getNode("candidate:aravind");
  const results = traverse(candidate.id, null, 2);
  assert(results.length >= 1, `expected >= 1 result from 2-hop, got ${results.length}`);
  const firstHop = results.filter((r) => r.depth === 1);
  const secondHop = results.filter((r) => r.depth === 2);
  assert(firstHop.length >= 1, "should have 1-hop results");
  // With null rel, we should reach experience (depth 1) and projects (depth 2)
  assert(secondHop.length >= 1, "should have 2-hop results (candidate → exp → project)");
});

test("graphStore: traverse returns node + depth info", ({ assert }) => {
  const candidate = getNode("candidate:aravind");
  const results = traverse(candidate.id, "DID", 2);
  assert(results.length > 0, "should have results");
  const r = results[0];
  assert(r.node !== undefined, "should have node");
  assert(typeof r.depth === "number", "should have depth");
  assert(r.depth >= 0, "depth should be non-negative");
});

// ── Evidence by topic ──────────────────────────────────────────────────
test("graphStore: getEvidenceForTopic('rag') returns results", ({ assert }) => {
  const results = getEvidenceForTopic("rag");
  assert(Array.isArray(results), "must return array");
  assert(results.length >= 1, `expected >= 1 result for 'rag', got ${results.length}`);
});

test("graphStore: getEvidenceForTopic('yolo') returns results", ({ assert }) => {
  const results = getEvidenceForTopic("yolo");
  assert(Array.isArray(results), "must return array");
  assert(results.length >= 1, `expected >= 1 result for 'yolo', got ${results.length}`);
});

test("graphStore: getEvidenceForTopic('tensorrt') returns results", ({ assert }) => {
  const results = getEvidenceForTopic("tensorrt");
  assert(Array.isArray(results), "must return array");
  assert(results.length >= 1, `expected >= 1 result for 'tensorrt', got ${results.length}`);
});

test("graphStore: getEvidenceForTopic('redis') returns results", ({ assert }) => {
  const results = getEvidenceForTopic("redis");
  assert(Array.isArray(results), "must return array");
  assert(results.length >= 1, `expected >= 1 result for 'redis', got ${results.length}`);
});

test("graphStore: getEvidenceForTopic('sensor fusion') returns results", ({ assert }) => {
  const results = getEvidenceForTopic("sensor fusion");
  assert(Array.isArray(results), "must return array");
  assert(results.length >= 1, `expected >= 1 result for 'sensor fusion', got ${results.length}`);
});

test("graphStore: getEvidenceForTopic('unknown gibberish') returns empty", ({ assert }) => {
  const results = getEvidenceForTopic("xyzzyx gibberish nonsense");
  assert(Array.isArray(results), "must return array");
  assert(results.length === 0, `expected 0 results for gibberish, got ${results.length}`);
});

// ── Graph integrity ─────────────────────────────────────────────────────
test("graphStore: all project nodes have required attrs", ({ assert }) => {
  const projs = getByType("project");
  projs.forEach((p) => {
    assert(p.id !== undefined, `project ${p.id} missing id`);
    assert(p.attrs.name !== undefined, `project ${p.id} missing name`);
    assert(p.attrs.year !== undefined, `project ${p.id} missing year`);
  });
});

export { suite };
