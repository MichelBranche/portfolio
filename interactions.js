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
      const subEl = dialog.querySelector("[data-pd-sub]");
      const caseBox = dialog.querySelector(".pd-case");
      const probEl = dialog.querySelector("[data-pd-problem]");
      const solEl = dialog.querySelector("[data-pd-solution]");
      const outEl = dialog.querySelector("[data-pd-outcome]");
      const featUl = dialog.querySelector("[data-pd-features]");
      const learnUl = dialog.querySelector("[data-pd-learn]");
      const noteEl = dialog.querySelector("[data-pd-note]");
      const techEl = dialog.querySelector("[data-pd-tech]");
      const imgEl = dialog.querySelector("[data-pd-img]");
      const liveEl = dialog.querySelector("[data-pd-live]");
      const codeEl = dialog.querySelector("[data-pd-code]");

      const PROJECT_DETAILS = {
        "Masonry Gallery": {
          it: {
            sub: "Gallery tipo Pinterest con masonry responsive in puro HTML/CSS.",
            features: [
              "Layout a colonne con spaziatura curata e card riutilizzabili",
              "Micro-interazioni e hover puliti, senza librerie",
              "Breakpoints ottimizzati per desktop e mobile"
            ],
            learned: [
              "Uso di Grid e tecniche masonry senza JS",
              "Gestione immagini: proporzioni, crop e performance",
              "Coerenza visiva: componenti, variabili, spacing"
            ],
            problem: "Volevo un layout tipo Pinterest, stabile e responsive, senza usare JS.",
            solution: "Ho creato card riutilizzabili e un masonry pulito usando solo CSS (grid/colonne) e variabili.",
            outcome: "Gallery fluida su desktop e mobile, con micro-interazioni leggere e buona leggibilità.",
            stack: "HTML5 · CSS3 · Grid · Responsive",
            note: "Obiettivo: layout solido e leggibile, con UI moderna ma semplice."
          },
          en: {
            sub: "Pinterest-like masonry gallery built with clean HTML/CSS.",
            features: [
              "Column-based layout with consistent spacing and reusable cards",
              "Subtle micro-interactions, no libraries",
              "Optimized breakpoints for desktop and mobile"
            ],
            learned: [
              "Using Grid/masonry techniques without JS",
              "Image handling: ratios, crop, performance",
              "Visual consistency: components, variables, spacing"
            ],
            problem: "I wanted a Pinterest-like layout that stays stable and responsive without using JS.",
            solution: "I built reusable cards and a clean masonry using CSS only (grid/columns) and variables.",
            outcome: "A smooth gallery on desktop and mobile, with subtle micro-interactions and solid readability.",
            stack: "HTML5 · CSS3 · Grid · Responsive",
            note: "Goal: a solid, readable layout with a modern, minimal UI."
          }
        },
        "Landing Page": {
          it: {
            sub: "Landing completa con componenti riutilizzabili e gerarchie chiare.",
            features: [
              "Sezioni complete: hero, features, pricing, FAQ",
              "CTA coerenti e tipografia leggibile",
              "Struttura semantica e responsive solido"
            ],
            learned: [
              "Gerarchie visive: titoli, spazi, contrasto",
              "Componenti UI ripetibili senza duplicare CSS",
              "Layout con Flexbox/Grid in modo ordinato"
            ],
            problem: "Serviva una landing completa e chiara, con sezioni tipiche e CTA coerenti.",
            solution: "Ho strutturato la pagina con HTML semantico e componenti riutilizzabili, curando gerarchie e spacing.",
            outcome: "Landing estendibile e ordinata, pronta per essere riadattata ad altri prodotti o brand.",
            stack: "HTML5 · CSS3 · Flexbox · Responsive",
            note: "Pensata per essere chiara e convertire: poche distrazioni, focus sul contenuto."
          },
          en: {
            sub: "Full landing page with reusable components and clear hierarchy.",
            features: [
              "Full sections: hero, features, pricing, FAQ",
              "Consistent CTAs and readable typography",
              "Semantic structure and solid responsive layout"
            ],
            learned: [
              "Visual hierarchy: headings, spacing, contrast",
              "Reusable UI components without CSS bloat",
              "Organized layout with Flexbox/Grid"
            ],
            problem: "I needed a complete, clear landing page with common sections and consistent CTAs.",
            solution: "I structured it with semantic HTML and reusable components, focusing on hierarchy and spacing.",
            outcome: "A tidy, extensible landing you can adapt to other products or brands.",
            stack: "HTML5 · CSS3 · Flexbox · Responsive",
            note: "Designed to be clear and conversion-oriented: minimal distraction, strong content focus."
          }
        },
        "UI Layout": {
          it: {
            sub: "Dashboard mock con interazioni JS: filtro, modal, toast.",
            features: [
              "Filtro tabella in JS con gestione dello stato",
              "Modale accessibile e feedback con toast",
              "UI a componenti (card, bottoni, badge)"
            ],
            learned: [
              "Event handling e DOM update senza framework",
              "Pattern UI: modal, toast, feedback utente",
              "Debug e organizzazione dello script"
            ],
            problem: "Volevo mostrare interazioni reali (filtri, modal, toast) in una UI tipo dashboard.",
            solution: "Ho implementato logica DOM in vanilla JS e uno stile coerente per componenti e stati.",
            outcome: "Una demo che evidenzia capacità UI/UX e gestione eventi senza dipendenze.",
            stack: "HTML5 · CSS3 · JavaScript (DOM)",
            note: "Focus sul comportamento: poche feature, ma fatte bene e pulite."
          },
          en: {
            sub: "Dashboard mock with JS interactions: filter, modal, toast.",
            features: [
              "JS table filtering with state handling",
              "Accessible modal and toast feedback",
              "Component-like UI (cards, buttons, badges)"
            ],
            learned: [
              "Event handling and DOM updates without frameworks",
              "UI patterns: modal, toast, user feedback",
              "Debugging and script organization"
            ],
            problem: "I wanted to showcase real interactions (filters, modal, toast) in a dashboard-style UI.",
            solution: "I implemented DOM logic in vanilla JS and a consistent component/state styling system.",
            outcome: "A demo that highlights UI/UX skills and event handling without dependencies.",
            stack: "HTML5 · CSS3 · JavaScript (DOM)",
            note: "Behavior-first: fewer features, but polished and clean."
          }
        },
        "Quiz EPICODE": {
          it: {
            sub: "Quiz web (Build Week) con flusso completo: start, domande, feedback, risultato finale.",
            features: [
              "Navigazione tra domande e gestione risposte",
              "Feedback visivo e riepilogo finale",
              "UI responsive e stato gestito in JavaScript"
            ],
            learned: [
              "Gestione stato e flusso di una mini app",
              "Event handling e DOM update su piu schermate",
              "Sviluppo iterativo: feature, fix e rifiniture UI"
            ],
            problem: "Volevo realizzare un quiz completo, con piu schermate e una UX chiara.",
            solution: "Ho strutturato il flusso in step e gestito stato e UI via DOM, mantenendo stile coerente.",
            outcome: "Quiz fluido e leggibile, con feedback chiari e risultato finale.",
            stack: "HTML5 · CSS3 · JavaScript (DOM)",
            note: "Build Week: focus su flusso, stati e chiarezza UI."
          },
          en: {
            sub: "Build Week quiz app with a full flow: start, questions, feedback, final result.",
            features: [
              "Question navigation and answer handling",
              "Visual feedback and final summary",
              "Responsive UI and state handled in JavaScript"
            ],
            learned: [
              "Managing state and flow in a mini app",
              "Event handling and DOM updates across views",
              "Iterative work: features, fixes, UI polish"
            ],
            problem: "I wanted to build a complete quiz with multiple screens and a clear UX.",
            solution: "I organized the flow into steps and managed state and UI via the DOM with consistent styling.",
            outcome: "A smooth, readable quiz with clear feedback and a final result screen.",
            stack: "HTML5 · CSS3 · JavaScript (DOM)",
            note: "Build Week focus: flow, states, and UI clarity."
          }
        },
        "Easy Calculator": {
          it: {
            sub: "Calcolatrice minimale con tastiera e tema persistente.",
            features: [
              "Input robusto: click e tastiera",
              "Gestione edge case (reset, errori, chaining)",
              "Tema Light/Dark con persistenza"
            ],
            learned: [
              "Parsing e validazione degli input",
              "Gestione stato UI e feedback",
              "LocalStorage per preferenze"
            ],
            problem: "Serviva una calcolatrice minimale che funzionasse bene anche da tastiera e ricordasse il tema.",
            solution: "Gestione input e eventi (click + keyboard), parsing sicuro e persistenza tema con localStorage.",
            outcome: "Calcolatrice pulita, rapida e comoda, con Light/Dark persistente.",
            stack: "HTML5 · CSS3 · JavaScript (DOM) · LocalStorage",
            note: "Obiettivo: UX semplice, veloce e prevedibile."
          },
          en: {
            sub: "Minimal calculator with keyboard support and persistent theme.",
            features: [
              "Robust input via buttons and keyboard",
              "Edge cases handled (reset, errors, chaining)",
              "Light/Dark theme with persistence"
            ],
            learned: [
              "Input parsing and validation",
              "UI state management and feedback",
              "LocalStorage for preferences"
            ],
            problem: "I needed a minimal calculator that works well with the keyboard and remembers the theme.",
            solution: "Input + event handling (click and keyboard), safe parsing, and theme persistence via localStorage.",
            outcome: "A clean, fast calculator with persistent Light/Dark theme.",
            stack: "HTML5 · CSS3 · JavaScript (DOM) · LocalStorage",
            note: "Goal: simple, fast, predictable UX."
          }
        }
      };

      const setList = (ul, items) => {
        if (!ul) return;
        ul.innerHTML = "";
        (items || []).forEach((t) => {
          const li = document.createElement("li");
          li.textContent = t;
          ul.appendChild(li);
        });
      };

      function populateFromCard(card) {
        const title = card.querySelector("h3")?.textContent?.trim() || "";
        const cardDesc = card.querySelector("p")?.textContent?.trim() || "";
        const img = card.querySelector("img");
        const links = Array.from(card.querySelectorAll(".card-links a"));
        const live = links[0]?.getAttribute("href") || "#";
        const code = links[1]?.getAttribute("href") || "#";

        const isEn = (document.documentElement.lang || "").toLowerCase().startsWith("en");
        const techPrefix = isEn ? "Stack: " : "Tecnologie: ";

        const details = PROJECT_DETAILS[title]?.[isEn ? "en" : "it"] || null;
        const sub = details?.sub || cardDesc;
        const features = details?.features || [];
        const learned = details?.learned || [];
        const stack = details?.stack || (card.querySelector(".tech")?.textContent?.trim() || "");
        const note = details?.note || "";
        const problem = details?.problem || "";
        const solution = details?.solution || "";
        const outcome = details?.outcome || "";

        if (titleEl) titleEl.textContent = title;
        if (subEl) subEl.textContent = sub;
        if (caseBox) {
          const hasCase = !!(problem || solution || outcome);
          caseBox.hidden = !hasCase;
        }
        if (probEl) probEl.textContent = problem;
        if (solEl) solEl.textContent = solution;
        if (outEl) outEl.textContent = outcome;
        setList(featUl, features);
        setList(learnUl, learned);
        if (noteEl) {
          if (note) {
            noteEl.hidden = false;
            noteEl.textContent = note;
          } else {
            noteEl.hidden = true;
            noteEl.textContent = "";
          }
        }
        if (techEl) techEl.textContent = stack ? (techPrefix + stack.replace(/\s+/g, " ").trim()) : "";
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
       PROJECT FILTERS (CHIPS)
       - Works on desktop rail and on mobile carousel
       - Keeps it simple: fade out, hide, fade in
    ========================= */
    const filterGroups = Array.from(document.querySelectorAll(".filters"));
    if (filterGroups.length) {
      const DURATION = reducedMotion ? 0 : 170;

      const setActiveChip = (chips, activeKey) => {
        chips.forEach((c) => {
          const isActive = (c.getAttribute("data-filter") || "") === activeKey;
          c.classList.toggle("is-active", isActive);
          c.setAttribute("aria-selected", isActive ? "true" : "false");
        });
      };

      filterGroups.forEach((group) => {
        const section = group.closest("section") || document;
        const rail = section.querySelector(".rail") || section.querySelector("[data-carousel]") || section.querySelector(".m-carousel");
        if (!rail) return;

        const cards = Array.from(rail.querySelectorAll("article"));
        if (!cards.length) return;

        const chips = Array.from(group.querySelectorAll("[data-filter]"));
        if (!chips.length) return;

        const getTags = (card) => {
          const raw = (card.getAttribute("data-tags") || "").trim();
          if (!raw) return ["all"];
          return raw.split(/\s+/g).filter(Boolean);
        };

        const applyFilter = (key) => {
          setActiveChip(chips, key);

          const toHide = [];
          const toShow = [];

          cards.forEach((card) => {
            const tags = getTags(card);
            const match = key === "all" ? true : tags.includes(key);
            const isHidden = card.getAttribute("data-filter-hidden") === "1";
            if (match) {
              if (isHidden) toShow.push(card);
            } else {
              if (!isHidden) toHide.push(card);
            }
          });

          // Animate out
          toHide.forEach((c) => c.classList.add("is-hiding"));

          window.setTimeout(() => {
            // Hide after fade
            toHide.forEach((c) => {
              c.style.display = "none";
              c.setAttribute("data-filter-hidden", "1");
              c.classList.remove("is-hiding");
            });

            // Show + animate in
            toShow.forEach((c) => {
              c.style.display = "";
              c.setAttribute("data-filter-hidden", "0");
              c.classList.add("is-showing");
              // force reflow so transition triggers
              void c.offsetWidth;
              c.classList.remove("is-showing");
            });

            // Mobile carousel: keep an active card visible and centered
            const isCarousel = rail.matches("[data-carousel], .m-carousel");
            const changed = toHide.length > 0 || toShow.length > 0;
            if (isCarousel && changed) {
              const visible = cards.filter((c) => c.style.display !== "none");
              if (visible.length) {
                const first = visible[0];
                visible.forEach((c) => c.classList.toggle("is-active", c === first));
                if (!reducedMotion) {
                  first.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                } else {
                  first.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
                }
              }
            }
          }, DURATION);
        };

        // Default
        applyFilter("all");

        group.addEventListener("click", (ev) => {
          const btn = ev.target.closest("[data-filter]");
          if (!btn) return;
          const key = btn.getAttribute("data-filter") || "all";
          applyFilter(key);
        });
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
