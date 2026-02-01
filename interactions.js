(() => {
  const run = () => {
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* =========================
       REVEAL ON SCROLL
       - Safe by default: content is visible even if JS fails
       - We only apply the hidden state by adding .reveal-init from JS
    ========================= */
    const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
    if (revealEls.length) {
      if (reducedMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach((el) => el.classList.add("is-in"));
      } else {
        const vh = window.innerHeight || document.documentElement.clientHeight || 0;

        const io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (!e.isIntersecting) continue;
              e.target.classList.add("is-in");
              io.unobserve(e.target);
            }
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );

        revealEls.forEach((el) => {
          const r = el.getBoundingClientRect();
          const inView = r.top < vh * 0.92 && r.bottom > 0;
          el.classList.add("reveal-init");
          if (inView) {
            el.classList.add("is-in");
          } else {
            io.observe(el);
          }
        });
      }
    }

    /* =========================
       TOAST (UTILITY)
    ========================= */
    const toastEl = document.getElementById("toast");
    let toastTimer = null;

    function showToast(message) {
      if (!toastEl) return;
      toastEl.textContent = message;
      toastEl.classList.add("is-show");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => {
        toastEl.classList.remove("is-show");
      }, 1600);
    }

    /* =========================
       COPY EMAIL
    ========================= */
    const copyBtn = document.querySelector("[data-copy-email]");
    if (copyBtn) {
      const email = copyBtn.getAttribute("data-copy-email") || "";

      copyBtn.addEventListener("click", async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(email);
          } else {
            const input = document.createElement("input");
            input.value = email;
            input.setAttribute("readonly", "readonly");
            input.style.position = "fixed";
            input.style.left = "-9999px";
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
          }

          const isEn = (document.documentElement.lang || "").toLowerCase().startsWith("en");
          showToast(isEn ? "Email copied" : "Email copiata");
        } catch {
          const isEn = (document.documentElement.lang || "").toLowerCase().startsWith("en");
          showToast(isEn ? "Copy failed" : "Copia non riuscita");
        }
      });
    }

    /* =========================
       PROJECT QUICK VIEW (DIALOG)
    ========================= */
    const dialog = document.getElementById("projectDialog");

    if (dialog) {
      const titleEl = dialog.querySelector("[data-pd-title]");
      const descEl = dialog.querySelector("[data-pd-desc]");
      const techEl = dialog.querySelector("[data-pd-tech]");
      const imgEl = dialog.querySelector("[data-pd-img]");
      const liveEl = dialog.querySelector("[data-pd-live]");
      const codeEl = dialog.querySelector("[data-pd-code]");

      function populateFromCard(card) {
        const title = card.querySelector("h3")?.textContent?.trim() || "";
        const desc = card.querySelector("p")?.textContent?.trim() || "";
        const tech = card.querySelector(".tech")?.textContent?.trim() || "";
        const img = card.querySelector("img");
        const links = Array.from(card.querySelectorAll(".card-links a"));
        const live = links[0]?.getAttribute("href") || "#";
        const code = links[1]?.getAttribute("href") || "#";

        const isEn = (document.documentElement.lang || "").toLowerCase().startsWith("en");
        const techPrefix = isEn ? "Stack: " : "Tecnologie: ";

        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = desc;
        if (techEl) techEl.textContent = tech ? (techPrefix + tech.replace(/\s+/g, " ").trim()) : "";
        if (imgEl && img) {
          imgEl.src = img.getAttribute("src") || "";
          imgEl.alt = img.getAttribute("alt") || title;
        }
        if (liveEl) liveEl.href = live;
        if (codeEl) codeEl.href = code;
      }

      document.addEventListener("click", (ev) => {
        const btn = ev.target.closest("[data-quickview]");
        if (!btn) return;

        const card = btn.closest("article");
        if (!card) return;

        populateFromCard(card);

        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
      });

      // Close on backdrop click
      dialog.addEventListener("click", (ev) => {
        if (ev.target === dialog) dialog.close();
      });
    }

    /* =========================
       SPOTLIGHT (SUBTLE)
       - Desktop only: pointer fine + hover
       - Mobile: uses .is-active via CSS
    ========================= */
    const canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
    const finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

    if (!reducedMotion && canHover && finePointer) {
      const spots = Array.from(document.querySelectorAll(".spotlight"));
      if (spots.length) {
        spots.forEach((el) => {
          let raf = 0;

          const update = (ev) => {
            const rect = el.getBoundingClientRect();
            const x = ((ev.clientX - rect.left) / rect.width) * 100;
            const y = ((ev.clientY - rect.top) / rect.height) * 100;
            el.style.setProperty("--mx", x.toFixed(2) + "%");
            el.style.setProperty("--my", y.toFixed(2) + "%");
            el.classList.add("spotlight-on");
          };

          const onMove = (ev) => {
            if (raf) return;
            raf = window.requestAnimationFrame(() => {
              raf = 0;
              update(ev);
            });
          };

          el.addEventListener("pointerenter", (ev) => update(ev));
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerleave", () => el.classList.remove("spotlight-on"));
        });
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
