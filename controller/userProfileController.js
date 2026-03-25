const User = require("../model/User");
const Collected = require("../model/Collected");
const Assignment = require("../model/Assignment");
const PickupRequest = require("../model/PickupRequest");

// ── Helper: calculate reward balance for a user _id ──────────────────────────
const calcRewardBalance = async (userObjectId) => {
  const pickupRequests = await PickupRequest.find({ user: userObjectId }).select("_id");
  const pickupRequestIds = pickupRequests.map(p => p._id);

  const assignments = await Assignment.find({
    pickupRequest: { $in: pickupRequestIds }
  }).select("_id");
  const assignmentIds = assignments.map(a => a._id);

  const collections = await Collected.find({
    assignment: { $in: assignmentIds }
  }).select("actual_weight");

  const totalWeight = collections.reduce((sum, c) => sum + (c.actual_weight || 0), 0);
  return parseFloat((totalWeight * 0.1).toFixed(2)); // ₹0.1 per kg
};

// GET USER USING userId (from localStorage)
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ userId: userId })
      .populate("region_Id", "region_name");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate reward balance dynamically
    const rewardBalance = await calcRewardBalance(user._id);

    res.status(200).json({
      userId: user.userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      region_Id: user.region_Id._id,
      region_name: user.region_Id.region_name,
      photo: user.photo,
      reward_balance: rewardBalance   // ← NEW (read-only, computed)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      region_Id: req.body.region_Id
    };

    if (req.file) {
      updatedData.photo = req.file.filename;
    }

    const user = await User.findOneAndUpdate(
      { userId: userId },
      updatedData,
      { new: true }
    ).populate("region_Id", "region_name");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate reward balance after update too
    const rewardBalance = await calcRewardBalance(user._id);

    res.status(200).json({
      message: "Profile updated",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        region_Id: user.region_Id._id,
        region_name: user.region_Id.region_name,
        photo: user.photo,
        reward_balance: rewardBalance   // ← NEW (read-only, computed)
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};