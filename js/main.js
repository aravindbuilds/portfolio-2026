// js/main.js
// Entry point. Dispatches to the right mode based on the ?mode= URL param.
//   ?mode=terminal  → legacy terminal experience (boot, HUD, prompt, RAG chat)
//   (default)       → modern recruiter-friendly portfolio
//
// Both modes are dynamically imported so users only pay for the JS they
// actually load.

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");

if (mode === "terminal") {
  import("./mode/terminal.js").then((m) => m.bootTerminal());
} else {
  import("./mode/portfolio.js").then((m) => m.mountPortfolio());
}
