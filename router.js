(() => {
  const hash = window.location.hash || "";
  const params = new URLSearchParams(window.location.search || "");
  const v = (params.get("v") || "").toLowerCase();

  const isEn = (document.documentElement.lang || "").toLowerCase().startsWith("en");
  const recruiter = isEn ? "recruiter-en.html" : "recruiter.html";
  const business = isEn ? "business-en.html" : "business.html";

  // If someone used an old deep link like /#projects, redirect to the recruiter version.
  const known = new Set(["#projects", "#certifications", "#skills", "#about", "#contact"]);
  if (hash && known.has(hash)) {
    window.location.replace(recruiter + hash);
    return;
  }

  // Optional: allow ?v=recruiter or ?v=business
  if (v === "recruiter") {
    window.location.replace(recruiter);
    return;
  }
  if (v === "business") {
    window.location.replace(business);
    return;
  }
})();