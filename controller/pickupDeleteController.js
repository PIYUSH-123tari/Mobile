// Ecoloop/controller/pickupDeleteController.js

const PickupRequest = require("../model/PickupRequest");
const PickupLog     = require("../model/PickupLog");
const Manager       = require("../model/Manager"); // your admin/manager model

const Assignment = require("../model/Assignment");
const Collected = require("../model/Collected");
const Agent = require("../model/Agent");

const deletePickup = async (req, res) => {
  try {
    const existing = await PickupRequest.findOne({ pickupRequest_id: req.params.id })
      .populate("user", "name email")
      .populate("category", "category_name");

    if (!existing) return res.status(404).json({ message: "Pickup not found" });

    // 1. Cascade delete Assignment + Collected directly in db
    try {
      const assignment = await Assignment.findOne({ pickupRequest: existing._id });
      if (assignment) {
        const collectedExists = await Collected.findOne({ assignment: assignment._id });
        await Collected.deleteOne({ assignment: assignment._id });
        await Assignment.findByIdAndDelete(assignment._id);
        
        if (!collectedExists) {
          await Agent.findByIdAndUpdate(assignment.agent, {
            $inc: { assigned_pending_order: -1 }
          });
        }
      }
    } catch (cascadeErr) {
      console.warn("Could not cascade delete assignment (may not exist):", cascadeErr.message);
    }

    // 2. Delete the PickupRequest (your original logic)
    await PickupRequest.findOneAndDelete({ pickupRequest_id: req.params.id });

    // 3. Log deletion for admin notification
    const manager = await Manager.findOne({ region_Id: existing.region_Id });
    if (manager) {
      await PickupLog.create({
        admin:     manager.admin_Id,
        user:      existing.user._id || existing.user,
        requestId: existing._id,
        type:      "delete",
        message:   `${existing.user?.name || "A user"} deleted their pickup request (${existing.category?.category_name || "N/A"} — "${existing.waste_description?.slice(0, 40)}…").`,
        snapshot: {
          category:    existing.category?.category_name || null,
          description: existing.waste_description,
          weight:      existing.estimated_weight,
          address:     existing.pickup_address,
          date:        existing.preferred_date,
        }
      });
    }

    res.json({ message: "Pickup deleted successfully" });

  } catch (err) {
    console.error("deletePickup error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { deletePickup };