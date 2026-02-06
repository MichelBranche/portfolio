(() => {
  const toastEl = document.createElement("div");
  toastEl.className = "toast";
  toastEl.setAttribute("role", "status");
  toastEl.setAttribute("aria-live", "polite");
  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(toastEl);
  });

  let toastTimer = null;
  function toast(message){
    clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.add("is-show");
    toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), 2200);
  }

  function bindDemoActions(){
    document.querySelectorAll("[data-demo-action]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const label = el.getAttribute("data-demo-action") || "Azione";
        toast(`Demo UI: "${label}" si implementa su richiesta.`);
      });
    });

    document.querySelectorAll("form[data-demo-submit]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const label = form.getAttribute("data-demo-submit") || "Invio";
        toast(`Demo UI: "${label}" si implementa su richiesta.`);
      });
    });

    document.querySelectorAll("[data-back]").forEach((el) => {
      el.addEventListener("click", (e) => {
        // allow normal navigation
      });
    });
  }

  document.addEventListener("DOMContentLoaded", bindDemoActions);
})();
