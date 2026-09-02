// tests/run.js
// Test runner for the intent-gated agent pipeline.
// Run with: node tests/run.js
//
// Test files live alongside this file and import from ./shared.js.
// Each test file exports a `suite` with { name, tests }.

import { readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---- Browser-API stubs (modules that touch localStorage / document) ----
const localStorageMap = new Map();
global.localStorage = {
  getItem: (k) => localStorageMap.get(k) ?? null,
  setItem: (k, v) => localStorageMap.set(k, v),
  removeItem: (k) => localStorageMap.delete(k),
  clear: () => localStorageMap.clear(),
};

const stubEl = () => ({
  style: {},
  className: "",
  innerHTML: "",
  textContent: "",
  dataset: {},
  classList: { add: () => {}, remove: () => {}, toggle: () => {} },
  appendChild: () => {},
  addEventListener: () => {},
  setAttribute: () => {},
  getAttribute: () => null,
  querySelectorAll: () => [],
  querySelector: () => null,
  scrollTop: 0,
  scrollHeight: 0,
  focus: () => {},
});

global.document = {
  body: { dataset: { theme: "dark" }, classList: { add: () => {}, remove: () => {} } },
  documentElement: { setAttribute: () => {}, getAttribute: () => "dark" },
  head: { appendChild: () => {} },
  createElement: stubEl,
  createElementNS: () => stubEl(),
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  location: { search: "" },
};

global.window = {
  scrollY: 0,
  addEventListener: () => {},
  IntersectionObserver: undefined,
};

// ---- Test loader + reporter ----
async function loadSuites() {
  const files = await readdir(__dirname);
  const testFiles = files
    .filter((f) => f !== "run.js" && f !== "shared.js" && f.endsWith(".js"))
    .sort();

  const suites = [];
  for (const file of testFiles) {
    const mod = await import(`./${file}?t=${Date.now()}_${file}`);
    if (mod.suite && mod.suite.tests) suites.push(mod.suite);
  }
  return suites;
}

let passed = 0;
let failed = 0;
const failures = [];

async function main() {
  console.log("\n🧪  Intent-gated agent pipeline tests\n");
  const suites = await loadSuites();

  for (const suite of suites) {
    const suiteName = (suite && suite.name) || "<unnamed>";
    console.log(`\n${suiteName}`);
    console.log("─".repeat(Math.min(60, suiteName.length + 2)));
    for (const t of suite.tests || []) {
      const testName = (t && t.name) || "<anonymous>";
      localStorageMap.clear();
      try {
        await t.run();
        passed++;
        console.log(`  ✓ ${testName}`);
      } catch (err) {
        failed++;
        failures.push({ name: `${suiteName} > ${testName}`, error: err });
        console.error(`  ✗ ${testName}: ${err.message}`);
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  if (failed === 0) {
    console.log(`  ✅  All ${passed} tests passed`);
  } else {
    console.log(`  ❌  ${failed}/${passed + failed} tests failed`);
    failures.forEach((f) => {
      console.error(`\n   suite: ${f.name}\n   ${f.error.message}`);
      if (f.error.stack) console.error(f.error.stack.split("\n").slice(1, 4).join("\n"));
    });
  }
  console.log();

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
