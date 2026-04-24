// CANAL-AI — tiny i18n runtime.
// Loads site/assets/i18n.json, swaps every [data-i18n], [data-i18n-attr],
// and [data-i18n-html] node into the active language. Persists the choice
// in localStorage; a #lang=xx hash overrides.

(function () {
  "use strict";

  const SUPPORTED = ["en", "ja", "fr"];
  const DEFAULT = "en";
  const STORAGE_KEY = "canal-ai.lang";

  function pickInitialLang() {
    const m = location.hash.match(/#lang=(en|ja|fr)/i);
    if (m) return m[1].toLowerCase();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : DEFAULT;
  }

  function applyLang(dict, lang) {
    const bundle = dict[lang];
    if (!bundle) return;

    // <html lang="…">
    document.documentElement.setAttribute("lang", bundle["html_lang"] || lang);

    // <title>
    if (bundle["meta.title"]) document.title = bundle["meta.title"];

    // <meta name="description">
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && bundle["meta.description"]) {
      metaDesc.setAttribute("content", bundle["meta.description"]);
    }

    // Plain text nodes.
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = bundle[key];
      if (val !== undefined) el.textContent = val;
    });

    // HTML-valued nodes (when the string contains inline tags like <strong>).
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const val = bundle[key];
      if (val !== undefined) el.innerHTML = val;
    });

    // Attribute targets, e.g. data-i18n-attr="aria-label:lang.switcher_label".
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

    // Mailto buttons: rebuild href with localised subject + body prefix.
    document.querySelectorAll("[data-i18n-mailto]").forEach((a) => {
      const to = a.getAttribute("data-i18n-mailto");
      const subject = encodeURIComponent(bundle["contact.subject"] || "");
      const body = encodeURIComponent(bundle["contact.body_mail"] || "");
      a.setAttribute("href", `mailto:${to}?subject=${subject}&body=${body}`);
    });

    // Language switcher active state.
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
        localStorage.setItem(STORAGE_KEY, next);
        applyLang(dict, next);
      });
    });

    // React to manual hash changes.
    window.addEventListener("hashchange", () => {
      const m = location.hash.match(/#lang=(en|ja|fr)/i);
      if (!m) return;
      const next = m[1].toLowerCase();
      localStorage.setItem(STORAGE_KEY, next);
      applyLang(dict, next);
    });
  }

  fetch("assets/i18n.json", { cache: "no-cache" })
    .then((r) => {
      if (!r.ok) throw new Error("i18n fetch failed: " + r.status);
      return r.json();
    })
    .then(init)
    .catch((err) => {
      console.error("CANAL-AI i18n:", err);
    });
})();
