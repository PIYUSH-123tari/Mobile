const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { getRewardBalance } = require("../controller/RewardController");

// GET /reward/:userId
router.get("/:userId", authMiddleware, getRewardBalance);

module.exports = router;