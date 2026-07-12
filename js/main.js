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
  const slug = (navn) => navn.toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa")
    .replace(/\s+/g, "-");
  const initialer = (navn) =>
    navn.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const staffCard = (p, i) => `
    <div class="staff-card reveal${i % 3 === 1 ? " reveal-d1" : i % 3 === 2 ? " reveal-d2" : ""}">
      <div class="avatar">
        <span aria-hidden="true">${initialer(p.navn)}</span>
        <img src="assets/personale/${slug(p.navn)}.jpg" alt="Portræt af ${p.navn}" loading="lazy" onerror="this.remove()">
      </div>
      <h3>${p.navn}</h3>
      <div class="role">${p.rolle}</div>
      ${p.info ? `<p>${p.info}</p>` : ""}
    </div>`;

  document.querySelectorAll("[data-staff]").forEach((el) => {
    const liste = SITE_DATA[el.dataset.staff] || [];
    el.innerHTML = liste.map(staffCard).join("");
  });

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

// 3D-tilt på kort — kun med mus, aldrig på touch
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReduced) {
  document.querySelectorAll(".card").forEach((card) => {
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
