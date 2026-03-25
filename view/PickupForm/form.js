const userId = sessionStorage.getItem("userId");
const userPhone = sessionStorage.getItem("userPhone"); // must be stored at login
const token = sessionStorage.getItem("token");
const categorySelect = document.getElementById("categorySelect");
const imageInput = document.querySelector("input[name='image']");
const editData = sessionStorage.getItem("editPickup");
const editingPickupId = sessionStorage.getItem("editingPickupId");


async function loadCategories(selectedId = null) {
  try {
    const res = await fetch("/category/all");
    const categories = await res.json();

    categorySelect.innerHTML = `<option value="">Select Category</option>`;

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat._id;
      option.textContent = cat.category_name;
      categorySelect.appendChild(option);
    });

    // Set the selected value AFTER categories are loaded
    if (selectedId) {
      categorySelect.value = selectedId;
    }

  } catch (err) {
    console.error("Error loading categories:", err);
  }
}

// 🔁 Pre-fill form if editing
if (editData) {
  const pickup = JSON.parse(editData);

  document.querySelector("[name='additional_phone_no']").value =
    pickup.additional_phone_no || "";

  document.querySelector("[name='estimated_weight']").value =
    pickup.estimated_weight;

  document.querySelector("[name='pickup_address']").value =
    pickup.pickup_address;

  document.querySelector("[name='preferred_date']").value =
    pickup.preferred_date.split("T")[0];

  document.querySelector("[name='waste_description']").value =
    pickup.waste_description;

  // Pass the category ID to loadCategories
  loadCategories(pickup.category ? pickup.category._id : null);
} else {
  loadCategories();
}



if (!userId) {
  alert("User not logged in properly");
  window.location.href = "../register/register.html";
}

const heading = document.getElementById("formHeading");
const backBtn = document.getElementById("backBtn");

if (editingPickupId) {
  // Update mode
  heading.textContent = "Update Pickup Request";

  backBtn.disabled = true;
  backBtn.style.opacity = "0.5";
  backBtn.style.cursor = "not-allowed";
  backBtn.onclick = null; // disable navigation
   imageInput.required = false;

}
else{
  imageInput.required = true;//for create mode
}


// 🔁 Pre-fill form if editing
if (editData) {
  const pickup = JSON.parse(editData);

  document.querySelector("[name='additional_phone_no']").value =
    pickup.additional_phone_no || "";

  document.querySelector("[name='estimated_weight']").value =
    pickup.estimated_weight;

  document.querySelector("[name='pickup_address']").value =
    pickup.pickup_address;

  document.querySelector("[name='preferred_date']").value =
    pickup.preferred_date.split("T")[0];

  document.querySelector("[name='waste_description']").value =
    pickup.waste_description;

  if (pickup.category && pickup.category._id) {
    categorySelect.value = pickup.category._id;
  }
}

// 🔁 Decide URL + METHOD
const url = editingPickupId
  ? `/pickup/update/${editingPickupId}`
  : "/pickup/create";


const method = editingPickupId ? "PUT" : "POST";

document.getElementById("pickupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  formData.append("userId", userId);
  formData.append("userPhone", userPhone);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Authorization": "Bearer " + token
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    alert(data.message);

    sessionStorage.removeItem("editPickup");
    sessionStorage.removeItem("editingPickupId");
    e.target.reset();
    window.location.href = "../PickupHistory/pH.html";

  } catch (err) {
    console.error(err);
    alert("Server not reachable");
  }
});

const useLocationBtn = document.getElementById("useLocationBtn");
const pickupAddressField = document.getElementById("pickupAddress");


// ===== MOBILE CAMERA & GALLERY FUNCTIONALITY =====
const mobileCameraSection = document.getElementById("mobileCameraSection");
const openCameraBtn = document.getElementById("openCameraBtn");
const openGalleryBtn = document.getElementById("openGalleryBtn");
const cameraCapture = document.getElementById("cameraCapture");
const galleryCapture = document.getElementById("galleryCapture");
const cameraPreview = document.getElementById("cameraPreview");
const previewImg = document.getElementById("previewImg");
const retakeBtn = document.getElementById("retakeBtn");
const wasteImageInput = document.getElementById("wasteImageInput");

// Show camera section only on mobile
function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function updateCameraVisibility() {
  if (isMobile()) {
    mobileCameraSection.style.display = "flex";
  } else {
    mobileCameraSection.style.display = "none";
  }
}

updateCameraVisibility();
window.addEventListener("resize", updateCameraVisibility);

// Open camera
openCameraBtn.addEventListener("click", () => {
  cameraCapture.click();
});

// Open gallery
openGalleryBtn.addEventListener("click", () => {
  galleryCapture.click();
});

// Shared handler: show preview and transfer file to real input
function handleImageSelected(file, sourceLabel) {
  if (!file) return;

  // Transfer file to the real image input via DataTransfer
  const dt = new DataTransfer();
  dt.items.add(file);
  wasteImageInput.files = dt.files;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    cameraPreview.style.display = "flex";
    openCameraBtn.textContent = sourceLabel === "camera" ? "✅ Photo Captured" : "📷 Take Photo";
    openGalleryBtn.textContent = sourceLabel === "gallery" ? "✅ Image Selected" : "🖼️ Choose from Gallery";
    if (sourceLabel === "camera") {
      openCameraBtn.style.background = "#157a3f";
      openCameraBtn.style.color = "#fff";
      openGalleryBtn.style.background = "";
      openGalleryBtn.style.color = "";
    } else {
      openGalleryBtn.style.background = "#157a3f";
      openGalleryBtn.style.color = "#fff";
      openCameraBtn.style.background = "";
      openCameraBtn.style.color = "";
    }
  };
  reader.readAsDataURL(file);
}

// When photo is taken via camera
cameraCapture.addEventListener("change", () => {
  handleImageSelected(cameraCapture.files[0], "camera");
});

// When image is selected from gallery
galleryCapture.addEventListener("change", () => {
  handleImageSelected(galleryCapture.files[0], "gallery");
});

// Change Image (reset)
retakeBtn.addEventListener("click", () => {
  cameraCapture.value = "";
  galleryCapture.value = "";
  wasteImageInput.value = "";
  previewImg.src = "";
  cameraPreview.style.display = "none";
  openCameraBtn.textContent = "📷 Take Photo";
  openCameraBtn.style.background = "";
  openCameraBtn.style.color = "";
  openGalleryBtn.textContent = "🖼️ Choose from Gallery";
  openGalleryBtn.style.background = "";
  openGalleryBtn.style.color = "";
});

// ===== GEOLOCATION =====
useLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  useLocationBtn.textContent = "Getting location...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const accuracy = position.coords.accuracy;

      console.log("Latitude:", lat);
      console.log("Longitude:", lon);
      console.log("Accuracy (meters):", accuracy);

      try {

        await new Promise(resolve => setTimeout(resolve, 800));
        const response = await fetch(
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
  {
    headers: {
      "Accept": "application/json"
    }
  }
);

if (!response.ok) {
  throw new Error("API Error");
}

const data = await response.json();

        if (data.address) {
          const area =
            data.address.suburb ||
            data.address.village ||
            data.address.town ||
            data.address.city ||
            "";

          const district = data.address.county || "";
          const state = data.address.state || "";
          const country = data.address.country || "";

          pickupAddressField.value =
            `${area}, ${district}, ${state}, ${country}`;
        } else {
          pickupAddressField.value = `Lat: ${lat}, Lon: ${lon}`;
        }

      } catch (error) {
        console.error(error);
        alert("Unable to fetch address");
      }

      useLocationBtn.textContent = "📍 Use My Location";
    },

    (error) => {
      alert("Location permission denied or unavailable");
      useLocationBtn.textContent = "📍 Use My Location";
    },

    // 🔥 IMPORTANT: High Accuracy Options
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
});