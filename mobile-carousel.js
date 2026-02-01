(() => {
  // Touch-friendly project animations for the dedicated mobile pages.
  // Idea: the card in the center of the carousel becomes "active".
  // Active card pops out (slight lift + rotation + scale).

  const rails = document.querySelectorAll("[data-carousel]");
  if (!rails.length) return;

  rails.forEach((rail) => {
    const cards = Array.from(rail.querySelectorAll(".m-card"));
    if (!cards.length) return;

    const setActive = (card) => {
      cards.forEach((c) => c.classList.toggle("is-active", c === card));
    };

    // Default active: first card
    setActive(cards[0]);

    // IntersectionObserver picks the most visible card inside the rail
    const io = new IntersectionObserver(
      (entries) => {
        let best = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
        }
        if (best) setActive(best.target);
      },
      {
        root: rail,
        threshold: [0.45, 0.6, 0.75, 0.9],
      }
    );

    cards.forEach((c) => io.observe(c));

    // Tap on a card (but not on links) scrolls it to center and activates it
    rail.addEventListener(
      "click",
      (e) => {
        const link = e.target.closest("a");
        if (link) return;

        const card = e.target.closest(".m-card");
        if (!card) return;

        card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        setActive(card);
      },
      { passive: true }
    );
  });
})();
