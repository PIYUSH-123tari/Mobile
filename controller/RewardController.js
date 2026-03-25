const Collected = require("../model/Collected");
const Assignment = require("../model/Assignment");
const PickupRequest = require("../model/PickupRequest");
const User = require("../model/User");

// GET /reward/:userId
// Traverses: Collected -> Assignment -> PickupRequest -> User
// reward_balance = total_actual_weight * 0.1  (₹0.1 per kg)
const getRewardBalance = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Find the user document by custom userId string
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Find all PickupRequests belonging to this user
    const pickupRequests = await PickupRequest.find({ user: user._id }).select("_id");
    const pickupRequestIds = pickupRequests.map(p => p._id);

    // 3. Find all Assignments linked to those PickupRequests
    const assignments = await Assignment.find({
      pickupRequest: { $in: pickupRequestIds }
    }).select("_id");
    const assignmentIds = assignments.map(a => a._id);

    // 4. Find all Collected records linked to those Assignments
    const collections = await Collected.find({
      assignment: { $in: assignmentIds }
    }).select("actual_weight");

    // 5. Sum up actual_weight across all collections
    const totalWeight = collections.reduce((sum, c) => sum + (c.actual_weight || 0), 0);

    // 6. Calculate reward balance: ₹0.1 per kg
    const rewardBalance = parseFloat((totalWeight * 0.1).toFixed(2));

    res.status(200).json({
      userId: user.userId,
      totalWeight,
      rewardBalance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRewardBalance };