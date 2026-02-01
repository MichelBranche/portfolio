/* demo.js (robusto)
   - Logga in console quando è caricato
   - Event delegation: non dipende da "setup" fragile
   - Non crasha se mancano elementi (null-check ovunque)
*/

console.log("[demo.js] loaded ✅");

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function openModalById(id) {
  const overlay = qs(`#${id}`);
  if (!overlay) {
    console.warn("[demo.js] Modal non trovata:", id);
    return;
  }
  overlay.classList.add("is-open");

  const first = qs("input, select, textarea, button", overlay);
  if (first) first.focus();
}

function closeAnyOpenModal() {
  const open = qs(".modal-overlay.is-open");
  if (open) open.classList.remove("is-open");
}

/* ========== GLOBAL EVENTS ========== */
document.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-open-modal]");
  if (openBtn) {
    const id = openBtn.getAttribute("data-open-modal");
    if (id) openModalById(id);
    return;
  }

  const closeBtn = e.target.closest("[data-close-modal]");
  if (closeBtn) {
    closeAnyOpenModal();
    return;
  }

  // click fuori (overlay)
  const overlay = e.target.classList?.contains("modal-overlay") ? e.target : null;
  if (overlay) {
    overlay.classList.remove("is-open");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAnyOpenModal();
});

  /* =========================
     B&B - calcolo notti/prezzo
  ========================= */
function initBeb() {
  const inEl = qs("#beb-checkin");
  const outEl = qs("#beb-checkout");
  const guestsEl = qs("#beb-guests");
  const priceEl = qs("#beb-price");
  const nightsEl = qs("#beb-nights");
  const resultEl = qs("#beb-result");
  const sendBtn = qs("#beb-send");

  if (!inEl || !outEl || !guestsEl || !priceEl || !nightsEl || !resultEl) {
    console.warn("[BEB] Elementi mancanti, init saltata.");
    return;
  }

  const basePerNight = 85;
  const extraGuest = 15;

  function calc() {
    const checkIn = inEl.value ? new Date(inEl.value) : null;
    const checkOut = outEl.value ? new Date(outEl.value) : null;
    const guests = Number(guestsEl.value || 2);

    if (!checkIn || !checkOut || !(checkOut > checkIn)) {
      nightsEl.textContent = "-";
      priceEl.textContent = "-";
      resultEl.textContent = "Seleziona date valide per vedere una stima.";
      return;
    }

    const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const perNight = basePerNight + Math.max(0, guests - 2) * extraGuest;
    const total = nights * perNight;

    nightsEl.textContent = String(nights);
    priceEl.textContent = `€ ${total.toFixed(0)}`;
    resultEl.textContent = `Stima demo: ${nights} notti · ${guests} ospiti · €${perNight}/notte`;
  }

  inEl.addEventListener("input", calc);
  outEl.addEventListener("input", calc);
  guestsEl.addEventListener("input", calc);
  calc();

  if (sendBtn) {
    sendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      resultEl.textContent = "Richiesta inviata (demo).";
    });
  }

  console.log("[BEB] init ✅");
}

  /* =========================
     CAFFÈ - filtri + carrello
  ========================= */
function initCaffe() {
  const tabs = qsa(".tab");
  const items = qsa(".menu-line");

  const cartCount = qs("#caffe-cart-count");
  const cartList = qs("#caffe-cart-list");
  const cartTotal = qs("#caffe-cart-total");
  const clearBtn = qs("#caffe-clear");

  const cart = [];

  function renderCart() {
    if (cartCount) cartCount.textContent = String(cart.length);

    const total = cart.reduce((sum, it) => sum + it.price, 0);
    if (cartTotal) cartTotal.textContent = `€ ${total.toFixed(2)}`;

    if (cartList) {
      cartList.innerHTML = "";
      if (cart.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Carrello vuoto.";
        cartList.appendChild(li);
      } else {
        cart.forEach((it) => {
          const li = document.createElement("li");
          li.textContent = `${it.name} - € ${it.price.toFixed(2)}`;
          cartList.appendChild(li);
        });
      }
    }
  }

  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      tabs.forEach(x => x.classList.remove("is-active"));
      t.classList.add("is-active");

      const cat = t.getAttribute("data-cat");
      items.forEach((line) => {
        const lineCat = line.getAttribute("data-cat");
        const show = (cat === "all") || (lineCat === cat);
        line.style.display = show ? "flex" : "none";
      });
    });
  });

  items.forEach((line) => {
    const btn = qs("[data-add]", line);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const name = line.getAttribute("data-name") || "Item";
      const price = Number(line.getAttribute("data-price") || 0);
      cart.push({ name, price });
      renderCart();
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      cart.length = 0;
      renderCart();
    });
  }

  renderCart();
  console.log("[CAFFE] init ✅");
}

  /* =========================
     HOTEL - selezione + preventivo
  ========================= */
function initHotel() {
  const roomCards = qsa("[data-room]");
  const pickedEl = qs("#hotel-picked");             // testo fuori modale
  const selectedEl = qs("#hotel-selected-room");    // testo in modale
  const quoteEl = qs("#hotel-quote");
  const inEl = qs("#hotel-checkin");
  const outEl = qs("#hotel-checkout");
  const guestsEl = qs("#hotel-guests");
  const sendBtn = qs("#hotel-send");

  if (!quoteEl || !selectedEl || !inEl || !outEl || !guestsEl) {
    console.warn("[HOTEL] Elementi mancanti, init saltata.");
    return;
  }

  let selectedRoom = { name: "Standard", price: 120 };

  function recalc() {
    if (pickedEl) pickedEl.textContent = `${selectedRoom.name} (€${selectedRoom.price}/notte)`;
    selectedEl.textContent = `${selectedRoom.name} · €${selectedRoom.price}/notte (demo)`;

    const checkIn = inEl.value ? new Date(inEl.value) : null;
    const checkOut = outEl.value ? new Date(outEl.value) : null;
    const guests = Number(guestsEl.value || 2);

    if (!checkIn || !checkOut || !(checkOut > checkIn)) {
      quoteEl.textContent = "Seleziona date valide per vedere un preventivo.";
      return;
    }

    const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const extra = Math.max(0, guests - 2) * 20;
    const total = nights * (selectedRoom.price + extra);

    quoteEl.textContent = `Preventivo demo: ${nights} notti · ${guests} ospiti · Totale € ${total.toFixed(0)}`;
  }

  function setActiveCard(card) {
    roomCards.forEach(c => c.classList.remove("is-active"));
    card.classList.add("is-active");
  }

  roomCards.forEach((c) => {
    c.addEventListener("click", () => {
      selectedRoom = {
        name: c.getAttribute("data-room") || "Standard",
        price: Number(c.getAttribute("data-price") || 120)
      };
      setActiveCard(c);
      recalc();
    });
  });

  inEl.addEventListener("input", recalc);
  outEl.addEventListener("input", recalc);
  guestsEl.addEventListener("input", recalc);

  // Stato iniziale: se c'è una card con is-active usala, altrimenti la prima
  const initial = qs("[data-room].is-active") || roomCards[0];
  if (initial) initial.click();

  if (sendBtn) {
    sendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      quoteEl.textContent = "Richiesta inviata (demo).";
    });
  }

  console.log("[HOTEL] init ✅");
}


  /* =========================
     RISTORANTE - prenotazione + note
  ========================= */
function initRistorante() {
  const peopleEl = qs("#rist-people");
  const dateEl = qs("#rist-date");
  const timeEl = qs("#rist-time");
  const notesEl = qs("#rist-notes");
  const outEl = qs("#rist-confirm");
  const sendBtn = qs("#rist-send");

  if (!peopleEl || !dateEl || !timeEl || !outEl) {
    console.warn("[RIST] Elementi mancanti, init saltata.");
    return;
  }

  function preview() {
    const p = peopleEl.value || "2";
    const d = dateEl.value || "-";
    const t = timeEl.value || "-";
    outEl.textContent = `Prenotazione (demo): ${p} persone · ${d} · ${t}`;
  }

  peopleEl.addEventListener("input", preview);
  dateEl.addEventListener("input", preview);
  timeEl.addEventListener("input", preview);
  if (notesEl) notesEl.addEventListener("input", preview);

  preview();

  if (sendBtn) {
    sendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const notes = (notesEl?.value || "").trim();
      outEl.textContent = notes
        ? `Confermato (demo). Note: "${notes}".`
        : "Confermato (demo).";
    });
  }

  console.log("[RIST] init ✅");
}

/* =========================
   BOOT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.getAttribute("data-page");
  console.log("[demo.js] data-page =", page);

  if (page === "beb") initBeb();
  if (page === "caffe") initCaffe();
  if (page === "hotel") initHotel();
  if (page === "ristorante") initRistorante();
});
