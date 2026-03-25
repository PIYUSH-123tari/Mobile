const userId = sessionStorage.getItem("userId");
const userPhone = sessionStorage.getItem("userPhone"); // must be stored at login
const token = sessionStorage.getItem("token");
const categorySelect = document.getElementById("categorySelect");
const imageInput = document.querySelector("input[name='image']");
const editData = sessionStorage.getItem("editPickup");
const editingPickupId = sessionStorage.getItem("editingPickupId");


async function loadCategories(selectedId = null) {
  try {
    const res = await fetch("http://localhost:5000/category/all");
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
  ? `http://localhost:5000/pickup/update/${editingPickupId}`
  : "http://localhost:5000/pickup/create";


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