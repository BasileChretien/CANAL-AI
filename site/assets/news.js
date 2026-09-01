// CANAL-AI — news.html loader.
// Picks the article from ?id=... and wires data-i18n keys onto the
// article fields so i18n.js (loaded after, also with defer) renders the
// active language. Keeps document.title in sync with the article title.

(function () {
  "use strict";

  const NEWS = {
    helsinki:{ date: "news.helsinki_date", title: "news.helsinki_title", body: "news.helsinki_body", html: false,
               photos: [
                 { jpg: "assets/photos/visit-helsinki.jpg",   webp: "assets/photos/visit-helsinki.webp",   alt: "news.helsinki_alt",  w: 1600, h: 1200 },
                 { jpg: "assets/photos/visit-helsinki-2.jpg", webp: "assets/photos/visit-helsinki-2.webp", alt: "news.helsinki_alt2", w: 1600, h: 1200 }
               ] },
    irb:     { date: "news.irb_date", title: "news.irb_title", body: "news.irb_body", html: false },
    caen:    { date: "news.caen_date", title: "news.caen_title", body: "news.caen_body", html: false,
               photos: [
                 { jpg: "assets/photos/visit-caen.jpg",   webp: "assets/photos/visit-caen.webp",   alt: "news.caen_alt",  w: 1600, h: 1200 },
                 { jpg: "assets/photos/visit-caen-2.jpg", webp: "assets/photos/visit-caen-2.webp", alt: "news.caen_alt2", w: 1024, h: 768  }
               ] },
    award:   { date: "news.award_date", title: "news.award_title", body: "news.award_body", html: false,
               photos: [
                 { jpg: "assets/photos/award-residence.jpg",   webp: "assets/photos/award-residence.webp",   alt: "news.award_alt",  w: 1600, h: 1200 },
                 { jpg: "assets/photos/award-residence-2.jpg", webp: "assets/photos/award-residence-2.webp", alt: "news.award_alt2", w: 1600, h: 1200 },
                 { jpg: "assets/photos/award-residence-3.jpg", webp: "assets/photos/award-residence-3.webp", alt: "news.award_alt3", w: 1200, h: 1600 }
               ] },
    dukenus: { date: "news.dukenus_date", title: "news.dukenus_title", body: "news.dukenus_body", html: false,
               photo: { jpg: "assets/photos/visit-duke.jpg", webp: "assets/photos/visit-duke.webp", alt: "news.dukenus_alt" } },
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

    const photos = cfg.photos || (cfg.photo ? [cfg.photo] : []);
    applyPhotos(photos);
  }

  // Build an additional <figure> for photos beyond the first. The img keeps a
  // data-i18n-attr="alt:KEY" so i18n.js translates the caption on language switch.
  function buildFigure(p) {
    const fig = document.createElement("figure");
    fig.className = "news-article__figure";
    const picture = document.createElement("picture");
    const source = document.createElement("source");
    source.type = "image/webp";
    source.srcset = p.webp;
    const img = document.createElement("img");
    img.src = p.jpg;
    if (p.w) img.width = p.w;
    if (p.h) img.height = p.h;
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = "";
    img.setAttribute("data-i18n-attr", "alt:" + p.alt);
    picture.appendChild(source);
    picture.appendChild(img);
    fig.appendChild(picture);
    return fig;
  }

  // First photo reuses the static figure already in news.html; any extra photos
  // are appended as sibling figures (stacked by the .news-article__figure rule).
  function applyPhotos(photos) {
    if (!photos.length) return;

    const fig = document.getElementById("news-article-figure");
    fig.hidden = false;

    const first = photos[0];
    const webp = document.getElementById("news-article-photo-webp");
    if (webp) webp.setAttribute("srcset", first.webp);
    const img = document.getElementById("news-article-photo");
    if (img) {
      img.setAttribute("src", first.jpg);
      if (first.w) img.width = first.w;
      if (first.h) img.height = first.h;
      img.setAttribute("data-i18n-attr", "alt:" + first.alt);
    }

    let prev = fig;
    for (let i = 1; i < photos.length; i++) {
      const next = buildFigure(photos[i]);
      prev.insertAdjacentElement("afterend", next);
      prev = next;
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
