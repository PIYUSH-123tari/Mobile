/* ================================================
   ECO ALERT BOX  (matches image UI)
   ================================================ */
function showAlert({
  icon = "✔",
  iconBg = "linear-gradient(135deg,#dbeafe,#bfdbfe)",
  iconColor = "#1d4ed8",
  title = "Done!",
  message = "",
  btnText = "OK",
  btnColor = "#1d4ed8",
  onClose = null
}) {
  const existing = document.getElementById("ecoAlertOverlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "ecoAlertOverlay";
  overlay.style.cssText = `
    position:fixed;inset:0;
    background:rgba(0,0,0,0.35);
    backdrop-filter:blur(6px);
    -webkit-backdrop-filter:blur(6px);
    display:flex;align-items:center;justify-content:center;
    z-index:99999;
    animation:_ecoFadeIn 0.2s ease;
  `;

  overlay.innerHTML = `
    <style>
      @keyframes _ecoFadeIn{from{opacity:0}to{opacity:1}}
      @keyframes _ecoPopIn{from{opacity:0;transform:scale(0.82) translateY(24px)}to{opacity:1;transform:scale(1) translateY(0)}}
      #ecoAlertBox{
        background:#fff;
        border-radius:20px;
        padding:36px 32px 28px;
        max-width:340px;
        width:90%;
        text-align:center;
        box-shadow:0 24px 60px rgba(0,0,0,0.18);
        animation:_ecoPopIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
        font-family:'Segoe UI',Tahoma,sans-serif;
      }
      #ecoAlertBox .eco-modal-icon{
        width:68px;height:68px;border-radius:50%;
        background:${iconBg};
        color:${iconColor};
        display:flex;align-items:center;justify-content:center;
        margin:0 auto 18px;font-size:1.9rem;
      }
      #ecoAlertBox h3{
        margin:0 0 8px;font-size:1.25rem;font-weight:800;color:#111827;
      }
      #ecoAlertBox p{
        margin:0 0 24px;font-size:0.9rem;color:#6b7280;line-height:1.55;
      }
      #ecoAlertOkBtn{
        display:inline-block;padding:11px 36px;
        background:${btnColor};color:#fff;border:none;
        border-radius:12px;font-size:0.92rem;font-weight:700;
        cursor:pointer;transition:0.22s;
      }
      #ecoAlertOkBtn:hover{filter:brightness(1.08);transform:translateY(-1px);}
    </style>
    <div id="ecoAlertBox">
      <div class="eco-modal-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${message}</p>
      <button id="ecoAlertOkBtn">${btnText}</button>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => {
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.18s";
    setTimeout(() => { overlay.remove(); if (onClose) onClose(); }, 200);
  };

  overlay.querySelector("#ecoAlertOkBtn").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
}

/* ================================================
   MAIN PROFILE LOGIC
   ================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  const backBtn = document.getElementById("backBtn");

  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  if (!userId) {
    showAlert({
      icon: "🔒",
      iconBg: "linear-gradient(135deg,#fef3c7,#fde68a)",
      iconColor: "#b45309",
      title: "Not Logged In",
      message: "You are not logged in. Please login to continue.",
      btnText: "OK",
      btnColor: "#b45309"
    });
    return;
  }

  const nameInput = document.querySelector("input[type='text']");
  const emailInput = document.querySelector("input[type='email']");
  const phoneInput = document.querySelector("input[type='tel']");
  const regionText = document.getElementById("regionText");
  const regionSelect = document.getElementById("regionSelect");
  const rewardBalanceInput = document.getElementById("rewardBalanceInput");

  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");

  const uploadBtn = document.getElementById("uploadBtn");
  const photoInput = document.getElementById("photoInput");

  // FETCH USER
  const response = await fetch(`/userProfile/${userId}`, {
    headers: { "Authorization": "Bearer " + token }
  });
  const user = await response.json();

  nameInput.value = user.name || "";
  emailInput.value = user.email || "";
  phoneInput.value = user.phone || "";
  regionText.value = user.region_name || "";
  regionSelect.value = user.region_Id || "";

  rewardBalanceInput.value = `₹${(user.reward_balance || 0).toFixed(2)}`;

  // FETCH ALL REGIONS
  const regionRes = await fetch("/users/regions");
  const regions = await regionRes.json();

  regionSelect.innerHTML = "";
  regions.forEach(region => {
    const option = document.createElement("option");
    option.value = region._id;
    option.textContent = region.region_name;
    regionSelect.appendChild(option);
  });

  regionSelect.value = user.region_Id || "";

  if (user.photo) {
    document.querySelector(".avatar").src =
      `/uploads/${user.photo}`;
  }

  // SET READONLY INITIALLY
  setReadOnly(true);

  function setReadOnly(state) {
    nameInput.readOnly = state;
    emailInput.readOnly = state;
    phoneInput.readOnly = state;
    regionText.readOnly = true;
    rewardBalanceInput.readOnly = true;

    if (state) {
      regionSelect.style.display = "none";
      regionText.style.display = "block";
      uploadBtn.style.display = "none";
      saveBtn.style.display = "none";
      editBtn.style.display = "inline-block";
      backBtn.style.display = "inline-block";
    } else {
      regionSelect.style.display = "block";
      regionText.style.display = "none";
      uploadBtn.style.display = "inline-block";
      saveBtn.style.display = "inline-block";
      editBtn.style.display = "none";
      backBtn.style.display = "none";
    }
  }

  // EDIT CLICK
  editBtn.addEventListener("click", () => {
    setReadOnly(false);
  });

  // Upload Button
  uploadBtn.addEventListener("click", () => {
    photoInput.click();
  });

  // SAVE CLICK LOGIC
  async function saveUserProfile(isAutoSave = false) {
    const formData = new FormData();
    formData.append("name", nameInput.value);
    formData.append("email", emailInput.value);
    formData.append("phone", phoneInput.value);
    formData.append("region_Id", regionSelect.value);

    if (photoInput.files[0]) {
      formData.append("photo", photoInput.files[0]);
    }

    const res = await fetch(`/userProfile/${userId}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: formData
    });

    if (res.ok) {
      const updated = await res.json();

      sessionStorage.setItem("region_Id", updated.user.region_Id);
      sessionStorage.setItem("region_name", updated.user.region_name);

      rewardBalanceInput.value = `₹${(updated.user.reward_balance || 0).toFixed(2)}`;

      if (!isAutoSave) {
        showAlert({
          icon: "✔",
          iconBg: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
          iconColor: "#1b8f4a",
          title: "Profile Updated!",
          message: "Your profile has been updated successfully.",
          btnText: "OK",
          btnColor: "#1b8f4a",
          onClose: () => location.reload()
        });
      }
      return true;
    } else {
      if (!isAutoSave) {
        showAlert({
          icon: "✖",
          iconBg: "linear-gradient(135deg,#fee2e2,#fecaca)",
          iconColor: "#c62828",
          title: "Update Failed",
          message: "Could not update your profile. Please try again.",
          btnText: "Try Again",
          btnColor: "#c62828"
        });
      }
      return false;
    }
  }

  saveBtn.addEventListener("click", async () => {
    await saveUserProfile(false);
  });

  // Expose automatic save for global inactivity timeout watcher
  window.onAutoSave = async () => {
    // Auto-save is only valid if we are in "edit" mode (saveBtn visible)
    if (saveBtn.style.display !== "none") {
      await saveUserProfile(true);
    }
  };

});

backBtn.addEventListener("click", () => {
  window.location.href = "../Homepage/index.html";
});