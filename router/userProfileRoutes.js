const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const userProfileController = require("../controller/userProfileController");
const upload = require("../middleware/uploadMiddleware");

// GET user profile
router.get("/:id", authMiddleware, userProfileController.getUserProfile);



router.put("/:id", authMiddleware, upload.single("photo"), userProfileController.updateUserProfile);

module.exports = router;
