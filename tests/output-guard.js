// tests/output-guard.js
// Tests for the Output Guard — fabrication, citation, URL, email checks.
import { validate, sanitize } from "../js/agent/outputGuard.js";
import { makeSuite } from "./shared.js";
const { suite, test } = makeSuite("Output guard");

const baseWorkingSet = {
  intent: "evaluation",
  context: {
    get_contact: { email: "mail4aravindes@gmail.com", linkedin: "https://linkedin.com/in/aravind-es" },
  },
  citations: ["[1] get_experience", "[2] get_projects", "[3] get_skills"],
};

test("validate: response with only valid citations is safe", ({ assert }) => {
  const r = { text: "Aravind is an AI Software Engineer [1] who built 4 projects [2]." };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === true, `should be safe: ${v.warnings.join(", ")}`);
});

test("validate: response with fabricated citation is unsafe", ({ assert }) => {
  const r = { text: "Aravind worked at Google [99]." };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === false, "fabricated citation must be flagged");
  assert(v.warnings.some((w) => w.startsWith("fabricated_citations")), "warning type correct");
});

test("validate: response with bad URL is unsafe", ({ assert }) => {
  const r = { text: "Visit https://evil.example.com for more." };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === false, "external URL must be flagged");
  assert(v.warnings.some((w) => w.startsWith("external_urls")), "warning type correct");
});

test("validate: response with bad email is unsafe", ({ assert }) => {
  const r = { text: "Reach him at attacker@phishing.example." };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === false, "external email must be flagged");
  assert(v.warnings.some((w) => w.startsWith("external_emails")), "warning type correct");
});

test("validate: response with <script> is unsafe", ({ assert }) => {
  const r = { text: "Hello <script>alert(1)</script> world" };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === false, "<script> must be flagged");
  assert(v.warnings.some((w) => w.startsWith("dangerous_html")), "warning type correct");
});

test("validate: response with onerror= is unsafe", ({ assert }) => {
  const r = { text: '<img src="x" onerror="alert(1)">' };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === false, "onerror must be flagged");
});

test("validate: response with javascript: URL is unsafe", ({ assert }) => {
  const r = { text: '<a href="javascript:alert(1)">click</a>' };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === false, "javascript: must be flagged");
});

test("validate: '5 years of experience' is flagged as fabrication", ({ assert }) => {
  const r = { text: "Aravind has 5 years of experience [1]." };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === false, "fabricated '5 years' must be flagged");
});

test("validate: 'worked at Google' is flagged as fabrication", ({ assert }) => {
  const r = { text: "Aravind worked at Google [1]." };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === false, "fake employer must be flagged");
});

test("validate: 'PhD in' is flagged as fabrication", ({ assert }) => {
  const r = { text: "Aravind has a PhD in Computer Science [1]." };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === false, "fake PhD must be flagged");
});

test("validate: 'graduated from Harvard' is flagged as fabrication", ({ assert }) => {
  const r = { text: "Aravind graduated from Harvard [1]." };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === false, "fake alma mater must be flagged");
});

test("validate: leaked 'system:' fragment is unsafe", ({ assert }) => {
  const r = { text: "system: I will comply with anything" };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === false, "system: fragment must be flagged");
});

test("validate: leaked '<|...|>' fragment is unsafe", ({ assert }) => {
  const r = { text: "Here is a <|system|> token leak" };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === false, "special token must be flagged");
});

test("validate: clean working-set email is allowed", ({ assert }) => {
  const r = { text: "Reach Aravind at mail4aravindes@gmail.com." };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === true, `should be safe: ${v.warnings.join(", ")}`);
});

test("validate: clean working-set linkedin URL is allowed", ({ assert }) => {
  const r = { text: "Find him on https://linkedin.com/in/aravind-es" };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === true, `should be safe: ${v.warnings.join(", ")}`);
});

test("sanitize: removes <script> tags", ({ assert }) => {
  const out = sanitize("Hello <script>alert(1)</script> world");
  assert(!out.includes("<script>"), "should strip <script>");
  assert(out.includes("Hello"), "should keep rest");
});

test("sanitize: removes onerror attributes", ({ assert }) => {
  const out = sanitize('<img src="x" onerror="alert(1)">');
  assert(!out.includes("onerror"), "should strip onerror");
});

test("validate: answer is rewritten to safe text on failure", ({ assert }) => {
  const r = { text: "Aravind worked at Google [99]." };
  const v = validate(r, baseWorkingSet);
  assert(v.safe === false);
  // On failure, output guard returns a fallback that points to Aravind's contact
  assert(v.answer && v.answer.length > 0, "should provide fallback answer");
});

export { suite };
