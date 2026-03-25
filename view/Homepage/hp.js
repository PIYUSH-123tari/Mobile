const navLinks = document.getElementById("navLinks");
const heroButtons = document.getElementById("heroButtons");
const hamburgerBtn = document.getElementById("hamburgerBtn");

// Hamburger menu toggle
hamburgerBtn.addEventListener("click", () => {
  navLinks.classList.toggle("nav-open");
  hamburgerBtn.classList.toggle("active");
});

const userId = sessionStorage.getItem("userId");

if (userId) {

  // =========================
  // ✅ AFTER LOGIN
  // =========================

  navLinks.innerHTML = `
    <a href="../PickupForm/form.html">Request Pickup</a>
    <a href="../PickupHistory/pH.html">View Pickup History</a>
    <a href="../userProfile/userProfile.html">User Profile</a>
    <a href="#" id="logoutBtn" class="nav-btn">Logout</a>
  `;

  heroButtons.innerHTML = `
    <a href="../PickupForm/form.html" class="btn-primary">
      Request E-Waste Pickup <i class="fa-solid fa-arrow-right"></i>
    </a>
  `;

  // Logout logic
  document.getElementById("logoutBtn").addEventListener("click", async function (e) {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    sessionStorage.clear();

    const response = await fetch("/users/logout", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (response.ok) {
      window.location.href = "../register/register.html";
    }
  });

} else {

  // =========================
  // ❌ BEFORE LOGIN
  // =========================

  navLinks.innerHTML = `
    <a href="../register/register.html" class="nav-btn">Register</a>
  `;

  heroButtons.innerHTML = `
    <a href="../register/register.html" class="btn-primary">
      Request E-Waste Pickup <i class="fa-solid fa-arrow-right"></i>
    </a>

    <a href="../register/register.html" class="btn-secondary">
      Register
    </a>
  `;
}
