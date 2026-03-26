// ============================================
// AUTH GUARD — Protects all routes
// Include this script BEFORE the page's own JS
// ============================================
(function () {
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  // Helper to determine the correct path to register.html
  function getLoginPageUrl() {
    if (window.location.pathname.includes("/register/")) {
      return window.location.href;
    }
    const depth = window.location.pathname.split("/view/")[1];
    if (!depth) return "../register/register.html";
    const parts = depth.split("/").filter(Boolean);
    const prefix = parts.length > 1 ? "../".repeat(parts.length - 1) : "../";
    return prefix + "register/register.html";
  }

  // Common logout functionality
  function logoutUser() {
    sessionStorage.clear();
    window.location.href = getLoginPageUrl();
  }

  const path = window.location.pathname;
  const isHomePage = path.endsWith('/Homepage/index.html') || 
                     path.endsWith('/Homepage/hp.html') || 
                     path.endsWith('/Homepage/') || 
                     path === '/' || 
                     path === '/index.html';

  if (!userId || !token) {
    // If user is accessing protected routes without logging in
    if (!isHomePage) {
      logoutUser();
    }
  } else {
    // User is logged in, attach global 3-minute inactivity timeout
    let inactivityTimer;
    const INACTIVITY_LIMIT = 3 * 60 * 1000; // 3 minutes

    async function handleInactivity() {
      // Check if the current page has a specific auto-save mechanism defined
      if (typeof window.onAutoSave === "function") {
        try {
          await window.onAutoSave();
        } catch (error) {
          console.error("Auto-save failed during inactivity timeout:", error);
        }
      }
      
      // Notify the user before logging out
      alert("Your session is expired please login again");
      
      // Regardless of saving success, log out afterwards
      logoutUser();
    }

    function resetTimer() {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(handleInactivity, INACTIVITY_LIMIT);
    }

    // Attach listeners to reset timer on typical user interactions
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer, { passive: true }));

    // Start timer on page load
    resetTimer();
  }
})();
