// tests/scope-violations.js
// Tests for off-topic rejection and out-of-scope filtering.
// The LLM-based classifier handles these — mock the /api/classify endpoint.
import { normalize } from "../js/agent/normalizer.js";
import { evaluate } from "../js/agent/intentGate.js";
import { makeSuite, mockLLM } from "./shared.js";
const { suite, test } = makeSuite("Scope violations");

test("rejects: 'what is the weather' — LLM classifies off_topic", async ({ assert }) => {
  mockLLM({ intent: "off_topic", reason: "general knowledge" });
  const r = normalize("what is the weather today");
  const gate = await evaluate(r);
  assert(gate.allowed === false, "weather is out of scope");
  assert(gate.intent === "off_topic", `got: ${gate.intent}`);
  mockLLM(null);
});

test("rejects: 'who is the president' — LLM classifies off_topic", async ({ assert }) => {
  mockLLM({ intent: "off_topic", reason: "general knowledge" });
  const r = normalize("who is the president of france");
  const gate = await evaluate(r);
  assert(gate.allowed === false, "general question is out of scope");
  mockLLM(null);
});

test("rejects: 'tell me a joke' — LLM classifies off_topic", async ({ assert }) => {
  mockLLM({ intent: "off_topic", reason: "off-topic request" });
  const r = normalize("tell me a joke about cats");
  const gate = await evaluate(r);
  assert(gate.allowed === false, "joke request is out of scope");
  mockLLM(null);
});

test("rejects: 'what is 2+2' — LLM classifies off_topic", async ({ assert }) => {
  mockLLM({ intent: "off_topic", reason: "math question" });
  const r = normalize("what is 2+2");
  const gate = await evaluate(r);
  assert(gate.allowed === false, "math is out of scope");
  mockLLM(null);
});

// Note: "write me a python fibonacci function" contains "python" which IS in ARAVIND_TERMS
// (Aravind uses Python). So it is intentionally allowed — it would return a fact/list
// response based on Aravind's skills, rather than blocking as off-topic.

test("allows: 'what is aravind's email' — LLM classifies fact", async ({ assert }) => {
  mockLLM({ intent: "fact", reason: "contact detail query" });
  const r = normalize("what is aravind's email");
  const gate = await evaluate(r);
  assert(gate.allowed === true, "in-scope query should pass");
  mockLLM(null);
});

test("allows: 'tell me about aravind's projects' — LLM classifies list", async ({ assert }) => {
  mockLLM({ intent: "list", reason: "collection query" });
  const r = normalize("tell me about aravind's projects");
  const gate = await evaluate(r);
  assert(gate.allowed === true, "in-scope query should pass");
  mockLLM(null);
});

test("allows: 'aravind yolo' — LLM classifies evaluation", async ({ assert }) => {
  mockLLM({ intent: "evaluation", reason: "topic query" });
  const r = normalize("aravind yolo");
  const gate = await evaluate(r);
  assert(gate.allowed === true, "in-scope query should pass");
  mockLLM(null);
});

test("rejects: empty query — handled before LLM call", async ({ assert }) => {
  const r = normalize("   ");
  const gate = await evaluate(r);
  assert(gate.allowed === false, "empty query must be off-topic");
});

test("refusal text: rejection includes Aravind contact", async ({ assert }) => {
  mockLLM({ intent: "off_topic", reason: "general knowledge" });
  const r = normalize("what is the meaning of life");
  const gate = await evaluate(r);
  assert(gate.allowed === false);
  assert(
    gate.refusal.includes("Aravind") || gate.refusal.includes("mail4aravindes"),
    `refusal should point back to Aravind, got: ${gate.refusal}`
  );
  mockLLM(null);
});

export { suite };
