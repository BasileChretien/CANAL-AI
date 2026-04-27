// CANAL-AI — news.html loader.
// Picks the article from ?id=... and wires data-i18n keys onto the
// article fields so i18n.js (loaded after, also with defer) renders the
// active language. Keeps document.title in sync with the article title.

(function () {
  "use strict";

  const NEWS = {
    grant:   { date: "news.grant_date", title: "news.grant_title", body: "news.grant_body", html: true  },
    visit:   { date: "news.visit_date", title: "news.visit_title", body: "news.visit_body", html: false,
               photo: { jpg: "assets/photos/visit-nagoya.jpg", webp: "assets/photos/visit-nagoya.webp", alt: "news.visit_alt" } },
    website: { date: "news.item4_date", title: "news.item4_title", body: "news.item4_body", html: false },
    secom:   { date: "news.item3_date", title: "news.item3_title", body: "news.item3_body", html: true  },
    ethics:  { date: "news.item1_date", title: "news.item1_title", body: "news.item1_body", html: false },
    loi:     { date: "news.item2_date", title: "news.item2_title", body: "news.item2_body", html: false }
  };

  function pickId() {
    const m = location.search.match(/[?&]id=([a-z0-9_-]+)/i);
    return m ? m[1].toLowerCase() : null;
  }

  function applyConfig(cfg) {
    document.getElementById("news-article-date").setAttribute("data-i18n", cfg.date);
    document.getElementById("news-article-title").setAttribute("data-i18n", cfg.title);

    const body = document.getElementById("news-article-body");
    body.setAttribute(cfg.html ? "data-i18n-html" : "data-i18n", cfg.body);

    if (cfg.photo) {
      const fig = document.getElementById("news-article-figure");
      fig.hidden = false;
      const webp = document.getElementById("news-article-photo-webp");
      if (webp) webp.setAttribute("srcset", cfg.photo.webp);
      const img = document.getElementById("news-article-photo");
      if (img) {
        img.setAttribute("src", cfg.photo.jpg);
        img.setAttribute("data-i18n-attr", "alt:" + cfg.photo.alt);
      }
    }
  }

  function bindTitleSync() {
    const titleEl = document.getElementById("news-article-title");
    if (!titleEl) return;
    const sync = () => {
      const t = (titleEl.textContent || "").trim();
      if (t) document.title = t + " — CANAL-AI";
    };
    new MutationObserver(sync).observe(titleEl, {
      childList: true, characterData: true, subtree: true
    });
    // i18n.js applies bundles after fetch resolves; pick up the eventual value.
    setTimeout(sync, 50);
    setTimeout(sync, 400);
  }

  const id = pickId();
  const cfg = id && NEWS[id];
  if (!cfg) {
    location.replace("index.html#news");
    return;
  }
  applyConfig(cfg);
  bindTitleSync();
})();
