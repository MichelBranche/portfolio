(() => {
  const KEY = "portfolio_view_pref"; // "desktop" or "mobile"
  const pref = localStorage.getItem(KEY);

  const isSmall = window.matchMedia("(max-width: 780px)").matches;

  const path = window.location.pathname;
  const file = (path.split("/").pop() || "index.html");

  const toMobile = {
    "recruiter.html": "mobile.html",
    "recruiter-en.html": "mobile-en.html",
    "examples.html": "examples-mobile.html",
    "examples-en.html": "examples-en-mobile.html",
  };

  const toDesktop = {
    "mobile.html": "recruiter.html",
    "mobile-en.html": "recruiter-en.html",
    "examples-mobile.html": "examples.html",
    "examples-en-mobile.html": "examples-en.html",
  };

  function buildUrl(targetFile){
    const parts = path.split("/");
    if (path.endsWith("/")) {
      // Example: /portfolio/ -> /portfolio/mobile.html
      return window.location.origin + path + targetFile;
    }
    parts[parts.length - 1] = targetFile;
    return window.location.origin + parts.join("/");
  }

  // Auto switch only for mapped pages
  if (isSmall && pref !== "desktop" && toMobile[file]) {
    window.location.replace(buildUrl(toMobile[file]));
    return;
  }

  if (!isSmall && pref !== "mobile" && toDesktop[file]) {
    window.location.replace(buildUrl(toDesktop[file]));
    return;
  }

  // Manual toggle buttons/links
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-view-toggle]");
    if (!el) return;

    const mode = el.getAttribute("data-view-toggle"); // "mobile" or "desktop"
    if (mode === "mobile" || mode === "desktop") {
      localStorage.setItem(KEY, mode);
    }
  });
})();