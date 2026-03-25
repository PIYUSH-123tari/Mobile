const detailContainer = document.getElementById("detailContainer");
const pickup = JSON.parse(sessionStorage.getItem("viewPickup"));
const token = sessionStorage.getItem("token");

if (!pickup) {
  detailContainer.innerHTML = "<p>No pickup data found.</p>";
} else {
  const status = pickup.status;
  if (status === "pending") {
    renderPending();
  } else if (status === "assigned") {
    renderAssigned();
  } else if (status === "collected") {
    renderCollected();
  }
}

// ── Image Modal ───────────────────────────────────────────────────────────────
function openModal(src) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  modal.style.display = "flex";
  modalImg.src = src;
}

function closeModal() {
  document.getElementById("imgModal").style.display = "none";
}

// ── PENDING ───────────────────────────────────────────────────────────────────
function renderPending() {
  detailContainer.innerHTML = `
    <div class="detail-card pending-card">
      <div class="pending-icon">🌿</div>
      <h2>Thank you for contacting our EcoLoop Team!</h2>
      <p class="pending-sub">Your request has been received and is under review.</p>
      <div class="status-badge pending-badge">Status: PENDING</div>
      <div class="info-section">
        <h3>Request Summary</h3>
        <p><b>Category:</b> ${pickup.category ? pickup.category.category_name : "-"}</p>
        <p><b>Waste Description:</b> ${pickup.waste_description}</p>
        <p><b>Estimated Weight:</b> ${pickup.estimated_weight} kg</p>
        <p><b>Pickup Address:</b> ${pickup.pickup_address}</p>
        <p><b>Preferred Date:</b> ${new Date(pickup.preferred_date).toDateString()}</p>
      </div>
      <p class="pending-note">Our team will assign an agent shortly. Please keep your phone reachable.</p>
    </div>
  `;
}

// ── ASSIGNED ──────────────────────────────────────────────────────────────────
function renderAssigned() {
  detailContainer.innerHTML = `<p class="loading-text">Loading assignment details...</p>`;

  fetch(`http://localhost:5000/pickupHistory/assignment/${pickup.pickupRequest_id}`, {
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => res.json())
    .then(data => {
      if (!data || data.error) {
        detailContainer.innerHTML = `<p>Assignment details not found.</p>`;
        return;
      }

      const agent = data.agent;
      // Photo served directly from Admin server at port 3500 (already working)
      const photoUrl = agent.passport_photo
        ? `http://localhost:3500/${agent.passport_photo.replace(/\\/g, "/")}`
        : null;

      detailContainer.innerHTML = `
        <div class="detail-card assigned-card">
          <div class="assigned-header">
            <div class="assigned-icon">📋</div>
            <h2>Your Request Has Been Assigned!</h2>
            <div class="status-badge assigned-badge">Status: ASSIGNED</div>
          </div>

          <div class="agent-section">
            <h3>Assigned Agent</h3>
            <div class="agent-profile">
              ${photoUrl
                ? `<img src="${photoUrl}" alt="Agent Photo" class="agent-photo" onclick="openModal('${photoUrl}')" title="Click to enlarge" />`
                : `<div class="agent-photo-placeholder">👤</div>`
              }
              <div class="agent-info">
                <p class="agent-name">${agent.name}</p>
                <p><b>Phone:</b> ${agent.phone}</p>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Assignment Details</h3>
            <p><b>Assigned Date:</b> ${new Date(data.assigned_date).toDateString()}</p>
            <p><b>Assigned Time:</b> ${data.assigned_time}</p>
          </div>

          <div class="info-section">
            <h3>Your Request</h3>
            <p><b>Category:</b> ${pickup.category ? pickup.category.category_name : "-"}</p>
            <p><b>Waste Description:</b> ${pickup.waste_description}</p>
            <p><b>Estimated Weight:</b> ${pickup.estimated_weight} kg</p>
            <p><b>Pickup Address:</b> ${pickup.pickup_address}</p>
          </div>
        </div>

        <!-- Image Modal -->
        <div id="imgModal" class="modal-overlay" onclick="closeModal()">
          <div class="modal-box" onclick="event.stopPropagation()">
            <button class="modal-close" onclick="closeModal()">✕</button>
            <img id="modalImg" src="" alt="Agent Photo" />
          </div>
        </div>
      `;
    })
    .catch(err => {
      console.error(err);
      detailContainer.innerHTML = `<p>Error loading assignment details.</p>`;
    });
}

// ── COLLECTED ─────────────────────────────────────────────────────────────────
// ── COLLECTED ─────────────────────────────────────────────────────────────────
function renderCollected() {
  detailContainer.innerHTML = `<p class="loading-text">Loading collected details...</p>`;

  fetch(`http://localhost:5000/pickupHistory/collected/${pickup.pickupRequest_id}`, {
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => res.json())
    .then(data => {
      if (!data || data.error) {
        detailContainer.innerHTML = `<p>Collected details not found.</p>`;
        return;
      }

      const agent = data.agent;
      const photoUrl = agent.passport_photo
        ? `http://localhost:3500/${agent.passport_photo.replace(/\\/g, "/")}`
        : null;

      detailContainer.innerHTML = `
        <div class="detail-card collected-card">
          <div class="collected-icon">✅</div>
          <h2>Pickup Collected Successfully!</h2>
          <div class="status-badge collected-badge">Status: COLLECTED</div>

          <div class="agent-section">
            <h3>Collected By</h3>
            <div class="agent-profile">
              ${photoUrl
                ? `<img src="${photoUrl}" alt="Agent Photo" class="agent-photo"
                    onclick="openModal('${photoUrl}')" title="Click to enlarge" />`
                : `<div class="agent-photo-placeholder">👤</div>`
              }
              <div class="agent-info">
                <p class="agent-name">${agent.name}</p>
                <p><b>Phone:</b> ${agent.phone}</p>
                <p><b>Address:</b> ${agent.address}</p>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Collected Details</h3>
            <p><b>Category:</b> ${data.category ? data.category.category_name : "-"}</p>
            <p><b>Product Description:</b> ${data.product_description}</p>
            <p><b>Actual Weight:</b> ${data.actual_weight} kg</p>
            <p><b>Received Time:</b> ${new Date(data.received_time).toLocaleString()}</p>
          </div>

          <div class="info-section">
            <h3>Your Original Request</h3>
            <p><b>Waste Description:</b> ${pickup.waste_description}</p>
            <p><b>Estimated Weight:</b> ${pickup.estimated_weight} kg</p>
            <p><b>Pickup Address:</b> ${pickup.pickup_address}</p>
            <p><b>Preferred Date:</b> ${new Date(pickup.preferred_date).toDateString()}</p>
          </div>

          <p class="collected-note">🌱 Thank you for contributing to a greener planet! Your reward points have been updated.</p>
        </div>

        <!-- Image Modal -->
        <div id="imgModal" class="modal-overlay" onclick="closeModal()">
          <div class="modal-box" onclick="event.stopPropagation()">
            <button class="modal-close" onclick="closeModal()">✕</button>
            <img id="modalImg" src="" alt="Agent Photo" />
          </div>
        </div>
      `;
    })
    .catch(err => {
      console.error(err);
      detailContainer.innerHTML = `<p>Error loading collected details.</p>`;
    });
}