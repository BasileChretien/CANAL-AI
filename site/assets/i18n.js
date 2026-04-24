// CANAL-AI — tiny i18n runtime.
// Loads site/assets/i18n.json, swaps every [data-i18n], [data-i18n-attr],
// [data-i18n-html] and [data-i18n-mailto] node into the active language.
// Persists the choice in localStorage; #lang=xx hash overrides.

(function () {
  "use strict";

  const SUPPORTED = ["en", "ja", "fr"];
  const DEFAULT = "en";
  const STORAGE_KEY = "canal-ai.lang";

  // Single source of truth for the three principal-investigator mailboxes.
  // To change a contact, edit here only — every CTA picks it up.
  const TEAM_MAILBOXES = {
    team: [
      "nishida.kazuki.n6@f.mail.nagoya-u.ac.jp",
      "charles.dolladille@unicaen.fr",
      "chretien.basile.jean.bernard.u4@s.mail.nagoya-u.ac.jp"
    ]
  };

  // Whitelist parser for data-i18n-html: only <strong>, <em>, and <a href="https?://"> are kept.
  // Defence-in-depth: the JSON is author-controlled today, but this removes any
  // future XSS path if delivery is ever compromised.
  function safeFragment(rawHtml) {
    const doc = new DOMParser().parseFromString(
      "<body>" + rawHtml + "</body>",
      "text/html"
    );
    const frag = document.createDocumentFragment();
    const walk = (src, dst) => {
      src.childNodes.forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          dst.appendChild(document.createTextNode(n.textContent));
          return;
        }
        if (n.nodeType !== Node.ELEMENT_NODE) return;
        const name = n.nodeName.toLowerCase();
        if (name === "strong" || name === "em" || name === "br") {
          const safe = document.createElement(name);
          walk(n, safe);
          dst.appendChild(safe);
          return;
        }
        if (name === "a") {
          const href = n.getAttribute("href") || "";
          if (/^(https?:\/\/|#|mailto:)/i.test(href)) {
            const safe = document.createElement("a");
            safe.setAttribute("href", href);
            if (/^https?:\/\//i.test(href)) {
              safe.setAttribute("rel", "noopener noreferrer");
              safe.setAttribute("target", "_blank");
            }
            walk(n, safe);
            dst.appendChild(safe);
            return;
          }
        }
        // Unknown tag → keep text only
        walk(n, dst);
      });
    };
    walk(doc.body, frag);
    return frag;
  }

  function pickInitialLang() {
    const m = location.hash.match(/#lang=(en|ja|fr)/i);
    if (m) return m[1].toLowerCase();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.includes(stored)) return stored;
    } catch (_) {}
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : DEFAULT;
  }

  function resolveRecipients(token) {
    if (Array.isArray(TEAM_MAILBOXES[token])) return TEAM_MAILBOXES[token].slice();
    return (token || "").split(",").map((s) => s.trim()).filter(Boolean);
  }

  function buildMailto(token, subject, body) {
    // RFC 6068: put first recipient in the path, additional in cc= query param.
    const recipients = resolveRecipients(token);
    if (recipients.length === 0) return "#";
    const primary = encodeURIComponent(recipients[0]);
    const cc = recipients.slice(1).map(encodeURIComponent).join(",");
    const params = [];
    if (cc) params.push("cc=" + cc);
    if (subject) params.push("subject=" + encodeURIComponent(subject));
    if (body) params.push("body=" + encodeURIComponent(body));
    const q = params.length ? "?" + params.join("&") : "";
    return "mailto:" + primary + q;
  }

  function applyLang(dict, lang) {
    const bundle = dict[lang];
    if (!bundle) return;

    document.documentElement.setAttribute("lang", bundle["html_lang"] || lang);

    if (bundle["meta.title"]) document.title = bundle["meta.title"];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && bundle["meta.description"]) {
      metaDesc.setAttribute("content", bundle["meta.description"]);
    }

    // Plain text
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = bundle[key];
      if (val !== undefined) el.textContent = val;
    });

    // Sanitised HTML
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const val = bundle[key];
      if (val === undefined) return;
      el.replaceChildren(safeFragment(val));
    });

    // Attribute targets, e.g. data-i18n-attr="aria-label:contact.cta"
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.getAttribute("data-i18n-attr")
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((pair) => {
          const [attr, key] = pair.split(":").map((s) => s.trim());
          const val = bundle[key];
          if (attr && val !== undefined) el.setAttribute(attr, val);
        });
    });

    // Mailto buttons: RFC-6068 multi-recipient using cc= query parameter.
    document.querySelectorAll("[data-i18n-mailto]").forEach((a) => {
      const to = a.getAttribute("data-i18n-mailto");
      const subject = bundle["contact.subject"] || "";
      const body = bundle["contact.body_mail"] || "";
      a.setAttribute("href", buildMailto(to, subject, body));
    });

    // Language switcher active state
    document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
      const isActive = btn.getAttribute("data-lang-switch") === lang;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      btn.classList.toggle("is-active", isActive);
    });
  }

  function init(dict) {
    const lang = pickInitialLang();
    applyLang(dict, lang);

    document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const next = btn.getAttribute("data-lang-switch");
        if (!SUPPORTED.includes(next)) return;
        try { localStorage.setItem(STORAGE_KEY, next); } catch (_) {}
        applyLang(dict, next);
      });
    });

    window.addEventListener("hashchange", () => {
      const m = location.hash.match(/#lang=(en|ja|fr)/i);
      if (!m) return;
      const next = m[1].toLowerCase();
      try { localStorage.setItem(STORAGE_KEY, next); } catch (_) {}
      applyLang(dict, next);
    });

    // Mobile-nav toggle (progressive enhancement)
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    if (navToggle && nav) {
      navToggle.addEventListener("click", () => {
        const open = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", open ? "false" : "true");
        nav.classList.toggle("is-open", !open);
        document.body.classList.toggle("nav-open", !open);
      });
      nav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          navToggle.setAttribute("aria-expanded", "false");
          nav.classList.remove("is-open");
          document.body.classList.remove("nav-open");
        });
      });
    }

    // Respect prefers-reduced-motion for SMIL <animate> elements
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".fed-diagram animate").forEach((a) => {
        a.setAttribute("dur", "0s");
        a.setAttribute("repeatCount", "1");
        if (typeof a.endElement === "function") {
          try { a.endElement(); } catch (_) {}
        }
      });
    }

    // Pause SVG animations when the diagram is off-screen (battery + CPU)
    const diagram = document.querySelector(".fed-diagram");
    if (diagram && "IntersectionObserver" in window) {
      const svg = diagram.querySelector("svg");
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!svg) return;
          if (entry.isIntersecting) {
            if (typeof svg.unpauseAnimations === "function") svg.unpauseAnimations();
            svg.style.animationPlayState = "running";
          } else {
            if (typeof svg.pauseAnimations === "function") svg.pauseAnimations();
            svg.style.animationPlayState = "paused";
          }
        },
        { threshold: 0 }
      );
      obs.observe(diagram);
    }

    initStory();
  }

  // ---------- How-it-works story controller ----------
  function initStory() {
    const story = document.querySelector(".fed-story");
    if (!story) return;

    const cards = Array.from(story.querySelectorAll(".fed-story__card"));
    const dots  = Array.from(story.querySelectorAll(".fed-story__dot"));
    const toggle = story.querySelector(".fed-story__toggle");
    const progressFill = story.querySelector(".fed-story__progress-fill");
    const roundEl = story.querySelector(".fed-round__n");
    if (cards.length === 0 || dots.length === 0) return;

    const STEPS = cards.length;
    const PERIOD_MS = 5000;
    let phase = 1;
    let round = 1;
    let paused = false;
    let phaseStartedAt = 0;
    let raf = 0;
    let intersecting = true;

    function setPhase(n, resetTimer) {
      const requested = ((n - 1) % STEPS + STEPS) % STEPS + 1;
      // Increment the round counter when the story wraps phase 4 -> phase 1.
      if (phase === STEPS && requested === 1) {
        round += 1;
        if (roundEl) roundEl.textContent = String(round);
        story.classList.remove("is-round-bump");
        // Force a reflow so the CSS animation replays cleanly.
        void story.offsetWidth;
        story.classList.add("is-round-bump");
      }
      phase = requested;
      story.setAttribute("data-phase", String(phase));
      cards.forEach((c, i) => c.classList.toggle("is-active", i + 1 === phase));
      dots.forEach((d, i) => {
        const on = i + 1 === phase;
        d.classList.toggle("is-active", on);
        d.setAttribute("aria-current", on ? "true" : "false");
      });
      if (resetTimer !== false) phaseStartedAt = performance.now();
    }

    function tick(now) {
      raf = 0;
      if (paused || !intersecting) return;
      const elapsed = now - phaseStartedAt;
      if (progressFill) {
        const p = Math.min(1, elapsed / PERIOD_MS);
        progressFill.style.transform = `scaleX(${p})`;
      }
      if (elapsed >= PERIOD_MS) {
        setPhase(phase + 1);
      }
      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (raf || paused || !intersecting) return;
      phaseStartedAt = performance.now();
      raf = requestAnimationFrame(tick);
    }

    function stop() {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (progressFill) progressFill.style.transform = "scaleX(0)";
    }

    dots.forEach((d, i) => {
      d.addEventListener("click", () => {
        setPhase(i + 1);
        if (!paused && intersecting) start();
      });
    });

    if (toggle) {
      toggle.addEventListener("click", () => {
        paused = !paused;
        toggle.setAttribute("aria-pressed", paused ? "true" : "false");
        story.classList.toggle("is-paused", paused);
        if (paused) stop(); else start();
      });
    }

    // Reduced motion: show all steps side by side, no auto-rotate.
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      story.classList.add("is-all-steps");
      cards.forEach((c) => c.classList.add("is-active"));
      return;
    }

    // Pause when off-screen.
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(([entry]) => {
        intersecting = entry.isIntersecting;
        if (intersecting) start(); else stop();
      }, { threshold: 0.2 });
      io.observe(story);
    } else {
      start();
    }

    setPhase(1);
  }

  fetch("assets/i18n.json")
    .then((r) => {
      if (!r.ok) throw new Error("i18n fetch failed: " + r.status);
      return r.json();
    })
    .then(init)
    .catch((err) => {
      // Leave the English fallbacks present in the HTML; surface failure quietly.
      if (typeof console !== "undefined" && console && console.warn) {
        console.warn("CANAL-AI i18n unavailable, falling back to English defaults.", err);
      }
    });
})();
