(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-scroll]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const el = document.querySelector(href);
      if (!el) return;

      e.preventDefault();
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  });

  const navRows = Array.from(document.querySelectorAll(".navRow"));
  const sections = Array.from(document.querySelectorAll("[data-observe]"));

  function setActive(id) {
    navRows.forEach((r) => r.classList.toggle("isActive", r.getAttribute("href") === `#${id}`));
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((x) => x.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (vis && vis.target && vis.target.id) setActive(vis.target.id);
      },
      { threshold: [0.25, 0.4, 0.55], rootMargin: "-20% 0px -60% 0px" }
    );

    sections.forEach((s) => io.observe(s));
  }

  const form = document.getElementById("bookForm");
  const msg = document.getElementById("msg");
  if (form && msg) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      msg.textContent = "Richiesta inviata (demo).";
      form.reset();
      setTimeout(() => (msg.textContent = ""), 2200);
    });
  }
})();
