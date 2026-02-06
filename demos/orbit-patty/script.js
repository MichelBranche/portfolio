
/*
  Orbit Patty - sito (vanilla)
  - Menu filtrabile + ricerca
  - Modal dettagli prodotto
  - Modal delivery
  - Header mobile e tema light/dark
*/

const ITEMS = [
  {
    id: "space_patty",
    name: "Orbit Special",
    category: "burger",
    price: 13.90,
    desc: "Pulled beef, krauti, cipolla croccante e salsa BBQ.",
    tags: ["pulled", "bbq", "crunch"],
    accent: "purple",
  },
  {
    id: "cheese_patty",
    name: "Cheese Comet",
    category: "burger",
    price: 11.90,
    desc: "Patty, cheddar, cipolla, pickles e honey mustard.",
    tags: ["cheddar", "pickles"],
    accent: "orange",
  },
  {
    id: "bacon_millennium",
    name: "Millennium Bacon",
    category: "burger",
    price: 12.90,
    desc: "Patty, cheddar, bacon, coleslaw e baconnaise.",
    tags: ["bacon", "coleslaw"],
    accent: "green",
  },
  {
    id: "chilli_51",
    name: "Chilli 51",
    category: "burger",
    price: 11.90,
    desc: "Patty, cheddar, pico de gallo e mayo spicy.",
    tags: ["spicy", "fresh"],
    accent: "red",
  },
  {
    id: "astro_veg",
    name: "Astro Veg",
    category: "burger",
    price: 10.90,
    desc: "Burger quinoa e spinaci, lattuga, pomodoro, ketchup.",
    tags: ["veg", "light"],
    accent: "yellow",
  },

  { id: "nuggets", name: "Space Nuggets", category: "sides", price: 7.90, desc: "Nuggets croccanti con salsa a scelta.", tags: ["crispy"], accent: "orange" },
  { id: "pulled_bites", name: "Pulled Bites", category: "sides", price: 6.90, desc: "Crocchette di pulled pork.", tags: ["pulled"], accent: "purple" },
  { id: "pickle_bites", name: "Pickle Bites", category: "sides", price: 4.90, desc: "Crocchette con cheese e cetriolini.", tags: ["cheese", "pickles"], accent: "green" },

  { id: "fries", name: "Meteor Fries", category: "fries", price: 4.90, desc: "Classiche, croccanti, sale giusto.", tags: ["classic"], accent: "yellow" },
  { id: "sweet_fries", name: "Sweet Meteor Fries", category: "fries", price: 5.90, desc: "Patate dolci con paprika.", tags: ["sweet"], accent: "orange" },

  { id: "space_bun", name: "Space Bun", category: "sweets", price: 5.50, desc: "Bun dolce con crema e crumble.", tags: ["sweet"], accent: "purple" },
  { id: "nebula_shake", name: "Nebula Shake", category: "sweets", price: 6.50, desc: "Milkshake cremoso con topping croccante.", tags: ["shake"], accent: "green" },

  { id: "cola", name: "Cola", category: "drinks", price: 3.00, desc: "Lattina ghiacciata.", tags: ["cold"], accent: "teal" },
  { id: "water", name: "Acqua", category: "drinks", price: 1.50, desc: "Naturale o frizzante.", tags: ["basic"], accent: "teal" },
];

const CATEGORY_LABEL = {
  all: "Tutto",
  burger: "Burger",
  sides: "Sides",
  fries: "Fries",
  sweets: "Sweets",
  drinks: "Bevande",
};

const els = {
  grid: document.getElementById("menuGrid"),
  search: document.getElementById("searchInput"),
  chips: Array.from(document.querySelectorAll(".chip")),
  overlay: document.getElementById("overlay"),
  itemModal: document.getElementById("itemModal"),
  deliveryModal: document.getElementById("deliveryModal"),
  modalCategory: document.getElementById("modalCategory"),
  modalTitle: document.getElementById("modalTitle"),
  modalDesc: document.getElementById("modalDesc"),
  modalPrice: document.getElementById("modalPrice"),
  modalTags: document.getElementById("modalTags"),
  menuToggle: document.getElementById("menuToggle"),
  mobilePanel: document.getElementById("mobilePanel"),
  themeToggle: document.getElementById("themeToggle"),
  chipsWrap: document.querySelector(".chips"),
  navLinks: Array.from(document.querySelectorAll(".nav-link")),
};

let activeFilter = "all";
let activeQuery = "";

function euro(n){
  const v = Number(n);
  return v.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function matches(item){
  const byFilter = activeFilter === "all" || item.category === activeFilter;
  if (!byFilter) return false;

  if (!activeQuery) return true;
  const q = activeQuery.toLowerCase();
  const hay = (item.name + " " + item.desc + " " + item.tags.join(" ")).toLowerCase();
  return hay.includes(q);
}

function buttonClassFromAccent(accent){
  const map = {
    purple: "btn-purple",
    orange: "btn-orange",
    green: "btn-green",
    red: "btn-orange",
    yellow: "btn-yellow",
    teal: "btn-teal",
  };
  return map[accent] || "btn-purple";
}

function render(){
  const filtered = ITEMS.filter(matches);

  els.grid.innerHTML = "";

  if (filtered.length === 0){
    const empty = document.createElement("div");
    empty.className = "shell card";
    empty.innerHTML = `
      <div class="card-head">
        <p class="card-title">Nessun risultato</p>
        <p class="card-price">0</p>
      </div>
      <p class="card-desc">Prova a cambiare filtro o a cercare un'altra parola chiave.</p>
    `;
    els.grid.appendChild(empty);
    return;
  }

  for (const item of filtered){
    const card = document.createElement("article");
    card.className = "shell card";

    const btnClass = buttonClassFromAccent(item.accent);

    card.innerHTML = `
      <div class="card-head">
        <h3 class="card-title">${escapeHtml(item.name)}</h3>
        <p class="card-price">${euro(item.price)}</p>
      </div>
      <p class="card-desc">${escapeHtml(item.desc)}</p>
      <div class="tag-row">${item.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
      <div class="card-actions">
        <button class="btn ${btnClass}" type="button" data-open-item="${item.id}">
          <span class="btn-inner">
            <span class="btn-text" data-primary="Dettagli" data-secondary="Dettagli">Dettagli</span>
            <span class="btn-icon" aria-hidden="true">+</span>
          </span>
        </button>
        <button class="btn btn-black" type="button" data-open-delivery>
          <span class="btn-inner">
            <span class="btn-text" data-primary="Ordina" data-secondary="Ordina">Ordina</span>
            <span class="btn-icon" aria-hidden="true">🛵</span>
          </span>
        </button>
      </div>
    `;

    els.grid.appendChild(card);
  }
}

function openOverlay(){
  els.overlay.hidden = false;
}

function closeOverlay(){
  els.overlay.hidden = true;
}

function openItemModal(id){
  const item = ITEMS.find(i => i.id === id);
  if (!item) return;

  els.modalCategory.textContent = CATEGORY_LABEL[item.category] || item.category;
  els.modalTitle.textContent = item.name;
  els.modalDesc.textContent = item.desc;
  els.modalPrice.textContent = euro(item.price);

  els.modalTags.innerHTML = item.tags
    .map(t => `<span class="tag">${escapeHtml(t)}</span>`)
    .join("");

  openOverlay();
  els.itemModal.showModal();
}

function openDeliveryModal(){
  openOverlay();
  els.deliveryModal.showModal();
}

function closeAnyModal(){
  if (els.itemModal.open) els.itemModal.close();
  if (els.deliveryModal.open) els.deliveryModal.close();
  closeOverlay();
}


function syncChipAria(){
  for (const chip of els.chips){
    chip.setAttribute("role", "tab");
    const selected = chip.dataset.filter === activeFilter;
    chip.setAttribute("aria-selected", String(selected));
    chip.tabIndex = selected ? 0 : -1;
  }
}

function initChipKeyboardNav(){
  if (!els.chipsWrap) return;

  els.chipsWrap.addEventListener("keydown", (e) => {
    const keys = ["ArrowLeft","ArrowRight","Home","End","Enter"," "];
    if (!keys.includes(e.key)) return;

    const current = document.activeElement;
    const idx = els.chips.indexOf(current);
    const activeIdx = idx >= 0 ? idx : els.chips.findIndex(c => c.dataset.filter === activeFilter);
    let nextIdx = activeIdx;

    if (e.key === "ArrowLeft") nextIdx = Math.max(0, activeIdx - 1);
    if (e.key === "ArrowRight") nextIdx = Math.min(els.chips.length - 1, activeIdx + 1);
    if (e.key === "Home") nextIdx = 0;
    if (e.key === "End") nextIdx = els.chips.length - 1;

    if (["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){
      e.preventDefault();
      els.chips[nextIdx]?.focus();
      return;
    }

    if (e.key === "Enter" || e.key === " "){
      e.preventDefault();
      const target = idx >= 0 ? current : els.chips[activeIdx];
      if (target && target.dataset && target.dataset.filter) setFilter(target.dataset.filter);
    }
  });
}

function initScrollSpy(){
  if (!("IntersectionObserver" in window)) return;
  if (!els.navLinks || els.navLinks.length === 0) return;

  const linkById = new Map();
  for (const a of els.navLinks){
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#")) linkById.set(href.slice(1), a);
  }

  const ids = ["menu","promo","location","faq"];
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);

  function setActive(id){
    for (const a of els.navLinks){
      const href = (a.getAttribute("href") || "").replace("#", "");
      const on = href === id;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    }
  }

  const obs = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(en => en.isIntersecting)
      .sort((a,b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

    if (visible && visible.target && visible.target.id){
      setActive(visible.target.id);
    }
  }, { rootMargin: "-35% 0px -55% 0px", threshold: [0.01, 0.1, 0.25] });

  for (const s of sections) obs.observe(s);
}

function setFilter(filter){
  activeFilter = filter;
  for (const chip of els.chips){
    chip.classList.toggle("is-active", chip.dataset.filter === filter);
  }
  render();
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initTheme(){
  const saved = localStorage.getItem("orbit_theme");
  if (saved === "dark"){
    document.documentElement.setAttribute("data-theme", "dark");
  }
  updateThemeIcon();
}

function updateThemeIcon(){
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  els.themeToggle.innerHTML = dark ? "<span aria-hidden='true'>☾</span>" : "<span aria-hidden='true'>☼</span>";
}

function toggleTheme(){
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  if (dark){
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("orbit_theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("orbit_theme", "dark");
  }
  updateThemeIcon();
}

function toggleMobilePanel(){
  const isOpen = !els.mobilePanel.hidden;
  els.mobilePanel.hidden = isOpen;
  els.menuToggle.setAttribute("aria-expanded", String(!isOpen));
}

function closeMobilePanel(){
  els.mobilePanel.hidden = true;
  els.menuToggle.setAttribute("aria-expanded", "false");
}

// Events
els.search.addEventListener("input", (e) => {
  activeQuery = e.target.value.trim();
  render();
});

for (const chip of els.chips){
  chip.addEventListener("click", () => setFilter(chip.dataset.filter));
}

document.addEventListener("click", (e) => {
  const t = e.target;

  const itemBtn = t.closest?.("[data-open-item]");
  if (itemBtn){
    openItemModal(itemBtn.getAttribute("data-open-item"));
    return;
  }

  const deliveryBtn = t.closest?.("[data-open-delivery]");
  if (deliveryBtn){
    openDeliveryModal();
    return;
  }

  // close mobile nav on link click
  if (t.matches?.(".mobile-link")){
    closeMobilePanel();
  }
});

els.overlay.addEventListener("click", closeAnyModal);

els.itemModal.addEventListener("close", closeOverlay);
els.deliveryModal.addEventListener("close", closeOverlay);

els.themeToggle.addEventListener("click", toggleTheme);

els.menuToggle.addEventListener("click", toggleMobilePanel);

const desktopMq = window.matchMedia("(min-width: 681px)");
if (desktopMq.addEventListener){
  desktopMq.addEventListener("change", (e) => {
    if (e.matches) closeMobilePanel();
  });
}
if (desktopMq.matches) closeMobilePanel();

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape"){
    closeAnyModal();
    closeMobilePanel();
  }
});

// Init
initTheme();
setFilter("all");
initChipKeyboardNav();
initScrollSpy();
render();
