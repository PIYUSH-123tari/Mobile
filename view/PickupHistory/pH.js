const pickupContainer = document.getElementById("pickupContainer");

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
   ECO CONFIRM BOX  (matches image UI)
   ================================================ */
function showConfirm({
  icon = "🗑",
  iconBg = "linear-gradient(135deg,#fee2e2,#fecaca)",
  iconColor = "#c62828",
  title = "Are you sure?",
  message = "",
  confirmText = "Yes",
  cancelText = "Cancel",
  confirmColor = "#c62828",
  onConfirm = null,
  onCancel = null
}) {
  const existing = document.getElementById("ecoConfirmOverlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "ecoConfirmOverlay";
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
      #ecoConfirmBox{
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
      #ecoConfirmBox .eco-modal-icon{
        width:68px;height:68px;border-radius:50%;
        background:${iconBg};
        color:${iconColor};
        display:flex;align-items:center;justify-content:center;
        margin:0 auto 18px;font-size:1.9rem;
      }
      #ecoConfirmBox h3{
        margin:0 0 8px;font-size:1.25rem;font-weight:800;color:#111827;
      }
      #ecoConfirmBox p{
        margin:0 0 26px;font-size:0.9rem;color:#6b7280;line-height:1.55;
      }
      .eco-confirm-btns{display:flex;gap:10px;justify-content:center;}
      .eco-cancel-btn{
        padding:11px 26px;background:#f3f4f6;color:#374151;
        border:1px solid #e5e7eb;border-radius:12px;font-size:0.88rem;
        font-weight:600;cursor:pointer;transition:0.22s;
      }
      .eco-cancel-btn:hover{background:#e5e7eb;transform:translateY(-1px);}
      .eco-confirm-btn{
        padding:11px 26px;background:${confirmColor};color:#fff;
        border:none;border-radius:12px;font-size:0.88rem;font-weight:700;
        cursor:pointer;transition:0.22s;
      }
      .eco-confirm-btn:hover{filter:brightness(1.08);transform:translateY(-1px);}
    </style>
    <div id="ecoConfirmBox">
      <div class="eco-modal-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="eco-confirm-btns">
        <button class="eco-cancel-btn">${cancelText}</button>
        <button class="eco-confirm-btn">${confirmText}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = (confirmed) => {
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.18s";
    setTimeout(() => {
      overlay.remove();
      if (confirmed && onConfirm) onConfirm();
      if (!confirmed && onCancel) onCancel();
    }, 200);
  };

  overlay.querySelector(".eco-confirm-btn").addEventListener("click", () => close(true));
  overlay.querySelector(".eco-cancel-btn").addEventListener("click", () => close(false));
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(false); });
}

/* ================================================
   AUTH CHECK
   ================================================ */
const userId = sessionStorage.getItem("userId");
const token = sessionStorage.getItem("token");

if (!userId) {
  showAlert({
    icon: "🔒",
    iconBg: "linear-gradient(135deg,#fef3c7,#fde68a)",
    iconColor: "#b45309",
    title: "Login Required",
    message: "Please login first to view your pickup requests.",
    btnText: "Go to Login",
    btnColor: "#b45309",
    onClose: () => {
      window.location.href = "../register/register.html";
    }
  });
}

/* ================================================
   FETCH PICKUP HISTORY
   ================================================ */
fetch(`/pickupHistory/user/${userId}`, {
  headers: { "Authorization": "Bearer " + token }
})
  .then(res => res.json())
  .then(data => {
    if (!data.length) {
      pickupContainer.innerHTML = "<p>No pickup requests found.</p>";
      return;
    }

    pickupContainer.innerHTML = "";

    data.forEach(pickup => {
      const card = document.createElement("div");
      card.className = "pickup-card";

      const isCollected = pickup.status === "collected";

      card.innerHTML = `
        <div class="card-clickable">
          ${pickup.image ? `<img src="${pickup.image}" />` : ""}

          <p><b>Created At:</b> ${new Date(pickup.createdAt).toLocaleString()}</p>
          <p><b>User Phone:</b> ${pickup.userPhone}</p>
          <p><b>Additional Phone:</b> ${pickup.additional_phone_no ? pickup.additional_phone_no : "-"}</p>
          <p><b>Category:</b> ${pickup.category ? pickup.category.category_name : "-"}</p>
          <p><b>Waste Description:</b> ${pickup.waste_description}</p>
          <p><b>Estimated Weight:</b> ${pickup.estimated_weight} kg</p>
          <p><b>Pickup Address:</b> ${pickup.pickup_address}</p>
          <p><b>Preferred Date:</b> ${new Date(pickup.preferred_date).toDateString()}</p>
          <p><b>Status:</b> <span class="status">${pickup.status}</span></p>
        </div>

        <div class="btn-group">
          <button class="edit-btn"
            ${isCollected ? "disabled title='Cannot edit a collected request'" : ""}
            onclick='${isCollected ? "" : `editPickup(${JSON.stringify(pickup)})`}'>
            ✏ Edit
          </button>
          <button class="delete-btn"
            ${isCollected ? "disabled title='Cannot delete a collected request'" : ""}
            onclick="${isCollected ? "" : `deletePickup('${pickup.pickupRequest_id}')`}">
            🗑 Delete
          </button>
        </div>
      `;

      // Click on the card body (not buttons) → open detail page
      const clickable = card.querySelector(".card-clickable");
      clickable.style.cursor = "pointer";
      clickable.addEventListener("click", () => {
        sessionStorage.setItem("viewPickup", JSON.stringify(pickup));
        window.location.href = "Pickupdetail.html";
      });

      pickupContainer.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
    pickupContainer.innerHTML = "<p>Error loading pickup requests.</p>";
  });

/* ================================================
   EDIT PICKUP
   ================================================ */
function editPickup(pickup) {
  showConfirm({
    icon: "✏️",
    iconBg: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
    iconColor: "#1d4ed8",
    title: "Edit Request?",
    message: "Do you want to edit this pickup request?",
    confirmText: "Yes, Edit",
    cancelText: "Cancel",
    confirmColor: "#1d4ed8",
    onConfirm: () => {
      sessionStorage.setItem("editPickup", JSON.stringify(pickup));
      sessionStorage.setItem("editingPickupId", pickup.pickupRequest_id);
      window.location.href = "../PickupForm/form.html";
    }
  });
}

/* ================================================
   DELETE PICKUP
   ================================================ */
function deletePickup(pickupId) {
  showConfirm({
    icon: "🗑️",
    iconBg: "linear-gradient(135deg,#fee2e2,#fecaca)",
    iconColor: "#c62828",
    title: "Delete Request?",
    message: "Are you sure you want to delete this pickup request? This action cannot be undone.",
    confirmText: "Yes, Delete",
    cancelText: "Cancel",
    confirmColor: "#c62828",
    onConfirm: () => {
      fetch(`/pickup/delete/${pickupId}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      })
        .then(res => res.json())
        .then(data => {
          showAlert({
            icon: "✔",
            iconBg: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
            iconColor: "#1b8f4a",
            title: "Deleted!",
            message: data.message || "Pickup request deleted successfully.",
            btnText: "OK",
            btnColor: "#1b8f4a",
            onClose: () => location.reload()
          });
        })
        .catch(err => {
          showAlert({
            icon: "✖",
            iconBg: "linear-gradient(135deg,#fee2e2,#fecaca)",
            iconColor: "#c62828",
            title: "Delete Failed",
            message: "Something went wrong. Please try again.",
            btnText: "OK",
            btnColor: "#c62828"
          });
          console.error(err);
        });
    }
  });
}