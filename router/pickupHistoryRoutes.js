const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { 
  getUserPickups, 
  getAssignmentByPickupId, 
  getCollectedByPickupId  // ADD THIS
} = require("../controller/pickupHistoryController");

// GET all pickups for a user
router.get("/user/:userId", authMiddleware, getUserPickups);

// GET assignment details for a pickup (status = assigned)
router.get("/assignment/:pickupRequestId", authMiddleware, getAssignmentByPickupId);

// GET collected details for a pickup (status = collected)
router.get("/collected/:pickupRequestId", authMiddleware, getCollectedByPickupId);

module.exports = router;