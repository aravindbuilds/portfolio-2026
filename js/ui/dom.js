// js/ui/dom.js
// Lightweight DOM helpers used across both portfolio and terminal modes.

export function $(sel) {
  return document.querySelector(sel);
}

export function $$(sel) {
  return Array.from(document.querySelectorAll(sel));
}

export function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

export function actionButton(label, cmd, variant) {
  return `<button class="term-action ${variant || ""}" type="button" data-cmd="${escapeHtml(cmd)}">${escapeHtml(label)}</button>`;
}

export function agentThread(messages) {
  return `<div class="agent-thread">${messages
    .map(
      (msg) =>
        `<div class="agent-msg"><span class="agent-name">${escapeHtml(msg.agent)}</span><span class="agent-copy">${msg.html}</span></div>`
    )
    .join("")}</div>`;
}

export function createEl(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === "className") el.className = val;
    else if (key === "style" && typeof val === "object") Object.assign(el.style, val);
    else if (key.startsWith("on")) el.addEventListener(key.slice(2).toLowerCase(), val);
    else el.setAttribute(key, val);
  }
  for (const child of children) {
    if (typeof child === "string") el.appendChild(document.createTextNode(child));
    else if (child instanceof Node) el.appendChild(child);
  }
  return el;
}
