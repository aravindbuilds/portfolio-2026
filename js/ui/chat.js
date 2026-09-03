// js/ui/chat.js
// Two-step LLM chat widget. Can be mounted inline (portfolio) or as a floating panel
// (terminal). Inlines the CSS needed for the chat bubbles to avoid an extra
// stylesheet dependency.
import { answer } from "../agent/pipeline.js";
import { canQuery, recordQuery, getRemaining, getResetAt, RATE_LIMIT } from "../agent/rateLimit.js";
import { isFastPath } from "../agent/intentGate.js";
import { $ } from "./dom.js";
import { formatMarkdown } from "./markdown.js";

const CHAT_CSS = `
  .rag-answer{display:flex;flex-direction:column;gap:10px}
  .rag-section{padding:4px 0 2px}
  .rag-heading{font-size:11.5px;color:var(--green,#3dffa0);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;font-weight:600}
  .rag-section p{margin:4px 0;line-height:1.55}
  .rag-section p:first-child{margin-top:2px}
  .rag-section p:last-child{margin-bottom:0}
  .rag-footer{margin-top:4px;padding-top:8px;border-top:1px dashed var(--border,#1d2b25);font-size:11.5px;line-height:1.5}
  .chat-widget{display:flex;flex-direction:column;height:480px;max-width:640px;border:1px solid var(--border,#1d2b25);border-radius:10px;overflow:hidden;background:var(--bg,#fff)}
  .chat-widget-header{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--border,#1d2b25);background:var(--bg-raised,#f8f8f8);flex-shrink:0}
  .chat-widget-avatar{width:36px;height:36px;border-radius:50%;background:var(--green,#3dffa0);color:var(--bg,#fff);font-weight:800;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .chat-widget-title{font-size:13px;font-weight:700;color:var(--text,#333)}
  .chat-widget-sub{font-size:10px;color:var(--text-dim,#888);margin-top:2px}
  .chat-widget-thread{flex:1 1 auto;overflow-y:auto;padding:14px 14px 8px;display:flex;flex-direction:column;gap:10px;min-height:0}
  .chat-widget-msg{display:flex;gap:8px;align-items:flex-start}
  .chat-widget-msg.user{flex-direction:row-reverse}
  .chat-widget-bubble{max-width:78%;padding:8px 11px;border-radius:10px;font-size:13px;line-height:1.5;white-space:pre-wrap;word-break:break-word}
  .chat-widget-msg.bot .chat-widget-bubble{background:var(--bg-input,#f0f0f0);border:1px solid var(--border,#ddd);color:var(--text,#333);border-bottom-left-radius:2px}
  .chat-widget-msg.user .chat-widget-bubble{background:var(--green,#3dffa0);color:var(--bg,#fff);border-bottom-right-radius:2px}
  .chat-widget-typing{display:flex;gap:5px;padding:2px 0;align-items:center}
  .chat-widget-thinking{display:flex;align-items:center;gap:8px;color:var(--text-dim,#888);min-width:180px}
  .chat-widget-thinking-copy{min-width:150px}
  .chat-widget-typing-dot{width:5px;height:5px;border-radius:50%;background:var(--text-dim,#aaa);animation:blink 1.2s ease-in-out infinite}
  .chat-widget-typing-dot:nth-child(2){animation-delay:.2s}
  .chat-widget-typing-dot:nth-child(3){animation-delay:.4s}
  @keyframes blink{0%,100%{opacity:.25}50%{opacity:1}}
  .chat-widget-form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--border,#1d2b25);background:var(--bg-raised,#f8f8f8);flex-shrink:0}
  .chat-widget-input{flex:1;background:var(--bg-input,#f5f5f5);border:1px solid var(--border,#ccc);border-radius:6px;color:var(--text,#333);font-family:inherit;font-size:13px;padding:7px 10px;outline:none;caret-color:var(--green,#3dffa0)}
  .chat-widget-input:focus{border-color:var(--green,#3dffa0)}
  .chat-widget-input::placeholder{color:var(--text-faint,#aaa)}
  .chat-widget-send{background:var(--green,#3dffa0);border:none;color:var(--bg,#fff);border-radius:6px;width:36px;height:36px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .2s}
  .chat-widget-send:hover{opacity:.85}
  .chat-widget-send:disabled{opacity:.4;cursor:default}
`;

let chatHistory = []; // [{role:"user"|"assistant", content}]

function appendChatCss() {
  if (document.getElementById("chat-widget-css")) return;
  const style = document.createElement("style");
  style.id = "chat-widget-css";
  style.textContent = CHAT_CSS;
  document.head.appendChild(style);
}

function escapeHtmlChat(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function appendChatMsg(role, html) {
  const thread = $(".chat-widget-thread");
  const div = document.createElement("div");
  div.className = `chat-widget-msg ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "chat-widget-bubble";
  bubble.innerHTML = html;
  div.appendChild(bubble);
  thread.appendChild(div);
  thread.scrollTop = thread.scrollHeight;
  return div;
}

function appendTypingIndicator() {
  const thread = $(".chat-widget-thread");
  const div = document.createElement("div");
  div.className = "chat-widget-msg bot";
  div.innerHTML = `<div class="chat-widget-bubble chat-widget-thinking"><span class="chat-widget-thinking-copy"></span><span class="chat-widget-typing"><span class="chat-widget-typing-dot"></span><span class="chat-widget-typing-dot"></span><span class="chat-widget-typing-dot"></span></span></div>`;
  thread.appendChild(div);
  thread.scrollTop = thread.scrollHeight;
  const copy = div.querySelector(".chat-widget-thinking-copy");
  const phrases = ["Thinking", "Reading Aravind's profile", "Shaping a clear answer"];
  let phraseIndex = 0;
  let position = 0;
  let deleting = false;
  const timer = setInterval(() => {
    const phrase = phrases[phraseIndex];
    if (!deleting) {
      position += 1;
      copy.textContent = `${phrase.slice(0, position)}${position < phrase.length ? "|" : ""}`;
      if (position >= phrase.length) deleting = true;
    } else {
      position -= 1;
      copy.textContent = `${phrase.slice(0, position)}${position > 0 ? "|" : ""}`;
      if (position <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
  }, 75);
  return { element: div, stop: () => clearInterval(timer) };
}

function removeTypingIndicator(indicator) {
  if (!indicator) return;
  indicator.stop();
  indicator.element.remove();
}

function isGreeting(text) {
  return /^(?:h+i+y*|he+y+|hello+|hiya+|yo+|sup+|hola+|howdy+|greetings+|good\s+(?:morning|afternoon|evening))(?:\s+there)?[\s!?.,]*$/i.test(text);
}

function fastReply(text) {
  const remaining = getRemaining();
  const quota = `You have ${remaining}/${RATE_LIMIT.MAX_QUERIES} questions left today.`;
  if (isGreeting(text)) return `Hi! I'm <strong>Aravind's Assistant</strong>. Ask me about his work, skills, projects, or experience. ${quota}`;
  if (/^(thanks|thank\s+you|ty|thx|appreciate\s+it|cheers)\b/i.test(text)) return `You're welcome. Aravind is reachable at <a href="mailto:mail4aravindes@gmail.com">mail4aravindes@gmail.com</a>.`;
  return `I'm <strong>Aravind's Assistant</strong>. I can help with Aravind's professional profile, projects, skills, experience, education, and contact details.`;
}

function serviceErrorReply(error) {
  const message = String(error?.message || error).toLowerCase();
  if (message.includes("402") || message.includes("403") || message.includes("404") || message.includes("500")) {
    return `<strong>Looks like Aravind's API bill wandered off.</strong> I retried a few times, but the assistant is still offline. The wire may have been pulled. Try again later, or reach him at <a href="mailto:mail4aravindes@gmail.com">mail4aravindes@gmail.com</a>.`;
  }
  return `<strong>The assistant took the scenic route.</strong> I retried while it was thinking, but the connection is still being shy. Try again in a moment, or email <a href="mailto:mail4aravindes@gmail.com">Aravind</a> directly.`;
}

function formatResetIn(resetAt) {
  if (!resetAt) return "";
  const ms = resetAt - Date.now();
  if (ms <= 0) return "";
  const hrs = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m`;
  return "<1m";
}

function refreshQuota() {
  const el = document.querySelector(".chat-widget-quota");
  if (!el) return;
  const remaining = getRemaining();
  if (remaining > 0) {
    el.textContent = `${remaining}/${RATE_LIMIT.MAX_QUERIES} queries left`;
  } else {
    const resetAt = getResetAt();
    el.innerHTML = `<span style="color:var(--red,#ff6459)">0/${RATE_LIMIT.MAX_QUERIES} queries — resets in ${escapeHtmlChat(formatResetIn(resetAt))}</span>`;
  }
}

// Mount the chat widget into a target element. Returns a cleanup function.
export function mountChatWidget(containerEl, { initialMessage = null } = {}) {
  appendChatCss();

  containerEl.innerHTML = `
    <div class="chat-widget">
      <div class="chat-widget-header">
        <div class="chat-widget-avatar" aria-hidden="true">AE</div>
        <div>
          <div class="chat-widget-title">Aravind's Assistant</div>
          <div class="chat-widget-sub">Ask about Aravind · <span class="chat-widget-quota"></span></div>
        </div>
      </div>
      <div class="chat-widget-thread" role="log" aria-live="polite"></div>
      <form class="chat-widget-form" autocomplete="off">
        <input class="chat-widget-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ask about Aravind's work, skills, projects…" aria-label="Ask the assistant" />
        <button class="chat-widget-send" type="submit" aria-label="Send">→</button>
      </form>
    </div>
  `;

  const form = $(".chat-widget-form");
  const input = $(".chat-widget-input");
  const sendBtn = $(".chat-widget-send");
  refreshQuota();

  if (initialMessage) {
    appendChatMsg("bot", `<strong>Aravind's Assistant</strong>\n${escapeHtmlChat(initialMessage)}`);
  }

  async function handleSubmit(rawText) {
    const text = rawText.trim();
    if (!text) return;

    const fast = isFastPath(text);

    // Gating rule: block at the rate-limit step only for non-fast-path queries.
    // Fast-path queries (greeting/identity/thanks) never consume the quota.
    if (!fast && !canQuery()) {
      const resetAt = getResetAt();
      appendChatMsg("user", escapeHtmlChat(text));
      chatHistory.push({ role: "user", content: text });
      const resetMsg = resetAt ? `Resets in ${formatResetIn(resetAt)}.` : "Resets in 24h.";
      appendChatMsg(
        "bot",
        `<span style="color:var(--red,#ff6459)">Daily limit reached (${RATE_LIMIT.MAX_QUERIES}/${RATE_LIMIT.MAX_QUERIES} queries used).</span> ${escapeHtmlChat(resetMsg)} For now, you can find the same info on this page. For anything else, reach Aravind at <a class="out-link" href="mailto:mail4aravindes@gmail.com">mail4aravindes@gmail.com</a>.`
      );
      refreshQuota();
      return;
    }

    appendChatMsg("user", escapeHtmlChat(text));
    chatHistory.push({ role: "user", content: text });

    if (fast) {
      const replyHtml = fastReply(text);
      chatHistory.push({ role: "assistant", content: replyHtml });
      appendChatMsg("bot", replyHtml);
      refreshQuota();
      return;
    }

    sendBtn.disabled = true;

    const typingIndicator = appendTypingIndicator();

    try {
      const result = await answer(text);
      removeTypingIndicator(typingIndicator);
      const replyHtml = result.intent === "greeting"
        ? fastReply(text)
        : result.ok === false
        ? `<span style="color:var(--red,#ff6459)">Refused:</span> ${escapeHtmlChat(result.text || "I can't help with that.")}`
        : formatMarkdown(result.text);
      chatHistory.push({ role: "assistant", content: replyHtml });
      appendChatMsg("bot", replyHtml);

      // Count the query: any non-fast-path query goes through the LLM
      // classifier (and possibly the LLM reasoner) and so costs one of
      // the 5 daily quota. Fast-path queries (greeting/identity/thanks)
      // never hit the LLM and don't count.
      if (!fast && result.intent !== "greeting") {
        recordQuery();
      }
    } catch (err) {
      removeTypingIndicator(typingIndicator);
      appendChatMsg("bot", serviceErrorReply(err));
    } finally {
      sendBtn.disabled = false;
      input.focus();
      refreshQuota();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit(input.value);
    input.value = "";
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(input.value);
      input.value = "";
    }
  });

  input.focus();

  return () => {
    chatHistory = [];
  };
}
