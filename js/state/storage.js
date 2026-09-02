// js/state/storage.js
// Lightweight localStorage wrapper for theme persistence.
// Only handles theme in the new portfolio mode (gamification/XP stays in
// the terminal module's own state).

const STORAGE_KEY = "aravind_portfolio_v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw);
    return {
      theme: parsed.theme || "dark",
    };
  } catch (e) {
    return { theme: "dark" };
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadTheme() {
  return loadState().theme;
}

export function saveTheme(theme) {
  const state = loadState();
  state.theme = theme;
  saveState(state);
}
