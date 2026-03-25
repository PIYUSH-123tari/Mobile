// Ecoloop/controller/pickupUpdateController.js

const PickupRequest = require("../model/PickupRequest");
const PickupLog     = require("../model/PickupLog");
const Manager       = require("../model/Manager");

const updatePickup = async (req, res) => {
  try {
    const existing = await PickupRequest.findOne({ pickupRequest_id: req.params.id })
      .populate("user", "name email")
      .populate("category", "category_name");

    if (!existing) return res.status(404).json({ message: "Pickup not found" });

    // ── Build update data (your original logic unchanged) ──
    const updateData = {
      additional_phone_no: req.body.additional_phone_no || null,
      category:            req.body.category,
      waste_description:   req.body.waste_description,
      estimated_weight:    req.body.estimated_weight,
      pickup_address:      req.body.pickup_address,
      preferred_date:      req.body.preferred_date
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await PickupRequest.findOneAndUpdate(
      { pickupRequest_id: req.params.id },
      updateData,
      { new: true }
    ).populate("category", "category_name");

    if (!updated) return res.status(404).json({ message: "Pickup not found" });

    // ── If pickup is already assigned, cascade delete assignment + collected ──
    // Because the pickup details changed, the old assignment is now invalid
    if (existing.status === "assigned" || existing.status === "collected") {
      try {
        const cascadeRes = await fetch(
          `http://localhost:3500/api/assignment/delete-by-pickup/${existing._id}`,
          { method: "DELETE" }
        );
        if (cascadeRes.ok) {
          // Reset status back to pending since assignment is gone
          await PickupRequest.findByIdAndUpdate(existing._id, { status: "pending" });
        }
      } catch (cascadeErr) {
        console.warn("Could not cascade delete assignment on update:", cascadeErr.message);
      }
    }

    // ── Detect what changed for notification log ──
    const changes = [];
    if (String(existing.category?._id)   !== String(req.body.category))                    changes.push("category changed");
    if (existing.waste_description        !== req.body.waste_description)                    changes.push("description changed");
    if (String(existing.estimated_weight) !== String(req.body.estimated_weight))             changes.push("weight changed");
    if (existing.pickup_address           !== req.body.pickup_address)                       changes.push("address changed");
    if (existing.preferred_date?.toISOString().split("T")[0] !== req.body.preferred_date)    changes.push("preferred date changed");

    // ── Log to PickupLog for admin notification ──
    if (changes.length > 0) {
      const manager = await Manager.findOne({ region_Id: existing.region_Id });
      if (manager) {
        await PickupLog.create({
          admin:     manager.admin_Id,
          user:      existing.user._id || existing.user,
          requestId: existing._id,
          type:      "update",
          message:   `${existing.user?.name || "A user"} updated their pickup request: ${changes.join(", ")}.${(existing.status === "assigned" || existing.status === "collected") ? " Related assignment was automatically deleted." : ""}`,
          snapshot: {
            category:    updated.category?.category_name || null,
            description: updated.waste_description,
            weight:      updated.estimated_weight,
            address:     updated.pickup_address,
            date:        updated.preferred_date,
          }
        });
      }
    }

    res.json({ message: "Pickup updated successfully" });

  } catch (err) {
    console.error("updatePickup error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { updatePickup };