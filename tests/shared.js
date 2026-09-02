// tests/shared.js
// Test helpers.
//
// Usage in test files:
//
//   import { makeSuite, test, mockLLM } from "./shared.js";
//   const { suite } = makeSuite("My Suite");
//   suite.tests.push(test("example", async ({ assert }) => { ... }));
//   export { suite };
//
// Each test file gets its own isolated suite via makeSuite().
// The runner loads each file and reads its `suite` export.
//
// For tests that need the LLM classifier, use mockLLM() to set a per-test
// fetch mock before the test runs. The mock intercepts POST /api/classify
// calls and returns the configured response.

function makeAssert() {
  return function assert(condition, message) {
    if (!condition) throw new Error(`Assertion failed: ${message}`);
  };
}

/**
 * Install a per-test fetch mock for POST /api/classify.
 * Pass null to remove the mock (back to real network / environment fetch).
 *
 * @param {{ intent: string, reason?: string } | null} response
 */
export function mockLLM(response) {
  if (response === null) {
    global.__llmMock__ = null;
    return;
  }
  global.__llmMock__ = {
    async json() { return response; },
    ok: true,
    status: 200,
  };
}

/** Intercept fetch for POST /api/classify using the installed mock. */
const _realFetch = global.fetch;
global.fetch = function mockFetch(url, opts) {
  if (typeof url === "object" && url?.href) url = url.href;
  const u = String(url);
  if (
    u.endsWith("/api/classify") ||
    u.includes("/api/classify") ||
    u === "/api/classify"
  ) {
    const mock = global.__llmMock__;
    if (mock) return Promise.resolve(mock);
    // No mock installed — fail fast so the test clearly shows what's missing
    return Promise.reject(new Error("test: no mockLLM() installed for /api/classify"));
  }
  return _realFetch.call(global, url, opts);
};

/**
 * Create an isolated suite for one test file.
 * @param {string} name  Display name for the test suite.
 */
export function makeSuite(name) {
  const suite = { name, tests: [] };

  function testCase(name, fn) {
    suite.tests.push({
      name,
      run: async () => {
        const assertFn = makeAssert();
        // Reset mock before each test
        global.__llmMock__ = null;
        await fn({ assert: assertFn });
        global.__llmMock__ = null;
      },
    });
  }

  return { suite, test: testCase };
}
