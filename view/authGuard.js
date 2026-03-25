// ============================================
// AUTH GUARD — Protects all routes
// Include this script BEFORE the page's own JS
// ============================================
(function () {
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  if (!userId || !token) {
    // Clear any stale data
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = window.location.pathname.includes("/register/")
      ? window.location.href
      : (function () {
          // Calculate relative path to register page
          const depth = window.location.pathname.split("/view/")[1];
          if (!depth) return "../register/register.html";
          const parts = depth.split("/").filter(Boolean);
          // parts.length - 1 gives number of directories deep from /view/
          const prefix = parts.length > 1 ? "../".repeat(parts.length - 1) : "../";
          return prefix + "register/register.html";
        })();
  }
})();
