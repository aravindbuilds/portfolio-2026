// js/mode/portfolio.js
// Modern, recruiter-friendly portfolio. Replaces the terminal as the
// default experience. Sticky nav, hero, projects, experience, skills,
// contact (with inline RAG chat), footer.
import { LINKS } from "../data/links.js";
import { PROJECTS, PROJECT_READABLE, PROJECT_ORDER } from "../data/projects.js";
import { SKILLS_DATA, EXPERIENCE_DATA } from "../data/files.js";
import { mountChatWidget } from "../ui/chat.js";
import { loadTheme, saveTheme } from "../state/storage.js";
import { escapeHtml } from "../ui/dom.js";

const CURRENT_YEAR = new Date().getFullYear();

const PORTFOLIO_HTML = `
  <header class="nav" role="banner">
    <div class="nav-inner">
      <a href="#top" class="nav-brand">Aravind E S</a>
      <nav class="nav-links" aria-label="Primary">
        <a href="#projects" class="nav-link">Projects</a>
        <a href="#experience" class="nav-link">Experience</a>
        <a href="#skills" class="nav-link">Skills</a>
        <a href="#contact" class="nav-link">Contact</a>
      </nav>
      <div class="nav-actions">
        <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle theme">
          <span class="theme-icon-light" aria-hidden="true">☀</span>
          <span class="theme-icon-dark" aria-hidden="true">☾</span>
        </button>
        <a class="cta-btn" href="#contact">Hire me</a>
        <button class="nav-burger" id="nav-burger" type="button" aria-label="Toggle menu">☰</button>
      </div>
    </div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <div class="hero-eyebrow">AI Software Engineer · Kerala, India</div>
          <h1 class="hero-name">Aravind E S</h1>
          <p class="hero-tagline">
            I'm a curious, deliberate engineer who likes understanding how systems behave
            under pressure, then making them useful, dependable, and clear to the people
            who rely on them.
          </p>
          <div class="hero-ctas">
            <a class="cta-btn cta-primary" href="assets/resume.pdf" target="_blank" rel="noopener">↓ Download resume</a>
            <a class="cta-btn cta-secondary" href="#projects">View projects</a>
            <a class="cta-btn cta-secondary" href="#contact">Chat with my AI</a>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <div class="stat-value">2 yrs</div>
              <div class="stat-label">production AI</div>
            </div>
            <div class="stat">
              <div class="stat-value">1</div>
              <div class="stat-label">U.S. safety certified solution</div>
            </div>
            <div class="stat">
              <div class="stat-value">4</div>
              <div class="stat-label">flagship projects</div>
            </div>
          </div>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <svg viewBox="0 0 320 320" class="hero-svg">
            <defs>
              <radialGradient id="rg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <circle cx="160" cy="160" r="140" fill="url(#rg)"/>
            <circle cx="160" cy="160" r="120" fill="none" stroke="var(--border)" stroke-width="1"/>
            <circle cx="160" cy="160" r="90" fill="none" stroke="var(--border)" stroke-width="1"/>
            <circle cx="160" cy="160" r="60" fill="none" stroke="var(--border)" stroke-width="1"/>
            <circle cx="160" cy="160" r="30" fill="none" stroke="var(--border)" stroke-width="1"/>
            <line x1="160" y1="20" x2="160" y2="300" stroke="var(--border)" stroke-width="1"/>
            <line x1="20" y1="160" x2="300" y2="160" stroke="var(--border)" stroke-width="1"/>
            <circle cx="210" cy="110" r="4" fill="var(--accent)"/>
            <circle cx="120" cy="190" r="4" fill="var(--accent)"/>
            <circle cx="220" cy="220" r="4" fill="var(--accent)"/>
            <circle cx="100" cy="120" r="3" fill="var(--text-dim)"/>
            <circle cx="180" cy="80" r="3" fill="var(--text-dim)"/>
          </svg>
        </div>
      </div>
    </section>

    <section class="about">
      <div class="container">
        <h2 class="section-title">About</h2>
        <p class="lead">
          I'm an AI Software Engineer at <strong>Tata Elxsi</strong> with two years
          building production systems across cloud backends and edge devices. I tend to
          be methodical and curious: I ask what can go wrong, make the important parts
          observable, and keep the system understandable for the team that owns it.
          That mindset has shaped my work in agentic AI, real-time computer vision,
          and constrained edge hardware.
        </p>
        <p class="lead">
          What matters to me is <strong>building technology people can trust when the
          inputs are messy and the stakes are real</strong>, with careful validation,
          honest boundaries, and a practical respect for the details.
        </p>
      </div>
    </section>

    <section class="projects" id="projects">
      <div class="container">
        <h2 class="section-title">Selected projects</h2>
        <p class="section-sub">Four systems that shipped into compliance critical production.</p>
        <div class="project-grid" id="project-grid"></div>
      </div>
    </section>

    <section class="experience" id="experience">
      <div class="container">
        <h2 class="section-title">Experience</h2>
        <div class="timeline" id="timeline"></div>
      </div>
    </section>

    <section class="skills" id="skills">
      <div class="container">
        <h2 class="section-title">Skills</h2>
        <p class="section-sub">Two years of focused production work. Grouped by domain.</p>
        <div class="skills-grid" id="skills-grid"></div>
      </div>
    </section>

    <section class="contact" id="contact">
      <div class="container">
        <h2 class="section-title">Let's talk</h2>
        <p class="section-sub">Open to full time AI/ML roles. Fastest path: email or LinkedIn.</p>
        <div class="contact-grid">
          <div class="contact-card">
            <div class="contact-badge">Open to opportunities</div>
            <ul class="contact-list">
              <li><span class="contact-label">Email</span><a href="mailto:${LINKS.email}">${LINKS.email}</a></li>
              <li><span class="contact-label">Phone</span><a href="tel:${LINKS.phone.replace(/\s/g, "")}">${LINKS.phone}</a></li>
              <li><span class="contact-label">LinkedIn</span><a href="${LINKS.linkedin}" target="_blank" rel="noopener">linkedin.com/in/aravind-es</a></li>
              <li><span class="contact-label">Location</span>${LINKS.location}</li>
            </ul>
            <a class="cta-btn cta-primary" href="assets/resume.pdf" target="_blank" rel="noopener">↓ Download resume</a>
          </div>
          <div class="contact-card">
            <div class="chat-mount" id="chat-mount"></div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer" role="contentinfo">
    <div class="container footer-inner">
      <div>© ${CURRENT_YEAR} Aravind E S</div>
      <div class="footer-links">
        <a href="?mode=terminal">View as terminal</a>
        <a href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:${LINKS.email}">Email</a>
      </div>
    </div>
  </footer>
`;

function renderProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid) return;
  grid.innerHTML = PROJECT_ORDER.map((name, i) => {
    const proj = PROJECTS[name];
    const readable = PROJECT_READABLE[name];
    if (!proj || !readable) return "";
    const tags = proj.tags.slice(0, 4).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
    const highlights = readable.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("");
    return `
      <article class="project-card" data-project="${name}">
        <div class="project-num">0${i + 1}</div>
        <h3 class="project-title">${escapeHtml(proj.title)}</h3>
        <div class="project-meta">${escapeHtml(proj.year)}</div>
        <div class="project-tags">${tags}</div>
        <p class="project-short">${escapeHtml(readable.short)}</p>
        <ul class="project-highlights">${highlights}</ul>
        <div class="project-impact">
          <span class="project-impact-label">Impact</span>
          <span>${escapeHtml(readable.impact)}</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderExperience() {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;
  timeline.innerHTML = EXPERIENCE_DATA.map((exp) => {
    const tags = exp.tags.map((t) => `<span class="tag tag-sm">${escapeHtml(t)}</span>`).join("");
    const bullets = exp.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("");
    return `
      <article class="exp-item">
        <div class="exp-marker"></div>
        <div class="exp-content">
          <div class="exp-head">
            <div>
              <h3 class="exp-role">${escapeHtml(exp.role)}</h3>
              <div class="exp-company">${escapeHtml(exp.company)} · ${escapeHtml(exp.location)}</div>
            </div>
            <div class="exp-period">${escapeHtml(exp.period)}</div>
          </div>
          <ul class="exp-bullets">${bullets}</ul>
          <div class="exp-tags">${tags}</div>
        </div>
      </article>
    `;
  }).join("");
}

function renderSkills() {
  const grid = document.getElementById("skills-grid");
  if (!grid) return;
  grid.innerHTML = SKILLS_DATA.map((group) => {
    const items = group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    return `
      <div class="skill-group">
        <h3 class="skill-group-title">${escapeHtml(group.group)}</h3>
        <ul class="skill-list">${items}</ul>
      </div>
    `;
  }).join("");
}

function setupTheme() {
  const theme = loadTheme();
  document.body.dataset.theme = theme;
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const next = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    saveTheme(next);
  });
}

function setupScrollSpy() {
  const links = document.querySelectorAll(".nav-link");
  const sections = ["#projects", "#experience", "#skills", "#contact"].map((id) => document.querySelector(id)).filter(Boolean);

  function update() {
    const fromTop = window.scrollY + 120;
    let current = null;
    sections.forEach((sec) => {
      if (sec.offsetTop <= fromTop) current = sec;
    });
    links.forEach((link) => {
      link.classList.toggle("active", current && link.getAttribute("href") === `#${current.id}`);
    });
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

function setupBurger() {
  const burger = document.getElementById("nav-burger");
  const links = document.querySelector(".nav-links");
  if (!burger || !links) return;
  burger.addEventListener("click", () => {
    links.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".project-card, .exp-item, .skill-group").forEach((el) => {
    el.classList.add("reveal");
    obs.observe(el);
  });
}

export function mountPortfolio() {
  document.body.classList.add("mode-portfolio");

  const root = document.getElementById("portfolio-root") || document.body;
  root.innerHTML = PORTFOLIO_HTML;

  renderProjects();
  renderExperience();
  renderSkills();
  setupTheme();
  setupScrollSpy();
  setupBurger();
  setupReveal();

  // The shell mounts after the browser's first hash/scroll pass. Re-apply
  // only an intentional section hash; otherwise always start at the top.
  requestAnimationFrame(() => {
    const hash = window.location.hash;
    if (hash && document.querySelector(hash)) {
      document.querySelector(hash).scrollIntoView({ block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
  });

  // Mount the inline RAG chat in the Contact section
  const chatMount = document.getElementById("chat-mount");
  if (chatMount) {
    mountChatWidget(chatMount, {
      initialMessage: "Hi! I'm Aravind's AI assistant. Ask me about his projects, skills, experience, or anything else from his profile.",
    });
  }

  // Smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}
