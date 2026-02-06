/* Aurum Canal House - Demo interattiva (no backend) */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const toastEl = $("#toast");
let toastTimer = null;

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), 2400);
}

/* Drawer (mobile menu) */
const drawer = $("#drawer");
const menuBtn = $("#menuBtn");
const closeDrawer = $("#closeDrawer");
const drawerBook = $("#drawerBook");

function openDrawer() {
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  menuBtn.setAttribute("aria-expanded", "true");
}
function shutDrawer() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn?.addEventListener("click", openDrawer);
closeDrawer?.addEventListener("click", shutDrawer);
drawer?.addEventListener("click", (e) => {
  if (e.target === drawer) shutDrawer();
});
drawerBook?.addEventListener("click", () => {
  shutDrawer();
  $("#bookingForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
});

/* Smooth scroll to booking */
$("#scrollToBooking")?.addEventListener("click", () => {
  $("#bookingForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
});
$("#openBooking")?.addEventListener("click", () => {
  $("#bookingForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
});
$("#stickyGo")?.addEventListener("click", () => {
  $("#bookingForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
});

/* Tabs: stay */
const stayData = {
  rooms: [
    {
      title: "Classic Room",
      desc: "Compatta, luminosa, perfetta per chi vive Amsterdam fuori e riposa dentro.",
      img: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
      chips: ["18-22 m²", "Letto queen", "Doccia walk-in"],
    },
    {
      title: "Deluxe Room",
      desc: "Più spazio, più silenzio. Ideale se vuoi alternare città e relax.",
      img: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
      chips: ["24-28 m²", "Area lounge", "Vista quartiere"],
    },
    {
      title: "Corner Room",
      desc: "Angolo luce, atmosfera pulita, un posto dove fermarsi davvero.",
      img: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
      chips: ["26-30 m²", "Finestre ampie", "Scrivania"],
    },
  ],
  suites: [
    {
      title: "Junior Suite",
      desc: "Zona giorno separata e dettagli che fanno la differenza quando resti di più.",
      img: "https://images.unsplash.com/photo-1742844552264-71e01c8dd7c0?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
      chips: ["34-40 m²", "Sofa lounge", "Coffee station"],
    },
    {
      title: "Aurum Suite",
      desc: "Ritmo lento: letto grande, spazio giusto, privacy alta.",
      img: "https://images.unsplash.com/photo-1742844552264-71e01c8dd7c0?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
      chips: ["42-52 m²", "Zona living", "Bagno ampio"],
    },
    {
      title: "Canal Loft Suite",
      desc: "La suite per chi vuole il mood “Amsterdam film” senza complicazioni.",
      img: "https://images.unsplash.com/photo-1742844552264-71e01c8dd7c0?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
      chips: ["50+ m²", "Vista canale", "Late check-out"],
    },
  ],
  canal: [
    {
      title: "Canal View Room",
      desc: "Svegliarsi con l’acqua davanti cambia la giornata, punto.",
      img: "https://images.unsplash.com/photo-1741290606668-c367b34d3d4a?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
      chips: ["Vista canale", "22-26 m²", "Tende oscuranti"],
    },
    {
      title: "Canal View Deluxe",
      desc: "Più spazio e una vista che ti fa rallentare anche se sei di corsa.",
      img: "https://images.unsplash.com/photo-1741290606668-c367b34d3d4a?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
      chips: ["Vista canale", "26-32 m²", "Area lounge"],
    },
    {
      title: "Canal View Suite",
      desc: "La scelta per un anniversario o per dire: ok, stavolta facciamo sul serio.",
      img: "https://images.unsplash.com/photo-1741290606668-c367b34d3d4a?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
      chips: ["Vista canale", "40+ m²", "Welcome toast"],
    },
  ],
};

const stayCards = $("#stayCards");

function renderStay(key) {
  if (!stayCards) return;
  const list = stayData[key] || [];
  stayCards.innerHTML = list
    .map(
      (item) => `
      <article class="card">
        <div class="card__img">
          <img src="${item.img}" alt="${item.title}" loading="lazy" />
        </div>
        <h3>${item.title}</h3>
        <p class="muted">${item.desc}</p>
        <div class="card__meta">
          ${item.chips.map((c) => `<span class="chip">${c}</span>`).join("")}
        </div>
        <div style="margin-top:12px">
          <button class="btn btn--ghost btn--wide jsToast" data-toast="Aperta scheda ${item.title} (demo).">Dettagli</button>
        </div>
      </article>
    `
    )
    .join("");
}

renderStay("rooms");

$$(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".tab").forEach((b) => b.classList.remove("is-active"));
    $$(".tab").forEach((b) => b.setAttribute("aria-selected", "false"));

    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");

    renderStay(btn.dataset.tab);
  });
});

/* Booking form: demo submit */
$("#bookingForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("Ricerca avviata (demo). Qui colleghi la tua API o backend.");
});

/* Newsletter: demo submit */
$("#newsletterForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("Iscrizione registrata (demo).");
});

/* Generic toast buttons */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".jsToast");
  if (!btn) return;
  const msg = btn.getAttribute("data-toast") || "Ok (demo).";
  showToast(msg);
});

/* Experiences slider */
const track = $("#expTrack");
const slides = track ? Array.from(track.children) : [];
let expIndex = 0;

function updateSlider() {
  if (!track) return;
  const x = expIndex * 100;
  track.style.transform = `translateX(-${x}%)`;
}

$("#nextExp")?.addEventListener("click", () => {
  if (!slides.length) return;
  expIndex = (expIndex + 1) % slides.length;
  updateSlider();
});

$("#prevExp")?.addEventListener("click", () => {
  if (!slides.length) return;
  expIndex = (expIndex - 1 + slides.length) % slides.length;
  updateSlider();
});

/* Sticky mini booking appears after hero */
const sticky = $("#stickyBook");
const hero = $(".hero");

function handleSticky() {
  if (!sticky || !hero) return;
  const rect = hero.getBoundingClientRect();
  const show = rect.bottom < 80;
  sticky.classList.toggle("is-show", show);
  sticky.setAttribute("aria-hidden", show ? "false" : "true");
}
window.addEventListener("scroll", handleSticky, { passive: true });
handleSticky();

/* FAQ accordion */
$$(".faq__q").forEach((q) => {
  q.addEventListener("click", () => {
    const isOpen = q.getAttribute("aria-expanded") === "true";
    q.setAttribute("aria-expanded", String(!isOpen));
    const icon = q.querySelector(".faq__icon");
    if (icon) icon.textContent = isOpen ? "+" : "-";
  });
});

/* Newsletter quick open */
$("#openNewsletter")?.addEventListener("click", () => {
  $("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* Footer year */
const year = $("#year");
if (year) year.textContent = String(new Date().getFullYear());
