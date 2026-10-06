/* =========================================================
   Priya Shah — Portfolio
   Renders every page from /content/*.json.
   Edit content in the JSON files (or via Pages CMS), not here.
   ========================================================= */
(() => {
  "use strict";

  const PAGE = document.body.dataset.page || "home";
  const app = document.getElementById("app");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- helpers ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Light formatting for editors: **bold**, *italic* or _italic_
  const rt = (s) => esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s>(])_(.+?)_(?=$|[\s<.,!?)])/g, "$1<em>$2</em>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
  const pad = (n) => String(n).padStart(2, "0");
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const swap = (label) => `<span class="swap"><span>${esc(label)}</span><span aria-hidden="true">${esc(label)}</span></span>`;
  const isExternal = (href) => /^https?:\/\//.test(href || "");

  const ICON = {
    arrow: '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M2.5 9.5l7-7M3.5 2.5h6v6"/></svg>',
    arrowDR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 5l14 14M19 7v12H7"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    copy: '<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/></svg>',
    plus: '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M1 7h12"/><path class="v" d="M7 1v12"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z"/></svg>',
    behance: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.2 11.3c.9-.4 1.4-1.1 1.4-2.1 0-2-1.5-2.7-3.4-2.7H1v11h5.4c2 0 3.9-1 3.9-3.2 0-1.4-.7-2.6-2.1-3zM3.4 8.4h2.3c.9 0 1.7.2 1.7 1.2 0 .9-.6 1.3-1.5 1.3H3.4zm2.6 7.2H3.4v-3h2.7c1.1 0 1.8.4 1.8 1.6 0 1.1-.8 1.4-1.9 1.4zM23 13.3c0-2.6-1.5-4.8-4.3-4.8-2.7 0-4.5 2-4.5 4.7 0 2.8 1.7 4.7 4.5 4.7 2.1 0 3.5-.9 4.2-3h-2.1c-.3.8-1.2 1.2-2 1.2-1.6 0-2.4-.9-2.4-2.4H23v-.4zm-6.6-1c.1-1.2.9-2 2.2-2 1.2 0 1.8.7 1.9 2zM16 6.6h5.4V8H16z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    dribbble: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M5 6c4 3 10 4 15 3M3.5 14c5-2 11-1 14 6M9 3.5c3 4 5 10 5.5 17"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>'
  };

  const btn = (label, href, cls = "") =>
    `<a class="btn ${cls}" href="${esc(href)}"${isExternal(href) ? ' target="_blank" rel="noopener"' : ""}>${swap(label)}<span class="btn-arrow" aria-hidden="true">↗</span></a>`;

  /** Media with graceful placeholder. Options: image, video, poster, ratio, focus (object-position), fit ("contain"), bg, hoverVideo. */
  function media(o = {}) {
    const pal = o.palette && o.palette.length ? o.palette : ["#6410AD", "#B07BDB", "#F3D6E4"];
    const style = `${o.ratio ? `aspect-ratio:${esc(o.ratio)};` : ""}${o.bg ? `background:${esc(o.bg)};` : ""}`;
    const pos = o.focus ? ` style="object-position:${esc(o.focus)}"` : "";
    let inner;
    if (o.video) {
      const poster = o.poster || o.image;
      inner = `<video src="${esc(o.video)}" ${poster ? `poster="${esc(poster)}"` : ""} data-autoplay muted loop playsinline preload="none" aria-label="${esc(o.alt || "")}"${pos}></video>`;
    } else if (o.image) {
      inner = `<img src="${esc(o.image)}" alt="${esc(o.alt || "")}" ${o.eager ? "" : 'loading="lazy"'} decoding="async"${pos}>`;
    } else {
      inner = `<div class="ph" style="--c1:${esc(pal[0])};--c2:${esc(pal[1] || pal[0])};--c3:${esc(pal[2] || "rgba(255,255,255,.55)")}">${o.noLabel ? "" : `<span class="ph-label">${esc(o.label || "Image placeholder")}</span>`}</div>`;
    }
    if (o.hoverVideo) inner += `<video class="hover-video" src="${esc(o.hoverVideo)}" muted loop playsinline preload="none"${pos}></video>`;
    return `<div class="media${o.fit === "contain" ? " is-contain" : ""} ${o.cls || ""}" style="${style}">${inner}</div>`;
  }

  const socialIcon = (s) => ICON[(s.icon || s.label || "").toLowerCase()] || "";

  /* ---------- data ---------- */
  const load = (p) => fetch(p, { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw new Error(`${p}: ${r.status}`);
    return r.json();
  });

  async function boot() {
    try {
      const needWorks = ["home", "works", "work"].includes(PAGE);
      const [site, works, archive] = await Promise.all([
        load("content/site.json"),
        needWorks ? load("content/works.json") : null,
        PAGE === "archive" ? load("content/archive.json") : null
      ]);
      window.SITE = { site, works, archive };
      applyTheme(site);
      app.innerHTML = header(site) + `<main id="main">${renderPage(site, works, archive)}</main>` + footer(site);
      init(site, works, archive);
    } catch (err) {
      console.error(err);
      const local = location.protocol === "file:";
      app.innerHTML = `<div class="wrap" style="padding:20vh 0;max-width:40rem;margin:auto;font-size:18px">
        <h1 class="display" style="font-size:3rem">Content could not load</h1>
        <p>${local ? "Open this site through a local server, not by double-clicking the file. In this folder, run <code>python3 -m http.server 8000</code> and visit <code>http://localhost:8000</code>." : esc(err.message)}</p></div>`;
      document.documentElement.classList.add("is-ready");
    }
  }

  function applyTheme(site) {
    const t = site.theme || {};
    const r = document.documentElement.style;
    if (t.primary) r.setProperty("--primary", t.primary);
    if (t.base) r.setProperty("--base", t.base);
    if (t.ink) r.setProperty("--ink", t.ink);
    if (t.tint) r.setProperty("--tint", t.tint);
    if (t.radius) r.setProperty("--radius", /^\d+$/.test(t.radius) ? `${t.radius}px` : t.radius);
    if (t.localFonts && !$('link[href="assets/css/fonts.css"]')) {
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.href = "assets/css/fonts.css";
      document.head.appendChild(l);
    }
    if (t.displayFont) r.setProperty("--font-display", `"${t.displayFont}", "Times New Roman", serif`);
    if (t.bodyFont) r.setProperty("--font-body", `"${t.bodyFont}", "Helvetica Neue", Arial, sans-serif`);
    // Percent controls keep the responsive type scale intact. Blank/invalid = 100%.
    const fontScales = {
      nameSizePercent: "--scale-name",
      pageTitleSizePercent: "--scale-page-title",
      sectionSizePercent: "--scale-section",
      bodySizePercent: "--scale-body",
    };
    Object.entries(fontScales).forEach(([key, variable]) => {
      const value = t[key];
      const percent = typeof value === "number" && Number.isFinite(value)
        ? Math.max(70, Math.min(130, value)) : 100;
      r.setProperty(variable, String(percent / 100));
    });

    const titles = { home: "", works: "Works", work: "Work", about: "About", archive: "Archive", contact: "Contact" };
    const name = `${site.brand.firstName} ${site.brand.lastName}`;
    document.title = titles[PAGE] ? `${titles[PAGE]} — ${name}` : site.meta.title;
    const desc = $('meta[name="description"]');
    if (desc) desc.content = site.meta.description;
    let fav = $('link[rel="icon"]');
    if (!fav) { fav = document.createElement("link"); fav.rel = "icon"; document.head.appendChild(fav); }
    fav.href = site.meta.favicon || site.brand.logo;
    const loaderText = $(".loader span");
    if (loaderText) loaderText.textContent = (site.brand.firstName[0] || "") + (site.brand.lastName[0] || "");
  }

  /* ---------- layout ---------- */
  function header(site) {
    const file = location.pathname.split("/").pop() || "index.html";
    const links = site.nav.map((n) => {
      const active = n.href.split("#")[0] === file && !n.href.includes("#") ? " is-active" : "";
      return `<a href="${esc(n.href)}" class="t-label${active}">${swap(n.label)}</a>`;
    }).join("");
    const menuItems = [{ label: "Home", href: "index.html" }, ...site.nav, site.navCta]
      .map((n, i) => `<li><a href="${esc(n.href)}" style="--i:${i}"><small>${pad(i + 1)}</small>${esc(n.label)}</a></li>`).join("");
    return `
    <header class="header">
      <a class="header-logo" href="index.html" aria-label="Home"><img src="${esc(site.brand.logo)}" alt="${esc(site.brand.logoAlt || "Logo")}"></a>
      <nav class="header-nav" aria-label="Main">${links}</nav>
      <div class="header-right">
        <a class="btn is-sm header-cta" href="${esc(site.navCta.href)}">${swap(site.navCta.label)}<span class="btn-arrow" aria-hidden="true">↗</span></a>
        <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span></span><span></span></button>
      </div>
    </header>
    <div class="menu is-dark" id="menu" aria-hidden="true">
      <ul class="menu-links">${menuItems}</ul>
      <div class="menu-foot">
        <button data-copy="${esc(site.contact.email)}" class="footer-link">${esc(site.contact.email)}</button>
        <div class="socials">${site.socials.map((s) => `<a class="footer-link" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("")}</div>
      </div>
    </div>`;
  }

  function footer(site) {
    const f = site.footer;
    const name = `${site.brand.firstName} ${site.brand.lastName}`;
    return `
    <footer class="footer is-dark">
      <div class="wrap">
        <div class="footer-top">
          <h2 class="t-h2 reveal">${rt(f.heading)}</h2>
          <div class="reveal" style="--d:.1s">${btn(f.buttonLabel, f.buttonHref, "is-solid")}</div>
        </div>
        <div class="footer-cols">
          <div><h4 class="t-label">Menu</h4><ul>${[{ label: "Home", href: "index.html" }, ...site.nav, site.navCta].map((n) => `<li><a class="footer-link" href="${esc(n.href)}">${esc(n.label)}</a></li>`).join("")}</ul></div>
          <div><h4 class="t-label">Socials</h4><ul>${site.socials.map((s) => `<li><a class="footer-link" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a></li>`).join("")}</ul></div>
          <div><h4 class="t-label">Contact</h4><ul>
            <li><button class="footer-link" data-copy="${esc(site.contact.email)}">${esc(site.contact.email)}</button></li></ul></div>
          <div><h4 class="t-label">Local time</h4><ul>
            <li class="footer-time" data-time="${esc(site.contact.timezone)}">--:--</li>
            <li><button class="footer-link" data-top>Back to top ↑</button></li></ul></div>
        </div>
        <p class="footer-word" data-fit aria-hidden="true"><span data-fit-inner style="display:inline-block">${esc(name)}</span></p>
        <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${esc(f.copyright)}</span></div>
      </div>
    </footer>`;
  }

  /* ---------- shared pieces ---------- */
  function workCard(p, i, works, { hover = true } = {}) {
    const idx = works.projects.indexOf(p);
    return `
      <a class="work-card reveal" href="work.html?slug=${encodeURIComponent(p.slug)}" data-cursor="View project" ${hover && p.coverVideo ? "data-hover-media" : ""}
         data-cats="${esc((p.categories || []).join(" "))}" style="--d:${(i % 3) * 0.08}s">
        ${media({ image: p.cover, hoverVideo: hover ? p.coverVideo : "", palette: p.palette, alt: p.title, focus: p.coverFocus, fit: p.coverFit, bg: p.coverBg, label: `Cover ${pad(idx + 1)}` })}
        <div class="work-card-ui">
          <div class="work-card-top"><span class="work-card-title">${esc(p.title)}</span><span class="work-card-arrow">${ICON.arrow}</span></div>
          <div class="tags">${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        </div>
      </a>`;
  }

  function contactBlock(site, opts = {}) {
    const c = site.contact;
    const Tag = opts.h1 ? "h1" : "h2";
    return `
    <section class="section contact" id="contact" ${opts.style ? `style="${opts.style}"` : ""}>
      <div class="wrap contact-grid">
        <div>
          <${Tag} class="${opts.h1 ? "t-h1" : "t-h2"} reveal">${rt(c.heading)}</${Tag}>
          <p class="contact-label t-label">Email-ID</p>
          <button class="copy-email t-lead reveal" data-copy="${esc(c.email)}" aria-label="Copy email address ${esc(c.email)}">
            <span>${esc(c.email)}</span>${ICON.copy}<span class="copy-tip">Click to copy</span>
          </button>
          <p class="contact-label t-label">Socials</p>
          <ul class="social-list reveal">${site.socials.map((s) => `
            <li><a class="social-link t-lead" href="${esc(s.url)}" target="_blank" rel="noopener">${socialIcon(s)}${esc(s.label)}<span class="arr" aria-hidden="true">↗</span></a></li>`).join("")}
          </ul>
        </div>
        <form class="form reveal" novalidate data-endpoint="${esc(c.formEndpoint)}">
          <div class="field"><label class="t-label" for="f-name">Name:</label><input id="f-name" name="name" type="text" required autocomplete="name" placeholder="Alex Monroe"></div>
          <div class="field"><label class="t-label" for="f-email">Email:</label><input id="f-email" name="email" type="email" required autocomplete="email" placeholder="info@monroe.art"></div>
          <div class="field"><label class="t-label" for="f-msg">Your message:</label><textarea id="f-msg" name="message" required rows="4" autocomplete="off" placeholder="Enter your message here ..."></textarea></div>
          <div class="form-foot">
            <button class="btn is-solid" type="submit">${swap("Send message")}<span class="btn-arrow" aria-hidden="true">↗</span></button>
          </div>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>`;
  }

  function faqBlock(site) {
    const f = site.faqs;
    return `
    <section class="section faqs">
      <div class="wrap faq-grid">
        <h2 class="t-h2 reveal">${rt(f.heading)}</h2>
        <div class="faq-list reveal">${f.items.map((q, i) => `
          <div class="faq">
            <button class="faq-q" aria-expanded="false" id="faq-q-${i}" aria-controls="faq-a-${i}">
              <span class="n t-label">${pad(i + 1)}</span><span class="q">${esc(q.question)}</span><span class="faq-icon">${ICON.plus}</span>
            </button>
            <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"><div><p>${rt(q.answer)}</p></div></div>
          </div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  const ruleTitle = (title, { reverse = false, tag = "h2" } = {}) =>
    `<div class="rule-title${reverse ? " is-reverse" : ""} reveal"><${tag} class="t-h2">${esc(title)}</${tag}><span class="diamond"></span><span class="rule"></span></div>`;

  /* ---------- pages ---------- */
  function renderPage(site, works, archive) {
    switch (PAGE) {
      case "works": return pageWorks(site, works);
      case "work": return pageWork(site, works);
      case "about": return pageAbout(site);
      case "archive": return pageArchive(site, archive);
      case "contact": return contactBlock(site, { h1: true, style: "padding-top:calc(var(--header-h) + clamp(3rem,8vw,7rem))" }) + faqBlock(site);
      default: return pageHome(site, works);
    }
  }

  function pageHome(site, works) {
    document.body.classList.add("on-dark");
    const h = site.home.hero;
    const variant = h.variant === "centered" ? "centered" : "split";
    const name = variant === "centered"
      ? `<h1 class="hero-name" data-fit><span class="reveal-line" data-fit-inner style="display:inline-block"><span>${esc(site.brand.firstName)} ${esc(site.brand.lastName)}</span></span></h1>`
      : `<h1 class="hero-name"><span class="hero-first reveal-line"><span>${esc(site.brand.firstName)}</span></span><span class="hero-last reveal-line" style="--d:.12s"><span>${esc(site.brand.lastName)}</span></span></h1>`;
    const strip = `<div class="hero-strip"><div class="wrap hero-strip-inner">${h.categories.map((c) => `<a href="${esc(c.href)}">${swap(c.label)} <span class="arr" aria-hidden="true">↗</span></a>`).join("")}</div></div>`;

    const w = site.home.works;
    const g = w.gradient && w.gradient.length ? w.gradient : ["#6410AD", "#7B2CC4", "#A452C6", "#D98BB5"];
    const featured = works.projects.filter((p) => p.featured).slice(0, w.count || 4);
    const worksBg = `background:radial-gradient(60% 40% at 85% 30%, ${g[1]}aa, transparent 70%), linear-gradient(180deg, ${g.map((c, i) => `${c} ${Math.round((i / (g.length - 1)) * 100)}%`).join(", ")});`;

    return `
    <section class="hero hero--${variant} is-dark">
      ${h.backgroundImage ? `<div class="hero-bg">${/\.(mp4|webm|mov)$/i.test(h.backgroundImage) ? `<video src="${esc(h.backgroundImage)}" autoplay muted loop playsinline></video>` : `<img src="${esc(h.backgroundImage)}" alt="">`}</div>` : ""}
      <div class="hero-inner">
        ${name}
        <p class="hero-tagline t-body-l reveal" style="--d:.3s">${rt(h.tagline)}</p>
        <a class="hero-circle reveal" style="--d:.4s" href="#works" aria-label="Scroll to works">${ICON.arrowDR}</a>
      </div>
    </section>
    ${strip}

    <section class="section works-home is-dark" id="works" style="${worksBg}">
      ${w.backgroundImage ? `<div class="works-home-bg"><img src="${esc(w.backgroundImage)}" alt=""></div>` : ""}
      <div class="wrap works-home-grid">
        <aside class="works-side">
          <p class="t-label">${esc(w.eyebrow)}</p>
          <h2 class="t-h2 reveal">${rt(w.heading)}</h2>
          <div class="nodes" role="list">
            <span class="nodes-progress"></span>
            ${featured.map((p, i) => `<button class="node${i === 0 ? " is-active" : ""}" role="listitem" data-target="feat-${i}"><span class="node-dot"></span><span class="node-num t-label">${pad(i + 1)}</span><span class="node-title">${esc(p.title)}</span></button>`).join("")}
          </div>
          ${btn("View all works", "works.html")}
        </aside>
        <div class="works-list">
          ${featured.map((p, i) => `
          <a class="work-feature reveal" id="feat-${i}" href="work.html?slug=${encodeURIComponent(p.slug)}" data-cursor="View project">
            ${media({ image: p.cover, palette: p.palette, alt: p.title, fit: p.coverFit, bg: p.coverBg })}
            <div class="work-feature-meta">
              <div><h3 class="t-h3">${esc(p.title)}</h3><p>${esc(p.summary)}</p></div>
              <span class="t-label">${esc(p.year)}</span>
            </div>
          </a>`).join("")}
        </div>
      </div>
    </section>

    <section class="section" id="services">
      <div class="wrap">
        <div class="section-head">
          <h2 class="t-h2 reveal">${rt(site.home.services.heading)}</h2>
          <p class="t-label">${esc(site.home.services.eyebrow)}</p>
        </div>
        <div class="services-grid reveal">
          ${site.services.map((s, i) => `
          <article class="service" tabindex="0">
            <div class="service-bg">${s.video ? `<video src="${esc(s.video)}" ${s.image ? `poster="${esc(s.image)}"` : ""} muted loop playsinline preload="none" class="service-video"></video>` : s.image ? `<img src="${esc(s.image)}" alt="" loading="lazy">` : `<div class="ph" style="--c1:${esc(s.palette?.[0] || "#3b2a1f")};--c2:${esc(s.palette?.[1] || "#8a6a4f")}"></div>`}</div>
            <span class="service-num t-label">${pad(i + 1)}</span>
            <h3 class="t-h3">${esc(s.title)}</h3>
            <p>${esc(s.description)}</p>
          </article>`).join("")}
        </div>
      </div>
    </section>

    <section class="section feedback" style="padding-top:0">
      <div class="wrap section-head">
        <h2 class="t-h2 reveal">${rt(site.home.testimonials.heading)}</h2>
        <div class="feedback-nav">
          <button class="round-btn" data-dir="-1" aria-label="Previous">${ICON.left}</button>
          <button class="round-btn" data-dir="1" aria-label="Next">${ICON.right}</button>
        </div>
      </div>
      <div class="feedback-track reveal" data-cursor="Drag">
        ${site.testimonials.map((t) => `
        <article class="quote-card">
          <div>${media({ image: t.avatar, cls: "quote-avatar", palette: ["#8f1d1d", "#d94b4b"], noLabel: true })}</div>
          <div class="quote-body">
            <blockquote class="t-lead">“${esc(t.quote)}”</blockquote>
            <div><div class="quote-name">${esc(t.name)}</div><div class="quote-role">${esc(t.role)}</div></div>
          </div>
        </article>`).join("")}
      </div>
    </section>

    ${contactBlock(site)}`;
  }

  function pageWorks(site, works) {
    const wp = site.worksPage;
    const counts = Object.fromEntries(works.categories.map((c) => [c.id, works.projects.filter((p) => (p.categories || []).includes(c.id)).length]));
    const words = wp.heading.split(" ");
    return `
    <section class="wrap page-head">
      <div>
        <h1 class="t-h1"><span class="reveal-line"><span>${rt(words[0])}</span></span><span class="reveal-line" style="--d:.1s"><span>${rt(words.slice(1).join(" "))}</span></span></h1>
        <p class="page-desc reveal" style="--d:.2s">${rt(wp.description)}</p>
      </div>
      <div class="filters reveal" role="tablist" aria-label="Filter works">
        <button class="filter is-active" data-filter="all" role="tab">All <sup>${works.projects.length}</sup></button>
        ${works.categories.filter((c) => counts[c.id]).map((c) => `<button class="filter" data-filter="${esc(c.id)}" role="tab">${esc(c.label)} <sup>${counts[c.id]}</sup></button>`).join("")}
      </div>
    </section>
    <section class="wrap works-grid">${works.projects.map((p, i) => workCard(p, i, works)).join("")}</section>`;
  }

  function compareWidget(c) {
    return `<div class="media compare" data-compare>
      <img class="cmp-before" src="${esc(c.before)}" alt="Previous logo">
      <img class="cmp-after" src="${esc(c.after)}" alt="New logo">
      <span class="cmp-handle" aria-hidden="true"></span>
      <span class="cmp-hint t-label" data-hint-touch="${esc(c.hintTouch || "Drag to compare")}">${esc(c.hint || "Hover to compare")}</span>
    </div>`;
  }

  function caseBlock(b, p) {
    const paras = (s) => String(s || "").split(/\n\s*\n/).map((x) => `<p>${rt(x.trim())}</p>`).join("");
    if (b.type === "text") return `
      <div class="cb-text reveal">
        <div class="cb-text-head"><span class="t-label">${esc(b.label || "")}</span><h3 class="t-h3">${esc(b.heading)}</h3></div>
        <div class="cb-text-body t-body-l">${b.kicker ? `<p class="cb-kicker t-label">${esc(b.kicker)}</p>` : ""}${paras(b.body)}</div>
      </div>`;
    if (b.type === "divider") return `
      <div class="cb-divider">${ruleTitle(b.title, { tag: "h2" })}${b.note ? `<p class="reveal">${esc(b.note)}</p>` : ""}</div>`;
    if (b.type === "pair") return `<div class="cb-pair">${(b.items || []).map((m) => `<div class="reveal">${media({ image: m.image, video: m.video, ratio: b.ratio || m.ratio || "4/5", focus: m.focus, fit: m.fit, bg: m.bg, palette: p.palette, alt: p.title })}</div>`).join("")}</div>`;
    if (b.type === "credits") return ""; // removed from the layout (kept for old content)
    return `<div class="cb-media reveal${b.bleed ? " is-bleed" : ""}">${media({ image: b.image, video: b.video, ratio: b.ratio || "16/9", focus: b.focus, fit: b.fit, bg: b.bg, palette: p.palette, alt: p.title, cls: b.bleed ? "is-bleed" : "" })}</div>`;
  }

  function pageWork(site, works) {
    const slug = new URLSearchParams(location.search).get("slug");
    const idx = Math.max(0, works.projects.findIndex((p) => p.slug === slug));
    const p = works.projects[idx];
    const more = [1, 2, 3].map((k) => works.projects[(idx + k) % works.projects.length]).filter((x) => x !== p);
    const rows = [
      ["Role", (p.role || []).join(" · ")],
      ["Tools", (p.tools || []).join(", ")],
      ["Collaborators", (p.collaborators || []).join(", ")],
      ["Year", p.year]
    ].filter(([, v]) => v);
    const heroMedia = p.heroCompare
      ? compareWidget(p.heroCompare)
      : media({ image: p.cover, palette: p.palette, alt: p.title, eager: true, focus: p.coverFocus, fit: p.coverFit, bg: p.coverBg });

    return `
    <section class="case-hero">
      <div class="case-info">
        <div class="case-title-row">
          <span class="case-num t-label">${pad(idx + 1)}</span>
          <h1 class="t-h1"><span class="reveal-line"><span>${esc(p.title)}</span></span></h1>
        </div>
        <div class="case-intro t-body-l reveal" style="--d:.1s">${String(p.intro || p.summary || "").split(/\n\s*\n/).map((x) => `<p>${rt(x)}</p>`).join("")}</div>
        ${(p.links || []).length ? `<div class="case-links reveal" style="--d:.15s">${p.links.map((l) => btn(l.label, l.url, "is-solid")).join("")}</div>` : ""}
        <dl class="case-table reveal" style="--d:.2s">${rows.map(([k, v]) => `<div class="case-row"><dt class="t-label">${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      </div>
      <div class="case-media reveal">${heroMedia}</div>
    </section>
    <div class="case-blocks">${(p.blocks || []).map((b) => caseBlock(b, p)).join("")}</div>
    <section class="section more-work">
      <div class="wrap">
        <div class="section-head">
          <h2 class="t-h2 reveal">More work</h2>
          ${btn("Back to works", "works.html")}
        </div>
        <div class="more-grid">${more.map((m, i) => workCard(m, i, works)).join("")}</div>
        <div class="center">${btn("View all works", "works.html", "is-solid")}</div>
      </div>
    </section>`;
  }

  function pageAbout(site) {
    const a = site.about;
    return `
    <section class="wrap about-intro">
      <div>
        <p class="t-label reveal">${esc(a.eyebrow)}</p>
        <h1 class="t-lead reveal" style="--d:.1s">${rt(a.intro)}</h1>
        <p class="t-body-l reveal" style="--d:.2s">${rt(a.body)}</p>
        <div class="reveal" style="--d:.3s;margin-top:2rem">${btn("Get in touch", "contact.html", "is-solid")}</div>
      </div>
      <div class="about-portrait reveal" style="--d:.2s">${media({ image: a.portrait, label: "Portrait 4:5", palette: ["#6410AD", "#D9C2E8", "#F8F3EF"] })}</div>
    </section>

    <section class="section">
      <div class="wrap">
        ${ruleTitle(a.process.heading)}
        <p class="process-desc reveal">${rt(a.process.description)}</p>
        <div class="process-grid">${a.process.steps.map((s, i, all) => `
          <article class="step reveal" style="--d:${i * 0.1}s">
            <div class="step-dots" aria-hidden="true">${all.map((_, k) => `<i class="${k === i ? "is-on" : ""}"></i>`).join("")}</div>
            <span class="step-num">${pad(i + 1)}</span>
            <div><h3 class="t-h3">${esc(s.title)}</h3><p>${esc(s.description)}</p></div>
          </article>`).join("")}
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="wrap">
        ${ruleTitle(a.experience.heading, { reverse: true })}
        <ul class="exp-list">${a.experience.items.map((e, i) => `
          <li class="exp-item reveal" style="--d:${i * 0.05}s">
            <span class="exp-head"><span class="exp-company">${esc(e.company)}</span>, <span class="exp-role">${esc(e.role)}</span></span>
            <span class="exp-period">${esc(e.period)}</span>
            ${e.note ? `<span class="exp-note">${esc(e.note)}</span>` : ""}
          </li>`).join("")}
        </ul>
      </div>
    </section>
    ${faqBlock(site)}`;
  }

  function pageArchive(site, archive) {
    const a = site.archive;
    return `
    <section class="wrap page-head">
      <div>
        <h1 class="t-h1"><span class="reveal-line"><span>${rt(a.heading)}</span></span></h1>
        <p class="page-desc reveal" style="--d:.15s">${rt(a.description)}</p>
      </div>
      <div class="filters reveal" role="tablist" aria-label="Filter archive">
        <button class="filter is-active" data-filter="all" role="tab">All <sup>${archive.items.length}</sup></button>
        <button class="filter" data-filter="image" role="tab">Stills <sup>${archive.items.filter((x) => x.type !== "video").length}</sup></button>
        <button class="filter" data-filter="video" role="tab">Motion <sup>${archive.items.filter((x) => x.type === "video").length}</sup></button>
      </div>
    </section>
    <section class="wrap archive-grid">
      ${archive.items.map((it, i) => `
      <button class="archive-item reveal" data-type="${it.type === "video" ? "video" : "image"}" data-idx="${i}" data-cursor="${it.type === "video" ? "Play" : "View"}" aria-label="Open ${esc(it.caption)}">
        ${media(it.type === "video" ? { video: it.src, poster: it.poster, ratio: it.ratio, palette: it.palette, alt: it.caption } : { image: it.src, ratio: it.ratio, palette: it.palette, alt: it.caption })}
        <span class="archive-cap">${esc(it.caption)}</span>
      </button>`).join("")}
    </section>
    <div class="lightbox" role="dialog" aria-modal="true" aria-label="Media viewer">
      <button class="lightbox-close" aria-label="Close">×</button>
      <div class="lightbox-inner"></div>
    </div>`;
  }

  /* ---------- interactions ---------- */
  function init(site, works, archive) {
    const html = document.documentElement;
    let closeLightbox = null;

    const onScroll = () => html.classList.toggle("is-scrolled", scrollY > 30);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });

    // Menu
    const burger = $(".burger");
    const menu = $("#menu");
    const setMenu = (open) => {
      html.classList.toggle("menu-open", open);
      html.classList.toggle("lock", open);
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.setAttribute("aria-hidden", !open);
    };
    burger.addEventListener("click", () => setMenu(!html.classList.contains("menu-open")));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    addEventListener("keydown", (e) => { if (e.key === "Escape") { setMenu(false); closeLightbox && closeLightbox(); } });

    // Reveal
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    setTimeout(() => $$(".reveal, .reveal-line").forEach((el) => io.observe(el)), 350);

    // Copy email
    $$("[data-copy]").forEach((el) => el.addEventListener("click", async () => {
      const text = el.dataset.copy;
      try { await navigator.clipboard.writeText(text); }
      catch { const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); }
      const tip = $(".copy-tip", el);
      el.classList.add("is-copied");
      if (tip) tip.textContent = "Copied!";
      else { el.dataset.orig ??= el.textContent; el.textContent = "Copied!"; }
      clearTimeout(el._t);
      el._t = setTimeout(() => {
        el.classList.remove("is-copied");
        if (tip) tip.textContent = "Click to copy"; else el.textContent = el.dataset.orig;
      }, 1600);
    }));

    // Hover-to-play covers (works page cards only)
    $$("[data-hover-media]").forEach((card) => {
      const m = $(".media", card);
      const v = $(".hover-video", card);
      if (!v) return;
      const on = () => { m.classList.add("is-playing"); v.play().catch(() => {}); };
      const off = () => { m.classList.remove("is-playing"); v.pause(); v.currentTime = 0; };
      card.addEventListener("mouseenter", on);
      card.addEventListener("mouseleave", off);
      card.addEventListener("focus", on);
      card.addEventListener("blur", off);
    });

    // Inline videos: autoplay + loop while visible
    const vio = new IntersectionObserver((ens) => ens.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
    }), { rootMargin: "200px 0px" });
    $$("video[data-autoplay]").forEach((v) => vio.observe(v));

    // Services: hover video / tap on touch
    $$(".service").forEach((s) => {
      const v = $(".service-video", s);
      if (v) {
        s.addEventListener("mouseenter", () => v.play().catch(() => {}));
        s.addEventListener("mouseleave", () => v.pause());
      }
      s.addEventListener("click", () => {
        if (finePointer) return;
        $$(".service").forEach((o) => o !== s && o.classList.remove("is-open"));
        s.classList.toggle("is-open");
        if (v) (s.classList.contains("is-open") ? v.play().catch(() => {}) : v.pause());
      });
    });

    // FAQ
    $$(".faq-q").forEach((q) => q.addEventListener("click", () => {
      const item = q.parentElement;
      const open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      q.setAttribute("aria-expanded", open);
    }));

    // Feedback carousel: arrows + mouse drag on desktop
    const track = $(".feedback-track");
    if (track) {
      const [prev, next] = $$(".feedback-nav .round-btn");
      const step = () => (track.firstElementChild?.getBoundingClientRect().width || 600) + 16;
      prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
      next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
      const upd = () => {
        prev.disabled = track.scrollLeft < 8;
        next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
      };
      track.addEventListener("scroll", upd, { passive: true });
      upd();
      let drag = null;
      track.addEventListener("pointerdown", (e) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        drag = { x: e.clientX, left: track.scrollLeft, moved: false };
        track.setPointerCapture(e.pointerId);
      });
      track.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x;
        if (Math.abs(dx) > 3) { drag.moved = true; track.classList.add("is-dragging"); }
        track.scrollLeft = drag.left - dx;
      });
      const end = () => {
        if (!drag) return;
        const moved = drag.moved;
        drag = null;
        if (!moved) return;
        const w = step();
        const target = Math.round(track.scrollLeft / w) * w;
        track.classList.remove("is-dragging");
        track.scrollTo({ left: target, behavior: "smooth" });
      };
      track.addEventListener("pointerup", end);
      track.addEventListener("pointercancel", end);
      track.addEventListener("dragstart", (e) => e.preventDefault());
    }

    // Home works sidebar nodes
    const nodes = $$(".node");
    if (nodes.length) {
      const prog = $(".nodes-progress");
      const setActive = (i) => {
        nodes.forEach((n, k) => n.classList.toggle("is-active", k === i));
        prog.style.height = `${nodes[i].offsetTop - nodes[0].offsetTop}px`;
      };
      nodes.forEach((n, i) => n.addEventListener("click", () => {
        const t = document.getElementById(n.dataset.target);
        scrollTo({ top: t.getBoundingClientRect().top + scrollY - 120, behavior: "smooth" });
        setActive(i);
      }));
      const nio = new IntersectionObserver((ens) => ens.forEach((en) => {
        if (en.isIntersecting) setActive(Number(en.target.id.split("-")[1]));
      }), { rootMargin: "-45% 0px -45% 0px" });
      $$(".work-feature").forEach((f) => nio.observe(f));
    }

    // Filters
    const filterBtns = $$(".filter");
    if (filterBtns.length) {
      const items = $$(".works-grid .work-card, .archive-item");
      const apply = (f) => {
        filterBtns.forEach((b) => { const on = b.dataset.filter === f; b.classList.toggle("is-active", on); b.setAttribute("aria-selected", on); });
        items.forEach((it) => {
          const match = f === "all" || (it.dataset.cats || it.dataset.type || "").split(" ").includes(f);
          it.classList.toggle("is-hidden", !match);
          if (match) { it.classList.remove("is-in"); requestAnimationFrame(() => requestAnimationFrame(() => it.classList.add("is-in"))); }
        });
        const url = new URL(location.href);
        if (f === "all") url.searchParams.delete("filter"); else url.searchParams.set("filter", f);
        history.replaceState(null, "", url);
      };
      filterBtns.forEach((b) => b.addEventListener("click", () => apply(b.dataset.filter)));
      const initial = new URLSearchParams(location.search).get("filter");
      if (initial && filterBtns.some((b) => b.dataset.filter === initial)) apply(initial);
    }

    // Before / after compare (Ibaco): hover swipe on desktop, drag on touch
    $$("[data-compare]").forEach((el) => {
      const hint = $(".cmp-hint", el);
      const setPos = (pct) => el.style.setProperty("--pos", `${Math.max(0, Math.min(100, pct))}%`);
      const fromEvent = (e) => ((e.clientX - el.getBoundingClientRect().left) / el.clientWidth) * 100;
      if (finePointer) {
        el.addEventListener("mouseenter", (e) => {
          el.classList.add("is-anim", "is-active"); setPos(fromEvent(e));
          setTimeout(() => el.classList.remove("is-anim"), 700);
        });
        el.addEventListener("mousemove", (e) => setPos(fromEvent(e)));
        el.addEventListener("mouseleave", () => { el.classList.add("is-anim"); el.classList.remove("is-active"); setPos(0); });
      } else {
        hint.textContent = hint.dataset.hintTouch;
        setPos(50);
        el.classList.add("is-active");
        hint.style.opacity = "1";
        let dragging = false;
        el.addEventListener("pointerdown", (e) => { dragging = true; el.setPointerCapture(e.pointerId); setPos(fromEvent(e)); hint.style.opacity = "0"; });
        el.addEventListener("pointermove", (e) => { if (dragging) setPos(fromEvent(e)); });
        el.addEventListener("pointerup", () => { dragging = false; });
        el.addEventListener("pointercancel", () => { dragging = false; });
      }
    });

    // Archive lightbox
    const lb = $(".lightbox");
    if (lb) {
      const inner = $(".lightbox-inner", lb);
      const open = (i) => {
        const it = archive.items[i];
        inner.innerHTML = (it.type === "video"
          ? `<div class="media"><video src="${esc(it.src)}" ${it.poster ? `poster="${esc(it.poster)}"` : ""} controls autoplay loop muted playsinline style="max-height:86svh"></video></div>`
          : `<div class="media"><img src="${esc(it.src)}" alt="${esc(it.caption)}" style="max-height:86svh;object-fit:contain"></div>`)
          + `<p class="lightbox-cap">${esc(it.caption)}</p>`;
        lb.classList.add("is-open"); html.classList.add("lock");
      };
      closeLightbox = () => { lb.classList.remove("is-open"); html.classList.remove("lock"); inner.innerHTML = ""; };
      $$(".archive-item").forEach((b) => b.addEventListener("click", () => open(Number(b.dataset.idx))));
      $(".lightbox-close", lb).addEventListener("click", closeLightbox);
      lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
    }

    // Contact form → email.
    // No hidden "honeypot" input: desktop autofill / password managers filled it and the
    // form silently refused to send. Bots are filtered with a simple time check instead.
    const loadedAt = Date.now();
    $$(".form").forEach((form) => form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = $(".form-status", form);
      const show = (msg, kind = "") => {
        status.textContent = msg;
        status.className = `form-status is-visible${kind ? ` is-${kind}` : ""}`;
      };
      const data = Object.fromEntries(new FormData(form));
      if (!data.name?.trim() || !/^\S+@\S+\.\S+$/.test(data.email || "") || !data.message?.trim()) {
        show("Please fill in your name, a valid email and a message.", "error");
        return;
      }
      if (Date.now() - loadedAt < 1200) { show("Please wait a moment and try again.", "error"); return; }
      const submit = $("button[type=submit]", form);
      submit.disabled = true;
      show("Sending…");
      try {
        const res = await fetch(form.dataset.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name: data.name, email: data.email, message: data.message, _subject: site.contact.formSubject, _template: "table", _captcha: "false" })
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || out.success === "false" || out.success === false) throw new Error(out.message || "Request failed");
        form.reset();
        show(site.contact.successMessage, "success");
      } catch (err) {
        console.error(err);
        show(`Sorry, that didn't send. Please email ${site.contact.email} directly.`, "error");
      } finally { submit.disabled = false; }
    }));

    // Footer time + back to top
    const timeEl = $("[data-time]");
    const tick = () => {
      try { timeEl.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: timeEl.dataset.time, timeZoneName: "short" }).format(new Date()); }
      catch { timeEl.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
    };
    if (timeEl) { tick(); setInterval(tick, 30000); }
    $$("[data-top]").forEach((b) => b.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" })));

    // Fit big words to width
    const fit = () => $$("[data-fit]").forEach((el) => {
      const inner = $("[data-fit-inner]", el) || el;
      el.style.fontSize = "100px";
      const w = inner.getBoundingClientRect().width;
      const cs = getComputedStyle(el);
      const avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (w) el.style.fontSize = `${Math.floor((100 * avail) / w * 0.995)}px`;
    });
    fit();
    document.fonts?.ready.then(fit);
    let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(fit, 120); });

    if (finePointer) initCursor();

    if (location.hash) {
      const t = document.querySelector(location.hash);
      if (t) setTimeout(() => t.scrollIntoView({ behavior: "instant", block: "start" }), 60);
    }
    requestAnimationFrame(() => html.classList.add("is-ready"));
  }

  function initCursor() {
    const html = document.documentElement;
    html.classList.add("has-cursor");
    const c = document.createElement("div");
    c.className = "cursor";
    c.innerHTML = '<span class="cursor-text"></span>';
    document.body.appendChild(c);
    const text = $(".cursor-text", c);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; c.classList.add("is-visible"); }, { passive: true });
    document.addEventListener("mouseleave", () => c.classList.remove("is-visible"));
    addEventListener("mousedown", () => c.classList.add("is-down"));
    addEventListener("mouseup", () => c.classList.remove("is-down"));
    document.addEventListener("mouseover", (e) => {
      const link = e.target.closest("a, button, [role=button], label, input, textarea");
      const label = e.target.closest("[data-cursor]");
      if (label && (!link || link === label || label.contains(link) === false)) {
        text.textContent = label.dataset.cursor + (label.dataset.cursor === "Drag" ? " ⟷" : " ↗");
        c.classList.add("is-label"); c.classList.remove("is-link");
      } else if (link) { c.classList.add("is-link"); c.classList.remove("is-label"); }
      else c.classList.remove("is-link", "is-label");
    });
    const loop = () => {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      c.style.translate = `${cx}px ${cy}px`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  boot();
})();
