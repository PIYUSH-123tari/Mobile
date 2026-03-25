// ✅ LOAD REGIONS FROM BACKEND
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:5000/users/regions");
    const regions = await response.json();

    const regionSelect = document.getElementById("region_Id");

    regions.forEach(region => {
      const option = document.createElement("option");
      option.value = region._id; // ✅ STORE OBJECTID
      option.textContent = region.region_name;
      regionSelect.appendChild(option);
    });

  } catch (error) {
    console.error("Error loading regions:", error);
  }
});

// ===== IMPROVED EMAIL VALIDATION =====
// Allows any domain with .com / .in / .net / .org / .co.in etc.
const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.(com|in|net|org|edu|co\.in|gov|io)$/;

const phoneRegex = /^[6-9]\d{9}$/;

// ✅ Strong Password Validation
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

// ===== INLINE ERROR HELPERS =====

/**
 * Show an inline error message below a given element.
 * @param {string} fieldId - The input/select element's ID (or a container group ID)
 * @param {string} message - Error text to display
 * @param {string} [formId] - If provided, clears form-level error first
 */
function showFieldError(fieldId, message) {
  // Remove existing error if any
  clearFieldError(fieldId);

  const field = document.getElementById(fieldId);
  if (!field) return;

  const errorEl = document.createElement("span");
  errorEl.classList.add("field-error");
  errorEl.setAttribute("data-for", fieldId);
  errorEl.textContent = "⚠ " + message;

  // Insert after the field (or after its parent if inside .password-box)
  const parent = field.closest(".password-box") || field.parentElement;
  parent.insertAdjacentElement("afterend", errorEl);

  // Highlight the field
  field.classList.add("input-error");
}

function clearFieldError(fieldId) {
  const existing = document.querySelector(`.field-error[data-for="${fieldId}"]`);
  if (existing) existing.remove();
  const field = document.getElementById(fieldId);
  if (field) field.classList.remove("input-error");
}

/**
 * Show a form-level (general) error message inside the form.
 * Used for server errors like "Email already exists".
 */
function showFormError(formId, message) {
  clearFormError(formId);

  const form = document.getElementById(formId);
  if (!form) return;

  const errorEl = document.createElement("div");
  errorEl.classList.add("form-error-banner");
  errorEl.setAttribute("id", formId + "_formError");
  errorEl.textContent = "⚠ " + message;

  // Insert before the submit button
  const submitBtn = form.querySelector('button[type="submit"]');
  form.insertBefore(errorEl, submitBtn);
}

function clearFormError(formId) {
  const existing = document.getElementById(formId + "_formError");
  if (existing) existing.remove();
}

function showFormSuccess(formId, message) {
  clearFormError(formId);

  const form = document.getElementById(formId);
  if (!form) return;

  const el = document.createElement("div");
  el.classList.add("form-success-banner");
  el.setAttribute("id", formId + "_formError");
  el.textContent = "✔ " + message;

  const submitBtn = form.querySelector('button[type="submit"]');
  form.insertBefore(el, submitBtn);
}

// ===== TOGGLE FORMS =====
function toggleForm(formType) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  document.getElementById("loginTab")?.classList.toggle("active", formType === "login");
  document.getElementById("signupTab")?.classList.toggle("active", formType === "signup");

  if (formType === "login") {
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
  } else {
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
  }
}

function togglePassword(inputId, eye) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    eye.textContent = "🙈";
  } else {
    input.type = "password";
    eye.textContent = "👁";
  }
}

// ===== LOGIN =====
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Clear previous errors
  clearFieldError("loginEmail");
  clearFieldError("loginPassword");
  clearFormError("loginForm");

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  let hasError = false;

  // Validate email
  if (!emailRegex.test(email)) {
    showFieldError("loginEmail", "Enter a valid email (e.g. user@example.com or user@example.in)");
    hasError = true;
  }

  if (!password) {
    showFieldError("loginPassword", "Password is required");
    hasError = true;
  }

  if (hasError) return;

  const authData = { email, password };

  try {
    const response = await fetch("http://localhost:5000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authData)
    });

    const data = await response.json();

    if (response.ok) {
      showFormSuccess("loginForm", "Login Successful!");

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("userId", data.user.userId);
      sessionStorage.setItem("userName", data.user.name);
      sessionStorage.setItem("userPhone", data.user.phone);
      sessionStorage.setItem("region_Id", data.user.region_Id);
      sessionStorage.setItem("region_name", data.user.region_name);

      setTimeout(() => {
        window.location.href = "../Homepage/hp.html";
      }, 2000);

    } else {
      showFormError("loginForm", data.message);
    }

  } catch (error) {
    showFormError("loginForm", "Error logging in: " + error.message);
  }
});

// ===== SIGN UP =====
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Clear previous errors
  ["signupName", "signupEmail", "phoneNo", "registerPassword", "region_Id"].forEach(clearFieldError);
  clearFormError("signupForm");

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const phone = document.getElementById("phoneNo").value.trim();
  const password = document.getElementById("registerPassword").value;
  const region_Id = document.getElementById("region_Id").value;

  let hasError = false;

  // Validate name
  if (!name) {
    showFieldError("signupName", "Full name is required");
    hasError = true;
  }

  // Validate email
  if (!emailRegex.test(email)) {
    showFieldError("signupEmail", "Enter a valid email (e.g. user@example.com or user@example.in)");
    hasError = true;
  }

  // Validate phone
  if (!phoneRegex.test(phone)) {
    showFieldError("phoneNo", "Enter valid Indian mobile number (10 digits starting with 6-9)");
    hasError = true;
  } else if (/^(\d)\1{9}$/.test(phone)) {
    showFieldError("phoneNo", "Invalid phone number");
    hasError = true;
  } else if (/(\d)\1{5,}/.test(phone)) {
    showFieldError("phoneNo", "Phone number looks invalid");
    hasError = true;
  }

  // Validate password
  if (!strongPasswordRegex.test(password)) {
    showFieldError("registerPassword", "Password is not strong enough! See rules above.");
    hasError = true;
  }

  // Validate region
  if (!region_Id) {
    showFieldError("region_Id", "Please select your region");
    hasError = true;
  }

  if (hasError) return;

  const userData = { name, email, phone, password, region_Id };

  try {
    const response = await fetch("http://localhost:5000/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (response.ok) {
      showFormSuccess("signupForm", "Account Created Successfully! Please Login.");

      document.getElementById("signupForm").reset();

      setTimeout(() => {
        clearFormError("signupForm");
        toggleForm("login");
      }, 2000);

    } else {
      showFormError("signupForm", data.message);
    }

  } catch (error) {
    showFormError("signupForm", "Error registering user: " + error.message);
  }
});

// ===== LIVE PASSWORD VALIDATION =====
const passwordInput = document.getElementById("registerPassword");

passwordInput.addEventListener("input", function () {
  const value = passwordInput.value;

  const lengthRule = document.getElementById("lengthRule");
  const upperRule = document.getElementById("upperRule");
  const lowerRule = document.getElementById("lowerRule");
  const numberRule = document.getElementById("numberRule");
  const specialRule = document.getElementById("specialRule");

  if (value.length >= 8) {
    lengthRule.classList.add("valid");
    lengthRule.innerHTML = "✔ At least 8 characters";
  } else {
    lengthRule.classList.remove("valid");
    lengthRule.innerHTML = "❌ At least 8 characters";
  }

  if (/[A-Z]/.test(value)) {
    upperRule.classList.add("valid");
    upperRule.innerHTML = "✔ At least 1 uppercase letter";
  } else {
    upperRule.classList.remove("valid");
    upperRule.innerHTML = "❌ At least 1 uppercase letter";
  }

  if (/[a-z]/.test(value)) {
    lowerRule.classList.add("valid");
    lowerRule.innerHTML = "✔ At least 1 lowercase letter";
  } else {
    lowerRule.classList.remove("valid");
    lowerRule.innerHTML = "❌ At least 1 lowercase letter";
  }

  if (/[0-9]/.test(value)) {
    numberRule.classList.add("valid");
    numberRule.innerHTML = "✔ At least 1 number";
  } else {
    numberRule.classList.remove("valid");
    numberRule.innerHTML = "❌ At least 1 number";
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    specialRule.classList.add("valid");
    specialRule.innerHTML = "✔ At least 1 special character";
  } else {
    specialRule.classList.remove("valid");
    specialRule.innerHTML = "❌ At least 1 special character";
  }
});