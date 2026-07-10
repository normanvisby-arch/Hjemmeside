/* Fælles adfærd: mobilmenu, aktiv navigation og scroll-reveal */

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

// Scroll-reveal
const revealables = document.querySelectorAll(".reveal");
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
