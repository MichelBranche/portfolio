/* Theme: light / dark toggle
   - Uses: html[data-theme="dark"|"light"]
   - Persists in localStorage
   - Defaults to system preference when no saved value
*/
(function () {
  var KEY = "portfolioTheme";
  var root = document.documentElement;

  function isValid(value) {
    return value === "dark" || value === "light";
  }

  function systemDefault() {
    try {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
      }
    } catch (e) {}
    return "dark";
  }

  function apply(value) {
    if (!isValid(value)) return;
    root.setAttribute("data-theme", value);
  }

  function current() {
    return root.getAttribute("data-theme") || "dark";
  }

  function setButtonLabel(btn) {
    var value = current();
    var pageLang = root.getAttribute("lang") || "it";

    // Label shows the ACTION (what happens if you click)
    var next = value === "dark" ? "light" : "dark";
    var it = next === "light" ? "Tema: Chiaro" : "Tema: Scuro";
    var en = next === "light" ? "Theme: Light" : "Theme: Dark";

    btn.textContent = pageLang === "it" ? it : en;
    btn.setAttribute("aria-label", btn.textContent);
    btn.setAttribute("title", btn.textContent);
  }

  function toggle() {
    var next = current() === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) setButtonLabel(btn);
  }

  // Initial load
  (function init() {
    var initial = systemDefault();
    try {
      var saved = localStorage.getItem(KEY);
      if (isValid(saved)) initial = saved;
    } catch (e) {}
    apply(initial);
  })();

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;
    setButtonLabel(btn);
    btn.addEventListener("click", toggle);
  });
})();
