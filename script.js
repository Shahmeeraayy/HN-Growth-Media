/* HN Growth Media — edit the value below, nothing else needs changing. */
const CONFIG = {
  email: "brownhazel2003@gmail.com",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

// ---------- Basics ----------
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.querySelector(".menu-btn");
const mobileNav = document.getElementById("mobile-nav");
let lenis = null;
function setMenu(open) {
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileNav.hidden = !open;
  document.body.classList.toggle("menu-open", open);
  if (lenis) open ? lenis.stop() : lenis.start();
  if (open && hasGsap && !reduceMotion) {
    gsap.fromTo(".mobile-nav-inner a", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" });
    gsap.fromTo(".mobile-nav-foot", { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.4 });
  }
}
menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !mobileNav.hidden) setMenu(false); });

// Header shadow on scroll
const header = document.querySelector(".top");
let lastY = 0;
const onScrollHeader = () => {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 10);
  header.classList.toggle("hidden", y > 300 && y > lastY + 4);
  if (y < lastY - 4 || y <= 300) header.classList.remove("hidden");
  lastY = y;
};
window.addEventListener("scroll", onScrollHeader, { passive: true });
onScrollHeader();

// Back to top
document.querySelector(".to-top").addEventListener("click", () => {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 }); else window.scrollTo({ top: 0, behavior: "smooth" });
});

// Accordions: services and FAQ
function wireAccordion(btn) {
  btn.addEventListener("click", () => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    if (open) {
      if (hasGsap && !reduceMotion) {
        gsap.to(panel, { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut", onComplete: () => { panel.hidden = true; panel.style.height = ""; panel.style.opacity = ""; } });
      } else {
        panel.hidden = true;
      }
    } else {
      panel.hidden = false;
      if (hasGsap && !reduceMotion) {
        gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out", clearProps: "height" });
      }
    }
    if (hasGsap) setTimeout(() => ScrollTrigger.refresh(), 450);
  });
}
document.querySelectorAll(".service-row, .faq-q").forEach(wireAccordion);

// Quote form: builds an email, nothing is sent to a server
const form = document.getElementById("quote-form");
const formError = document.getElementById("form-error");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get("name") || "").trim();
  const contact = (data.get("contact") || "").trim();
  if (!name || !contact) {
    formError.hidden = false;
    (name ? form.contact : form.name).focus();
    return;
  }
  formError.hidden = true;
  const services = data.getAll("service").join(", ") || "Not sure yet";
  const body = [
    "Name: " + name,
    "Business: " + ((data.get("business") || "").trim() || "-"),
    "Contact: " + contact,
    "Services: " + services,
    "",
    (data.get("message") || "").trim(),
  ].join("\n");
  window.location.href =
    "mailto:" + CONFIG.email +
    "?subject=" + encodeURIComponent("Quote request from " + name) +
    "&body=" + encodeURIComponent(body);
});

// ---------- Motion ----------
const loader = document.querySelector(".loader");

if (!hasGsap || reduceMotion) {
  // No animation: everything stays visible as-is
  document.body.classList.add("no-motion");
  if (loader) loader.remove();
} else {
  document.body.classList.add("motion");
  gsap.registerPlugin(ScrollTrigger);

  // Smooth scroll
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70, duration: 1.2 });
      });
    });
  }

  // Split statement into words
  document.querySelectorAll("[data-split]").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach((w, i) => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = w;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });

  // Hero sequence (plays after the loader)
  const typed = document.querySelector(".typed");
  const typedText = typed ? typed.dataset.text : "";
  if (typed) typed.textContent = "";

  gsap.set(".hero-title .line-inner", { yPercent: 110, opacity: 1 });
  gsap.set(".hero-fade", { opacity: 0, y: 20 });
  const heroTl = gsap.timeline({ paused: true });
  heroTl
    .fromTo(".hero-title .line-inner", { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.12, ease: "power4.out" })
    .fromTo(".hero-fade", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.5")
    .fromTo(".gbp", { opacity: 0, y: 60, rotate: -6 }, { opacity: 1, y: 0, rotate: -2, duration: 1.1, ease: "power3.out" }, "-=0.9")
    .add(() => {
      let i = 0;
      const tick = () => {
        typed.textContent = typedText.slice(0, ++i);
        if (i < typedText.length) setTimeout(tick, 55 + Math.random() * 60);
      };
      if (typed) tick();
    }, "-=0.6")
    .fromTo(".stars i", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: "back.out(2)" }, "-=0.2")
    .fromTo(".gbp-badge", { scale: 0, rotate: -10 }, { scale: 1, rotate: 4, duration: 0.5, ease: "back.out(2.5)" }, "-=0.1")
    .fromTo(".gbp-ping", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, "+=0.4")
    .add(() => {
      gsap.to(".gbp", { y: -12, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });

  const startHero = () => {
    document.body.classList.add("ready");
    heroTl.play();
  };

  let seen = false;
  try { seen = sessionStorage.getItem("hn-seen") === "1"; sessionStorage.setItem("hn-seen", "1"); } catch (e) {}
  if (loader && seen) { loader.remove(); }
  if (loader && !seen) {
    gsap.timeline()
      .to(".loader-bar span", { scaleX: 1, duration: 0.9, ease: "power2.inOut" })
      .to(".loader", { yPercent: -100, duration: 0.7, ease: "power4.inOut", onComplete: () => loader.remove() }, "+=0.1")
      .add(startHero, "-=0.45");
  } else {
    startHero();
  }

  // Parallax orbs and hero copy
  gsap.to(".orb-1", { yPercent: 30, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".orb-2", { yPercent: -40, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-copy", { yPercent: 15, opacity: 0.3, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  // Mouse-follow glow in the hero
  const hero = document.querySelector(".hero");
  if (finePointer && hero) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      hero.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    });
  }

  // Statement: words brighten as you scroll
  document.querySelectorAll("[data-split]").forEach((el) => {
    gsap.to(el.querySelectorAll(".word"), {
      opacity: 1, stagger: 0.05, ease: "none",
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
    });
  });

  // Counters
  document.querySelectorAll(".count").forEach((el) => {
    const to = +el.dataset.to;
    const obj = { v: 0 };
    el.textContent = "0";
    gsap.to(obj, {
      v: to, duration: 1.6, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: () => { el.textContent = Math.round(obj.v); },
    });
  });

  // Section headings: words rise in
  document.querySelectorAll(".section-head h2, .about-copy h2, .contact-copy h2, .process-head h2").forEach((h) => {
    const words = h.textContent.trim().split(/\s+/);
    h.textContent = "";
    h.classList.add("wsplit");
    words.forEach((w, i) => {
      const outer = document.createElement("span"); outer.className = "w";
      const inner = document.createElement("span"); inner.className = "wi"; inner.textContent = w;
      outer.appendChild(inner); h.appendChild(outer);
      if (i < words.length - 1) h.appendChild(document.createTextNode(" "));
    });
    gsap.fromTo(h.querySelectorAll(".wi"), { yPercent: 110 }, {
      yPercent: 0, duration: 0.9, stagger: 0.06, ease: "power4.out",
      scrollTrigger: { trigger: h, start: "top 88%", once: true },
    });
  });

  // Scroll progress line in the header
  gsap.to(".progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 } });

  // Active nav link follows the section in view
  document.querySelectorAll(".nav a[data-nav]").forEach((link) => {
    const section = document.getElementById(link.dataset.nav);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section, start: "top 50%", end: "bottom 50%",
      onToggle: (self) => link.classList.toggle("active", self.isActive),
    });
  });

  // Timeline: gold line draws down, dots light up
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    gsap.to(timeline, { "--draw": 1, ease: "none", scrollTrigger: { trigger: timeline, start: "top 70%", end: "bottom 60%", scrub: 0.4 } });
    document.querySelectorAll(".tl-item").forEach((item) => {
      gsap.fromTo(item, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 82%", once: true } });
      ScrollTrigger.create({ trigger: item, start: "top 65%", onEnter: () => item.classList.add("lit"), onLeaveBack: () => item.classList.remove("lit") });
    });
  }

  // About photo tilts toward the pointer
  const aboutPhoto = document.querySelector(".about-photo");
  if (finePointer && aboutPhoto) {
    const img = aboutPhoto.querySelector("img");
    aboutPhoto.addEventListener("pointermove", (e) => {
      const r = aboutPhoto.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(img, { rotateY: dx * 10, rotateX: -dy * 6, x: dx * 14, duration: 0.4, ease: "power2.out", transformPerspective: 800 });
    });
    aboutPhoto.addEventListener("pointerleave", () => gsap.to(img, { rotateY: 0, rotateX: 0, x: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }));
  }

  // Generic reveals
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  // Service rows stagger inside each group
  gsap.utils.toArray(".service-group").forEach((group) => {
    gsap.fromTo(group.querySelectorAll(".service-list > li"), { opacity: 0, x: -20 }, {
      opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
      scrollTrigger: { trigger: group, start: "top 80%", once: true },
    });
  });

  // Bento tiles: spotlight follows the pointer
  if (finePointer) {
    document.querySelectorAll(".tile").forEach((tile) => {
      tile.addEventListener("pointermove", (e) => {
        const r = tile.getBoundingClientRect();
        tile.style.setProperty("--x", (e.clientX - r.left) + "px");
        tile.style.setProperty("--y", (e.clientY - r.top) + "px");
      });
    });
  }

  // Process: pinned horizontal scroll on wide screens, stacked reveal on small
  ScrollTrigger.matchMedia({
    "(min-width: 961px)": () => {
      const track = document.querySelector(".process-track");
      const steps = document.querySelector(".steps");
      const getDistance = () => Math.max(0, steps.scrollWidth - track.clientWidth);
      const tween = gsap.to(steps, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: ".process",
          start: "top top",
          end: () => "+=" + getDistance(),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      gsap.utils.toArray(".step-n").forEach((n) => {
        gsap.fromTo(n, { scale: 0.5, opacity: 0.15 }, {
          scale: 1, opacity: 1, ease: "none",
          scrollTrigger: { trigger: n, containerAnimation: tween, start: "left 85%", end: "left 45%", scrub: true },
        });
      });
    },
    "(max-width: 960px)": () => {
      gsap.utils.toArray(".step").forEach((step) => {
        gsap.fromTo(step, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: step, start: "top 85%", once: true },
        });
      });
    },
  });

  // Industry list: gold line sweeps in
  gsap.utils.toArray(".industry-list li").forEach((li, i) => {
    gsap.fromTo(li, { "--w": "0%" }, {
      "--w": "100%", duration: 0.8, ease: "power3.out", delay: (i % 2) * 0.1,
      scrollTrigger: { trigger: li, start: "top 90%", once: true },
    });
  });

  // About photo parallax
  gsap.to(".about-photo img", { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true } });

  // Big CTA text grows as it enters
  gsap.fromTo(".cta-title", { scale: 0.7, opacity: 0.2 }, {
    scale: 1, opacity: 1, ease: "none",
    scrollTrigger: { trigger: ".cta-band", start: "top 90%", end: "center 55%", scrub: true },
  });

  // Marquee, speed reacts to scroll direction
  const track = document.querySelector(".marquee-track");
  if (track) {
    const tween = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
    track.parentElement.addEventListener("pointerenter", () => gsap.to(tween, { timeScale: 0.15, duration: 0.5 }));
    track.parentElement.addEventListener("pointerleave", () => gsap.to(tween, { timeScale: 1, duration: 0.5 }));
    ScrollTrigger.create({
      onUpdate: (self) => { gsap.to(tween, { timeScale: self.direction === -1 ? -1.5 : 1, duration: 0.4, overwrite: true }); },
    });
  }

  // Magnetic buttons
  if (finePointer) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.3, ease: "power2.out" });
      });
      btn.addEventListener("pointerleave", () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" }));
    });
  }

  // Custom cursor
  const cursor = document.querySelector(".cursor");
  if (finePointer && cursor) {
    document.body.classList.add("has-cursor");
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3" });
    window.addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); });
    document.querySelectorAll("a, button, label").forEach((el) => {
      el.addEventListener("pointerenter", () => cursor.classList.add("grow"));
      el.addEventListener("pointerleave", () => cursor.classList.remove("grow"));
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
}
