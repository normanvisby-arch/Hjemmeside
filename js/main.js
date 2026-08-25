/* Fælles adfærd: mobilmenu, aktiv navigation, scroll-reveal,
   header-morf, tekst-reveal, tal-optælling og kort-tilt */

document.documentElement.classList.add("js");
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mobilmenu
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".main-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") nav.classList.remove("open");
  });
}

// Markér aktiv side i menuen
const here = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".main-nav a[href]").forEach((a) => {
  const target = a.getAttribute("href").split("#")[0];
  if (target === here) a.setAttribute("aria-current", "page");
});

// ---------- Nyhedsstream i topbjælken (redigeres i js/data.js) ----------
const tickerBar = document.querySelector("[data-ticker]");
if (tickerBar && typeof SITE_DATA !== "undefined" &&
    Array.isArray(SITE_DATA.ticker) && SITE_DATA.ticker.length) {
  const items = SITE_DATA.ticker;
  let tickerIdx = 0;
  const visTicker = (i) => {
    tickerBar.innerHTML = `<span class="ticker-item">${items[i]}</span>`;
  };
  visTicker(0);
  if (items.length > 1) {
    setInterval(() => {
      if (prefersReduced) {
        tickerIdx = (tickerIdx + 1) % items.length;
        visTicker(tickerIdx);
      } else {
        const el = tickerBar.querySelector(".ticker-item");
        if (el) el.classList.add("out");
        setTimeout(() => {
          tickerIdx = (tickerIdx + 1) % items.length;
          visTicker(tickerIdx);
        }, 350);
      }
    }, 6000);
  }
}

// ---------- Dynamisk indhold fra js/data.js ----------
// Nyheder og personale ligger i én lille, letredigérbar datafil,
// så indholdet kan rettes uden at røre HTML'en.
if (typeof SITE_DATA !== "undefined") {
  // Samme regel som laegeplan (avatars._slug) og hjemmeside-editoren,
  // så et uploadet portræt får præcis det filnavn, siden slår op.
  const slug = (navn) => navn.toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa")
    .replace(/é/g, "e").replace(/è/g, "e").replace(/ü/g, "ue")
    .replace(/ö/g, "oe").replace(/ä/g, "ae")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const initialer = (navn) =>
    navn.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const staffCard = (p, i) => `
    <div class="staff-card reveal${i % 3 === 1 ? " reveal-d1" : i % 3 === 2 ? " reveal-d2" : ""}">
      <div class="avatar">
        <span aria-hidden="true">${initialer(p.navn)}</span>
        <img src="assets/personale/${slug(p.navn)}.jpg" alt="Portræt af ${p.navn}" loading="lazy"
             onerror="this.remove();">
      </div>
      <h3>${p.navn}</h3>
      <div class="role">${p.rolle}</div>
      ${p.info ? `<p>${p.info}</p>` : ""}
    </div>`;

  document.querySelectorAll("[data-staff]").forEach((el) => {
    const liste = SITE_DATA[el.dataset.staff] || [];
    el.innerHTML = liste.map(staffCard).join("");
  });

  // Forsidens "Mød holdet"-række: de faste læger fra data.js.
  // Portræt fra assets/personale/ hvis det findes — ellers initialer.
  const holdWrap = document.querySelector("[data-hold]");
  if (holdWrap && Array.isArray(SITE_DATA.laeger)) {
    holdWrap.innerHTML = SITE_DATA.laeger.map((p) => `
      <a class="hold-person" href="personale.html" title="${p.navn} · ${p.rolle}">
        <span class="h-avatar">
          <span aria-hidden="true">${initialer(p.navn)}</span>
          <img src="assets/personale/${slug(p.navn)}.jpg" alt="" loading="lazy" onerror="this.remove();">
        </span>
        <span class="h-navn">${p.navn.split(" ")[0]}</span>
      </a>`).join("");
  }

  const newsWrap = document.querySelector("[data-nyheder]");
  if (newsWrap && SITE_DATA.nyheder) {
    newsWrap.innerHTML = SITE_DATA.nyheder.map((n, i) => `
      <article class="news-item reveal${i % 3 === 1 ? " reveal-d1" : i % 3 === 2 ? " reveal-d2" : ""}">
        <div class="news-date" aria-hidden="true"><span class="d">${n.badge}</span><span class="m">${n.under}</span></div>
        <div>
          <h3>${n.titel}</h3>
          <p>${n.tekst}</p>
        </div>
      </article>`).join("");
  }

  // ---------- Redigerbar sidetekst, kontaktinfo, tider og FAQ ----------
  // Alle blokke er FALLBACK-BEVARENDE: teksten i HTML'en beholdes og
  // overskrives kun, hvis der findes en værdi i content.json. Uden JS (eller
  // uden en værdi) vises sidens indbyggede tekst.

  // Fri tekst pr. nøgle:  <p data-tekst="forside_hero_lede">…fallback…</p>
  const tekster = SITE_DATA.tekster || {};
  document.querySelectorAll("[data-tekst]").forEach((el) => {
    const v = tekster[el.dataset.tekst];
    if (v) el.innerHTML = v;
  });

  // Selvbetjenings-links:  <a data-link="selvbetjening" href="…fallback…">
  const links = SITE_DATA.links || {};
  document.querySelectorAll("[data-link]").forEach((a) => {
    const v = links[a.dataset.link];
    if (v) a.setAttribute("href", v);
  });

  // Faste kontaktoplysninger:  <span data-kontakt="telefon">…</span>
  // På et <a> sættes også tel:-linket for telefon/lægevagt.
  const kontakt = SITE_DATA.kontakt || {};
  document.querySelectorAll("[data-kontakt]").forEach((el) => {
    const v = kontakt[el.dataset.kontakt];
    if (!v) return;
    el.textContent = v;
    if (el.tagName === "A" &&
        (el.dataset.kontakt === "telefon" || el.dataset.kontakt === "laegevagt")) {
      el.setAttribute("href", "tel:" + v.replace(/\s+/g, ""));
    }
  });

  // Åbningstid-linje:  <li data-aabning>Man–fre kl. 8.00–15.00</li>
  if (SITE_DATA.aabningstekst) {
    document.querySelectorAll("[data-aabning]").forEach((el) => {
      el.textContent = SITE_DATA.aabningstekst;
    });
  }

  // Telefontider (samme kanoniske liste i alle paneler):
  //   <ul class="hours-list" data-telefontider>…fallback-rækker…</ul>
  if (Array.isArray(SITE_DATA.telefontider) && SITE_DATA.telefontider.length) {
    document.querySelectorAll("[data-telefontider]").forEach((ul) => {
      ul.innerHTML = SITE_DATA.telefontider.map((t) =>
        `<li><span class="time">${t.tid}</span><span>${t.tekst}</span></li>`).join("");
    });
  }

  // FAQ:  <div class="accordion prose" data-faq>…fallback-details…</div>
  const faqWrap = document.querySelector("[data-faq]");
  if (faqWrap && Array.isArray(SITE_DATA.faq) && SITE_DATA.faq.length) {
    faqWrap.innerHTML = SITE_DATA.faq.map((q) =>
      `<details><summary>${q.sp}</summary><div class="acc-body"><p>${q.svar}</p></div></details>`).join("");
  }

  // Patientinformation:  <div class="accordion prose" data-patientinfo>…</div>
  // tekst er rig HTML; et emne kan referere en struktureret prisliste
  // (attester/vacciner), som indsættes ved markøren [[PRISER]] i teksten.
  const prisliste = (rows) => (Array.isArray(rows) && rows.length)
    ? `<div class="pris-liste">${rows.map((r) =>
        `<div class="pris-row"><span class="pris-navn">${r.ydelse || r.navn || ""}</span><span class="pris-vaerdi">${r.pris || ""}</span></div>`
      ).join("")}</div>`
    : "";
  const piWrap = document.querySelector("[data-patientinfo]");
  if (piWrap && Array.isArray(SITE_DATA.patientinfo) && SITE_DATA.patientinfo.length) {
    piWrap.innerHTML = SITE_DATA.patientinfo.map((e) => {
      let body = e.tekst || "";
      const tbl = e.priser ? prisliste(SITE_DATA[e.priser]) : "";
      body = body.includes("[[PRISER]]") ? body.replace("[[PRISER]]", tbl) : body + tbl;
      return `<details><summary>${e.titel}</summary><div class="acc-body">${body}</div></details>`;
    }).join("");
  }
}

// Scroll-reveal (inkl. EKG-skillelinjer, der tegner sig selv)
const revealables = document.querySelectorAll(".reveal, .ekg-divider");
if ("IntersectionObserver" in window && revealables.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add("in"));
}

// Header-morf: krymper og får skygge, når der scrolles
const header = document.querySelector(".site-header");
if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 14);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Ord-for-ord reveal i hero-overskriften
const heroSection = document.querySelector(".hero");
const heroH1 = document.querySelector(".hero h1");
if (heroH1 && !prefersReduced) {
  [...heroH1.childNodes].forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement("span");
          span.className = "w";
          span.textContent = part;
          frag.appendChild(span);
        }
      });
      heroH1.replaceChild(frag, child);
    } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR" &&
               !child.classList.contains("ekg-word")) {
      child.classList.add("w"); // fx accent-ordet som én enhed
      // .ekg-word springes over — det animeres ind af sit eget EKG-kompleks
    }
  });
  heroH1.querySelectorAll(".w").forEach((w, i) => {
    w.style.transitionDelay = `${0.1 + i * 0.07}s`;
  });
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      heroH1.classList.add("in-words");
      if (heroSection) heroSection.classList.add("h-in");
    })
  );
} else if (heroSection) {
  heroSection.classList.add("h-in");
}

// Tal, der tæller op, når de ruller ind i billedet
document.querySelectorAll("[data-count]").forEach((el) => {
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;
  const show = () => { el.textContent = target; };
  if (prefersReduced || !("IntersectionObserver" in window)) { show(); return; }
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    io.disconnect();
    const start = performance.now();
    const dur = 1400;
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.6 });
  io.observe(el);
});

// Bløde anker-spring KUN ved klik på samme side — sideskift med #anker lander direkte
if (!prefersReduced) {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains("skip-link")) return;
    const el = document.getElementById(a.getAttribute("href").slice(1));
    if (!el) return;
    e.preventDefault();
    history.pushState(null, "", a.getAttribute("href"));
    el.scrollIntoView({ behavior: "smooth" });
  });
}

// 3D-tilt på kort — kun med mus, aldrig på touch
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReduced) {
  document.querySelectorAll(".card").forEach((card) => {
    if (card.querySelector(".btn, details")) return; // kort med knapper/foldere skal stå stille
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
      card.style.transform = `perspective(700px) translateY(-5px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

// ---------- Telefonstatus-linje under headeren (alle sider) ----------
// Viser hvad telefonen kan bruges til LIGE NU: grøn = tidsbestilling m.m.,
// gul = kun akut, rød = lukket (så peger vi på Lægevagten).
// VIGTIGT: Tidsrummene her skal følges ad med telefontiderne i indholdet
// (index.html, konsultation.html, kontakt.html og js/data.js) — ret ALLE
// steder, hvis telefontiderne ændres.
(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  // Dansk tid, uanset hvor den besøgende befinder sig
  const cphNu = () => {
    const dele = {};
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Copenhagen", hour12: false, weekday: "short",
      year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric",
    }).formatToParts(new Date()).forEach((p) => { dele[p.type] = p.value; });
    return {
      aar: +dele.year, md: +dele.month, dag: +dele.day,
      ugedag: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dele.weekday),
      min: ((+dele.hour) % 24) * 60 + (+dele.minute),
    };
  };

  // Påskedag (Meeus' algoritme) -> [måned, dag]
  const paaskedag = (y) => {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100,
      d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
      g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
      i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
      m = Math.floor((a + 11 * h + 22 * l) / 451), n = h + l - 7 * m + 114;
    return [Math.floor(n / 31), (n % 31) + 1];
  };

  // Officielle danske helligdage, hvor klinikken holder lukket
  const erHelligdag = (aar, md, dag) => {
    if ([[1, 1], [12, 25], [12, 26]].some(([m2, d2]) => m2 === md && d2 === dag)) return true;
    const [pm, pd] = paaskedag(aar);
    const paaske = Date.UTC(aar, pm - 1, pd);
    // Skærtorsdag, langfredag, påskedag, 2. påskedag, Kr. himmelfart, pinsedag, 2. pinsedag
    return [-3, -2, 0, 1, 39, 49, 50].some((off) => {
      const d2 = new Date(paaske + off * 86400000);
      return d2.getUTCMonth() + 1 === md && d2.getUTCDate() === dag;
    });
  };

  const tilstand = (nu) => {
    if (nu.ugedag === 0 || nu.ugedag === 6 || erHelligdag(nu.aar, nu.md, nu.dag)) {
      return { farve: "roed", tekst: "Lukket — Lægevagten 70 11 31 31 · ved livsfare ring 112", vagt: true };
    }
    if (nu.min >= 480 && nu.min < 540) return { farve: "gul", tekst: "Akut sygdom, der kræver lægekontakt samme dag", til: "9.00" };
    if (nu.min >= 540 && nu.min < 750) return { farve: "groen", tekst: "Tidsbestilling, prøvesvar og øvrige henvendelser", til: "12.30" };
    if (nu.min >= 750 && nu.min < 960) return { farve: "gul", tekst: "Kun akutte henvendelser", til: "16.00" };
    return { farve: "roed", tekst: "Lukket — Lægevagten 70 11 31 31 · ved livsfare ring 112", vagt: true };
  };

  const bar = document.createElement("div");
  bar.className = "tlf-status";
  bar.innerHTML = `
    <div class="wrap tlf-status-inner">
      <span class="dot" aria-hidden="true"></span>
      <p><strong>Telefonen lige nu:</strong> <span data-tlf-tekst></span><span class="tid" data-tlf-tid></span></p>
      <a class="tlf-ring" href="tel:75891811">Ring 75 89 18 11</a>
    </div>`;
  header.insertAdjacentElement("afterend", bar);

  const tekstEl = bar.querySelector("[data-tlf-tekst]");
  const tidEl = bar.querySelector("[data-tlf-tid]");
  const ringEl = bar.querySelector(".tlf-ring");

  const opdater = () => {
    const t = tilstand(cphNu());
    bar.dataset.farve = t.farve;
    tekstEl.textContent = t.tekst;
    tidEl.textContent = t.til ? ` · til kl. ${t.til}` : "";
    if (t.vagt) { ringEl.href = "tel:70113131"; ringEl.textContent = "Ring Lægevagten"; }
    else { ringEl.href = "tel:75891811"; ringEl.textContent = "Ring 75 89 18 11"; }
  };
  opdater();
  setInterval(opdater, 30000); // følger med, når klokken passerer et skifte
})();
