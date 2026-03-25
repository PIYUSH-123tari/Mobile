const PickupRequest = require("../model/PickupRequest");
const Assignment = require("../model/Assignment");
const Agent = require("../model/Agent");
const User = require("../model/User");
const Collected = require("../model/Collected"); // ADD THIS LINE

// GET all pickup requests for a user
const getUserPickups = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pickups = await PickupRequest.find({ user: user._id })
      .populate("category", "category_name")
      .sort({ createdAt: -1 });

    res.status(200).json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET assignment details for a specific pickupRequest (by pickupRequest_id string)
const getAssignmentByPickupId = async (req, res) => {
  try {
    const { pickupRequestId } = req.params;

    const pickup = await PickupRequest.findOne({ pickupRequest_id: pickupRequestId });
    if (!pickup) return res.status(404).json({ error: "Pickup request not found" });

    const assignment = await Assignment.findOne({ pickupRequest: pickup._id });
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    const agent = await Agent.findById(assignment.agent).select("agent_name agent_phoneNo passport_photo");
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    res.status(200).json({
      assigned_date: assignment.assigned_date,
      assigned_time: assignment.assigned_time,
      agent: {
        name: agent.agent_name,
        phone: agent.agent_phoneNo,
        passport_photo: agent.passport_photo
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── NEW FUNCTION ──────────────────────────────────────────────────────────────
// GET collected details for a specific pickupRequest (by pickupRequest_id string)
const getCollectedByPickupId = async (req, res) => {
  try {
    const { pickupRequestId } = req.params;

    // Step 1: Find PickupRequest by uuid string
    const pickup = await PickupRequest.findOne({ pickupRequest_id: pickupRequestId });
    if (!pickup) return res.status(404).json({ error: "Pickup request not found" });

    // Step 2: Find Assignment using PickupRequest ObjectId
    const assignment = await Assignment.findOne({ pickupRequest: pickup._id });
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    // Step 3: Find Collected using Assignment ObjectId
    const collected = await Collected.findOne({ assignment: assignment._id })
      .populate("category", "category_name")
      .populate("agent", "agent_name agent_phoneNo agent_address passport_photo");

    if (!collected) return res.status(404).json({ error: "Collected record not found" });

    res.status(200).json({
      actual_weight: collected.actual_weight,
      product_description: collected.product_description,
      received_time: collected.received_time,
      category: collected.category,
      agent: {
        name: collected.agent.agent_name,
        phone: collected.agent.agent_phoneNo,
        address: collected.agent.agent_address,
        passport_photo: collected.agent.passport_photo
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserPickups, getAssignmentByPickupId, getCollectedByPickupId }; // UPDATED